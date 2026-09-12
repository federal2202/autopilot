"use client";

import { m } from "framer-motion";
import { growthPath } from "@/data/content";
import Reveal from "./Reveal";

const EASE = [0.65, 0, 0.35, 1];
const TILTS = [-3, 2, -2, 3];

export default function ProcessSteps() {
  return (
    <section id="jak-to-dziala" className="section section-cream">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">{growthPath.eyebrow}</span>
          <h2 className="section-heading">{growthPath.heading}</h2>
          <p className="section-subtext">{growthPath.subtext}</p>
        </div>

        <Reveal className="process-teaser">
          <p className="process-teaser-text">{growthPath.teaser}</p>
        </Reveal>

        <div className="process-card-grid">
          {growthPath.stops.map((stop, i) => {
            const tilt = TILTS[i % TILTS.length];
            const fromSide = i % 2 === 0 ? -90 : 90;
            return (
              <m.div
                key={stop.km}
                className="process-card"
                initial={{ opacity: 0, x: fromSide, y: 24, rotate: 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: tilt }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                transition={{ duration: 0.65, delay: i * 0.08, ease: EASE }}
                whileHover={{ rotate: 0, y: -6 }}
              >
                <span className="process-card-index" aria-hidden="true">
                  Km {stop.km}
                </span>
                <span className="process-card-word">{stop.word}</span>
                <h3 className="process-card-title">{stop.title}</h3>
                <p className="process-card-text">{stop.text}</p>
                <div className="tag-row">
                  {stop.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
