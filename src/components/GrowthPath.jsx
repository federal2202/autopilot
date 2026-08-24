"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useScroll, useMotionValue, useMotionValueEvent, motionValue } from "framer-motion";
import { growthPath } from "@/data/content";

// Desktop reads fine as a dramatic zigzag; on a narrow, short viewport the
// same zigzag compresses into a cramped-looking squiggle, so mobile gets
// its own gentler, monotonically-climbing layout in a taller viewBox.
const DESKTOP_LAYOUT = {
  width: 1040,
  height: 320,
  grid: [80, 160, 240],
  points: [
    { x: 90, y: 190 },
    { x: 380, y: 90 },
    { x: 660, y: 230 },
    { x: 950, y: 110 },
  ],
};

const MOBILE_LAYOUT = {
  width: 1040,
  height: 460,
  grid: [110, 230, 350],
  points: [
    { x: 80, y: 360 },
    { x: 380, y: 260 },
    { x: 700, y: 220 },
    { x: 960, y: 120 },
  ],
};

function segmentAt(points, v) {
  const segments = points.length - 1;
  const scaled = Math.min(segments - 1e-6, Math.max(0, v * segments));
  const i = Math.floor(scaled);
  return { i, localT: scaled - i };
}

function useIsNarrow() {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsNarrow(mq.matches);
    const onChange = (e) => setIsNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isNarrow;
}

export default function GrowthPath() {
  const wrapRef = useRef(null);
  const n = growthPath.stops.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const isNarrow = useIsNarrow();
  const layout = isNarrow ? MOBILE_LAYOUT : DESKTOP_LAYOUT;
  const POINTS = layout.points;

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const markerX = useMotionValue(POINTS[0].x);
  const markerY = useMotionValue(POINTS[0].y);
  const markerAngle = useMotionValue(0);
  const segProgress = useRef(POINTS.slice(0, -1).map(() => motionValue(0))).current;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActiveIndex(idx);

    const { i, localT } = segmentAt(POINTS, v);
    const a = POINTS[i];
    const b = POINTS[i + 1];
    markerX.set(a.x + (b.x - a.x) * localT);
    markerY.set(a.y + (b.y - a.y) * localT);
    markerAngle.set((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI);

    segProgress.forEach((mv, si) => mv.set(si < i ? 1 : si === i ? localT : 0));
  });

  const stop = growthPath.stops[activeIndex];

  return (
    <section id="jak-to-dziala" ref={wrapRef} className="growth-pin-wrap" style={{ height: `${n * 100}vh` }}>
      <div className="growth-pin section-black">
        <div className="growth-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          {growthPath.eyebrow}
        </div>

        <div className="growth-content">
          <div className="growth-step-wrap">
            <AnimatePresence mode="wait">
              <m.div
                key={stop.km}
                className="growth-step"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h3 className="growth-step-title">{stop.title}</h3>
                <p className="growth-step-text">{stop.text}</p>
              </m.div>
            </AnimatePresence>
          </div>

          <div className="growth-route-wrap">
            <AnimatePresence mode="wait">
              <m.span
                key={stop.word}
                className="growth-bg-word"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {stop.word}
              </m.span>
            </AnimatePresence>

            <div className="growth-route">
              <svg
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                preserveAspectRatio="xMidYMid meet"
                className="growth-route-svg"
              >
                <defs>
                  <linearGradient id="growth-emerald" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" style={{ stopColor: "var(--emerald-light)" }} />
                    <stop offset="100%" style={{ stopColor: "var(--emerald-dark)" }} />
                  </linearGradient>
                </defs>

                {layout.grid.map((gy) => (
                  <line key={gy} x1={0} y1={gy} x2={layout.width} y2={gy} className="growth-route-grid" />
                ))}

                {POINTS.slice(0, -1).map((p, i) => (
                  <line key={`base-${i}`} x1={p.x} y1={p.y} x2={POINTS[i + 1].x} y2={POINTS[i + 1].y} className="growth-route-base" />
                ))}
                {POINTS.slice(0, -1).map((p, i) => (
                  <m.line
                    key={`progress-${i}`}
                    x1={p.x}
                    y1={p.y}
                    x2={POINTS[i + 1].x}
                    y2={POINTS[i + 1].y}
                    className="growth-route-progress"
                    style={{ pathLength: segProgress[i] }}
                  />
                ))}

                {POINTS.map((p, i) => (
                  <g key={i} transform={`translate(${p.x}, ${p.y})`}>
                    {i === activeIndex && <circle r={20} className="growth-checkpoint-ring" />}
                    <circle r={i === activeIndex ? 13 : 8} className={`growth-checkpoint${i <= activeIndex ? " is-passed" : ""}`} />
                    <text y={-28} textAnchor="middle" className="growth-checkpoint-label">
                      Km {growthPath.stops[i].km}
                    </text>
                  </g>
                ))}

                <m.g style={{ x: markerX, y: markerY, rotate: markerAngle }} className="growth-marker">
                  <path d="M -10 -7 L 12 0 L -10 7 Z" />
                </m.g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
