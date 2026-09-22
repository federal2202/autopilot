"use client";

import { useEffect, useRef, useState } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { philosophy } from "@/data/content";
import { ClockIcon, ChartIcon, LayersIcon } from "./icons";

const ICONS = { clock: ClockIcon, chart: ChartIcon, layers: LayersIcon };
// Desktop keeps the original 3-beam "Google Gemini Effect" reroll — it
// needs real width for three diverging/converging lines to read as
// distinct rather than a tangle. Mobile gets a simpler single vertical
// line instead of that same layout cramped into a narrow column: same "3
// principles, one team" idea, just laid out top-to-bottom. Per direct
// request, this is two designs gated by viewport, not one replacing the
// other.
const DESKTOP_QUERY = "(min-width: 1280px)";

/* ---------- Desktop: three diverging/converging beams ---------- */

// Anchor points (in the SVG's own 0-1200 x 0-460 coordinate space) that
// each beam starts from and the label chips are positioned against.
const ANCHORS = [
  { x: 190, y: 60 },
  { x: 600, y: 20 },
  { x: 1010, y: 60 },
];
const BEAM_CONVERGE = { x: 600, y: 440 };

function beamPath(anchor) {
  const midY = anchor.y + (BEAM_CONVERGE.y - anchor.y) * 0.65;
  return `M ${anchor.x} ${anchor.y} C ${anchor.x} ${midY}, ${BEAM_CONVERGE.x} ${midY}, ${BEAM_CONVERGE.x} ${BEAM_CONVERGE.y}`;
}

function PhilosophyBeam({ item, index, progress }) {
  const pathLength = useTransform(progress, [0.15 + index * 0.1, 0.75 + index * 0.05], [0, 1]);

  return (
    <m.path
      d={beamPath(ANCHORS[index])}
      stroke={`url(#philosophy-beam-${item.accent})`}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      style={{ pathLength }}
      className={`philosophy-beam-line philosophy-beam-${item.accent}`}
    />
  );
}

function PhilosophyBeamLabel({ item, index, progress }) {
  const Icon = ICONS[item.icon];
  const anchor = ANCHORS[index];
  const opacity = useTransform(progress, [index * 0.1, 0.1 + index * 0.1], [0, 1]);
  const y = useTransform(progress, [index * 0.1, 0.1 + index * 0.1], [12, 0]);

  return (
    <m.div
      className={`philosophy-label philosophy-label-${item.accent}`}
      style={{
        left: `${(anchor.x / 1200) * 100}%`,
        top: `${(anchor.y / 460) * 100}%`,
        // Centering has to live here (as a static motion value) rather than
        // in a CSS `transform: translateX(-50%)` — framer motion writes its
        // own `transform` inline from every x/y/rotate/scale it's given,
        // which would otherwise clobber a stylesheet transform the moment
        // the animated `y` below kicks in.
        x: "-50%",
        opacity,
        y,
      }}
    >
      <span className="philosophy-label-icon">
        <Icon />
      </span>
      <span className="philosophy-label-text">{item.title}</span>
    </m.div>
  );
}

function PhilosophyBeamStage({ progress }) {
  const convergeOpacity = useTransform(progress, [0.75, 1], [0, 1]);
  const convergeScale = useTransform(progress, [0.75, 1], [0.85, 1]);

  return (
    <div className="philosophy-beam-stage">
      <svg
        className="philosophy-beams"
        viewBox="0 0 1200 460"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* gradientUnits="userSpaceOnUse" with fixed viewBox coordinates,
            not the default objectBoundingBox — the middle beam runs
            perfectly straight down (same x the whole way), which gives it
            a zero-width bounding box, and a bbox-relative gradient
            degenerates to nothing on a zero-width box. Fixed coordinates in
            the SVG's own space don't have that failure mode. */}
        <defs>
          <linearGradient id="philosophy-beam-orange" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="460">
            <stop offset="0%" stopColor="var(--accent-2)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
          <linearGradient id="philosophy-beam-navy" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="460">
            <stop offset="0%" stopColor="var(--navy-light)" />
            <stop offset="100%" stopColor="var(--navy)" />
          </linearGradient>
        </defs>
        {philosophy.items.map((item, i) => (
          <PhilosophyBeam key={item.title} item={item} index={i} progress={progress} />
        ))}
      </svg>

      {philosophy.items.map((item, i) => (
        <PhilosophyBeamLabel key={item.title} item={item} index={i} progress={progress} />
      ))}

      <m.div className="philosophy-converge" style={{ x: "-50%", opacity: convergeOpacity, scale: convergeScale }}>
        {philosophy.convergeLabel}
      </m.div>
    </div>
  );
}

