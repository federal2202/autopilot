"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Inertial scroll only — everything else (useScroll, sticky positioning)
// still reads the native scrollY that Lenis drives, so no other component
// needs to know this exists.
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

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
