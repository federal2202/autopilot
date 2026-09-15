"use client";

import { useEffect, useRef } from "react";
import { intro } from "@/data/content";
import { ArrowIcon } from "./icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

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
        // Ghost -> ink color scrub only — a blur-in was tried alongside
        // this (per an earlier "make the reveal more interesting"
        // request) and then asked to be removed again, so back to the
        // plain scrub the rest of the site already uses.
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
        {/* nbnzia's about block: a narrow left column carrying BOTH the
            stat list and the video (stats on top, video at the bottom,
            same column) — the pitch statement fills the wide right
            column, with the CTAs sitting close underneath it. Not a
            "stats row + video-and-buttons row" layout, which was our own
            invention, not the reference's. */}
        <div className="intro-grid">
          <div className="intro-stats-col">
            <div className="intro-stats">
              {intro.stats.map((line, i) => (
                <Reveal key={line} delay={i * 0.06} className="intro-stat">
                  {line}
                </Reveal>
              ))}
            </div>

            {/* Empty slot only — the actual <video> lives in Showreel.jsx's
                big box further down the page and gets scroll-driven to
                visually sit here until you scroll it away. Reference's own
                DOM does the same two-differently-sized-boxes-plus-one-
                shared-video trick; ours re-measures both boxes live on
                every scroll frame instead of caching positions once (see
                Showreel.jsx), so there's nothing here that needs to stay
                in sync with anything — this stays a plain empty div. */}
            <div className="intro-media-frame" data-showreel-slot="small" />
          </div>

          <div className="intro-about">
            <p ref={aboutRef} className="intro-about-text">
              {intro.about}
            </p>

            <div className="intro-ctas">
              <Magnetic>
                <a href={intro.ctaPrimary.href} className="btn btn-primary">
                  {intro.ctaPrimary.label}
                  <ArrowIcon style={{ width: 16, height: 16 }} />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={intro.ctaSecondary.href} className="btn btn-secondary">
                  {intro.ctaSecondary.label}
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
