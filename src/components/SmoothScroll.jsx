"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Inertial scroll only — everything else (useScroll, sticky positioning)
// still reads the native scrollY that Lenis drives, so no other component
// needs to know this exists. The one exception is same-page hash links
// (nav links, CTAs like #kontakt/#oferta): the browser's own hash
// navigation is an instant jump with no relation to Lenis at all, which
// reads as a hard cut right after everything else on the page scrolls
// smoothly — so those clicks are intercepted here, centrally, and handed
// to Lenis's own scrollTo instead. Anywhere in the DOM, not wired per
// link, so no other component needs to opt in.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    let frame;
    function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    // GSAP ScrollTrigger (PinnedTagline.jsx, Intro.jsx — both pin+scrub a
    // section to the scroll position) has no idea Lenis exists by
    // default: it listens for native scroll independently, while Lenis
    // smooths that same scroll position in its own rAF loop above. Two
    // scroll sources that don't talk to each other is a well-known
    // cause of pinned/scrubbed sections drifting out of sync with the
    // actual scroll position (e.g. the pinned text reveal getting stuck
    // showing an early, barely-visible frame). Wired up separately from
    // the raf loop above (not replacing it) so a slow/failed gsap import
    // can never break basic smooth scrolling — this only adds the sync,
    // it isn't load-bearing for scrolling itself.
    // Strict Mode's dev-only double-mount runs this effect's cleanup
    // (destroying `lenis`) before the async import below has resolved,
    // so without this guard the first mount's import would go on to
    // attach `onLenisScroll` to an already-destroyed Lenis instance once
    // it finally resolves — see the matching comment in
    // PinnedTagline.jsx for the fuller version of this gotcha.
    let cancelled = false;
    let cleanupGsapSync;
    (async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        gsap.ticker.lagSmoothing(0);
        const onLenisScroll = () => ScrollTrigger.update();
        lenis.on("scroll", onLenisScroll);
        cleanupGsapSync = () => lenis.off("scroll", onLenisScroll);
      } catch {
        // ScrollTrigger-driven sections just keep whatever sync they had
        // before this fix; base scrolling above is unaffected either way.
      }
    })();

    // -96 leaves the target's top 96px below the viewport top, roughly
    // the fixed navbar's own height (46px logo + 22px padding top/bottom
    // — see .navbar-inner), so the section's heading doesn't land
    // directly under it.
    const onClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href").slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -96 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick);
      cleanupGsapSync?.();
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
