# Debugging animation "flicker": a framework

Written up from a real debugging session (this project's hero cold-open —
a small preview window growing into a fullscreen photo, with text and a
navbar revealing on top of it). "It flickers" turned out to be **four
unrelated bugs** that all *looked* like the same vague complaint. This
doc is the general method + catalog, so the next one goes faster.

## The core lesson

**"Flicker" is not one bug — it's a symptom.** Before touching code, get
the person seeing it to describe the *exact* sequence in words:
*"X happens, then a flash/jump/pause, then Y happens."* That sentence
usually tells you which of the categories below you're actually in. Don't
start guessing and patching until you have that sentence — three of the
four rounds in this session were fixing a real-but-wrong-cause because the
initial description was just "it flickers."

## Category 1 — crop/zoom mismatch (`object-fit` + animated size)

**Symptom:** an image inside a resizing box appears to re-crop or "pop" in
zoom right as the resize finishes, independent of any color/brightness
issue.

**Cause:** `object-fit: cover` (or `contain`) computes its crop window
from the box's *aspect ratio*. If a box animates from one aspect ratio to
a different one (e.g., a small preview at a fixed ~1.5:1 growing into a
`100vw × 100dvh` box, whose ratio is whatever the visitor's screen
happens to be), the browser is recomputing what part of the image to show
on every frame of the resize. That recomputation is the pop.

**How to misdiagnose it:** blaming image resolution/decoding. Downsizing
the source image *helps* (see Category 4) but doesn't fix this — it only
reduces one contributing factor.

**Fix pattern:**
- Never let a box that uses `object-fit` animate through *two different
  aspect ratios*. Either keep the ratio constant throughout, or don't use
  `object-fit` at all for the animated element.
- If the end state's ratio is dynamic (e.g., `100vw`/`100dvh` — the
  viewport's own ratio), the start state must be forced to *the same*
  ratio, not just something visually close. `clamp()`-based width and
  `clamp()`-based height, sized independently, will only coincidentally
  match — real viewports routinely hit one clamp's bound while the other
  is still fluid, breaking the match asymmetrically.
- Robust version: measure the target ratio once
  (`window.innerWidth / window.innerHeight`) and feed it to CSS
  `aspect-ratio` as a custom property, so height is *always* an exact
  function of width, however width resolves. Once an explicit `height` is
  set later (e.g. for the final full-size state), it silently overrides
  `aspect-ratio` — no special-casing needed for the handoff.

## Category 2 — DOM-mount collision (heavy work landing on the animation's last frame)

**Symptom:** a stutter/jank right at the tail end of a resize/transition,
even after Category 1 is fully fixed.

**Cause:** the state update that finalizes the animated element gets
batched together with unrelated, expensive DOM work — mounting a new
subtree, inserting a large text block, adding a new absolutely-positioned
overlay — all landing in the *same* commit as the last frame of the CSS
transition. The browser has to do a full layout+paint pass for all of it
at once, competing with the transition's own last frame for the same
frame budget.

**Fix pattern:** temporally separate "the animated thing finishes" from
"everything else appears." Let the animated element's own geometry/state
settle via a pure imperative DOM mutation (no React/framework state
change), then delay the state update that mounts/reveals the rest by a
short buffer (150–200ms is usually enough) so it lands in its own commit,
not competing with a paint the browser is still finishing.

```js
// on transition end / animation end:
el.style.position = "absolute"; // whatever finalizes the element
// ... more direct style mutations ...
setTimeout(() => setState("settled"), 180); // NOT called synchronously here
```

## Category 3 — explicit-vs-auto z-index race

**Symptom:** a hard flash of a *specific, identifiable color* (a
background color from some other layer) for a single frame, right as a
state transition lands — not a gradual pop, a hard flash.

**Cause:** CSS stacking order, precisely: a positioned element with
**no** explicit `z-index` (`auto`) *always* paints below any sibling that
has **any** explicit `z-index` value — including `0`. If element A's
`z-index` gets removed (goes from e.g. `1500` to unset) in the same
render where element B (still mounted, maybe mid-exit-animation, opacity
still ~1) still carries an explicit `z-index: 1400`, B — despite the
"lower" number — jumps on top of A for as long as it's still mounted.
"Lower number loses to a positioned box with no z-index at all" is the
counterintuitive part that causes this bug to survive several rounds of
"just make the number lower."

