# Design decisions log

Running list of placeholder/temporary calls made while rebuilding the site
around the nbnzia.com reference. Revisit these when the real asset/decision
is ready — nothing here is final.

## Open — needs a real asset

- **Hero visual (`Hero.jsx`, `ScalingMedia.jsx`)** — the reference site's
  hero and pinned-scale section both run a real portrait photo/video of the
  founder. We have no hero photo/video yet, so both slots currently show the
  existing `AsciiSculpture` canvas (camera-photo → ASCII art) as a stand-in
  centerpiece. **Swap plan:** once real photo or video footage exists, drop
  it into the `.hero-visual-inline` panel in `Hero.jsx` and the
  `.scaling-media-frame` in `ScalingMedia.jsx` in place of `<AsciiSculpture />`
  — the surrounding layout/scroll/animation code doesn't need to change.

## Resolved (recorded for context)

- **Case studies section** — the reference has a real named-client
  portfolio with results. We have no such data, so `Partners.jsx` fills that
  visual slot instead, showing the real equipment/lifestyle partners in the
  same numbered-row layout. Not a 1:1 content match, but honest.
- **Contact form** — the reference's contact section actually submits
  (Name/Email/Submit). `Contact.jsx` intentionally stays as static
  email/phone cards — no fake form UI with nowhere to send data.
- **Display font** — the reference uses a commercial font ("Bdogrotesk") we
  can't license. Substituted **Space Grotesk** (Google Fonts) for all large
  display/headline type via `--font-grotesk`.
