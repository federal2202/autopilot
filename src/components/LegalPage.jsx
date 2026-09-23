import Navbar from "./Navbar";
import Footer from "./Footer";
import { legal } from "@/data/content";

// Shared shell for the legal pages (/polityka-prywatnosci, /regulamin,
// /polityka-cookies, /polityka-zwrotow) — same Navbar/Footer/typography
// every marketing page gets, just without the marketing sections. Content
// is passed as plain data (see each page.jsx) instead of JSX so the legal
// text itself stays easy to review/edit without touching markup.
export default function LegalPage({ eyebrow, title, sections }) {
  return (
    <>
      <Navbar />
      <main>
        <section className="section section-cream legal-page">
          <div className="container legal-container">
            <div className="section-intro">
              <span className="eyebrow">{eyebrow}</span>
              <h1 className="section-heading">{title}</h1>
              <p className="legal-updated">Ostatnia aktualizacja: {legal.lastUpdated}</p>
            </div>

            <div className="legal-body">
              {sections.map((section) => (
                <div key={section.heading} className="legal-section">
                  <h2>{section.heading}</h2>
                  {section.paragraphs?.map((p, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <p key={i}>{p}</p>
                  ))}
                  {section.list && (
                    <ul>
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