**How to misdiagnose it:** assuming the two elements' *relative* z-index
values still matter once one of them has no explicit value at all. They
don't — explicit beats `auto` regardless of the explicit value.

**Fix pattern:** whichever element is "going away," kill its actual
*visual content* at the exact same synchronous moment as the other
element's z-index change — don't rely on both fading out at the same
rate. If element B still has explicit z-index and might still render on
top for a moment, make sure it has nothing left to show (transparent
background, already-hidden content) *before* that moment, not fading
starting at that moment.

```js
// synchronously with A's z-index-relevant state change:
elB.style.background = "transparent"; // now it's harmless even if it
                                        // wins the stacking race
```

**This fix has a hidden expiry date if B fades via a CSS transition
instead of an instant write.** "Kill B's visual content synchronously"
is often actually "*start* B fading it out synchronously" (a transition,
not an instant snap — snapping reads as its own abrupt-reveal bug, see
Category 6's sibling issue in the loader). That means the fix's
correctness depends on a **timing relationship** between two durations
that live in different places: how long B's fade takes, and how long
after B's state-change A waits before dropping its own z-index. Get that
relationship right once and it's easy to forget it's a relationship at
all — it looks like two independent tuning knobs. If either duration
changes later (e.g. a blanket "slow all the reveals down" pass that
lengthens B's fade without re-checking A's delay), the race reopens:
now A drops its z-index while B is still mostly opaque, and the flash
comes back, often more visible than the original because B has faded
even less by that point than it used to. Whenever you touch a duration
on a "fading while still explicitly z-indexed" element, re-derive the
other side of this relationship — don't assume a value that was safe
once stays safe after a neighboring duration changes.

## Category 4 — brightness/decode pop from oversized source images

**Symptom:** a brief brightness/contrast shift on the *same* image, tied
to it changing displayed size quickly.

**Cause:** browsers keep a resampled/decoded version of an image sized
for how it's *currently* displayed, as a memory/perf optimization. A
huge source (e.g. a 6000px-wide camera JPEG) shown tiny, then resized to
fullscreen fast, can force a visible re-decode at the new resolution.

**Fix pattern:** resize source images to a sane real-world maximum before
they ever ship (roughly the largest size they'll actually be displayed
at — 2400–3000px wide covers most hero-image cases). This is good
practice regardless of the flicker (weight, LCP), but it also measurably
reduces this specific artifact. Pair with `will-change: width, height`
(or whatever properties actually animate) on the element, as a hint to
keep it on its own compositor layer through the resize.

## The gotcha that cuts across all of the above: `mix-blend-mode` + isolation

If any element uses `mix-blend-mode` to blend against something behind
it (an "auto-contrast text over a photo" effect, for instance), it can
**only** see backdrop content that's in the *same CSS stacking context*.
Several very common things create a new stacking context and silently cut
that element off from what it's supposed to blend against:

- `opacity` less than `1` (yes, even `0.99`, and yes, even transiently
  during a fade animation)
- `transform` set to anything other than `none` — **including a
  "settled" `translateY(0px)`**, not just while it's actively animating
- `filter`, `backdrop-filter`, `clip-path`, `will-change` naming any of
  the above, `isolation: isolate`
- an explicit `z-index` (any value) on a positioned ancestor

Any of these on the blend-mode element **or on any ancestor between it
and the thing it's blending against** breaks the effect, often silently
(no error, it just renders flat/wrong, or glitches only during an
animation and looks fine at rest).

**Fix pattern:**
- Audit every ancestor between the blend-mode element and its intended
  backdrop for the properties above. Cancel inherited `z-index` from
  shared utility classes explicitly (`z-index: auto`), don't just avoid
  adding new ones.
- **Never animate the blend-mode element itself** — not even via a
  transform-based "slide up" that looks harmless. If it needs an entrance
  animation, put the animation on a separate, non-blended element that
  visually covers it and then fades/uncovers it (a "veil") — the
  blend-mode element stays completely static from frame one, and the
  veil does the reveal motion.
- If the veil is opaque and rectangular, its edges will read as a new
  shape appearing on top of whatever's behind it. Blur it well past its
  own box (`filter: blur()`, with `inset` pulled out further than the
  blur radius) so it feathers into an existing darkening/vignette instead
  of showing a hard-edged box.

## Category 5 — a reveal veil that's the wrong shape reads as a new shadow

**Symptom:** you build a "veil" per the pattern above (an opaque,
non-blended element that fades its own opacity to uncover a static
blend-mode element underneath) — the blend-mode glitch is gone, but now
*the veil itself* is visibly noticeable: it looks like a distinct dark
patch or shadow sitting on the backdrop for about a second, before fading
away and everything looking normal.

**Cause:** the veil was scoped to the *content* it's covering (e.g. a
text block's own bounding box), not to the *backdrop* it's sitting on
top of. A blurred, oversized box still has edges — and if those edges
don't correspond to anything else already present in the scene (no other
shape shares that silhouette), they read as a new, foreign shape no
matter how soft. Blur alone doesn't fix "wrong shape," it just softens
the wrong shape's edges.

