"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { segments } from "@/data/content";
import { CheckIcon } from "./icons";
import Reveal from "./Reveal";

function PackageCard({ pkg, delay }) {
  return (
    <Reveal delay={delay} className="package-card">
      <span className="package-niche">{pkg.niche}</span>
      <h4 className="package-name">{pkg.name}</h4>
      <ul className="package-bullets">
        {pkg.bullets.map((bullet) => (
          <li key={bullet}>
            <CheckIcon />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <a href="#kontakt" className="btn btn-secondary btn-block">
        Wybierz pakiet
      </a>
    </Reveal>
  );
}

export default function Segments() {
  const [activeId, setActiveId] = useState(segments.list[0].id);
  const active = segments.list.find((s) => s.id === activeId);

  return (
    <section id="segmenty" className="section section-black">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {segments.eyebrow}
          </span>
          <h2 className="section-heading">{segments.heading}</h2>
          <p className="section-subtext">{segments.subtext}</p>
        </div>

        <div className="segment-tabs" role="tablist" aria-label="Segmenty">
          {segments.list.map((seg) => (
            <button
              key={seg.id}
              type="button"
              role="tab"
              aria-selected={seg.id === activeId}
              className={`segment-tab${seg.id === activeId ? " is-active" : ""}`}
              onClick={() => setActiveId(seg.id)}
            >
              {seg.id === activeId && (
                <m.span className="segment-tab-bg" layoutId="segment-tab-bg" transition={{ duration: 0.35, ease: "easeInOut" }} />
              )}
              {seg.shortLabel}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <m.div
            key={activeId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="segment-panel-heading">
              <h3>{active.heading}</h3>
              <p>{active.subtext}</p>
            </div>

            <div className="package-grid">
              {active.packages.map((pkg, i) => (
                <PackageCard key={pkg.name} pkg={pkg} delay={i * 0.06} />
              ))}
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
