"use client";

import { useEffect, useRef } from "react";
import { hero } from "@/data/content";

// The nbnzia reference pins a full-viewport statement and reveals it
// character-by-character as the user scrolls through the pin — GSAP
// ScrollTrigger + SplitText, not framer-motion, since it needs a real
// scroll-scrubbed timeline tied to a pinned section rather than a
// viewport-enter trigger.
export default function PinnedTagline() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

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
        split = new SplitText(textRef.current, { type: "words,chars" });
        gsap.set(split.chars, { color: "rgba(31, 31, 31, 0.16)" });

        gsap.to(split.chars, {
          color: "#1f1f1f",
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 0.6,
          },
        });
      }, sectionRef);
    })();

    return () => {
      split?.revert();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="tagline-section section-cream">
      <div className="container">
        <h1 ref={textRef} className="tagline-text">
          {hero.lead}
        </h1>
      </div>
    </section>
  );
}