**Fix pattern (first attempt):** size and shape the veil to match
something that's *already legitimately there*, not to the content it
covers. If there's already an ambient darkening layer behind the content
(a photo scrim, a vignette), make the veil full-bleed with the *exact
same gradient/shape* as that layer, just more intense — fading it out
then reads as "the existing darkening eases off" instead of "a new shape
appears and disappears." This helps, but doesn't fully disappear — a
full-bleed veil is still *a pulse of extra darkness across the whole
backdrop*, which a careful eye reads as its own event.

**Better fix pattern: drop the veil, delay the mount instead.** If the
content itself can render with zero animated properties (a hard
precondition for `mix-blend-mode` correctness anyway — see below), you
don't need to cover-and-uncover it at all. Just don't mount it yet: hold
a plain boolean in state, flip it `true` on a `setTimeout` some hundreds
of ms after the rest of the scene has landed, and conditionally render
the content on that boolean. It "pops in" with no animation of its own —
but *when* it pops in is deliberately delayed, so it doesn't read as part
of the same abrupt batch of things appearing. This is strictly simpler
and has zero surface area for a wrong shape/color/timing to leak through,
because there is no intermediate state at all — the content is either
absent or already fully correct.

## Category 6 — any hard, single-frame change on a mix-blend-mode element can show one wrong frame

**Symptom:** a small, quick, faint flash of the element's raw declared
color (not the blended result), right when *something about a
`mix-blend-mode` element changes in a single frame* — even after the
isolation gotcha above is fully handled (no opacity/transform/filter/
z-index anywhere in the chain) and even with no veil involved at all.

**How this was misdiagnosed first:** the initial theory was that it's
specifically about *insertion* — a brand-new element joining the
compositor's blend stack for the first time. The fix that theory
predicts (mount the element early, invisibly, so its "first paint" isn't
the reveal moment) is harmless but **made no measurable difference** —
proof the theory was wrong, not just incomplete. Don't stop at a theory
that sounds mechanistically plausible; confirm the fix actually changes
the symptom before moving on.

**Actual cause:** re-blending in a single hard jump — going from one
value straight to another with no intermediate frames (a class swap
with no transition, e.g.) — can land on a frame where the browser hasn't
finished recomputing the blend against the backdrop, independent of
whether the element is brand-new or has existed (invisibly) for a while.
The common thread across this entire bug's several rounds was "some
property this element uses jumps in a single frame," not particularly
*which* property or *when* the element was inserted.

**Fix pattern:** never change a mix-blend-mode-relevant property in a
single hard frame. Add a short CSS `transition` on whatever property
you're toggling for the reveal (`color` is the safe one — unlike
`opacity`, it never creates a stacking context, so it doesn't reopen the
Category-above isolation problem). ~150–200ms is enough to spread the
change across roughly 10–15 frames instead of 1; that's still fast
enough to read as a near-instant pop-in, not a fade, but gives the
compositor a continuous run to keep up with rather than one jump to get
right.

