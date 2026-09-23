import { footer } from "@/data/content";
import Logo from "./Logo";

// Business-details block ("Add & check business details" — required by
// ad-platform landing-page policies) + legal page links is built and ready
// in git history, wired to `legal.entity` in content.js — it's just not
// rendered yet because that data is still TODO placeholders. Re-enable once
// the real NIP/REGON/address land.

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="navbar-logo">
            <Logo variant="light" />
          </div>
          <p style={{ color: "#9da3aa", fontSize: 14, maxWidth: 360 }}>{footer.tagline}</p>
        </div>

        <div className="footer-bottom">
          &copy; {year} {footer.rightsLine}
          <br />
          Partner techniczny:{" "}
          <a href={footer.techPartner.url} target="_blank" rel="noopener noreferrer" className="footer-partner-link">
            {footer.techPartner.label}
          </a>{" "}
          — sprzęt filmowy i fotograficzny najwyższej klasy.
          <br />
          <span className="footer-credit">made by Fiodar Yermakou</span>
        </div>
      </div>
    </footer>
  );
}
