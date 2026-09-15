# Design decisions log

Running list of placeholder/temporary calls made while rebuilding the site
around the nbnzia.com reference. Revisit these when the real asset/decision
is ready — nothing here is final.

## Open — needs a real asset

- **Scaling-scroll section (`ScalingMedia.jsx`)** — still runs the
  `AsciiSculpture` canvas stand-in. Swap for real photo/video into
  `.scaling-media-frame` when available.
## Resolved (recorded for context)

- **Services accordion thumbnail (`ServicesList.jsx`)** — was a plain white
  `.services-thumb` panel. `pc1/pc2/pc3.JPG` were sitting unused in
  `public/` (only `pc4/pc5/stas.JPG` are wired into the Hero slideshow), so
  swapped them in as one real per-service photo each (`<img>` instead of
  the empty span), matching the reference's real desk/workspace shot next
  to the expanded item.

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

- **Case studies section (superseded)** — the reference has a real
  named-client portfolio with results. We had no such data, so
  `Partners.jsx` filled that visual slot with real equipment/lifestyle
  partners instead. Later removed at direct request (not needed for this
  business) and replaced with `Faq.jsx` — see the FAQ entry further down.
- **Intro section rebuilt to match the reference 1:1** — previously a
  single centered column (a horizontal 4-stat row, then a centered about
  paragraph), with a *separate* full-bleed pinned-scale section
  (`ScalingMedia.jsx`) directly after it. Reference layout is different:
  a narrow stat column pinned to the *left*, the pitch statement filling
  the rest of the row, then a small looping showreel clip sitting next to
  two CTAs ("Let's talk" / "See the work"), with the stat marquee running
  along the *bottom* of that same block — not a separate section above
  it. Rebuilt `Intro.jsx` to match: `.intro-grid` (220px stat column +
  flexible text column on desktop, stacked on mobile), `.intro-stats`
  changed from a 4-across row to a plain vertical list (no more
  border-top dividers — the reference's list is a plain stack, not a
  bordered strip), and a new `.intro-media-row` (small `aspect-ratio:
  16/9` video box + `.intro-media-ctas`) below it. `Marquee.jsx` moved in
  `page.js` from *before* `Intro` to directly *after* it, so it now reads
  as the bottom edge of this block instead of its own section further up
  the page. CTAs reuse the site's existing `.btn-primary`/`.btn-secondary`
  (solid ink / outlined) rather than introducing the reference's red
  accent color — this site's palette has been deliberately monochrome
  cream/near-black throughout, and one CTA pair isn't a reason to break
  that.
- **`ScalingMedia.jsx` retired** — its full-bleed pinned-scale-on-scroll
  treatment doesn't match the reference's actual small, static-position
  video slot in this block (a pinned full-viewport takeover and a small
  inline thumbnail are fundamentally different mechanics, not a sizing
  tweak of the same one). Deleted the component and its
  `.scaling-media-*` CSS; `AsciiSculpture.jsx` itself stays, since
  `ServicesList.jsx`'s `.services-thumb` still uses it as a per-item
  placeholder. If a big pinned-scale moment is wanted elsewhere later,
  this is a reasonable pattern to revive, just not for this slot.
- **Real video swapped in for the placeholder, muted for now (per
  request)** — `/video.mp4` in `.intro-media-frame`, `autoPlay loop muted
  playsInline`. Re-encoded from the original HEVC/H.265 source to
  H.264 (`yuv420p`, `+faststart`), because HEVC in `<video>` has patchy
  support outside Safari/macOS — playing the original as-is would have
  silently failed to autoplay (or failed entirely) for a large share of
  visitors on Chrome/Windows/Linux. Also downscaled 1920×1080 → 960×540
  and stripped audio during the re-encode, since this box never renders
  wider than a few hundred px — full 1080p would just be wasted bytes.
- **Tooling incident: re-encoding in place destroyed the source file.**
  The project directory lives on a case-insensitive filesystem (macOS
  APFS default) — `video.mp4` and `video.MP4` are *the same file* on
  disk, not two files that happen to look similar. Ran
  `ffmpeg -i public/video.MP4 ... public/video.mp4` — input and output
  resolved to the identical inode, so ffmpeg read and wrote the same
  file simultaneously mid-transcode, truncating the 22 MB original down
  to a single corrupted frame with no way to recover it from that copy.
  The original survived only because an untouched copy still existed at
  `~/Downloads/video.MP4` (where the user had originally saved it) — re-
  ran the encode from that copy instead. **Lesson: on a case-insensitive
  filesystem, never use a same-named-but-different-case path as both the
  input and output of any in-place file operation (`ffmpeg`, `sips`,
  `mv`, etc.) — check `diff <(shasum -a1 pathA) <(shasum -a1 pathB)` first
  if there's any doubt, and always transcode to a different filename (or
  a temp path, then move) rather than trusting the case difference to
  keep the paths distinct.**
