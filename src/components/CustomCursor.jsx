"use client";

import { useEffect, useRef } from "react";

// Fine-pointer only — the effect below bails out immediately on
// touch/coarse pointers, so the "has-custom-cursor" class (which hides
// the real cursor) never gets added there. The two spans are still
// mounted regardless (same on every device, for hydration simplicity)
// — see the `@media (pointer: coarse), (hover: none)` rule in
// globals.css, which is the actual guarantee they never paint on
// phones/tablets, independent of this effect's own timing.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");

    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let targetX = ringX;
    let targetY = ringY;
    let isActive = false;
    // Nudges the ring away from dead-center-on-cursor while hovering
    // something clickable, so it sits toward that element's bottom-right
    // instead of directly on top of whatever text/icon is under the
    // pointer — see the matching .cursor-ring.is-active comment in
    // globals.css for why that overlap was a problem in the first place.
    const ACTIVE_OFFSET = 14;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
      }
      const el = e.target.closest("a, button, .magnetic");
      isActive = Boolean(el);
      ringRef.current?.classList.toggle("is-active", isActive);
    };

    let frame;
    const tick = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      const offset = isActive ? ACTIVE_OFFSET : 0;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX + offset}px, ${ringY + offset}px) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <span ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <span ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
