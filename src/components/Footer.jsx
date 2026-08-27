import { footer } from "@/data/content";
import Logo from "./Logo";

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
          <span className="footer-credit">made by Fiodar Yermakou</span>
        </div>
      </div>
    </footer>
  );
}