- **Media row was spanning the wrong columns** — first pass put
  `.intro-media-row` as a sibling of `.intro-grid`, so it stretched under
  *both* the stat column and the text column starting from the container's
  left edge. In the reference, the video+CTA row sits flush with the text
  column only — the stat column has nothing below its four lines. Fixed
  by nesting `.intro-media-row` inside `.intro-about` (right column),
  right after the paragraph.
- **Video needed a continuous scroll-linked scale, not a one-time
  reveal** — per direct request/confirmation. Reused the exact transform
  math from the retired `ScalingMedia.jsx` (`scale` interpolated
  `[0.9, 1, 1.05]` across `[0, 0.5, 1]` of `scrollYProgress`, via
  `useScroll({ target, offset: ["start end", "end start"] })` +
  `useTransform`) but applied directly to `.intro-media-frame` in place —
  no `position: sticky` pin, no full-viewport takeover, just the small
  inline box continuously growing/shrinking as it transits the viewport.
  Replaced the one-time `Reveal` (scale 0.9→1 on first view, then frozen)
  that was there before, since a `whileInView{once:true}` animation and a
  continuous scroll-driven one can't coexist on the same transform
  property.
- **Still not a match — turned out to be a fundamentally different
  mechanic, not a tuning problem.** Direct inspection of nbnzia's live DOM
  (`document.querySelector('video')` and its ancestor chain — the earlier
  automated screenshots of their site had come back blank, but the DOM
  itself was reachable via `javascript_tool` even while visually stuck
  mid-load) turned up `.scaling-video` / `.scaling-video__wrapper` with
  `data-flip-element="target"` / `data-flip-id="auto-2"` attributes, and
  **two separate sections** — `.scaling-element-header` containing
  `.scaling-element__small-box` (measured: 320×180px) and, further down
  the page, `.scaling-element-video` containing `.scaling-element__big-box`
  (measured: 1408×792px — same 16:9 ratio, just bigger). One video
  element, two differently-sized boxes in two different sections, tied
  together by `data-flip-id`: this is GSAP's **Flip** plugin, not a
  single element scaling itself in place via `useTransform`/CSS
  `transform`. Every earlier attempt (framer-motion `Reveal` scale,
  `useScroll`/`useTransform` continuous scale) was solving the wrong
  problem — animating one box, when the reference animates one *video
  element relocating and resizing between two boxes*.
