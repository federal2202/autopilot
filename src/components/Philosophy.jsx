"use client";

import { useEffect, useRef, useState } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { philosophy } from "@/data/content";
import { ClockIcon, ChartIcon, LayersIcon } from "./icons";

const ICONS = { clock: ClockIcon, chart: ChartIcon, layers: LayersIcon };
// Same breakpoint the section used for its earlier card-stack layout — the
// beams below need real width to read as three distinct converging lines
// rather than three cramped squiggles. Mobile falls back to a plain list of
// icon + label, no animation; a lighter-weight version for narrow screens
// is still "figure out later", as it's been the whole way through.
const DESKTOP_QUERY = "(min-width: 1280px)";

// Anchor points (in the SVG's own 0-1200 x 0-460 coordinate space) that
// each beam starts from and the label chips are positioned against — a true
// Aceternity "Google Gemini Effect" reroll: per the client's own reference,
// the meaning is carried by lines converging into one point, not by
// paragraphs, so each philosophy item is reduced to a short label sitting
// at the mouth of its own beam instead of a card full of body copy.
const ANCHORS = [
  { x: 190, y: 60 },
  { x: 600, y: 20 },
  { x: 1010, y: 60 },
];
const CONVERGE = { x: 600, y: 440 };

function beamPath(anchor) {
  const midY = anchor.y + (CONVERGE.y - anchor.y) * 0.65;
  return `M ${anchor.x} ${anchor.y} C ${anchor.x} ${midY}, ${CONVERGE.x} ${midY}, ${CONVERGE.x} ${CONVERGE.y}`;
}

function PhilosophyBeam({ item, index, progress }) {
  const pathLength = useTransform(progress, [0.15 + index * 0.1, 0.75 + index * 0.05], [0, 1]);
  const gradientId = `philosophy-beam-${item.accent}`;

  return (
    <m.path
      d={beamPath(ANCHORS[index])}
      stroke={`url(#${gradientId})`}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      style={{ pathLength }}
      className={`philosophy-beam-line philosophy-beam-${item.accent}`}
    />
  );
}

function PhilosophyLabel({ item, index, progress }) {
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

// New "NASZA FILOZOFIA" block from the client's copy doc, styled after the
// Aceternity UI "Google Gemini Effect" component the client pointed at:
// short labels instead of paragraphs, connected by gradient beams that draw
// themselves in as this section scrolls into view and converge into a
// single badge — the animation carries the "3 principles, one team"
// meaning instead of a sentence spelling it out.
export default function Philosophy() {
  const stageRef = useRef(null);
  const [isStage, setIsStage] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsStage(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "center center"],
  });

  const convergeOpacity = useTransform(scrollYProgress, [0.75, 1], [0, 1]);
  const convergeScale = useTransform(scrollYProgress, [0.75, 1], [0.85, 1]);

  return (
    <section className="section section-cream">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">{philosophy.eyebrow}</span>
          <h2 className="section-heading">{philosophy.heading}</h2>
        </div>

        {/* The ref stays on one element that's always mounted, regardless of
            isStage — useScroll errors ("target ref is defined but not
            hydrated") if the ref object exists but was never attached to a
            rendered node, which is exactly what happened when the stage and
            the mobile fallback were two separate conditionally-rendered
            elements and only one of them carried the ref. */}
        <div ref={stageRef} className={isStage ? "philosophy-stage" : "philosophy-list"}>
          {isStage ? (
            <>
              <svg
                className="philosophy-beams"
                viewBox="0 0 1200 460"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                {/* gradientUnits="userSpaceOnUse" with fixed viewBox coordinates,
                    not the default objectBoundingBox — the middle beam runs
                    perfectly straight down (same x the whole way), which
                    gives it a zero-width bounding box, and a bbox-relative
                    gradient degenerates to nothing on a zero-width box. Fixed
                    coordinates in the SVG's own space don't have that
                    failure mode, and still land in the same place for every
                    path since they all share the same viewBox. */}
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
                  <PhilosophyBeam key={item.title} item={item} index={i} progress={scrollYProgress} />
                ))}
              </svg>

              {philosophy.items.map((item, i) => (
                <PhilosophyLabel key={item.title} item={item} index={i} progress={scrollYProgress} />
              ))}

              <m.div
                className="philosophy-converge"
                style={{ x: "-50%", opacity: convergeOpacity, scale: convergeScale }}
              >
                {philosophy.convergeLabel}
              </m.div>
            </>
          ) : (
            <>
              {philosophy.items.map((item) => {
                const Icon = ICONS[item.icon];
                return (
                  <div key={item.title} className={`philosophy-label philosophy-label-${item.accent} is-static`}>
                    <span className="philosophy-label-icon">
                      <Icon />
                    </span>
                    <span className="philosophy-label-text">{item.title}</span>
                  </div>
                );
              })}
              <div className="philosophy-converge is-static">{philosophy.convergeLabel}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
