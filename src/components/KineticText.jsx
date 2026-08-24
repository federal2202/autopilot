"use client";

import { m } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];
const NBSP = String.fromCharCode(160);

// Splits text into per-letter spans that blur/rise into place with a
// stagger — the "type reacts on load" kinetic treatment for big headlines.
export default function KineticText({ text, baseDelay = 0, stagger = 0.035 }) {
  const letters = Array.from(text);
  return letters.map((char, i) => (
    <m.span
      key={i}
      className="kinetic-letter"
      initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
      animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.75, delay: baseDelay + i * stagger, ease: EASE }}
    >
      {char === " " ? NBSP : char}
    </m.span>
  ));
}