- **Rebuilt around GSAP Flip to match.** `Intro.jsx`'s `.intro-media-frame`
  is now an empty slot (`data-showreel-slot="small"`, no `<video>` inside
  it at all) — just a placeholder reserving the right size/position.
  The actual `<video>` lives in a new `Showreel.jsx`, a full-container-width
  16:9 section further down the page (`.showreel-box`, sized like the
  reference's big box) — its natural, real DOM position. On mount,
  `Showreel.jsx` uses `Flip.fit(video, smallSlot, {absolute:true,
  scale:true, duration:0})` to instantly snap the video's visual
  appearance to match the small slot (confirmed pixel-exact via
  `getBoundingClientRect` — 340×191.3 fitted vs. 340×191.25 target, no
  drift), captures that as a Flip state, then `Flip.from(state, {
  scrollTrigger: { trigger: bigBox, start: "top bottom", end: "top top",
  scrub: true } })` animates it from "looks small" back to its natural
  big size as `Showreel.jsx`'s section scrolls into view — reversible,
  scroll-position-driven, same as the reference. This is architecturally
  the same trick this project already used by hand for the Hero photo
  (measure a rect, pin it, animate to a different rect) — GSAP's Flip
  plugin is just the packaged version of that idea, and it was already a
  project dependency (`gsap` ^3.15.0 — Flip and ScrollTrigger are both
  bundled in, imported per-use same as `gsap/SplitText` elsewhere).
  Live scroll-scrub playback couldn't be verified in the browser-
  automation environment (same `document.hidden` / backgrounded-tab
  throttling documented throughout this project — GSAP's ticker is
  rAF-driven and stops advancing when the tab is hidden, so a
  programmatic `scrollTo` doesn't visibly move the animation even though
  the trigger math is sound); what *was* verified directly: no console
  errors, and `Flip.fit`'s output rect matches the target slot's rect to
  sub-pixel precision. Real-browser confirmation of the scrub itself is
  on the user.
- **That Flip setup then turned the video fully invisible ("just a black
  screen").** Cause: `.showreel-box` (`overflow: hidden`) and the shared
  `.section` utility class (also `overflow: hidden`, used by literally
  every section on the site) both sit between the video and the page
  root. `Flip.fit` positions the video far outside `.showreel-box`'s own
  rect to make it visually land in Intro's small slot — a completely
  different, much-earlier section — and *any* clipping ancestor along
  that path hides the paint entirely, even though the element's
  `getBoundingClientRect()` still reports the mathematically-correct
  position (clipped-but-correctly-positioned looks identical to "not
  there" — confirmed by comparing the rect, which matched exactly, against
  what actually rendered, which was nothing). Fixed with two changes:
  removed `overflow: hidden` from `.showreel-box` (its natural, non-
  flipped state already fills it exactly via `object-fit: cover`, so
  there was never anything to clip in the settled state anyway — it was
  purely defensive, and actively harmful here), and added
  `section.showreel-section { overflow: visible; }` — a higher-specificity
  override scoped to just this one section, rather than touching the
  shared `.section` rule everyone else still relies on. Verified by
  re-checking the clipping-ancestor chain from the video up to `<html>`
  after the fix: empty (only the video's own harmless default
  `overflow: clip` and `html`'s *horizontal-only* `overflow-x: hidden`
  remain, neither of which affects this vertical repositioning).
- **After the clipping fix, still "nothing happens" — this time a real
  logic bug, not an environment limitation.** User supplied screenshots
  of nbnzia's actual scroll sequence (small box → mid-transition,
  visibly both moving *and* growing → full big box), confirming the
  target mechanic was right; the question was why ours never moved at
  all. Root-caused by reading GSAP's own `Flip.js` source directly
  (`node_modules/gsap/dist/Flip.js`), not by guessing: `Flip.from(state,
  { targets })` is documented to apply a recorded state to different
  elements than it was captured from, but internally (`_fromTo`, the
  `for (p in toState.idLookup)` loop) it matches elements between the
  "from" and "to" states purely by `data-flip-id` — falling back to a
  *globally incrementing* auto-id (`"auto-" + _id++`) for any element
  that doesn't already carry one. Two different, unrelated elements
  (the empty small-slot div and the video) each silently got their own
  distinct auto-id the first time Flip touched them, so the id lookup
  never found a match — Flip treated the video as a brand-new element
  with no recorded "from" state at all, and produced a same-state,
  zero-duration timeline (confirmed directly: `Flip.from(...).duration()`
  logged as `0`, despite the two elements' `getBoundingClientRect()`
  values being genuinely, substantially different — proof this was a
  matching failure, not a real "nothing changed" result). Fixed by adding
  the *same* explicit `data-flip-id="showreel-video"` to both the small
  slot (`Intro.jsx`) and the video (`Showreel.jsx`) — exactly the pattern
  nbnzia's own DOM already used (`data-flip-id="auto-2"` was visible on
  their `.scaling-video` back when this was first investigated, which in
  hindsight was already the answer). Re-verified after the fix by
  forcibly scrubbing `ScrollTrigger` to 0%, 50%, and 100% and reading the
  video's rect at each: 340×191 (at the slot) → 836×470 (interpolated
  midpoint, position *and* size both moving) → 1332×749 (full natural
  size) — a real, working Flip this time, not just a plausible-looking
  setup.
