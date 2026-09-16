"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { navLinks } from "@/data/content";
import { MenuIcon, CloseIcon } from "./icons";
import Logo from "./Logo";
import { HERO_REVEAL_MS, prefersReducedMotion } from "./Hero";

const EASE = [0.65, 0, 0.35, 1];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Hidden behind the loader/photo (both explicit z-index, well above the
  // navbar's own 999) for the whole Hero intro regardless of this
  // animation's own state — but without motion of its own, the instant it
  // stops being covered it would just materialize already fully formed,
  // which read as an abrupt pop even though the *covering* mechanism
  // (Hero.jsx's loader fade) is smooth. Timed to HERO_REVEAL_MS — the
  // exact moment Hero.jsx uncovers it — so it slides down and fades in
  // right as it becomes visible, instead of being static motion revealed
  // by something else's fade.
  const reduceMotion = prefersReducedMotion();

  return (
    <m.header
      className="navbar"
      initial={reduceMotion ? false : { opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { delay: HERO_REVEAL_MS / 1000, duration: 0.6, ease: EASE }}
    >
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
            Porozmawiajmy
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
            Porozmawiajmy
          </a>
        </div>
      </div>
    </m.header>
  );
}
