"use client";

import { useEffect, useRef } from "react";

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Fixed navbar's own rendered height (46px logo + 22px padding top/bottom
// — see .navbar-inner in globals.css) plus a little breathing room; same
// value SmoothScroll.jsx's anchor-scroll offset uses for the same reason.
// The navbar sits at z-index 999 with no background of its own, so
// without this the parked video's top edge would land right at (or
// above) the viewport top and read as sitting underneath/behind it.
const NAVBAR_CLEARANCE = 96;

// The video's "real" home — full container width, 16:9. It renders here at
// natural size from the very first paint (no JS required to look correct),
// and Intro.jsx's small box further up the page is just an empty slot
// (`[data-showreel-slot="small"]`). A scroll-driven effect below makes the
// video visually grow from that small slot up to full size quickly (a
// fixed, short scroll distance, not however far away this box actually
// is), then holds it centered in the viewport until this box's own real
// position scrolls up to meet it, at which point it hands off to tracking
// the box directly — so it's already fully grown and viewable well before
// you actually reach this section, instead of still mid-transition or
// off-screen through the gap in between (Marquee sits there).
//
// This used to be done with GSAP Flip + a scrubbed ScrollTrigger (start/end
// pixel positions measured once, cached, then reused every scroll frame),
// then with a version of this same rAF approach that only re-measured on
// 'scroll'/'resize'/`document.fonts.ready`. Both kept going stale in
// practice: *anything* elsewhere on the page that shifts layout
// asynchronously after the measurement was taken — a web font's swap-in,
// another component's own GSAP/ScrollTrigger setup running its async
// import and adjusting spacing, anything — leaves the video positioned
// against outdated geometry until some scroll/resize event happens to
// come along and correct it, which is exactly what showed up as "lands
// right on some loads, wrong on others, then jumps once something finally
// forces a recalculation." Trying to enumerate every event that might
// justify a re-measure is a losing game — there's always another one.
// Solved properly by not trying: this now re-measures both the small slot
// and the big box fresh via getBoundingClientRect(), and repositions the
// video accordingly, on *every animation frame* the whole time this
// section is mounted, independent of scroll/resize/anything else firing.
// There is no cached state to go stale, because nothing is ever cached —
// whatever the layout actually is *right now* is what gets read, every
// ~16ms, so any shift from any cause is reflected on the very next frame
// no matter what caused it or when.
export default function Showreel() {
  const boxRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Below Intro.jsx's own .intro-grid breakpoint (globals.css), the fixed-
    // position grow-then-park illusion reads as the video overlapping the
    // about text while it's still being read — skip it entirely so the
    // video just renders at its plain, already-correctly-ordered static
    // size/position (.showreel-box/.showreel-video), no inline styles ever
    // applied.
    if (window.matchMedia("(max-width: 860px)").matches) return;

    const video = videoRef.current;
    const bigBox = boxRef.current;
    const smallSlot = document.querySelector('[data-showreel-slot="small"]');
    if (!video || !bigBox || !smallSlot) return;

    let rafId = null;
    // Frame-to-frame exponential smoothing state (same technique as
    // CustomCursor.jsx's ring), applied on top of the eased target below —
    // keeps the growth reading as fluid rather than snapping 1:1 to the
    // scroll-derived target every frame.
    let curX = null, curY = null, curW = null, curH = null;

    function render() {
      const smallRect = smallSlot.getBoundingClientRect();
      const bigRect = bigBox.getBoundingClientRect();

      // `remaining`: viewport-relative px until the small slot's bottom
      // edge would reach the viewport's top (positive = hasn't happened
      // yet, negative = already scrolled past). Recomputing both rects
      // fresh every frame (nothing cached from an earlier tick) is what
      // makes this immune to layout shifting after the fact — there's
      // nothing earlier to have gone stale.
      //
      // Growth is timed to *finish* right as `remaining` hits 0 — i.e. the
      // exact instant Intro's small slot scrolls out of view and Marquee's
      // top edge reaches the viewport top — instead of only *starting*
      // then. Starting the growth only once the slot had already scrolled
      // past (the original version) meant the video was still visibly
      // mid-transition through the entire Marquee section, which is
      // exactly the "shows up too late" complaint: by the time you reach
      // the next section it should already be sitting fully grown, not
      // still growing.
      const growthDistance = window.innerHeight * 0.6;
      const remaining = smallRect.bottom;
      const sizeProgress = clamp((growthDistance - remaining) / growthDistance, 0, 1);
      // Cubic ease-out on the growth curve itself — only feeds the x/w/h/
      // growthY lerps below; the `sizeProgress < 1 ? ... : pinnedY` branch
      // condition further down still keys off the raw, linear value.
      const eased = 1 - Math.pow(1 - sizeProgress, 3);

      const x = lerp(smallRect.left, bigRect.left, eased);
      const w = lerp(smallRect.width, bigRect.width, eased);
      const h = lerp(smallRect.height, bigRect.height, eased);

      // Once fully grown, don't just keep tracking the big box's live
      // position — it's likely still well below the viewport at this
      // point (Marquee is still in between), which would either yank
      // the now-full-size video far down off-screen or require waiting
      // out the rest of the scroll with nothing to look at. Instead it
      // parks centered in the viewport and stays there until the big
      // box's own natural position rises up to meet it, then hands off
      // to tracking the box directly, seamlessly. Centered in the space
      // *below* the navbar, not the full viewport, so a tall/wide video
      // never parks with its top edge under the fixed navbar.
      const pinnedY = NAVBAR_CLEARANCE + (window.innerHeight - NAVBAR_CLEARANCE - h) / 2;

      // The growth's *starting* Y is the slot's live `top` — valid for the
      // entire growth phase now, since growth only runs while
      // `remaining >= 0` (it finishes exactly as `remaining` hits 0), so
      // the slot is always still really there, at its real current
      // position, the whole time it's being interpolated from.
      const smallStartY = smallRect.top;

      // The pin isn't a separate phase bolted on after growth — it's
      // folded into the same continuous expression. Computing it as a
      // hard "if sizeProgress < 1, animate; else, pin-or-release" would
      // have its own edge case: on a short intro-to-showreel gap, the
      // box's *natural* position can rise up past `pinnedY` before
      // `sizeProgress` has even finished reaching 1, and a branch keyed
      // purely on `sizeProgress` wouldn't release early enough — right
      // as it crossed 1, `y` would jump from wherever the growth curve
      // still was down to the (already-passed) natural position. Taking
      // the `Math.min` of "wherever growth currently says" and "wherever
      // the box naturally is" at *every* frame, not just after growth
      // completes, means release can happen mid-growth if the box gets
      // there first, and there's never a frame where the two disagree.
      const growthY = sizeProgress < 1 ? lerp(smallStartY, pinnedY, eased) : pinnedY;
      const y = Math.min(growthY, bigRect.top);

      if (curX === null) {
        curX = x;
        curY = y;
        curW = w;
        curH = h;
      } else {
        curX += (x - curX) * 0.18;
        curY += (y - curY) * 0.18;
        curW += (w - curW) * 0.18;
        curH += (h - curH) * 0.18;
      }

      video.style.position = "fixed";
      video.style.margin = "0";
      video.style.left = `${curX}px`;
      video.style.top = `${curY}px`;
      video.style.width = `${curW}px`;
      video.style.height = `${curH}px`;

      rafId = requestAnimationFrame(render);
    }

    // Called directly (not just scheduled) so the first paint is already
    // correctly positioned without waiting on a rAF tick — matters both
    // for avoiding a flash of the unpositioned/natural video and because
    // a backgrounded tab can throttle rAF to the point where the *first*
    // tick never comes at all, which would otherwise leave the video
    // with no position ever applied.
    render();

    // The loop above re-measures two elements via getBoundingClientRect()
    // on every single animation frame for as long as this component stays
    // mounted — by design (see the long comment above), but that's also a
    // real, permanent background cost that keeps running at 60fps whether
    // or not this section is anywhere near the viewport (e.g. the visitor
    // is reading the FAQ or Contact section far below). An
    // IntersectionObserver on the big box, with a generous rootMargin so
    // it's already active well before the grow/park/track sequence would
    // actually need to move anything and stays active a while after,
    // pauses that loop outside that range without changing any of the
    // visible behavior inside it.
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries[0]?.isIntersecting;
        if (active) {
          if (rafId === null) render();
        } else if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { rootMargin: "150% 0px 150% 0px" }
    );
    observer.observe(bigBox);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      curX = curY = curW = curH = null;
      video.style.position = "";
      video.style.margin = "";
      video.style.left = "";
      video.style.top = "";
      video.style.width = "";
      video.style.height = "";
    };
  }, []);

  return (
    <section className="section section-cream showreel-section">
      <div className="container">
        <div className="showreel-box" ref={boxRef}>
          <video
            ref={videoRef}
            className="showreel-video"
            src="/video.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
