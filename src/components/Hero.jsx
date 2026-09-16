"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { hero } from "@/data/content";
import KineticText from "./KineticText";

const EASE = [0.65, 0, 0.35, 1];
const [headA, headB] = hero.headingParts;

// Cold-open sequence, reproducing the nbnzia.com reference 1:1:
// "Auto" + "pilot" sit merged as one word on a cream screen, then split
// apart to open a gap in the middle. A small frame in that gap cycles
// through three stills (production shots, then the founder portrait), and
// the founder frame then grows into the fullscreen hero background — a
// manual FLIP (measure current rect, pin it inline, then transition to the
// fullscreen rect) so the box can cross from an in-flow flex child to a
// fixed fullscreen layer without a jump cut.
const SLIDES = ["/pc5.JPG", "/pc4.JPG", "/stas.JPG"];
const SLIDE_HOLD = 420;

// Kinetic letter-reveal timing, in ms (KineticText's own props take
// seconds — divided by 1000 below wherever they're actually passed to
// it) — named here, rather than left as inline literals only, so
// SPLIT_DELAY can be derived from the same numbers instead of an
// independently-guessed constant that silently drifts out of sync with
// how long "AUTOPILOT" actually takes to finish writing on.
const KINETIC_BASE_DELAY_MS = 100;
const KINETIC_STAGGER_MS = 45;
const KINETIC_WORD_GAP_MS = 100;
const KINETIC_LETTER_DURATION_MS = 750; // matches KineticText.jsx's own fixed 0.75s duration
const headBBaseDelayMs = KINETIC_BASE_DELAY_MS + headA.length * KINETIC_STAGGER_MS + KINETIC_WORD_GAP_MS;
const headARevealEndMs = KINETIC_BASE_DELAY_MS + (headA.length - 1) * KINETIC_STAGGER_MS + KINETIC_LETTER_DURATION_MS;
const headBRevealEndMs = headBBaseDelayMs + (headB.length - 1) * KINETIC_STAGGER_MS + KINETIC_LETTER_DURATION_MS;
// The split (and the small preview frame appearing in the gap) must not
// start until "AUTOPILOT" has actually finished writing on — otherwise
// the frame/photo shows up while letters are still rising into place,
// which reads as "the photo appeared before the text." Whichever word
// settles later, plus a brief settled pause, rather than a guessed
// constant (550ms — well before either word actually finished).
const SETTLE_PAUSE_MS = 150;
const SPLIT_DELAY = Math.max(headARevealEndMs, headBRevealEndMs) + SETTLE_PAUSE_MS;
const SPLIT_DURATION = 700;
const EXPAND_HOLD = 550;
const EXPAND_DURATION = 950;
// Gap between "the photo has finished growing" and "everything else
// shows up" (scrim, statement, navbar unmasking, loader gone) — these
// used to happen in the exact same React commit as the resize
// transition's last frame, which is exactly the wrong moment to also
// hand the browser a scrim mount, a whole new text block, and a z-index
// change: the layout/paint work for all of it competed with the tail of
// the resize and read as a stutter in the photo itself. Letting the
// photo's geometry settle on its own first, silently, removes that
// collision.
// This also has to be at least as long as .hero-loader's own
// `background` CSS transition (LOADER_BG_TRANSITION_MS below, and the
// matching value in globals.css) — not just "long enough to avoid the
// DOM-mount stutter" above. The frame's z-index only drops from its
// explicit 1500 to auto once `phase` hits "settled" (REVEAL_DELAY after
// settle() runs), and the loader still carries an explicit z-index
// (1400) throughout its own exit. The instant frame goes to auto, the
// loader — however far its background has actually faded by then — wins
// the stacking race (explicit always beats auto) and jumps back on top
// of the fullscreen photo. Keeping this >= LOADER_BG_TRANSITION_MS means
// the loader has nothing left to show by the time it could win that
// race, so the race stays harmless. These two values (and the loader's
// framer-motion exit duration just below) are a coupled set — change one
// of the three, change all three, or the z-index flash comes back (see
// ANIMATION-FLICKER-FRAMEWORK.md, Category 3's timing-relationship
// note).
const LOADER_BG_TRANSITION_MS = 600; // must match .hero-loader's `transition: background` in globals.css
const REVEAL_DELAY = LOADER_BG_TRANSITION_MS + 50;
// The statement text used to rely on mix-blend-mode for adaptive
// contrast, which meant it could never be animated directly (opacity,
// transform, anything) without breaking the blend — every attempt at a
// smoother reveal (a veil, a delayed color swap) surfaced a new flash of
// its own. Simplified away entirely: plain solid color, no blend, no
// veil — which means it's finally safe to just fade it in normally.
// Held back this long after `phase` hits "settled" so it doesn't land in
// the same beat as the scrim/navbar reveal, then fades in on its own
// (see the .hero-statement transition below).
const STATEMENT_DELAY = 150;
// Total time from mount to the moment the frame's z-index drops and the
// navbar becomes physically uncoverable — exported so Navbar.jsx can
// time its own slide-down-and-fade entrance to land at exactly that
// instant, instead of just materializing in place the moment it's
// uncovered.
export const HERO_REVEAL_MS =
  SPLIT_DELAY + SPLIT_DURATION + SLIDES.length * SLIDE_HOLD + EXPAND_HOLD + EXPAND_DURATION + REVEAL_DELAY;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Hero() {
  // merged -> split -> slides -> expand -> settled; reduced-motion visitors
  // land straight on "settled" so no state update has to happen in an
  // effect just to skip the animation.
  const [phase, setPhase] = useState(() => (prefersReducedMotion() ? "settled" : "merged"));
  const [slide, setSlide] = useState(() => (prefersReducedMotion() ? SLIDES.length - 1 : 0));
  const [showStatement, setShowStatement] = useState(prefersReducedMotion);
  // null until sampled (renders as the .hero-statement-line default,
  // i.e. cream-on-dark) — see the sampling effect below.
  const [statementOnLight, setStatementOnLight] = useState(false);
  const frameRef = useRef(null);
  const loaderRef = useRef(null);
  const statementRef = useRef(null);

  // The small preview's aspect ratio has to equal the viewport's aspect
  // ratio exactly, or growing it into the fullscreen box (100vw x 100dvh
  // — the viewport's own ratio) re-crops the photo mid-animation, which
  // reads as a pop. A plain CSS clamp() can't guarantee that (min/max
  // bounds on width and height kick in independently, breaking the
  // match) — so the ratio is measured here and handed to CSS as a custom
  // property that `.hero-visual-frame`'s `aspect-ratio` reads, which
  // keeps height an exact function of width (however width ends up being
  // computed) for as long as no explicit height is set later.
  //
  // Set on .hero-section rather than on the frame element itself, since
  // --vp-ratio describes the whole hero, not just the frame: the base
  // .hero-visual-frame rule and Hero.jsx's own reads of --vp-ratio below
  // are both descendants of .hero-section either way, but scoping it to
  // .hero-section (rather than a single, more specific descendant) is
  // what makes it safe for any future rule elsewhere in the hero to read
  // too, without silently falling back to the 1.5 default the way an
  // earlier version of this effect (and of --hero-frame-ratio, which
  // used to derive from --vp-ratio) did for .hero-loader-gap.
  useEffect(() => {
    const section = frameRef.current?.closest(".hero-section");
    if (!section) return;
    const applyRatio = () => {
      section.style.setProperty("--vp-ratio", String(window.innerWidth / window.innerHeight));
    };
    applyRatio();
    window.addEventListener("resize", applyRatio);
    return () => window.removeEventListener("resize", applyRatio);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    document.body.style.overflow = "hidden";
    const timers = [
      setTimeout(() => setPhase("split"), SPLIT_DELAY),
      setTimeout(() => setPhase("slides"), SPLIT_DELAY + SPLIT_DURATION),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "slides") return;
    if (slide < SLIDES.length - 1) {
      const t = setTimeout(() => setSlide((i) => i + 1), SLIDE_HOLD);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("expand"), SLIDE_HOLD + EXPAND_HOLD);
    return () => clearTimeout(t);
  }, [phase, slide]);

  useEffect(() => {
    if (phase !== "expand") return;
    const el = frameRef.current;
    if (!el) return;

    // .hero-visual-frame.is-open (globals.css) deliberately gives the
    // preview a fixed width:height ratio (--hero-frame-ratio, the source
    // photos' own ratio) instead of the real --vp-ratio — see that rule
    // for why. That means the preview's rendered shape can differ from
    // the real --vp-ratio, so its width has to be explicitly snapped to match
    // height * the *true* ratio before the FLIP below measures its
    // starting rect. Setting `aspect-ratio` alone can't do this: both
    // width and height are already explicit lengths from that CSS rule,
    // and aspect-ratio only fills in a dimension left as `auto`.
    // Growing into 100vw x 100dvh only avoids re-cropping the photo
    // *throughout* that transition if the box's ratio is constant the
    // whole time (see the long comment on the base .hero-visual-frame
    // rule) — this is what keeps that true regardless of how the
    // preview itself was shaped a moment ago.
    const trueVpRatio =
      parseFloat(getComputedStyle(el).getPropertyValue("--vp-ratio")) || window.innerWidth / window.innerHeight;
    el.style.width = `${el.getBoundingClientRect().height * trueVpRatio}px`;
    void el.offsetWidth;

    const rect = el.getBoundingClientRect();
    el.style.transition = "none";
    el.style.transform = "none";
    el.style.top = `${rect.top}px`;
    el.style.left = `${rect.left}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    void el.offsetWidth;

    let settled = false;
    let revealTimer = null;
    // Drop from viewport-fixed to absolute-within-hero-section: at this
    // point the page is still scrolled to the top, so the rect is
    // identical either way — but a fixed layer would otherwise stay
    // pinned behind every section for the rest of the page's scroll.
    // This is a pure DOM mutation, no React state change — the photo's
    // geometry finishes and gets a beat to paint completely on its own
    // before setPhase("settled") (below, after REVEAL_DELAY) mounts the
    // scrim/statement/loader-exit all at once.
    const settle = () => {
      if (settled) return;
      settled = true;
      el.style.transition = "none";
      el.style.position = "absolute";
      el.style.top = "0px";
      el.style.left = "0px";
      el.style.width = "100%";
      el.style.height = "100%";
      // The loader's cream background is what was hiding the navbar
      // while the frame was still small and growing — the instant the
      // frame's geometry above finishes, the frame itself already covers
      // the full viewport, so the loader's cream is now pure dead weight
      // sitting on top of it. It has to go right here, synchronously
      // with the frame's own geometry, not 180ms later with the rest of
      // the reveal: `introVisible` (which the loader's own opacity-fade
      // exit is keyed to) doesn't flip until then, and in between, the
      // loader still carries an explicit z-index (1400) while the
      // frame's own z-index — 1500 only while `introVisible` — is still
      // intact at this exact instant too, so this alone wouldn't yet be
      // a bug; but the frame's z-index is what's about to be removed by
      // the delayed setPhase("settled"), and a positioned element with
      // *no* explicit z-index (auto) always loses to one that still has
      // an explicit value, however "low" — which is exactly what made
      // the cream flash on top for a frame right as the reveal landed.
      if (loaderRef.current) loaderRef.current.style.background = "transparent";
      revealTimer = setTimeout(() => {
        setPhase("settled");
        document.body.style.overflow = "";
      }, REVEAL_DELAY);
    };

    function handleTransitionEnd(e) {
      if (e.target === el && e.propertyName === "width") settle();
    }
    el.addEventListener("transitionend", handleTransitionEnd);

    const raf = requestAnimationFrame(() => {
      el.style.transition = `top ${EXPAND_DURATION}ms ${css(EASE)}, left ${EXPAND_DURATION}ms ${css(EASE)}, width ${EXPAND_DURATION}ms ${css(EASE)}, height ${EXPAND_DURATION}ms ${css(EASE)}`;
      el.style.top = "0px";
      el.style.left = "0px";
      el.style.width = "100vw";
      el.style.height = "100dvh";
    });

    // Safety net in case transitionend never fires (e.g. reduced-motion
    // browser setting that drops the transition duration to ~0).
    const fallback = setTimeout(settle, EXPAND_DURATION + 300);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("transitionend", handleTransitionEnd);
      clearTimeout(fallback);
      clearTimeout(revealTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "settled" || showStatement) return;
    const t = setTimeout(() => setShowStatement(true), STATEMENT_DELAY);
    return () => clearTimeout(t);
  }, [phase, showStatement]);

  // Adaptive contrast for .hero-statement — done as a single, one-time
  // sample of the photo's actual pixels (not a continuous mix-blend-mode
  // read, which is a closed chapter for this element — see
  // .hero-statement-line in globals.css). Safe to run only once because
  // the statement's position relative to the photo never changes after
  // this: both are part of the same section and scroll together, so
  // there's no ongoing relationship to keep re-evaluating, only a
  // resize (handled below) can invalidate it.
  useEffect(() => {
    if (phase !== "settled") return;
    const frameEl = frameRef.current;
    const statementEl = statementRef.current;
    if (!frameEl || !statementEl) return;

    const sample = () => {
      const img = frameEl.querySelector('img[src="/stas.JPG"]');
      if (!img || !img.complete || !img.naturalWidth) return;

      // Reproduces the CSS `object-fit: cover` + `object-position:
      // center 18%` mapping (see the SLIDES render below) to find which
      // rectangle of the *source* photo is actually rendered behind
      // the statement's own on-screen rectangle, rather than guessing.
      const frameRect = frameEl.getBoundingClientRect();
      const stRect = statementEl.getBoundingClientRect();
      if (!frameRect.width || !frameRect.height || !stRect.width || !stRect.height) return;

      const scale = Math.max(frameRect.width / img.naturalWidth, frameRect.height / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const offsetX = (drawW - frameRect.width) * 0.5; // object-position X: center
      const offsetY = (drawH - frameRect.height) * 0.18; // object-position Y: 18%

      const srcX = (stRect.left - frameRect.left + offsetX) / scale;
      const srcY = (stRect.top - frameRect.top + offsetY) / scale;
      const srcW = stRect.width / scale;
      const srcH = stRect.height / scale;

      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      try {
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 16, 16);
        const { data } = ctx.getImageData(0, 0, 16, 16);
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
          sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        }
        setStatementOnLight(sum / (data.length / 4) > 150);
      } catch {
        // Same-origin static asset — this shouldn't throw, but a failed
        // read just keeps the safe cream-on-dark default rather than
        // ever leaving the text unreadable.
      }
    };

    sample();
    window.addEventListener("resize", sample);
    return () => window.removeEventListener("resize", sample);
  }, [phase]);

  const introVisible = phase !== "settled";
  const isFullscreen = phase === "expand" || phase === "settled";

  return (
    <section id="hero" className="hero-section section-cream">
      {/* The frame is a sibling of the word overlay, never nested inside
          it — while it's position:fixed (merged/split/slides/expand) it
          must sit in its own stacking/containing context so that, once
          settled, switching it to position:absolute scopes it to
          .hero-section (the nearest positioned ancestor) instead of to a
          fixed parent, which would otherwise pin the photo behind every
          section for the rest of the page. */}
      <div
        ref={frameRef}
        className={`hero-visual-frame${phase !== "merged" ? " is-open" : ""}${isFullscreen ? " is-fullscreen" : ""}`}
        style={{ zIndex: introVisible ? 1500 : undefined }}
      >
        {SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="hero-visual-img"
            style={{
              opacity: i === slide ? 1 : 0,
              objectPosition: src === "/stas.JPG" ? "center 18%" : "center",
            }}
          />
        ))}
      </div>

      {phase === "settled" && (
        <m.div
          className="hero-visual-scrim"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      )}

      {/* AnimatePresence + exit here (rather than a plain conditional)
          specifically so the loader stays mounted long enough for its own
          `background` transition (see .hero-loader in globals.css — that
          CSS transition is what's actually revealing the navbar, triggered
          by settle()'s synchronous style write) to finish, rather than
          being yanked out of the DOM mid-fade the instant `introVisible`
          flips false. This exit `duration` must stay >= LOADER_BG_TRANSITION_MS
          above, or React unmounts the element before the background
          finishes going transparent, which cuts the reveal off abruptly —
          kept equal to it here. The opacity fade itself is close to
          invisible in practice (by the time it'd be noticeable, the
          background is already transparent and the loader's own text is
          already faded via `.is-faded`) — its job is timing, not
          appearance. */}
      <AnimatePresence>
        {introVisible && (
          <m.div
            ref={loaderRef}
            className="hero-loader"
            exit={{ opacity: 0 }}
            transition={{ duration: LOADER_BG_TRANSITION_MS / 1000, ease: EASE }}
          >
            <div className="hero-loader-row">
              <span className={`hero-loader-word${isFullscreen ? " is-faded" : ""}`}>
                <KineticText text={headA} baseDelay={KINETIC_BASE_DELAY_MS / 1000} stagger={KINETIC_STAGGER_MS / 1000} />
              </span>
              <span className={`hero-loader-gap${phase !== "merged" ? " is-open" : ""}`} aria-hidden="true" />
              <span className={`hero-loader-word${isFullscreen ? " is-faded" : ""}`}>
                <KineticText text={headB} baseDelay={headBBaseDelayMs / 1000} stagger={KINETIC_STAGGER_MS / 1000} />
              </span>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* nbnzia's hero shows nav-sized branding only — the wordmark itself
          never reappears large once the loader is gone. The big text over
          the photo is the sales statement (their "EVERY GREAT TRICK…"
          equivalent), not a repeat of the logo. */}
      {!introVisible && (
        <div className="container hero-container">
          <div className="hero-grid">
            <div className="hero-copy">
              {/* Plain solid color now (no mix-blend-mode, no veil) — so a
                  normal opacity fade is safe here, unlike every earlier
                  attempt at reveal motion on the blend-mode version of
                  this element. Mounted only once STATEMENT_DELAY has
                  passed, so it doesn't land in the same beat as the
                  scrim/navbar reveal above. */}
              <m.div
                ref={statementRef}
                className={`hero-statement${statementOnLight ? " is-on-light" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: showStatement ? 1 : 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                {hero.tagline.map((line) => (
                  <p key={line} className="hero-statement-line">
                    {line}
                  </p>
                ))}
              </m.div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function css([x1, y1, x2, y2]) {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}
