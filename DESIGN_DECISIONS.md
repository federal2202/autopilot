# Design decisions log

Running list of placeholder/temporary calls made while rebuilding the site
around the nbnzia.com reference. Revisit these when the real asset/decision
is ready — nothing here is final.

## Open — needs a real asset

- **Scaling-scroll section (`ScalingMedia.jsx`)** — still runs the
  `AsciiSculpture` canvas stand-in. Swap for real photo/video into
  `.scaling-media-frame` when available.
- **Services accordion thumbnail (`ServicesList.jsx`)** — the reference's
  "WHAT I DO" accordion shows a real photo (a desk/workspace shot) next to
  the expanded item. Same placeholder story: `.services-thumb` currently
  renders `<AsciiSculpture />` at a small size. Swap for a real per-service
  photo (or one shared brand photo) when available — one `<img>`/`<video>`
  per accordion item, or a single shared image, either works with the
  existing expand/collapse animation.
## Resolved (recorded for context)

- **Hero cold-open (`Hero.jsx`)** — reproduces the nbnzia.com reference's
  loader→hero mechanic 1:1: "Auto"/"pilot" render merged as one wordmark on
  a cream screen (with a KineticText letter-rise reveal on mount, matching
  the reference's write-on), split apart to open a gap, a small
  normal-proportioned (no rounded corners) frame in that gap cycles through
  `pc5.JPG` → `pc4.JPG` → `stas.JPG`, then the frame (still showing
  `stas.JPG`) grows into the fullscreen hero background via a manual FLIP
  (`getBoundingClientRect` → pin inline styles → animate to fullscreen).
  The loader stays opaque cream through the entire growth animation (not
  just merged/split/slides), which is what keeps the navbar masked until
  the photo has fully taken over — sequence is photo-fills-screen →
  navbar-unmasks → statement fades in, per how the reference actually
  plays out. Plain `<img>` (not `next/image`) is used deliberately — the
  FLIP needs one ref-able DOM node it can measure and reposition each
  phase; `next/image`'s wrapper/`fill` model would fight that. The one-off
  `Preloader.jsx` from an earlier pass was folded into this component and
  removed, since the reference's loader and hero are one section, not two.
  `pc4/pc5/stas.JPG` were resized from ~6000px camera originals down to
  2400px/~85% quality — besides the obvious weight/LCP win, serving the
  original huge files caused a visible brightness "pop" right as the frame
  hit fullscreen (the browser was re-decoding the massive source at a much
  higher resolution mid-transition); `will-change: width, height` on
  `.hero-visual-frame` was added alongside for the same reason. The hero's
  own big text is the sales statement (`hero.tagline`, two short lines),
  not a second rendering of the wordmark — nbnzia's hero never shows its
  logo large again once the loader's gone, only nav-sized branding plus
  their "EVERY GREAT TRICK…" statement, so there's no eyebrow, lead
  paragraph, CTAs, or scroll cue left in Hero.jsx at all.
- **Hero photo framing, settled on `cover`** — went through `cover` (crops
  inconsistently as the box resizes) → `contain` + cream pillarbox bars
  (bars are exactly as wide as the viewport/photo aspect mismatch, so
  looked fine at one aspect ratio and bad at another, e.g. a 14" laptop)
  → `contain` over a blurred `cover` backdrop copy (eliminates the bars
  entirely, but the blurred fill itself was judged not good enough — too
  soft/washed-out a look for a hero). Direct call: go back to plain
  `object-fit: cover` on `.hero-visual-img` everywhere (slider and
  fullscreen both), accept that it crops on some aspect ratios, and use
  `object-position` to keep the crop safe — `"center 18%"` specifically
  for `stas.JPG` (keeps the founder's head in frame), default center for
  the desk shots. No bars, no blur, no per-viewport math — simplest of
  the three, at the cost of occasionally cropping the photo's edges. That
  reintroduced the loader→fullscreen brightness/crop "pop", though — root
  cause: `.hero-visual-frame`'s small-preview width was `vw`-based but its
  height was ALSO `vw`-based (`clamp(240px, 30vw, 420px)` ×
  `clamp(170px, 20vw, 300px)`), which bakes in a fixed ~1.5:1 frame ratio
  that has nothing to do with the viewport's actual aspect ratio. Since
  `object-fit: cover`'s crop window depends only on the box's aspect
  ratio, growing from that fixed ratio to the fullscreen box's ratio
  (`100vw` × `100dvh` — the viewport's own ratio) necessarily re-crops
  mid-animation, and the re-crop is what reads as a pop.
  First attempt at a fix put the small preview's height in `vh` using the
  same coefficient as the width's `vw` (`30vw` / `30vh`) so
  width/height algebraically equals viewportWidth/viewportHeight — but
  this only holds in the *unclamped middle* of both clamp()s; the
  moment either one hits its own min/max independently (which is most
  real windows, not some edge case — it happened on the very first test
  viewport), the ratio match breaks again. Actual fix: `.hero-visual-frame`
  now uses `aspect-ratio: var(--vp-ratio)`, with `--vp-ratio` set from
  Hero.jsx (`window.innerWidth / window.innerHeight`, updated on resize)
  instead of a second independent clamp() for height. `aspect-ratio` keeps
  height an exact function of width regardless of how width's own clamp()
  resolves, so the match holds everywhere, not just in one lucky range.
  Once the manual FLIP sets an explicit `height` inline for the fullscreen
  state, that wins over `aspect-ratio` automatically — no special-casing
  needed for the handoff.
- **The resize wasn't the whole story** — fixing the aspect-ratio match
  made the pop *more* visible, not less, which was the tell that another,
  bigger cause was stacking on top of it: the CSS width/height transition
  finishing and the `setPhase("settled")` React commit landing in the same
  instant. That commit mounts the scrim, mounts the entire statement
  block, unmounts the loader, and drops the frame's z-index — real DOM
  insertion and a layout/paint pass, arriving at exactly the moment the
  resize transition needs its own final frame. Added `REVEAL_DELAY`
  (180ms): the manual FLIP's `settle()` still repositions the frame
  (`position: fixed` → `absolute`, `100vw/100dvh` → `100%/100%`) the
  instant the resize transition ends, as before, but `setPhase("settled")`
  — the thing that mounts everything else — now fires on a short timeout
  after that, not in the same tick. The photo's own geometry gets a beat
  to fully paint, undisturbed, before the rest of the reveal piles on.
- **Loader exit, not unmount** — the loader disappearing was a plain
  conditional (`{introVisible && <div>...}`), so it vanished the instant
  `introVisible` went false — and since the navbar sitting underneath it
  had been fully opaque the entire time (only ever hidden by the loader
  painting over it, never by its own opacity), that hard unmount read as
  the navbar snapping in abruptly. Wrapped it in `AnimatePresence` with
  `exit={{ opacity: 0 }}` so it fades over 0.4s instead.
- **The actual white flash** — user-reported precisely: photo finishes
  expanding, then a white/cream flash, then the rest of the hero appears.
  Root cause was the exact moment `setPhase("settled")` fires (after
  `REVEAL_DELAY`): the frame's z-index prop (React-managed, see above)
  goes from `1500` to `undefined` in that commit, but `.hero-loader` —
  still mounted, mid-`AnimatePresence` exit, opacity still ~1 — keeps its
  explicit `z-index: 1400` for the whole fade. A positioned element with
  *no* explicit z-index (`auto`, what the frame becomes) always loses to
  one that still has an explicit value, no matter how "low" — so for
  that instant the still-opaque cream loader jumps on top of the fullscreen
  photo. Fix: in `settle()`, synchronously with the frame's own geometry
  finishing (not 180ms later with the rest of the reveal), directly set
  `loaderRef.current.style.background = "transparent"`. By the time the
  z-index race above can even happen, the loader has nothing left to
  paint — its words are already faded via `.is-faded` (tied to
  `isFullscreen`, already true) and now its background is gone too, so
  whichever element wins the stacking order is moot.
- **That fix traded a flash for a snap** — setting the loader's
  `background` directly with no transition meant it went from opaque
  cream to fully transparent instantly — which is exactly what unmasks
  the navbar, so the navbar (and everything else the loader was hiding)
  now popped in with zero animation instead of flashing. Added
  `transition: background 0.4s ease` to `.hero-loader` — the imperative
  `style.background = "transparent"` write still happens at the same
  synchronous moment (still killing the z-index race above), but now
  animates instead of snapping.
- **The statement text also can't be animated at all, not even "just
  `y`"** — the previous entry already avoided `opacity` on
  `.hero-statement-line` for the mix-blend-mode reason, but kept a
  `y: 24 → 0` transform-based slide-in, reasoning that a *settled*
  `translateY(0px)` doesn't isolate. In *practice* the isolation/blend
  calculation visibly glitched while the transform was actively
  animating (Chrome promoting/demoting the compositor layer mid-transform
  — the text read as plain white for a beat before the tint caught up),
  even though the resting state looked fine. Fix: the statement lines are
  now plain, fully static `<p>` tags — zero animated properties, ever.
  The reveal motion moved to a new sibling, `.hero-statement-veil`: an
  opaque near-black div (no `mix-blend-mode` of its own, so it has no
  isolation constraints at all) that fades its own `opacity` from 1 to 0
  on top of the statement block, uncovering the already-static,
  correctly-blended-from-frame-one text underneath rather than fading the
  text in. First version used a tight, unblurred box and showed as a
  visible hard-edged rectangle sitting on the photo; added
  `filter: blur(60px)` with the box pulled out well past the text's own
  bounds so it feathers into the existing scrim instead of reading as a
  new shape.
- **The blurred veil still read as a foreign shadow** — even blurred and
  oversized relative to the text, `.hero-statement-veil` was scoped to
  `.hero-statement`'s own (small) bounding box, so its soft edges never
  lined up with anything else on the photo — it visibly appeared as a
  loose dark patch over the hoodie/text for about a second before
  disappearing. Tried a full-bleed version sharing the scrim's exact
  gradient shape (`.hero-reveal-veil`) — better, but still a visible,
  if subtler, darkening pulse over the whole photo, which read as its
  own "something happened" moment rather than nothing at all.
- **Dropped the veil concept entirely** — every version of "cover the
  text and uncover it" ended up visible as *something* (a shape, a pulse)
  because it necessarily darkens more of the photo than the ambient scrim
  already does, however well-shaped. Per direct request, replaced with
  the simplest possible mechanism: the statement lines mount with zero
  animation of their own (no fade, no veil, nothing) — `showStatement`
  is a plain boolean that flips true `STATEMENT_DELAY` (500ms) after
  `phase` reaches `"settled"`, so the text simply isn't in the DOM yet
  during the scrim/navbar reveal and then mounts, instantly, already in
  its final position and already correctly blend-colored. Slower in
  *timing* (it waits its turn instead of landing in the same commit as
  everything else), not slower in *manner* — there's no partial or
  wrong-color state for it to ever be caught in, so nothing to glitch.
- **A new, smaller flash appeared in its place** — quicker and fainter
  than the old shadow-veil bug. First guess was that it was about *DOM
  insertion timing*: the statement `<p>` tags were only inserted the
  instant `showStatement` flipped true, and a brand-new
  `mix-blend-mode` element's first-ever paint can in principle land
  before the blend calculation catches up. Tried mounting the `<p>` tags
  unconditionally as soon as `.hero-container` mounts, `color:
  transparent` by default so that first paint is invisible either way,
  with `showStatement` only toggling `.is-visible` (`color: #fff`) later
  — **this made no difference at all**, which rules the insertion-timing
  theory out entirely (confirmed by direct user report after testing:
  "все также" — still exactly the same). The pre-mount is harmless and
  stayed, but it isn't what was fixing anything.
- **Actual cause: an instant, hard `color` cut itself.** With no
  transition, `.is-visible` flips `color` from `transparent` to `#fff`
  in a single frame — and a mix-blend-mode element re-blending in one
  hard jump can still land on a frame where Chrome hasn't finished
  recomputing the blend, regardless of whether the element is brand-new
  or has been mounted (invisibly) for half a second. The common thread
  across every round of this bug turned out to be "some property this
  element uses jumps in a single frame," not particularly which
  property. Fix: `transition: color 0.18s ease` on `.hero-statement-line`
  — spreads the same transparent→white change across ~15 frames instead
  of 1, so no single frame is ever "the wrong one." Still reads as a
  near-instant pop (180ms), not a fade — `color` doesn't create a
  stacking context, so it still doesn't reopen the isolation problem
  `transform`/`opacity` caused earlier in this same element's history.
- **Even that wasn't the end of it — abandoned adaptive color entirely.**
  After the `color`-transition fix, a fast, faint flash was *still*
  reported, unchanged ("все также"). At that point the adaptive-contrast
  effect (see "Statement color: adaptive" below, now superseded) had
  gone through five distinct rounds of workaround, each catching one
  failure mode and surfacing a smaller one, never landing on something
  actually stable — a sign the underlying technique (mix-blend-mode text
  that must never be animated, never sit behind an isolating ancestor,
  never change any property in a single hard frame) was too fragile for
  the payoff. Per direct request, dropped `mix-blend-mode` entirely:
  `.hero-statement-line` is now plain `color: var(--cream)`, no
  text-shadow, no veil, no adaptive contrast at all — legibility now
  rides entirely on `.hero-visual-scrim`'s darkening. This finally makes
  the element boring enough (in the good sense) to animate normally:
  `.hero-statement` is a plain `m.div` with a real framer-motion opacity
  fade (`0 → 1`, 1.6s), gated on `showStatement` (still delayed
  `STATEMENT_DELAY` — now 400ms — after `phase` hits `"settled"`, same
  reasoning as before: don't land in the same beat as the scrim/navbar
  reveal). Also slowed the scrim's own fade-in (0.6s → 1.4s) and the
  loader's exit fade (0.4s → 0.9s) per the same request to make element
  entrances read as more deliberate. If adaptive per-pixel contrast is
  wanted again later, it needs a fundamentally different implementation
  (e.g. sampling the backdrop and setting a computed solid color in JS,
  rather than `mix-blend-mode`) — the CSS blend-mode route is now a
  closed chapter for this element, not a temporary regression.
- **The reported flash and abruptness were never about the text at
  all.** After dropping mix-blend-mode entirely, the same complaint
  came back ("photo expands → quick flash → navbar and text both just
  there"), pointing at something unrelated to anything already touched.
  Traced it by reading `settle()` in Hero.jsx directly (automated
  browser timing tests were, once again, unusable here — the tab was
  confirmed backgrounded, `document.hidden: true`, mid-test): the
  **navbar reveal never went through the framer-motion exit fade at
  all.** It's `.hero-loader`'s own `background` CSS transition, flipped
  from cream to transparent by a synchronous `style.background =
  "transparent"` write inside `settle()`, fired at the exact instant the
  photo's expand transition ends. When the whole reveal was slowed down
  earlier this session (scrim 0.6s→1.4s, loader's framer-motion exit
  0.4s→0.9s), this CSS transition got missed — it was still `0.4s`, the
  fastest thing in the whole sequence and the earliest-triggered (right
  as the photo finishes expanding, before the scrim/statement even start
  fading in), so it read exactly as "flash, then navbar/photo already
  fully there" while the slower stuff was still catching up behind it.
  Fixed: matched it to the scrim's `1.4s`. This also meant the loader's
  framer-motion exit duration had to move to `1.4s` too (from `0.9s`) —
  that exit fade is what keeps the loader *mounted*; if its duration is
  shorter than the CSS background-transition, React unmounts the loader
  mid-fade and cuts the transition off abruptly. The two durations must
  stay in sync going forward.
- **That fix immediately reopened the z-index race it was supposed to
  have already closed.** Next report: "flash, then everything appears
  smoothly" — an exact, clean split between a hard flash and the (now
  correctly slow) fades. Root-caused entirely by reasoning through
  `settle()`/the render, no browser testing needed: `.hero-visual-frame`
  keeps its explicit `z-index: 1500` only until `phase` hits `"settled"`
  (`REVEAL_DELAY` after `settle()` runs), at which point it drops to
  `auto`. `.hero-loader` keeps an explicit `z-index: 1400` for its
  *entire* lifetime, including its whole exit. The instant the frame
  goes to `auto`, the loader — explicit z-index always beats auto,
  regardless of value — wins the stacking race and jumps back on top of
  the fullscreen photo, however far its own `background` transition has
  actually progressed by that moment. At the old `REVEAL_DELAY` (180ms)
  against the old background-transition (0.4s), the loader was already
  ~45% faded by the time this race could happen, so the "flash" was
  faint enough not to register as one. Lengthening the background
  transition to 1.4s (previous entry) without also lengthening
  `REVEAL_DELAY` left it only ~13% faded at the same 180ms mark — the
  exact same race, now landing while the loader is still almost fully
  opaque cream. Fixed by raising `REVEAL_DELAY` to `1450` (just past the
  loader's `1.4s` background-transition): the frame doesn't drop its
  explicit z-index until the loader has nothing left to show, so winning
  the (still-technically-happening) race is now harmless — same fix
  pattern as the original z-index bug, just re-paired with the new
  duration. `REVEAL_DELAY` and `.hero-loader`'s `background` transition
  duration are now a coupled pair, same as that transition and the
  loader's own exit duration above — change one, change the other.
  Side effect: the fullscreen photo now sits plain (no scrim, no text)
  for ~1.45s before anything else layers in, versus ~180ms before — a
  deliberate trade given the explicit "make everything slower" request,
  not an accidental regression.
- **Statement color: adaptive, not simplified away (historical — see
  above, this was reverted)** — first shipped
  `mix-blend-mode: difference` (auto-inverting white text against the
  photo — reads dark over the bright background, light over the person,
  matching the reference's apparently-manual per-word color switching for
  free), then reverted it for a plain `color: var(--cream)` + text-shadow
  because the constant hard color flips read as too harsh. Brought back
  on request, tuned softer: `mix-blend-mode: exclusion` instead of
  `difference` — same adaptive idea, mathematically gentler inversion, so
  it tints rather than hard-flips. Requires the same stacking-context care
  as before and it's easy to silently break: `.hero-container` and
  `.hero-visual-scrim` must stay off any explicit z-index (cancel the
  `.container` utility's `z-index: 2`) so they don't isolate into their
  own stacking context, the frame's z-index is React-managed and removed
  entirely (not set to `0`) once settled, and the statement lines animate
  in via `y` transform only — never `opacity`, which also isolates and
  would silently kill the blend mid-fade.
- **Navbar over a photo, not cream** — the logo/link/CTA sizes and the
  `opacity: 0.55` link treatment were tuned for the old flat-cream hero;
  over a busy photo they read as too small and too faint. Sized everything
  up (logo `size=46`, bigger logo/link/CTA type) and raised link opacity to
  0.9 with a soft text-shadow for legibility regardless of what's behind
  them. Also made `.navbar-logo-accent` match the mark SVG's own fill
  (`#0a0a0b`) exactly instead of `--ink` (`#1f1f1f`) — close enough most
  places, but side-by-side with the mark the mismatch was visible. `.btn`
  lost its `border-radius: 999px` pill shape sitewide (now `0`, sharp
  corners) per direct request — this affects every button, not just the
  navbar CTA.
- **Photos re-cropped to a wider aspect ratio** — `pc4/pc5/stas.JPG` were
  2400×1611 (~1.49:1); re-cropped all three to 2400×1395 (~1.72:1,
  `stas.JPG` cropped mostly from the bottom to keep the headroom at the
  top intact). This predates and is now superseded by the blur-fill fix
  above as the thing actually eliminating the bars, but it's a reasonable
  crop on its own merits (closer to how the photos will typically be
  seen) and there's no reason to re-widen them back out.
- **Pinned statement (`PinnedTagline.jsx`, new)** — reproduces the
  reference's pinned, scroll-scrubbed headline (their "EVERY GREAT TRICK…"
  line) using `hero.lead` as the copy, via GSAP ScrollTrigger + SplitText
  (pin + per-character scrub from a faint tone to solid ink). This is the
  one piece of the redesign that needed real GSAP rather than framer-motion
  — framer-motion has no pinned-scroll-scrub primitive.
- **Intro paragraph reveal (`Intro.jsx`)** — the "about" paragraph now uses
  the same GSAP SplitText scroll-scrub technique (ghost → ink) instead of a
  framer-motion viewport-enter fade, matching the reference's per-character
  reveal. Simplified from the reference's three-stage ghost→accent→ink to a
  two-stage ghost→ink — the accent flash felt like more moving parts than
  the payoff was worth for a body paragraph.

- **Case studies section** — the reference has a real named-client
  portfolio with results. We have no such data, so `Partners.jsx` fills that
  visual slot instead, showing the real equipment/lifestyle partners in the
  same numbered-row layout. Not a 1:1 content match, but honest.
- **Contact form** — the reference's contact section actually submits
  (Name/Email/Submit). `Contact.jsx` intentionally stays as static
  email/phone cards — no fake form UI with nowhere to send data.
- **Display font** — the reference uses a commercial font ("Bdogrotesk") we
  can't license. Substituted **Space Grotesk** (Google Fonts) for all large
  display/headline type via `--font-grotesk`.
