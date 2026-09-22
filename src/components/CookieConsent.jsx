"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ar-autopilot-cookie-consent";

// Reads the visitor's stored choice ("all" | "essential") outside React —
// call this before initializing any analytics/ads pixel so it only loads
// after an explicit "all" consent. Returns false during SSR/before the
// visitor has chosen, which is the correct default (no consent yet).
export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "all";
  } catch {
    return false;
  }
}

// The site currently sets no cookies and loads no analytics/ads SDKs of
// its own (see the audit note in README/PR description) — Next.js itself
// sets none either. This banner exists so that the moment someone adds a
// Meta Pixel, GA4, or similar, there's already a consent gate to hang it
// off (`hasAnalyticsConsent()`) instead of shipping tracking before
// consent exists.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Named + called through its own reference (not a bare `setVisible(...)`
    // as the first statement) — matches the shape ServicesList.jsx/
    // Faq.jsx's own `isMobile` effects already use, which is what actually
    // satisfies react-hooks/set-state-in-effect here; a direct inline call
    // is flagged as a synchronous setState-in-effect even though this is
    // the correct pattern for reading a browser-only API after mount.
    const checkConsent = () => {
      try {
        if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
      } catch {
        // localStorage unavailable (privacy mode/blocked) — skip the banner
        // rather than show it every load with no way to persist a choice.
      }
    };
    checkConsent();
  }, []);

  const choose = (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Nothing to persist to — the choice just won't survive a reload.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-modal="false" aria-labelledby="cookie-consent-heading">
      <p id="cookie-consent-heading">
        Używamy plików cookie i podobnych technologii, w tym niezbędnych do działania strony oraz — po Twojej zgodzie —
        analitycznych i reklamowych. Szczegóły w{" "}
        <a href="/polityka-cookies">Polityce cookies</a>.
      </p>
      <div className="cookie-consent-actions">
        <button type="button" className="btn btn-ghost" onClick={() => choose("essential")}>
          Tylko niezbędne
        </button>
        <button type="button" className="btn btn-primary" onClick={() => choose("all")}>
          Akceptuj wszystkie
        </button>
      </div>
    </div>
  );
}
