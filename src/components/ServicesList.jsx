"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { offer } from "@/data/content";
import { ArrowIcon } from "./icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

const EASE = [0.65, 0, 0.35, 1];

export default function ServicesList() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="oferta" className="section section-black">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">{offer.eyebrow}</span>
          <h2 className="section-heading">{offer.heading}</h2>
          <p className="section-subtext">{offer.subtext}</p>
        </div>

        <div className="services-list">
          {offer.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal
                key={item.name}
                delay={i * 0.06}
                as="div"
                className={`services-item${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => setOpenIndex(i)}
              >
                <button
                  type="button"
                  className="services-row"
                  aria-expanded={isOpen}
                  onFocus={() => setOpenIndex(i)}
                  onClick={() => setOpenIndex(i)}
                >
                  <span className="services-index" aria-hidden="true">
                    [ 0{i + 1} ]
                  </span>
                  <h4 className="services-name">{item.name}</h4>
                </button>

                <m.div
                  className="services-details"
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <div className="services-details-grid">
                    <span aria-hidden="true" />
                    <p className="services-text">{item.description}</p>
                  </div>
                </m.div>

                <AnimatePresence>
                  {isOpen && (
                    <m.img
                      key="thumb"
                      src={item.thumb}
                      alt=""
                      className="services-thumb"
                      aria-hidden="true"
                      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                      animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.55, delay: 0.15, ease: EASE } }}
                      exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.35, ease: EASE } }}
                    />
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="offer-cta-wrap">
          <Magnetic>
            <a href={offer.cta.href} className="btn btn-primary">
              {offer.cta.label}
              <ArrowIcon style={{ width: 16, height: 16 }} />
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
