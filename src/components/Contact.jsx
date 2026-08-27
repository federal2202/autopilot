import { contact } from "@/data/content";
import { MailIcon, PhoneIcon, ArrowIcon } from "./icons";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="kontakt" className="section section-black">
      <div className="container" style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="section-intro">
          <span className="eyebrow">{contact.eyebrow}</span>
          <h2 className="section-heading">{contact.heading}</h2>
          <p className="section-subtext">{contact.subtext}</p>
        </div>

        <Reveal className="glass-card contact-email-card">
          <div className="contact-email-top">
            <span className="contact-icon-wrap">
              <MailIcon />
            </span>
            <div style={{ flex: 1 }}>
              <div className="contact-email-label">{contact.emailLabel}</div>
              <div className="contact-email-value">{contact.email}</div>
            </div>
          </div>
          <a href={`mailto:${contact.email}`} className="contact-email-cta">
            {contact.emailCta}
            <ArrowIcon style={{ width: 16, height: 16 }} />
          </a>
        </Reveal>

        <Reveal delay={0.08} className="glass-card contact-phone-card">
          <span className="contact-phone-icon">
            <PhoneIcon />
          </span>
          <div>
            <div className="contact-phone-name">{contact.phone.name}</div>
            <a href={`tel:${contact.phone.number}`} className="contact-phone-number">
              {contact.phone.display}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
