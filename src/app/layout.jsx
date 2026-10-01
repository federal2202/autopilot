import localFont from "next/font/local";
import "./globals.css";
import { site, contact, faq } from "@/data/content";
import MotionProvider from "@/components/MotionProvider";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";
import CookieConsent from "@/components/CookieConsent";

const geist = localFont({
  src: [
    { path: "../fonts/geist-latin.woff2", weight: "400 700", style: "normal" },
    { path: "../fonts/geist-latin-ext.woff2", weight: "400 700", style: "normal" },
  ],
  variable: "--font-geist",
  display: "swap",
});

// Display headline/serif faces (Fraunces, Space Grotesk) were dropped in
// favor of the system font stack (see --font-fraunces/--font-grotesk in
// globals.css, both now aliased to --font-system) — nothing in this file
// needs to load or expose those web fonts any more.

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "agencja marketingowa",
    "produkcja wideo",
    "montaż wideo",
    "prowadzenie social media",
    "strony internetowe dla firm",
    "AR Autopilot",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  // Google Search Console ownership verification — paste the "content"
  // value from Search Console's HTML tag method here once the property is
  // added (Settings → Ownership verification → HTML tag):
  // verification: { google: "PASTE_CODE_HERE" },
};

// `contact.socials` (content.js) feeds `sameAs` below — an empty array
// just omits the key, so this degrades cleanly until real profile URLs
// are added.
const sameAs = (contact.socials ?? []).map((s) => s.url).filter(Boolean);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/opengraph-image`,
  email: contact.email,
  telephone: contact.phone.number,
  areaServed: "PL",
  address: { "@type": "PostalAddress", addressCountry: "PL" },
  ...(sameAs.length > 0 && { sameAs }),
};

// FAQPage schema straight off the same `faq.items` the FAQ section
// already renders — one source of truth, no copy to keep in sync.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export const viewport = {
  themeColor: "#f5f2f3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={geist.variable}>
      <body>
        {/* One <script> per schema object — some JSON-LD parsers (browser
            extensions, crawlers) choke on a top-level array and throw
            on `r["@context"]`. */}
        {[jsonLd, faqJsonLd].map((schema) => (
          <script
            key={schema["@type"]}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <MotionProvider>
          <SmoothScroll />
          <GrainOverlay />
          <CustomCursor />
          {children}
          <CookieConsent />
        </MotionProvider>
      </body>
    </html>
  );
}
