import localFont from "next/font/local";
import "./globals.css";
import { site, contact } from "@/data/content";
import MotionProvider from "@/components/MotionProvider";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";

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
};

export const viewport = {
  themeColor: "#f5f2f3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={geist.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionProvider>
          <SmoothScroll />
          <GrainOverlay />
          <CustomCursor />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
