import Image from "next/image";
import { partners } from "@/data/content";
import { ArrowIcon } from "./icons";
import RichText from "./RichText";
import Reveal from "./Reveal";

export default function Partners() {
  return (
    <section id="partnerzy" className="section section-cream">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">{partners.eyebrow}</span>
          <h2 className="section-heading">{partners.heading}</h2>
          <p className="section-subtext">{partners.subtext}</p>
        </div>

        <div className="case-list">
          {partners.list.map((partner, i) => (
            <Reveal key={partner.name} delay={i * 0.06} as="div" className="case-row">
              <span className="case-index" aria-hidden="true">
                ( 0{i + 1} )
              </span>
              <div className="case-body">
                <div className="case-header">
                  <span className="case-icon">
                    <Image src={partner.logo} alt={partner.name} width={96} height={96} className="case-icon-img" />
                  </span>
                  <div>
                    <div className="case-badge">{partner.badge}</div>
                    <h4 className="case-name">{partner.name}</h4>
                  </div>
                </div>
                <p className="case-description">
                  <RichText text={partner.description} />
                </p>
                <a href={partner.href} target="_blank" rel="noopener noreferrer" className="case-cta">
                  {partner.cta}
                  <ArrowIcon style={{ width: 16, height: 16 }} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
