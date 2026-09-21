import { contact, footer } from "@/data/content";
import { MailIcon, PhoneIcon, InstagramIcon, ArrowIcon } from "./icons";
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

        <div className="contact-links-row">
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

          {/* Gated on contact.instagram (content.js) so no dead "#" link ever
              ships — set that field once the client's IG link is known and
              this card appears automatically, no code change needed. */}
          {contact.instagram && (
            <Reveal delay={0.14} className="glass-card contact-phone-card">
              <span className="contact-phone-icon">
                <InstagramIcon />
              </span>
              <div>
                <div className="contact-phone-name">Instagram</div>
                <a
                  href={contact.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-phone-number"
                >
                  {contact.instagram.label ?? "Autostrada Rozwoju"}
                </a>
              </div>
            </Reveal>
          )}
        </div>

        {/* Client asked for the Prozone Rent credit in the footer OR a
            "quality" section — it's in Footer.jsx too; repeated here since
            Contact is the section most people actually scroll to read. */}
        <Reveal delay={0.2} className="contact-partner-note">
          Sprzęt filmowy i fotograficzny dostarcza nasz partner techniczny —{" "}
          <a href={footer.techPartner.url} target="_blank" rel="noopener noreferrer" className="footer-partner-link">
            {footer.techPartner.label}
          </a>
          .
        </Reveal>
      </div>
    </section>
  );
}
