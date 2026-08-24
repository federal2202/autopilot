"use client";

import { useRef } from "react";

// Wrap a button/link to make it drift toward the cursor within its own
// bounds — a hover feel plain CSS :hover can't produce. No-ops on touch.
export default function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <span
      ref={ref}
      className="magnetic"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: "transform 0.25s ease" }}
    >
      {children}
    </span>
  );
}