- **Four more rounds of feedback on the showreel/intro block, all fixed
  together:**
  - *"Black shapes in the background"* — `.intro-media-frame` (the small
    slot) and `.showreel-box` (the video's natural home) both had a
    `background: var(--near-black)` fallback. Since Flip moves the video
    via `transform` (not `position: absolute`/`fixed`), it never actually
    leaves either box's normal document flow — `.showreel-box` still
    reserves its full natural height on the page even while the video
    is visually elsewhere, and `.intro-media-frame` is a permanently
    empty div regardless of where the video currently appears. Both
    backgrounds painted as stray solid rectangles whenever the video
    wasn't visually overlapping them. Removed both — nothing left to
    show there except the video itself, wherever it visually is.
  - *"Video jumps out of the first frame too fast"* — the scrollTrigger
    span was `trigger: bigBox, start: "top bottom", end: "top top"`,
    i.e. exactly one viewport-height of scroll distance for the *entire*
    grow-and-drift. Changed to `trigger: smallSlot, start: "bottom top"`
    through `endTrigger: bigBox, end: "top top"` — spans the whole real
    gap between the two sections (Marquee sits in between), giving a
    slow, gradual drift instead of a one-screen-height pop.
  - *Intro layout not matching the reference* — three separate issues,
    all from the same root cause (`.intro-about`'s `max-width: 720px`
    was too narrow): the CTA row wrapped the buttons below the video
    instead of beside it (not enough width for video + both buttons on
    one line). Widened to `1040px`. Also bumped `.intro-about-text` from
    `clamp(19px,2.4vw,27px)` regular-weight to `clamp(26px,3.6vw,44px)`
    at `font-weight: 600` per "text should be big, emphasized," and
    added a `filter: blur(6px) -> blur(0px)` scrub alongside the
    existing color ghost-to-ink scrub in `Intro.jsx` (same GSAP
    SplitText mechanism, just an added property) for a more "interesting
    appearance" at this larger size than a flat color fade alone gave.
  - *"Buttons should be more interesting, with an accent color"* —
    sitewide `.btn` redesign. Adopted `--accent` (`#eb381c`), which
    already existed in the palette and was already quietly in use
    (ProcessSteps' "KM 01" index color) but had no real home — now
    `.btn-primary`'s background everywhere (navbar, hero-adjacent CTAs,
    offer, closing, contact, intro), replacing the plain `--fg`/ink it
    used before. Added a fold-corner "tag" mark (small triangular
    `::before`/`::after` overlays in the top-left/bottom-right corners,
    tuned per variant) echoing the reference's folded-paper-corner
    buttons without literally copying them — deliberately **not** a
    `clip-path` cut corner, since clip-path masks everything painted
    through the element, pseudo-elements included, so a corner *notch*
    on the button would also erase any mark trying to fill that same
    notch. An opaque overlay avoids that entirely.
- **A refresh-timing bug specific to Flip + a live ScrollTrigger.** While
  fixing the above, the video stopped rendering the fitted-small look
  altogether after the layout changes — it just sat at its natural big
  size/position with an empty `style=""` attribute, as if Flip had never
  run. Root cause: the Flip/ScrollTrigger setup runs once, in an effect,
  right as the component mounts — but layout (web fonts swapping in,
  text reflowing at the new larger size, the video's own metadata still
  loading) can still be shifting at that exact moment, so the
  measurements taken then go stale almost immediately, and nothing
  forces a second look. Fixed with two additions: an explicit
  `ScrollTrigger.refresh()` call right after setup (re-measures
  everything once layout has had a beat to settle), plus `onRefresh:
  (self) => self.animation.progress(self.progress)` on the scrollTrigger
  itself. The second part matters independently of the first: refresh()
  can leave the DOM at the video's natural (un-fitted) state even when
  the calculated `progress` is unchanged (0 -> 0), because refresh's own
  remeasurement pass needs to briefly clear a Flip'd element's overrides
  to find its true natural bounds, and won't bother re-rendering
  afterward if it doesn't think progress changed — confirmed directly by
  watching the video's inline `style` attribute go from a correct fitted
  transform to empty (`""`) after a scroll-triggered refresh, with no
  console error anywhere. `onRefresh` forcing a render guarantees the
  DOM always matches whatever progress the trigger is actually at, on
  every refresh, not just the first one — the fix isn't a one-time
  workaround, it's needed for the automatic refreshes a window resize
  triggers too.
- **Intro layout restructured to match the reference's actual column
  split.** Previous layout put stats in the left column alone, and the
  video + both CTAs together in one row under the paragraph on the
  right — our own invention, not what the reference does. Reference:
  the *left* column carries the stats **and** the video (stats on top,
  video pinned to the bottom of that same narrow column), while the
  *right* column is just the paragraph with the CTAs sitting close
  underneath it — no video there at all. Rebuilt to match: `.intro-grid`
  widened its left track from `220px` to `340px` (220px was sized only
  for the stat text; a 16:9 video needs real room to not look cramped),
  and `.intro-stats-col` (new wrapper around `.intro-stats` +
  `.intro-media-frame`) is a flex column with `justify-content:
  space-between` — since CSS grid's default `align-items: stretch`
  (removing the `align-items: start` override from the previous layout)
  makes both grid columns share the row's full height, `space-between`
  reliably pins stats to the top and the video to the bottom regardless
  of how tall the paragraph makes the row, without any manual height
  math. Verified the two now share a bottom edge with the CTAs' own
  bottom via `getBoundingClientRect()` — both landed at the same y
  value. CTAs moved from their own separate row into `.intro-about`
  directly (renamed `.intro-media-ctas` → `.intro-ctas`, `margin-top`
  cut from `--sp-10` to `--sp-6`) so they sit close under the last line
  of text, matching the reference instead of trailing far below it.
- **That gap was cut too far — measured the reference again and reverted
  direction.** Re-measured a clean (non-transitional) reference
  screenshot directly: the gap between the paragraph's own bottom and
  the buttons' top runs to roughly 60% of the paragraph's height, not a
  tight ~28px. `.intro-ctas`'s `margin-top` moved back up, this time to
  `--sp-10` (96px) instead of the `--sp-6` (28px) from the previous
  round — that previous cut was based on a misread of the reference,
  not a correction of it. Also removed the `filter: blur()` scrub added
  alongside the color ghost-to-ink reveal in `Intro.jsx` the same round
  it was added — kept the plain color scrub only, per direct request to
  drop it. The apparent "everything sinks to the bottom" complaint that
  came with this was most likely the blur itself: a blurred, low-
  contrast paragraph mid-scrub visually reads as background noise,
  making the video + buttons area (already anchored toward the row's
  bottom by design — see the space-between entry above) look like the
  only "real" content on screen, exaggerating how bottom-heavy the
  section felt. Removing the blur was likely most of that fix on its
  own; the two changes shipped together rather than trying to isolate
  which one mattered more.
- **The Flip fit was inconsistent load to load — one more layer of the
  same refresh-timing issue.** After the earlier fix (an immediate
  `ScrollTrigger.refresh()` + `onRefresh` forcing a re-render every
  refresh), the Flip still sometimes landed correctly and sometimes
  didn't, depending on the load — the signature of a race rather than a
  deterministic bug. The remaining gap: that one `refresh()` call runs
  synchronously right after setup, but next/font swaps the real
  typeface in asynchronously (`font-display: swap`), and that swap
  reflows `.intro-about-text` — the row's tallest, height-defining
  column — *after* the immediate refresh on a slow/cold-cache load, but
  *before* it on a fast/warm one. Same code, two different measured
  layouts, purely depending on network/cache timing that varies between
  loads. Fixed by adding two more refresh calls, both safe to repeat
  now that `onRefresh` exists: `document.fonts.ready.then(() =>
  ScrollTrigger.refresh())` (fires exactly when every font is actually
  done swapping — a no-op timing-wise on a fast load, load-bearing on a
  slow one), and a `window.load` refresh for anything else (images, the
  video's own metadata) — guarded with a `document.readyState ===
  "complete"` check first, since `load` can easily have already fired
  by the time this effect runs and would otherwise never call back.
  Reloaded repeatedly in this session's own test environment and got
  identical fitted geometry every time (fonts were already
  locally cached after the first compile, so the slow-load path
  specifically couldn't be reproduced here) — the fix targets the
  mechanism directly rather than a symptom that was observed to
  reproduce locally; real confirmation on a genuinely cold cache is on
  the user.
- **Showreel abandoned GSAP Flip/ScrollTrigger entirely for a manual,
  no-caching rAF loop — the refresh-timing patches above kept the
  symptom alive.** Even after the `refresh()` + `onRefresh` +
  `document.fonts.ready` + `window.load` layering (previous entry), the
  user still reported the video landing differently load to load, and
  on one reload it appeared instantly at its natural (big) position at
  the bottom of the page, then visibly jumped to the correct fitted
  position and back to the scroll position once scrolling reached it.
  Every one of these fixes shared the same shape: measure geometry
  once, cache it, and add one more event that re-measures and patches
  the cache. That approach can only ever be as complete as the list of
  events considered — a web font swap, another component's own async
  GSAP setup shifting spacing, or anything else not yet on the list
  leaves the cached geometry stale until some unrelated scroll/resize
  happens to force a correction, which is exactly what "works
  sometimes, jumps other times" looks like from outside. Rewrote
  `Showreel.jsx` to not cache anything at all: a single
  `requestAnimationFrame` loop re-reads both the small slot's and the
  big box's `getBoundingClientRect()` from scratch and recomputes the
  video's `position:fixed` left/top/width/height every ~16ms, for as
  long as the component is mounted, independent of scroll/resize/font
  events entirely. There is no stale state to correct because nothing
  is ever held past a single frame — whatever the layout actually is
  *right now* is what gets read. `Flip`, `ScrollTrigger`, and
  `data-flip-id` were removed from both `Showreel.jsx` and `Intro.jsx`.
- **New requirement: the video should start growing immediately on
  scroll and be fully visible by the time the marquee/gap area is
  reached, not still mid-transition or off-screen through it.**
  Previously the grow phase was driven by "however far away the big
  box actually is," so with `Marquee` sitting in the gap between the
  intro and the showreel section, most of that scroll distance was
  spent watching the video still small or already off-screen — a dead
  stretch. Changed growth to a fixed, short distance
  (`window.innerHeight * 0.6`) driven by how far the small slot's
  bottom edge is from the viewport's top, independent of where the big
  box physically sits. Once fully grown it doesn't jump-cut to
  tracking the big box's real (likely still-offscreen) position either
  — it parks centered in the viewport (`pinnedY`) and stays there until
  the box's own natural scroll position rises up to meet it, at which
  point it hands off to tracking the box directly. Three sequential
  math bugs surfaced while building this, each found by injecting the
  exact render logic as JS into the live page and checking
  `getBoundingClientRect()` numbers directly rather than relying on
  screenshots (the automation tab is backgrounded, which stalls both
  `requestAnimationFrame` past its first tick and `<video>` decode —
  see `ANIMATION-FLICKER-FRAMEWORK.md`'s tooling-gotcha section):
  - **Moving-target interpolation source.** Using the slot's *live*
    `getBoundingClientRect().top` as the lerp start once scrolled past
    it made the video chase an ever-more-negative (further off-screen)
    target throughout the whole grow phase instead of crossing back
    into view. Fixed by deriving the scroll-invariant "top the slot had
    at the instant its bottom crossed the viewport top" —
    `-smallRect.height` — since the slot's own height doesn't change
    with scroll, only its position does.
  - **Pre-trigger regression from that fix.** Using the fixed
    `-smallRect.height` value unconditionally (even before the trigger
    point) put the video off-screen at page load, when it should have
    simply tracked the slot's real, fully-visible position. Fixed with
    `remaining > 0 ? smallRect.top : -smallRect.height` (`remaining` =
    px until the slot's bottom reaches the viewport top) — the two
    forms agree exactly at `remaining === 0`, so there's no seam.
  - **Phase-boundary discontinuity.** A hard `sizeProgress < 1 ?
    animate : pinned-or-release` branch assumed growth always finishes
    before the box's natural position could reach the pin point. On
    this site's actual (short) intro-to-showreel gap that's false: at
    `sizeProgress≈0.9998` the "still animating" branch gave `y≈15.89`
    while the "released" branch would have given `y≈-115` at the same
    instant — a real, visible jump right at the boundary. Fixed by not
    branching on the crossover at all: `growthY` computes the
    growth-phase value regardless, and `y = Math.min(growthY,
    bigRect.top)` is taken every frame — release can happen mid-growth
    if the box gets there first, and the two curves never disagree
    because there's no threshold where behavior switches out from
    under them.
  Verified the final formula with an 8-point numeric scroll sweep
  injected into the live page (pre-trigger, trigger, four points
  through the grow phase, the release point, and past it), confirming
  smooth non-discontinuous position/size at every point. `npx eslint`
  on both files is clean. True animation-smoothness and video-decode
  behavior could not be visually confirmed in this environment (see
  tooling-gotcha note) — geometry was verified numerically instead;
  real confirmation in a focused, real browser tab is on the user.
- **Contact form** — the reference's contact section actually submits
  (Name/Email/Submit). `Contact.jsx` intentionally stays as static
  email/phone cards — no fake form UI with nowhere to send data.
- **Display font** — the reference uses a commercial font ("Bdogrotesk") we
  can't license. Substituted **Space Grotesk** (Google Fonts) for all large
  display/headline type via `--font-grotesk`.