/* ---------- Mobile: single vertical connecting line ---------- */

const LINE_THRESHOLDS = [0.12, 0.45, 0.78];
const LINE_CONVERGE_RANGE = [0.85, 1];

function PhilosophyLinePoint({ item, threshold, progress }) {
  const Icon = ICONS[item.icon];
  const opacity = useTransform(progress, [Math.max(threshold - 0.1, 0), threshold], [0, 1]);
  const x = useTransform(progress, [Math.max(threshold - 0.1, 0), threshold], [-14, 0]);

  return (
    <m.div className={`philosophy-label philosophy-label-${item.accent}`} style={{ opacity, x }}>
      <span className="philosophy-label-icon">
        <Icon />
      </span>
      <span className="philosophy-label-text">{item.title}</span>
    </m.div>
  );
}

function PhilosophyLineStage({ progress }) {
  const lineScale = useTransform(progress, [0.05, 0.95], [0, 1]);
  const convergeOpacity = useTransform(progress, LINE_CONVERGE_RANGE, [0, 1]);
  const convergeScale = useTransform(progress, LINE_CONVERGE_RANGE, [0.9, 1]);

  return (
    <div className="philosophy-line-stage">
      <div className="philosophy-line-track" aria-hidden="true">
        <m.div className="philosophy-line-fill" style={{ scaleY: lineScale }} />
      </div>

      <div className="philosophy-timeline">
        {philosophy.items.map((item, i) => (
          <PhilosophyLinePoint key={item.title} item={item} threshold={LINE_THRESHOLDS[i]} progress={progress} />
        ))}
        <m.div className="philosophy-converge" style={{ opacity: convergeOpacity, scale: convergeScale }}>
          {philosophy.convergeLabel}
        </m.div>
      </div>
    </div>
  );
}

/* ---------- Shared shell ---------- */

// New "NASZA FILOZOFIA" block from the client's copy doc, styled after the
// Aceternity UI "Google Gemini Effect" component the client pointed at:
// short labels instead of paragraphs, connected by a line (three beams on
// desktop, one on mobile) that draws itself in as this section scrolls
// into view and converges into a single badge.
export default function Philosophy() {
  const stageRef = useRef(null);
  // Defaults to false so the very first paint (before this effect runs) is
  // the mobile line layout everywhere — matches the same hydration-safe-
  // default pattern already used for ServicesList.jsx/Faq.jsx's `isMobile`.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Progress goes 0 -> 1 as the stage rises from the bottom of the viewport
  // up to dead center, and stays at 1 for the rest of its time on screen.
  // Shared by both layouts — the ref stays on one always-mounted element
  // regardless of isDesktop, since useScroll errors ("target ref is
  // defined but not hydrated") if its target ref was never attached to a
  // rendered node.
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "center center"],
  });

  return (
    <section className="section section-cream">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">{philosophy.eyebrow}</span>
          <h2 className="section-heading">{philosophy.heading}</h2>
        </div>

        <div ref={stageRef}>
          {isDesktop ? (
            <PhilosophyBeamStage progress={scrollYProgress} />
          ) : (
            <PhilosophyLineStage progress={scrollYProgress} />
          )}
        </div>
      </div>
    </section>
  );
}
