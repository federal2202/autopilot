import LegalPage from "@/components/LegalPage";
import { site, contact, legal } from "@/data/content";

export const metadata = {
  title: "Regulamin",
  alternates: { canonical: "/regulamin" },
  robots: { index: false, follow: false },
};

const sections = [
  {
    heading: "1. Postanowienia ogólne",
    paragraphs: [
      `Niniejszy regulamin określa zasady korzystania ze strony internetowej ${site.url} oraz ogólne warunki świadczenia usług marketingowych, produkcyjnych i wdrożeniowych przez ${legal.entity.name} (${legal.entity.form}), NIP: ${legal.entity.nip}, REGON: ${legal.entity.regon}, adres siedziby: ${legal.entity.address} ("Usługodawca").`,
      "Szczegółowy zakres, cena i czas trwania konkretnej współpracy (w tym pakietu AUTOPILOT lub usług à la carte) są każdorazowo ustalane indywidualnie i potwierdzane odrębną umową lub ofertą zaakceptowaną przez klienta — niniejszy regulamin ma zastosowanie uzupełniające, w zakresie nieuregulowanym umową.",
    ],
  },
  {
    heading: "2. Usługi",
    paragraphs: [
      "Usługodawca świadczy usługi z zakresu płatnych kampanii reklamowych (Meta Ads, Google Ads), prowadzenia mediów społecznościowych i produkcji wideo, PR i brandingu, projektowania stron internetowych oraz wdrażania automatyzacji opartych o AI.",
      "Zakres poszczególnych usług opisany na stronie ma charakter informacyjny i poglądowy — nie stanowi oferty w rozumieniu art. 66 Kodeksu cywilnego, a zaproszenie do rozpoczęcia negocjacji i przygotowania indywidualnej wyceny.",
    ],
  },
  {
    heading: "3. Zawarcie i czas trwania umowy",
    paragraphs: [
      "Umowa o świadczenie usług zostaje zawarta w momencie pisemnego (w tym elektronicznego) potwierdzenia warunków współpracy przez obie strony.",
      "Czas trwania współpracy jest ustalany indywidualnie z klientem i wskazany w umowie lub potwierdzeniu zamówienia.",
    ],
  },
  {
    heading: "4. Płatności",
    paragraphs: [
      "Warunki płatności (kwota, waluta, terminy, forma rozliczenia — jednorazowa lub cykliczna) są określane indywidualnie w umowie lub potwierdzeniu zamówienia z klientem.",
      "Zasady rezygnacji, odstąpienia i zwrotów dla usług rozliczanych cyklicznie opisuje odrębna Polityka zwrotów.",
    ],
  },
  {
    heading: "5. Odpowiedzialność",
    paragraphs: [
      "Usługodawca dokłada należytej staranności przy realizacji usług, jednak nie gwarantuje konkretnych wyników biznesowych (np. określonego wzrostu sprzedaży czy liczby rezerwacji) — efekty kampanii marketingowych zależą od wielu czynników niezależnych od Usługodawcy, w tym od rynku, konkurencji, oferty i decyzji klienta.",
      "Usługodawca nie ponosi odpowiedzialności za treści i materiały przekazane przez klienta do wykorzystania w ramach usług (np. zdjęcia, opisy usług, dane produktowe).",
    ],
  },
  {
    heading: "6. Własność intelektualna",
    paragraphs: [
      "Prawa do materiałów (grafik, wideo, tekstów, kodu strony) wytworzonych w ramach realizacji usługi przechodzą na klienta po dokonaniu pełnej zapłaty za daną usługę, chyba że umowa stanowi inaczej.",
    ],
  },
  {
    heading: "7. Reklamacje",
    paragraphs: [
      `Reklamacje dotyczące świadczonych usług można zgłaszać na adres ${contact.email}, podając opis zastrzeżeń oraz oczekiwany sposób rozpatrzenia reklamacji. Reklamacja zostanie rozpatrzona w terminie 14 dni od dnia jej otrzymania.`,
    ],
  },
  {
    heading: "8. Postanowienia końcowe",
    paragraphs: [
      "W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego, w tym Kodeksu cywilnego.",
      "Usługodawca zastrzega sobie prawo do zmiany regulaminu — zmiany nie mają wpływu na warunki umów zawartych przed ich wejściem w życie.",
    ],
  },
];

export default function TermsPage() {
  return <LegalPage eyebrow="Prawnie" title="Regulamin" sections={sections} />;
}
