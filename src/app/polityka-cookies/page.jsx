import LegalPage from "@/components/LegalPage";
import { site } from "@/data/content";

export const metadata = {
  title: "Polityka cookies",
  alternates: { canonical: "/polityka-cookies" },
  robots: { index: false, follow: false },
};

const sections = [
  {
    heading: "1. Czym są pliki cookie",
    paragraphs: [
      "Pliki cookie to niewielkie pliki tekstowe zapisywane przez przeglądarkę na Twoim urządzeniu podczas odwiedzin strony internetowej. Ta polityka opisuje również inne technologie o podobnym działaniu, np. localStorage przeglądarki.",
    ],
  },
  {
    heading: "2. Jakich technologii aktualnie używamy",
    paragraphs: [
      `${site.url} nie ustawia obecnie żadnych plików cookie analitycznych, marketingowych ani śledzących — nie mamy wgranych narzędzi takich jak Google Analytics, Meta Pixel, TikTok Pixel czy podobnych.`,
      "Jedyny zapis, jaki strona zapisuje w Twojej przeglądarce, to Twój wybór w banerze zgody na cookies (localStorage) — dzięki temu baner nie pokazuje się przy każdej kolejnej wizycie. Ten zapis jest niezbędny do działania samego banera i nie wymaga odrębnej zgody.",
    ],
  },
  {
    heading: "3. Co się zmieni, gdy dodamy analitykę lub reklamy",
    paragraphs: [
      "Jeśli w przyszłości wdrożymy narzędzia analityczne (np. do mierzenia skuteczności kampanii reklamowych) lub piksele reklamowe, zostaną one podzielone na kategorie niezbędne i opcjonalne, a skrypty opcjonalne będą ładowane wyłącznie po wybraniu \"Akceptuj wszystkie\" w banerze zgody. W każdej chwili będziesz mógł/mogła wycofać zgodę, czyszcząc dane strony w ustawieniach przeglądarki — do czasu wdrożenia dedykowanego panelu zarządzania zgodami ta metoda jest jedynym sposobem cofnięcia wyboru.",
      "Ta strona zostanie zaktualizowana o pełną listę narzędzi (nazwa, dostawca, cel, okres przechowywania) przed uruchomieniem którejkolwiek z tych technologii.",
    ],
  },
  {
    heading: "4. Zarządzanie cookies w przeglądarce",
    paragraphs: [
      "Niezależnie od ustawień na tej stronie, każdą przeglądarkę można skonfigurować tak, by blokowała lub usuwała pliki cookie — odpowiednie opcje znajdziesz w ustawieniach prywatności swojej przeglądarki.",
    ],
  },
];

export default function CookiePolicyPage() {
  return <LegalPage eyebrow="Prawnie" title="Polityka cookies" sections={sections} />;
}
