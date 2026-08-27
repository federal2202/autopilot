import { offer } from "@/data/content";
import { CheckIcon, ArrowIcon } from "./icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

export default function ServicesList() {
  return (
    <section id="oferta" className="section section-black">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">{offer.eyebrow}</span>
          <h2 className="section-heading">{offer.heading}</h2>
          <p className="section-subtext">{offer.subtext}</p>
        </div>

        <div className="services-list">
          {offer.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.06} as="div">
              <div className="services-row">
                <span className="services-index" aria-hidden="true">
                  [ 0{i + 1} ]
                </span>
                <h4 className="services-name">{item.name}</h4>
                {item.badge && <span className="services-badge">{item.badge}</span>}
              </div>
              <div className="services-details">
                <ul className="services-bullets">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>
                      <CheckIcon />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="offer-cta-wrap">
          <Magnetic>
            <a href={offer.cta.href} className="btn btn-primary">
              {offer.cta.label}
              <ArrowIcon style={{ width: 16, height: 16 }} />
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
