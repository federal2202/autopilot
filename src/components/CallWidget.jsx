"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { contact } from "@/data/content";
import { CloseIcon } from "./icons";
import { prefersReducedMotion } from "./Hero";

const EASE = [0.65, 0, 0.35, 1];
const DISMISS_KEY = "ar-autopilot:call-widget-dismissed";

// Persistent floating notification — styled like an incoming message from
// Stanisław himself (avatar, first-person line, online dot), not a generic
// "call us" banner — so a visitor never has to scroll all the way down to
// find a phone number. Shows from the moment Hero has fully scrolled past
// (any earlier and it fights with Hero's own intro sequence/photo), and
// hides again for as long as the real Contact section — which already
// carries this same phone card — is anywhere on screen, so the two are
// never visible at once.
function readDismissed() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    // Private-mode/blocked storage — just never treat it as dismissed.
    return false;
  }
}

export default function CallWidget() {
  const [pastHero, setPastHero] = useState(false);
  const [inEndZone, setInEndZone] = useState(false);
  // Lazy initializer (not an effect) — this doesn't create a hydration
  // mismatch even though the server can't read sessionStorage, since the
  // widget is already hidden on first paint either way (pastHero starts
  // false regardless, see the effect below).
  const [dismissed, setDismissed] = useState(readDismissed);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const contactSection = document.getElementById("kontakt");
    const footer = document.querySelector(".footer");
    if (!hero || !contactSection || !footer) return;

    const heroObserver = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting));
    heroObserver.observe(hero);

    // One observer for both "end of page" targets — Contact already shows
    // this exact phone card, and Footer right after it has nothing left to
    // call for, so the widget stays hidden through both.
    const endObserver = new IntersectionObserver((entries) => setInEndZone(entries.some((e) => e.isIntersecting)));
    endObserver.observe(contactSection);
    endObserver.observe(footer);

    return () => {
      heroObserver.disconnect();
      endObserver.disconnect();
    };
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Nothing to persist to — stays dismissed for the rest of this visit.
    }
  }

  const visible = pastHero && !inEndZone && !dismissed;
  const reduceMotion = prefersReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="call-widget"
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: EASE }}
        >
          <a href={`tel:${contact.phone.number}`} className="call-widget-link">
            <span className="call-widget-avatar-wrap">
              <img src={contact.phone.photo} alt="" className="call-widget-avatar" aria-hidden="true" />
              <span className="call-widget-online" aria-hidden="true" />
            </span>
            <span className="call-widget-copy">
              <span className="call-widget-name">{contact.phone.name.split(" ")[0]}</span>
              <span className="call-widget-message">{contact.phone.widgetMessage}</span>
              <span className="call-widget-number">{contact.phone.display}</span>
            </span>
          </a>
          <button type="button" className="call-widget-close" aria-label="Zamknij" onClick={dismiss}>
            <CloseIcon style={{ width: 14, height: 14 }} />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