```css
.blend-text { color: transparent; mix-blend-mode: exclusion; transition: color 0.18s ease; }
.blend-text.is-visible { color: #fff; } /* toggled by JS state — the transition, not the JS, is what matters */
```

**When to stop and cut the feature instead of the bug.** Category 6's fix
was still not the end of it in the session this framework comes from —
after applying it, the same *kind* of flash was reported again,
unchanged. That's the signal to stop debugging the technique and
question whether it's worth keeping at all: mix-blend-mode adaptive
text went through five separate rounds here (isolation audit, veil,
reshaped veil, dropped veil for a delayed mount, color-transition), each
one fixing a real bug and surfacing a smaller one, never converging on
something stable. If a technique needs "never animate this, never let
any ancestor touch these five properties, never change anything in a
single frame" just to render correctly, and it's *still* flashing after
all of that is satisfied, the honest fix is to drop the technique, not
keep auditing for a sixth constraint. A plain solid color plus a normal
opacity fade has none of these failure modes — it's worth asking early
whether the fancier effect is worth the fragility, especially once
you're past two or three rounds of "smaller flash, same shape of bug."

## Category 7 — a "slow everything down" pass missed a transition living somewhere else

**Symptom:** after deliberately slowing down a reveal sequence (several
elements' fade/transition durations lengthened together, e.g. per direct
request to make things feel less abrupt), one part of the sequence still
reads as a "flash" — quick, out of step with everything else, timed to
whatever moment the underlying state change actually happens.

