"use client";

import { useEffect, useRef } from "react";
import { intro } from "@/data/content";
import Reveal from "./Reveal";

export default function Intro() {
  const aboutRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx;
    let split;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      gsap.registerPlugin(ScrollTrigger, SplitText);

      ctx = gsap.context(() => {
        split = new SplitText(aboutRef.current, { type: "chars" });
        gsap.set(split.chars, { color: "rgba(31, 31, 31, 0.18)" });

        gsap.to(split.chars, {
          color: "#1f1f1f",
          stagger: 0.012,
          ease: "none",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 85%",
            end: "bottom 45%",
            scrub: 0.5,
          },
        });
      }, aboutRef);
    })();

    return () => {
      split?.revert();
      ctx?.revert();
    };
  }, []);

  return (
    <section className="section section-cream">
      <div className="container">
        <div className="intro-stats">
          {intro.stats.map((line, i) => (
            <Reveal key={line} delay={i * 0.06} className="intro-stat">
              {line}
            </Reveal>
          ))}
        </div>

        <div className="intro-about">
          <p ref={aboutRef} className="intro-about-text">
            {intro.about}
          </p>
        </div>
      </div>
    </section>
  );
}
