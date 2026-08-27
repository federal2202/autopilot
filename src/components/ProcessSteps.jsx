import { growthPath } from "@/data/content";
import Reveal from "./Reveal";

export default function ProcessSteps() {
  return (
    <section id="jak-to-dziala" className="section section-cream">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">{growthPath.eyebrow}</span>
          <h2 className="section-heading">{growthPath.heading}</h2>
          <p className="section-subtext">{growthPath.subtext}</p>
        </div>

        <Reveal className="process-teaser">
          <p className="process-teaser-text">{growthPath.teaser}</p>
        </Reveal>

        <div className="process-steps">
          {growthPath.stops.map((stop, i) => (
            <Reveal key={stop.km} delay={i * 0.05} as="div" className="process-step">
              <span className="process-step-index" aria-hidden="true">
                Km {stop.km}
              </span>
              <div className="process-step-body">
                <span className="process-step-word">{stop.word}</span>
                <h3 className="process-step-title">{stop.title}</h3>
                <p className="process-step-text">{stop.text}</p>
                <div className="tag-row">
                  {stop.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
