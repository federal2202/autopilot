import LegalPage from "@/components/LegalPage";
import { contact } from "@/data/content";

export const metadata = {
  title: "Polityka zwrotów",
  alternates: { canonical: "/polityka-zwrotow" },
  robots: { index: false, follow: false },
};

const sections = [
  {
    heading: "1. Zakres",
    paragraphs: [
      "Niniejsza polityka dotyczy zwrotów i rezygnacji z usług pakietu AUTOPILOT oraz usług à la carte świadczonych na podstawie indywidualnej umowy lub potwierdzonej oferty. Szczegółowe warunki finansowe konkretnej współpracy zawsze określa umowa zawarta z klientem — poniższe zasady mają zastosowanie w zakresie, w jakim umowa nie stanowi inaczej.",
    ],
  },
  {
    heading: "2. Prawo odstąpienia od umowy (konsumenci i przedsiębiorcy na prawach konsumenta)",
    paragraphs: [
      "Jeśli zawierasz umowę jako konsument lub osoba fizyczna prowadząca działalność gospodarczą zawierająca umowę bezpośrednio niezwiązaną z jej działalnością zawodową, przysługuje Ci prawo odstąpienia od umowy zawartej na odległość w terminie 14 dni od jej zawarcia, bez podawania przyczyny, zgodnie z ustawą o prawach konsumenta.",
      "Jeżeli na Twoje wyraźne żądanie realizacja usługi rozpocznie się przed upływem terminu do odstąpienia od umowy, jesteś zobowiązany/a do zapłaty za świadczenia spełnione do chwili odstąpienia od umowy.",
      "Prawo odstąpienia nie przysługuje przedsiębiorcom zawierającym umowę w bezpośrednim związku z prowadzoną przez nich działalnością gospodarczą.",
    ],
  },
  {
    heading: "3. Rezygnacja z usług rozliczanych cyklicznie",
    paragraphs: [
      "Dla usług rozliczanych w modelu cyklicznym (np. abonamentowym) wypowiedzenie współpracy na przyszłe okresy rozliczeniowe następuje z zachowaniem okresu wypowiedzenia wskazanego w umowie. Wypowiedzenie nie uprawnia do zwrotu opłat już należnych za bieżący okres rozliczeniowy, w trakcie którego usługi były lub są świadczone.",
    ],
  },
  {
    heading: "4. Usługi zrealizowane i materiały wykonane na indywidualne zamówienie",
    paragraphs: [
      "Zwrot nie przysługuje w zakresie usług już w pełni wykonanych (np. zrealizowanej kampanii reklamowej, dostarczonych materiałów wideo/graficznych, wdrożonej automatyzacji), zgodnie z art. 38 pkt 1 i 3 ustawy o prawach konsumenta.",
    ],
  },
  {
    heading: "5. Jak zgłosić odstąpienie lub rezygnację",
    paragraphs: [
      `Aby odstąpić od umowy lub zrezygnować z usługi, wyślij oświadczenie na adres ${contact.email}, podając dane umożliwiające identyfikację umowy (imię i nazwisko/nazwa firmy, data zawarcia umowy, zakres usługi).`,
      "Zwrot płatności, jeśli jest należny, następuje w terminie 14 dni od otrzymania oświadczenia, przy użyciu tego samego sposobu płatności, jaki został użyty pierwotnie, chyba że uzgodniono inaczej.",
    ],
  },
];

export default function RefundPolicyPage() {
  return <LegalPage eyebrow="Prawnie" title="Polityka zwrotów" sections={sections} />;
}
