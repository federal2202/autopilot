import { intro } from "@/data/content";
import Reveal from "./Reveal";

export default function Intro() {
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

        <Reveal className="intro-about">
          <p className="intro-about-text">{intro.about}</p>
        </Reveal>
      </div>
    </section>
  );
}
