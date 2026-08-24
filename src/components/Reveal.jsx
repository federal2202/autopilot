"use client";

import { m } from "framer-motion";

// Scale-only — no opacity involved, so it can't interact with the glass
// surfaces' backdrop-filter alpha (that's what caused the color pop).
export default function Reveal({ children, className, delay = 0, as = "div", style }) {
  const Component = m[as] || m.div;
  return (
    <Component
      initial={{ scale: 0.9 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.35, delay, ease: "easeInOut" }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
}
