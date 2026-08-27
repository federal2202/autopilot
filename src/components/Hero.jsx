"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { hero } from "@/data/content";
import AsciiSculpture from "./AsciiSculpture";
import Magnetic from "./Magnetic";
import KineticText from "./KineticText";

const EASE = [0.65, 0, 0.35, 1];
const [headA, headB] = hero.headingParts;

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <section id="hero" ref={sectionRef} className="hero-section section-cream">
      <div className="hero-glow-layer" aria-hidden="true">
        <span className="hero-glow hero-glow-a" />
        <span className="hero-glow hero-glow-b" />
      </div>

      <div className="container hero-container">
        <div className="hero-grid">
          <div className="hero-copy">
            <m.span
              className="eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {hero.eyebrow}
            </m.span>

            <m.div className="hero-heading-wrap" style={{ scale, opacity }}>
              <h1 className="hero-heading">
                <span className="hero-heading-line hero-heading-accent">
                  <KineticText text={headA} baseDelay={0.1} stagger={0.032} />
                  <m.span
                    className="hero-visual-inline"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
                  >
                    <AsciiSculpture className="hero-sculpture" />
                  </m.span>
                  <KineticText text={headB} baseDelay={0.1 + headA.length * 0.032 + 0.1} stagger={0.032} />
                </span>
              </h1>
            </m.div>

            <m.p
              className="hero-lead"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85, ease: EASE }}
            >
              {hero.lead}
            </m.p>

            <m.div
              className="hero-ctas"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95, ease: EASE }}
            >
              {hero.ctas.map((cta, i) => (
                <Magnetic key={cta.label}>
                  <a href={cta.href} className={`btn ${i === 0 ? "btn-primary" : i === 1 ? "btn-secondary" : "btn-ghost"}`}>
                    {cta.label}
                  </a>
                </Magnetic>
              ))}
            </m.div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero-scroll-cue-line" />
      </div>
    </section>
  );
}
