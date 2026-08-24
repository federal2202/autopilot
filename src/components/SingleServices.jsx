import { singleServices } from "@/data/content";
import { CheckIcon } from "./icons";
import Reveal from "./Reveal";

export default function SingleServices() {
  return (
    <section id="usluGi" className="section section-tint">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {singleServices.eyebrow}
          </span>
          <h2 className="section-heading">{singleServices.heading}</h2>
          <p className="section-subtext">{singleServices.subtext}</p>
        </div>

        <div className="services-grid">
          {singleServices.list.map((service, i) => (
            <Reveal key={service.name} delay={i * 0.06} className="package-card">
              <span className="package-niche">{service.niche}</span>
              <h4 className="package-name">{service.name}</h4>
              <ul className="package-bullets">
                {service.bullets.map((bullet) => (
                  <li key={bullet}>
                    <CheckIcon />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <a href="#kontakt" className="btn btn-secondary btn-block">
                Zapytaj o usługę
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
