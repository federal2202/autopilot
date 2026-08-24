import Image from "next/image";
import { partners } from "@/data/content";
import { ArrowIcon } from "./icons";
import RichText from "./RichText";
import Reveal from "./Reveal";

export default function Partners() {
  return (
    <section id="partnerzy" className="section section-black">
      <div className="container">
        <div className="section-intro">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {partners.eyebrow}
          </span>
          <h2 className="section-heading">{partners.heading}</h2>
          <p className="section-subtext">{partners.subtext}</p>
        </div>

        <div className="partners-grid">
          {partners.list.map((partner, i) => (
            <Reveal key={partner.name} delay={i * 0.06} className="partner-card">
              <span className="partner-badge">{partner.badge}</span>
              <div className="partner-header">
                <span className="partner-icon">
                  <Image src={partner.logo} alt={partner.name} width={96} height={96} className="partner-icon-img" />
                </span>
                <h4 className="partner-name">{partner.name}</h4>
              </div>
              <p className="partner-description">
                <RichText text={partner.description} />
              </p>
              <a href={partner.href} target="_blank" rel="noopener noreferrer" className="partner-cta">
                {partner.cta}
                <ArrowIcon style={{ width: 16, height: 16 }} />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
