"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import AsciiSculpture from "./AsciiSculpture";

// A pinned block that scales up as you scroll through it — the reference
// site runs actual footage through this slot; wired against the ASCII
// sculpture placeholder for now (see DESIGN_DECISIONS.md), swap-ready for a
// real video/photo later without touching the scroll mechanics.
export default function ScalingMedia() {
  const wrapRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.75, 1, 1.08]);
  const radius = useTransform(scrollYProgress, [0, 0.5, 1], [24, 24, 0]);

  return (
    <div ref={wrapRef} className="scaling-media-wrap section-cream">
      <div className="scaling-media-pin">
        <m.div className="scaling-media-frame" style={{ scale, borderRadius: radius }}>
          <AsciiSculpture className="hero-sculpture" cell={9} />
        </m.div>
      </div>
    </div>
  );
}
