import localFont from "next/font/local";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { site } from "@/data/content";
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

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: "variable",
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "swap",
});

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
};

export const viewport = {
  themeColor: "#050505",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${geist.variable} ${fraunces.variable}`}>
      <body>
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