**Cause:** a reveal that *looks* like one animated property from the
outside can actually be driven by a completely different transition,
somewhere else, that the "slow everything down" pass never touched
because it wasn't the thing anyone was looking at. Concretely: an
element's *visibility* was really controlled by a plain CSS `transition:
background` triggered by an imperative `style.background = "..."`
write, while a separate framer-motion `exit={{opacity:0}}` sat on the
same element for an unrelated reason (keeping it mounted long enough).
Slowing down the obvious, named animations (a scrim's opacity, a
statement's fade) left this other transition at its old, much faster
duration — it became the fastest, earliest-firing thing in the whole
sequence by default, without anyone deciding that.

**Fix pattern:** when several elements' reveal timings need to move
together, grep for every `transition:` / `animate`/`exit` prop touching
the elements involved — not just the ones with an obvious name — and
check each one's *trigger*, not just its duration. If element A's
visible reveal is actually driven by a raw style mutation with its own
CSS transition, and a separate JS-side animation exists only to delay
that element's unmount, the two durations are coupled: the JS delay
must stay >= the CSS transition's duration, or the element gets removed
from the DOM mid-transition and the reveal cuts off abruptly. Keep them
equal, and change them together going forward.

## Category 8 — a GSAP Flip (or any cross-section reposition) goes invisible, not broken

**Symptom:** an element animated with GSAP Flip (or any technique that
positions an element far outside its own DOM parent's box — `position:
absolute`/`fixed` with a large offset, a large `transform: translate`,
etc.) simply doesn't render at all. No console error, no layout
exception — `getBoundingClientRect()` on the element reports exactly the
position you expect, but nothing paints there.

**Cause:** any ancestor between the element and the document root with
`overflow: hidden` (or `clip`/`scroll` without explicit visible bounds)
clips it, and clipping is invisible in the geometry — `getBoundingClientRect`
reports the mathematically correct box regardless of whether that box
is actually painted. A "correctly positioned but invisible" element is
easy to misdiagnose as a JS logic bug (wrong element, animation never
ran, wrong plugin registered) when it's actually a plain CSS clipping
issue one or two ancestors up. This bites GSAP Flip specifically because
Flip's whole technique is "make the element temporarily look like it's
somewhere else" — the "somewhere else" is very often outside the
nearest `overflow: hidden` container, especially crossing between two
different sections of a page (each of which may independently have
`overflow: hidden` as a common defensive reset).

**How to misdiagnose it:** assuming a black/blank result means the
source (video, image, canvas) failed to load, or that the animation
library never initialized. Check the geometry first — if
`getBoundingClientRect()` on the animated element matches where you
expect it to be, the positioning logic is working and the problem is
purely a paint/clipping one.

**Fix pattern:** walk the element's ancestor chain
(`el.parentElement` repeatedly) checking `getComputedStyle(ancestor).overflow`
until you reach `<html>`, and any ancestor that isn't `visible` is a
suspect. Remove or override `overflow: hidden` on the specific
ancestors involved — scoped narrowly (a combined selector like
`section.my-specific-section { overflow: visible; }`, not editing a
shared utility class used by unrelated elements elsewhere) — rather than
disabling it globally. Check the element's *own* final resting state
first: if it's sized to exactly fill its container in its natural
(non-animated) state, the container's `overflow: hidden` was likely
just a defensive default that was never actually load-bearing, and
removing it costs nothing.

```js
function clippingAncestors(el) {
  const chain = [];
  for (let cur = el.parentElement; cur; cur = cur.parentElement) {
    if (getComputedStyle(cur).overflow !== "visible") chain.push(cur);
  }
  return chain; // anything here is a suspect
}
```

## Category 9 — `Flip.from(state, { targets })` silently no-ops on two different elements

**Symptom:** you use GSAP Flip's documented "apply a recorded state to a
*different* target" pattern — `Flip.from(state, { targets: otherEl })`
— to animate element B into looking like element A used to, then to its
own natural position. No error. `ScrollTrigger` reports correct
`progress` values as you scroll. But the target element never visibly
moves or resizes at all — it just sits at its natural position/size the
entire time, in both directions.

**Cause:** internally, Flip matches elements between the "from" state
and the "to" state purely by a `data-flip-id` attribute — falling back
to a *globally incrementing* auto-id (`"auto-" + counter`, written back
onto the element as a real attribute) for any element that doesn't
already have one. If `state` was captured from element A and `targets`
points at element B, and neither had an explicit `data-flip-id` before,
they get two *different* auto-ids the first time Flip touches them — the
id lookup that's supposed to pair "A's recorded geometry" with "B, the
thing to animate" never matches anything, so Flip treats B as a
brand-new element entering with no "from" state, and produces a
same-state, zero-duration animation. This is invisible from the outside
because every symptom of success is present except the one that
matters: `ScrollTrigger.progress` still updates correctly (it's just
scrubbing an animation that does nothing).

**How to misdiagnose it:** assuming the problem is scroll-mechanics
related (wrong `start`/`end`, `scrub` not wired up, `document.hidden`
throttling) because progress reads correctly and there's no error to
chase. Check the animation itself, not the trigger: `const anim =
Flip.from(...); console.log(anim.duration())`. A duration of `0` means
Flip found nothing to animate between the two states — that's a
matching problem, not a scroll-trigger problem, no matter how correct
the `ScrollTrigger` setup looks.

**Fix pattern:** give both elements the *same* explicit `data-flip-id`
(any stable string) before calling `Flip.getState`/`Flip.from` — this is
mandatory whenever "from" and "to" refer to two genuinely different DOM
elements (as opposed to the same element before/after a layout change,
Flip's more common use case, where matching isn't an issue since there's
only one element to auto-id).

```html
<!-- both elements, wherever they live in the DOM: -->
<div data-flip-id="my-thing"></div>   <!-- state captured from this -->
<video data-flip-id="my-thing"></video>  <!-- animated via { targets: this } -->
```

## Category 10 — a Flip + ScrollTrigger set up on mount goes stale before layout settles

**Symptom:** a GSAP Flip animation driven by a scrubbed `ScrollTrigger`,
set up once in a mount effect, works correctly right after you fix
Category 9 — until an unrelated layout change elsewhere on the page
(bigger text, a wider container, anything that shifts where things sit)
and it stops applying its initial "fitted" look entirely. The element
just sits at its natural position/size with an empty `style=""`
attribute, as if Flip never ran — no console error anywhere. Scrolling,
resizing, or otherwise forcing a `ScrollTrigger.refresh()` can *also*
make an already-working one suddenly revert to the unfitted state after
a refresh, with the DOM's inline `style` attribute visibly going from a
correct fitted transform back to empty.

**Cause:** the Flip/ScrollTrigger setup runs once, synchronously, in a
mount effect — but real pages keep shifting layout for a beat after
that: web fonts swapping in, text reflowing, a video's metadata loading
and affecting box sizes. Whatever `Flip.getState()` and
`ScrollTrigger`'s start/end measured at effect-run time can go stale
almost immediately, and nothing forces a second look unless something
calls `refresh()`. Separately, even a `refresh()` call doesn't
guarantee a re-render: refresh's remeasurement pass often needs to
briefly clear a Flip'd element's style overrides to find its *true*
natural bounds, and if the recalculated `progress` number comes out
unchanged (e.g. `0 -> 0`, because scroll position didn't move), GSAP has
no reason to think anything needs re-rendering — leaving the
just-cleared, unfitted state as the final visible result.

**How to misdiagnose it:** assuming this is the same Category 9 problem
recurring (check `.duration()` again — it'll report a valid non-zero
number, since the Flip pairing itself is fine) or assuming it's random
flakiness because it only shows up after *other*, seemingly unrelated
changes (a font size bump, a container width change) — the trigger is
always the same: something shifted layout after the initial measurement.

**Fix pattern:** two additions, not one — they cover different moments.
1. Call `ScrollTrigger.refresh()` once, right after creating the
   trigger, to re-measure after the current tick's layout has had a
   chance to apply.
2. Add `onRefresh: (self) => self.animation.progress(self.progress)` to
   the `scrollTrigger` config, so *every* refresh — the one you just
   added, or an automatic one from a later window resize — re-renders
   the DOM to match whatever progress the trigger is actually at,
   instead of occasionally leaving the remeasurement pass's cleared
   state on screen.

```js
ScrollTrigger.create({
  // ...
  onRefresh: (self) => self.animation.progress(self.progress),
});
// right after setting up all your triggers for this mount:
ScrollTrigger.refresh();
```

**One `refresh()` still isn't the whole fix if the layout-shifting cause
is asynchronous** — web fonts are the classic case. `font-display: swap`
(what most web-font setups, including `next/font`, use by default)
paints with a fallback font first and swaps the real one in whenever it
finishes downloading — which reflows any text-driven layout *after*
your one synchronous `refresh()` call already ran, on a slow or
cold-cache load, but *before* it on a fast/cached one. Same code, two
different measured layouts, purely depending on network timing that
varies between loads — this is what "works on some loads, not others"
actually looks like from the outside. Fix: refresh again once fonts are
verifiably done, not just once immediately —

```js
ScrollTrigger.refresh(); // immediate — covers the fast/cached case
document.fonts.ready.then(() => ScrollTrigger.refresh()); // covers the slow case
// belt-and-suspenders for anything else still settling (images, media metadata):
if (document.readyState === "complete") {
  ScrollTrigger.refresh();
} else {
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}
```

— all safe to call more than once now that `onRefresh` (above) makes
every refresh re-render correctly regardless of how many others already
ran. Note the `readyState` check on the `load` listener: that event can
easily have already fired by the time a mount effect runs, and a
listener attached after the fact never gets called.

## Category 11 — when a cache-and-refresh fix keeps needing "one more event," the cache itself is the bug

**Symptom:** a scroll-linked animation (GSAP Flip, a scrubbed
`ScrollTrigger`, or any effect that measures layout once and reuses the
measurement) keeps behaving differently load-to-load even after fixing
Categories 9 and 10 — `refresh()` on mount, `onRefresh` forcing a
re-render, `document.fonts.ready` and `window.load` refresh calls all in
place. It still occasionally lands in the wrong spot, or — worse — the
element appears instantly at its *natural*, unfitted position/size on
load, then visibly jumps to the correct fitted state and back once
scrolling reaches it.

**Cause:** every fix in Category 10 shares the same shape — measure
geometry once, cache it, and add one more event listener that
re-measures and patches the cache when that specific thing happens.
That approach is only ever as complete as the list of events you
thought to cover. A web font swap, a sibling component's own async GSAP
setup nudging spacing, a browser extension injecting something, image
metadata resolving late — anything not already on the list leaves the
cached geometry stale until some unrelated scroll/resize event happens
to force a correction. Enumerating every possible invalidation trigger
is a losing game; there's always another one.

**Fix pattern:** stop caching. If the animation's cost allows it (a
`getBoundingClientRect()` call or two, not an expensive layout pass),
re-measure everything fresh on *every* animation frame via a plain
`requestAnimationFrame` loop instead of a scrubbed `ScrollTrigger` built
on a one-time (or even repeatedly-refreshed) measurement:

```js
function render() {
  const a = elA.getBoundingClientRect();
  const b = elB.getBoundingClientRect();
  // compute and apply this frame's position/size directly from a/b —
  // nothing here was computed on a previous tick or before this call
  target.style.left = `${lerp(a.left, b.left, progress)}px`;
  // ...
  requestAnimationFrame(render);
}
render(); // call synchronously once before the self-scheduling loop —
          // see the tooling-gotcha note below on why a scheduled-only
          // first call can matter
