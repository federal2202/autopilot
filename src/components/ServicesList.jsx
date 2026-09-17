"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { offer } from "@/data/content";
import { ArrowIcon } from "./icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

const EASE = [0.65, 0, 0.35, 1];
// Matches the `@media (max-width: 720px)` breakpoint in globals.css that
// switches this section to its stacked mobile layout.
const MOBILE_QUERY = "(max-width: 720px)";

export default function ServicesList() {
  const [openIndex, setOpenIndex] = useState(0);
  // Below 720px, `layout="position"` (framer-motion projection,
  // recalculated for every sibling item on any one item's open/close)
  // and the .services-details height animation are both skipped —
  // together with .services-thumb's own transition (see globals.css'
  // matching breakpoint), those were three concurrent layout-affecting
  // animations on every tap, which is what actually read as jank on
  // phones, not any one of them alone. Defaults to false so desktop's
  // first paint is unaffected; only matters once the effect below runs.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
            // On mobile there's no hover to reveal that these rows are
            // even interactive, so a visitor who never taps one would
            // otherwise never see the photo/description for [02] or
            // [03] at all — open every item by default there instead of
            // just the first. Desktop keeps the single-open,
            // hover-to-switch behavior unchanged.
            const isOpen = isMobile ? true : openIndex === i;
            return (
              <Reveal
                key={item.name}
                delay={i * 0.06}
                as="div"
                className={`services-item${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => setOpenIndex(i)}
                layout={isMobile ? undefined : "position"}
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
                  <h3 className="services-name">{item.name}</h3>
                </button>

                <m.div
                  className="services-details"
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0 }}
                  transition={{ duration: isMobile ? 0 : 0.45, ease: EASE }}
                >
                  <div className="services-details-grid">
                    <span aria-hidden="true" />
                    <p className="services-text">{item.description}</p>
                  </div>
                </m.div>

                {/* Always mounted — plain CSS transition off .is-open (see
                    globals.css) instead of Framer Motion, so the reveal
                    can never race the text's height animation or get
                    tangled up with this item's own layout="position"
                    projection. Also means the browser starts loading all
                    three photos on first paint instead of on first tap. */}
                <div className="services-thumb-wrap">
                  <img src={item.thumb} alt={item.name} className="services-thumb" aria-hidden="true" />
                </div>
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
