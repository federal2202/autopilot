import { site } from "@/data/content";

export default function sitemap() {
  const lastModified = new Date();

  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/#oferta`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/#jak-to-dziala`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/#faq`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/#kontakt`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    // Legal pages (polityka-prywatnosci, regulamin, polityka-cookies, polityka-zwrotow)
    // stay out of the sitemap until legal.entity in content.js has real business
    // data — see the TODO there.
  ];
}
