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
const SPLIT_DELAY = 550;
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
// `background` CSS transition (globals.css, currently 1.4s) — not just
// "long enough to avoid the DOM-mount stutter" above. The frame's
// z-index only drops from its explicit 1500 to auto once `phase` hits
// "settled" (REVEAL_DELAY after settle() runs), and the loader still
// carries an explicit z-index (1400) throughout its own exit. The
// instant frame goes to auto, the loader — however far its background
// has actually faded by then — wins the stacking race (explicit always
// beats auto) and jumps back on top of the fullscreen photo. At the old
// 180ms this was barely visible because the background transition was
// only 0.4s back then (already ~45% faded by 180ms); lengthening that
// transition to 1.4s without lengthening this delay to match reopened
// the exact same z-index race from a near-fully-opaque state, which
// read as a hard flash right before the (correctly slow) scrim/
// statement fades took over. Keeping this >= that transition's duration
// means the loader has nothing left to show by the time it could win
// the race, so the race becomes harmless again — same fix pattern as
// the original z-index bug, just re-applied to the new duration.
const REVEAL_DELAY = 1450;
// The statement text used to rely on mix-blend-mode for adaptive
// contrast, which meant it could never be animated directly (opacity,
// transform, anything) without breaking the blend — every attempt at a
// smoother reveal (a veil, a delayed color swap) surfaced a new flash of
// its own. Simplified away entirely: plain solid color, no blend, no
// veil — which means it's finally safe to just fade it in normally.
// Held back this long after `phase` hits "settled" so it doesn't land in
// the same beat as the scrim/navbar reveal, then fades in slowly on its
// own (see the .hero-statement transition below).
const STATEMENT_DELAY = 400;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Hero() {
  // merged -> split -> slides -> expand -> settled; reduced-motion visitors
  // land straight on "settled" so no state update has to happen in an
  // effect just to skip the animation.
  const [phase, setPhase] = useState(() => (prefersReducedMotion() ? "settled" : "merged"));
  const [slide, setSlide] = useState(() => (prefersReducedMotion() ? SLIDES.length - 1 : 0));
  const [showStatement, setShowStatement] = useState(prefersReducedMotion);
  const frameRef = useRef(null);
  const loaderRef = useRef(null);

  // The small preview's aspect ratio has to equal the viewport's aspect
  // ratio exactly, or growing it into the fullscreen box (100vw x 100dvh
  // — the viewport's own ratio) re-crops the photo mid-animation, which
  // reads as a pop. A plain CSS clamp() can't guarantee that (min/max
  // bounds on width and height kick in independently, breaking the
  // match) — so the ratio is measured here and handed to CSS as a custom
  // property that `.hero-visual-frame`'s `aspect-ratio` reads, which
  // keeps height an exact function of width (however width ends up being
  // computed) for as long as no explicit height is set later.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const applyRatio = () => {
      el.style.setProperty("--vp-ratio", String(window.innerWidth / window.innerHeight));
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
          transition={{ duration: 1.4, ease: EASE }}
        />
      )}

      {/* AnimatePresence + exit here (rather than a plain conditional)
          specifically so the loader stays mounted long enough for its own
          `background` transition (see .hero-loader in globals.css — that
          CSS transition is what's actually revealing the navbar, triggered
          by settle()'s synchronous style write) to finish, rather than
          being yanked out of the DOM mid-fade the instant `introVisible`
          flips false. This exit `duration` must stay >= that CSS
          transition's duration, or React unmounts the element before the
          background finishes going transparent, which cuts the reveal off
          abruptly — they're kept equal here so neither can undershoot the
          other. The opacity fade itself is close to invisible in practice
          (by the time it'd be noticeable, the background is already
          transparent and the loader's own text is already faded via
          `.is-faded`) — its job is timing, not appearance. */}
      <AnimatePresence>
        {introVisible && (
          <m.div
            ref={loaderRef}
            className="hero-loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <div className="hero-loader-row">
              <span className={`hero-loader-word${isFullscreen ? " is-faded" : ""}`}>
                <KineticText text={headA} baseDelay={0.1} stagger={0.045} />
              </span>
              <span className={`hero-loader-gap${phase !== "merged" ? " is-open" : ""}`} aria-hidden="true" />
              <span className={`hero-loader-word${isFullscreen ? " is-faded" : ""}`}>
                <KineticText text={headB} baseDelay={0.1 + headA.length * 0.045 + 0.1} stagger={0.045} />
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
                className="hero-statement"
                initial={{ opacity: 0 }}
                animate={{ opacity: showStatement ? 1 : 0 }}
                transition={{ duration: 1.6, ease: EASE }}
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
