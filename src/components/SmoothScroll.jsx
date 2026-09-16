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
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