```

There is no cache to invalidate because nothing survives past the
current frame — whatever the layout actually is *right now* is what
gets read, roughly every 16ms, so a shift from any cause (including
ones you never thought to name) shows up correctly on the very next
frame. This trades a small constant per-frame cost for eliminating an
entire class of "works on some loads, not others" bugs outright; for a
single scroll-driven element (not dozens), the cost is negligible.

Two sub-lessons that surfaced building a "quick growth, then pin until
a natural position catches up" effect this way, both worth generalizing
beyond this specific feature:

- **Don't interpolate from a live/current value that itself keeps
  moving as a side effect of the thing driving the interpolation.**
  Once scrolled past a trigger point, that trigger element's own
  `getBoundingClientRect()` position keeps receding (e.g. becoming more
  negative) the further you scroll — using it directly as a lerp source
  makes the animated element chase a moving target instead of settling.
  Derive a scroll-invariant substitute instead: "where would this value
  have been at the exact instant the trigger condition became true" is
  usually a fixed expression (e.g. `top === -height` at the instant
  `bottom === 0`), not something that needs to be sampled live — but
  only *after* that instant; before it, the live value is still correct
  and must be used, so branch on the trigger condition itself, not on
  time.
- **Combine adjacent phases into one continuous expression instead of
  an `if`-branch keyed on a threshold.** A branch like `phase < 1 ?
  animate() : parkedOrReleased()` silently assumes the two phases' own
  crossover happens exactly when the branch's threshold does. On a
  short enough gap between the trigger and the resting position, the
  "resting" value can overtake the "still animating" value's curve
  *before* the branch condition flips, producing a real jump right at
  the boundary once it finally does. Instead, compute both phases' values
  unconditionally every frame and combine them with something like
  `Math.min(...)`/`Math.max(...)` (pick whichever direction represents
  "whichever gets there first wins") — there is then no boundary where
  behavior switches out from under the two curves, because both are
  always being evaluated and the combinator picks the correct one at
  every single frame, including ones where the naive threshold would
  have picked wrong.

## Tooling gotcha: don't trust automated-browser timing tests blindly

If you're debugging this kind of issue with a browser-automation tool
(including AI-driven ones), **check `document.hidden` /
`document.visibilityState` in that tab before trusting any timing-based
observation.** Backgrounded/non-focused tabs get `requestAnimationFrame`
and, past a threshold, even `setTimeout` throttled or fully suspended by
the browser (power-saving behavior) — confirmed in this session by a
`requestAnimationFrame` loop that should complete in 500ms timing out
after 45 seconds of real time, in a tab reporting `document.hidden: true`.

Static inspection (computed styles, DOM structure, classes) is unaffected
and still reliable. *Animation smoothness* observed this way is not — a
real user's focused, foreground tab runs the exact same code at a
completely different real-world cadence. When you can't get a
foreground/focused automated tab, reason precisely through the CSS/JS
mechanics (as in the categories above) rather than trusting a screenshot
sequence that "looks fine."

## Quick diagnostic checklist

When something "flickers" during an animated transition:

1. **Get the precise sentence** — "X happens, then ___, then Y." Don't
   start fixing before you have it.
2. Is it a **flash of a solid, identifiable color**? → Category 3
   (z-index race). Check what has an explicit z-index vs. `auto` at that
   exact moment. If a fix for this was already in place and the flash
   just reappeared after an unrelated duration changed elsewhere, see
   Category 3's timing-relationship note — the fix likely depends on a
   duration pairing that just went out of sync.
3. Is it the **same image re-cropping/re-zooming**? → Category 1. Check
   whether an `object-fit` element's box ever passes through two
   different aspect ratios.
4. Is it a **stutter/pause**, not a color or crop change? → Category 2.
   Check what else mounts/updates in the same commit as the animation's
   last frame.
5. Is it a **brightness/contrast shift on the same content**? → Category
   4. Check the source image's native resolution vs. its displayed sizes.
6. Does the glitch only happen **during** an entrance animation, and only
   on an element using `mix-blend-mode`? → the isolation gotcha above.
   Check every ancestor for opacity/transform/filter/z-index.
7. Did you just add a "veil" to work around the isolation gotcha, and now
   **the veil itself** briefly looks like a new dark shape (or pulse)
   over the backdrop? → Category 5. First try shaping/sizing it to an
   existing ambient layer instead of the content it covers; if it's
   still visible as its own event, drop the veil and just delay the
   content's *mount* instead (a plain boolean flipped after a timeout) —
   no animation on the element at all means nothing to glitch.
8. Did delaying the *mount* (Category 5's fix) trade that for an even
   smaller, quicker, fainter flash of plain unblended color right at the
   reveal? → Category 6. Before assuming it's about insertion timing,
   test that theory's fix in isolation — if mounting early/invisibly
   makes zero difference, the real cause is the hard single-frame
   property jump itself; add a short `transition` (e.g. `color 0.18s`)
   instead of chasing mount timing further.
9. Just slowed several reveal timings down together, and one part still
   reads as an out-of-step "flash"? → Category 7. Grep for every
   `transition`/`animate`/`exit` touching that element, not just the
   ones with an obvious name — its real visibility trigger may be a
   plain style mutation with its own CSS transition that the pass
   missed, possibly paired with an unrelated JS animation whose only job
   is to keep it mounted long enough.
10. An element positioned far outside its own DOM parent (GSAP Flip,
    a big `position: absolute`/`fixed` offset) renders nothing at all,
    with no console error? → Category 8. Check `getBoundingClientRect()`
    first — if the geometry is correct, walk the ancestor chain for the
    `overflow: hidden` container that's clipping the paint.
11. A GSAP `Flip.from(state, { targets })` between two different
    elements has correct `ScrollTrigger` progress but the target never
    visibly moves? → Category 9. Check `Flip.from(...).duration()` — `0`
    means Flip never matched the two elements (no shared `data-flip-id`),
    not a scroll-trigger problem.
12. A working Flip + ScrollTrigger stops applying its fitted look after
    an unrelated layout change (bigger text, a wider container), leaving
    an empty `style=""` and no error? → Category 10. Add
    `ScrollTrigger.refresh()` after setup and an `onRefresh` handler that
    force-renders the current progress — one without the other isn't
    enough.
13. Testing via browser automation and everything "looks right" but the
    real user still sees it? Check `document.hidden` in that tab before
    trusting the test.
14. Already fixed a stale-measurement bug (Category 10) by adding a
    `refresh()`/re-measure call for one specific event, and it keeps
    coming back for a *different* triggering event each time? → Category
    11. Stop enumerating events one at a time — replace the cached
    measurement with a live `requestAnimationFrame` loop that
    re-measures from scratch every frame instead.
15. A scroll-driven value interpolates toward a fixed target but never
    actually arrives, or overshoots wildly, once scrolled past some
    trigger point? → Category 11's "moving target" sub-lesson. Check
    whether the interpolation source is a live `getBoundingClientRect()`
    read of an element that itself keeps moving as you keep scrolling,
    instead of a scroll-invariant derived constant.
16. Two adjacent animation phases (e.g. "growing" then "pinned") produce
    a visible snap right where an `if (progress < 1)`-style branch
    switches from one to the other? → Category 11's "unify phases"
    sub-lesson. Replace the branch with both phases computed every
    frame and combined via `Math.min`/`Math.max`, so there's no
    threshold where the two curves can disagree.
