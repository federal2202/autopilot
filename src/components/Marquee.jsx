import { intro } from "@/data/content";

// Infinite scrolling ticker of the same facts as the stat strip — pure CSS
// loop (two identical item sets side by side, track translated -50%), so it
// costs nothing at runtime and pauses cleanly under prefers-reduced-motion.
// The duplicate set is aria-hidden so screen readers only hear it once.
function ItemSet({ hidden }) {
  return (
    <span className="marquee-set" aria-hidden={hidden || undefined}>
      {intro.stats.map((item) => (
        <span className="marquee-item" key={item}>
          {item}
          <span className="marquee-sep" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Marquee() {
  return (
    <div className="marquee section-cream">
      <div className="marquee-track">
        <ItemSet />
        <ItemSet hidden />
      </div>
    </div>
  );
}
