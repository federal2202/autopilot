import { site } from "@/data/content";

export default function sitemap() {
  const lastModified = new Date();

  return [
    // Single-page site: Google ignores #fragments, so section anchors would
    // only be duplicates of the home page.
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    // Legal pages (polityka-prywatnosci, regulamin, polityka-cookies, polityka-zwrotow)
    // stay out of the sitemap until legal.entity in content.js has real business
    // data — see the TODO there.
  ];
}
