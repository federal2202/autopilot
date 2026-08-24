import { closing } from "@/data/content";
import { ArrowIcon } from "./icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

export default function Closing() {
  return (
    <section className="section section-black closing-section">
      <div className="container closing-inner">
        <Reveal>
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {closing.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="section-heading">{closing.heading}</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="closing-text">{closing.text}</p>
        </Reveal>
        <Reveal delay={0.24}>
          <Magnetic>
            <a href={closing.cta.href} className="btn btn-primary">
              {closing.cta.label}
              <ArrowIcon style={{ width: 16, height: 16 }} />
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
