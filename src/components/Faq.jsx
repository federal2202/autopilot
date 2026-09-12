"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { faq } from "@/data/content";
import { PlusIcon } from "./icons";
import Reveal from "./Reveal";

const EASE = [0.65, 0, 0.35, 1];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="section section-cream">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">{faq.eyebrow}</span>
          <h2 className="section-heading">{faq.heading}</h2>
          <p className="section-subtext">{faq.subtext}</p>
        </div>

        <div className="faq-list">
          {faq.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal
                key={item.question}
                delay={i * 0.06}
                as="div"
                className={`faq-item${isOpen ? " is-open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-row"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <h4 className="faq-question">{item.question}</h4>
                  <span className="faq-toggle" aria-hidden="true">
                    <PlusIcon style={{ width: 20, height: 20 }} />
                  </span>
                </button>

                <m.div
                  className="faq-details"
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <p className="faq-answer">{item.answer}</p>
                </m.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
