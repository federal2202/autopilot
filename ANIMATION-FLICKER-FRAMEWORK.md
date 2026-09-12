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
10. Testing via browser automation and everything "looks right" but the
    real user still sees it? Check `document.hidden` in that tab before
    trusting the test.
