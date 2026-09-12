"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/data/content";
import { MenuIcon, CloseIcon } from "./icons";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`navbar${scrolled ? " is-scrolled" : ""}`}>
      <div className="navbar-inner">
        <a href="#hero" className="navbar-logo">
          <Logo size={46} />
        </a>

        <nav className="navbar-links" aria-label="Nawigacja główna">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="#kontakt" className="navbar-cta btn btn-primary">
            Umów rozmowę
          </a>

          <button
            type="button"
            className="navbar-menu-toggle"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu${open ? " is-open" : ""}`}>
        <div className="mobile-menu-inner">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="mobile-link" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#kontakt" className="btn btn-primary btn-block" style={{ marginTop: 12 }} onClick={() => setOpen(false)}>
            Umów rozmowę
          </a>
        </div>
      </div>
    </header>
  );
}
