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

    // React's Strict Mode (on by default in Next.js dev) mounts every
    // component twice, running this effect and its cleanup back-to-back
    // before the async import below has any chance to resolve — so the
    // *first* run's cleanup always finds `ctx`/`split` still undefined
    // and reverts nothing, while the *second* run's async work lands on
    // top a moment later. Without this `cancelled` guard, both runs'
    // async callbacks eventually execute, each building its own SplitText
    // + ScrollTrigger pin on the very same section — two pins racing to
    // control one element is exactly what read as the text going blank
    // or stuck partway through its reveal (dev-only; a real unmount only
    // ever runs an effect once, so production isn't affected). Setting
    // `cancelled` in the first run's cleanup makes its still-pending
    // import a no-op once it resolves, leaving only the second, real
    // mount's split/pin ever active.
    let cancelled = false;
    let ctx;
    let split;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (cancelled) return;
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
      cancelled = true;
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
