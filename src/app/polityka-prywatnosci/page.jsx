import LegalPage from "@/components/LegalPage";
import { site, contact, legal } from "@/data/content";

export const metadata = {
  title: "Polityka prywatności",
  alternates: { canonical: "/polityka-prywatnosci" },
  robots: { index: false, follow: false },
};

const sections = [
  {
    heading: "1. Administrator danych",
    paragraphs: [
      `Administratorem danych osobowych zbieranych za pośrednictwem strony ${site.url} jest ${legal.entity.name} (${legal.entity.form}), NIP: ${legal.entity.nip}, REGON: ${legal.entity.regon}, z siedzibą pod adresem: ${legal.entity.address}.`,
      `Kontakt w sprawach dotyczących przetwarzania danych osobowych: ${contact.email}.`,
    ],
  },
  {
    heading: "2. Jakie dane zbieramy i w jakim celu",
    paragraphs: [
      "Strona nie posiada formularza kontaktowego — kontakt inicjujesz samodzielnie klikając link e-mail lub telefon, przez co dane, które nam przekazujesz (adres e-mail, treść wiadomości, numer telefonu), pochodzą bezpośrednio od Ciebie i trafiają odpowiednio do naszej skrzynki pocztowej lub operatora telekomunikacyjnego.",
      "Nie zbieramy żadnych innych danych osobowych automatycznie za pośrednictwem tej strony poza podstawowymi, zanonimizowanymi statystykami technicznymi hostingu (np. logi serwera) — patrz sekcja 4.",
    ],
    list: [
      "Podstawa prawna: art. 6 ust. 1 lit. b RODO (podjęcie działań przed zawarciem umowy / w celu jej zawarcia) oraz lit. f RODO (prawnie uzasadniony interes — odpowiedź na zapytanie).",
    ],
  },
  {
    heading: "3. Okres przechowywania danych",
    paragraphs: [
      "Dane przekazane w ramach korespondencji e-mail lub rozmowy telefonicznej przechowujemy przez czas niezbędny do realizacji celu, w którym zostały przekazane, a następnie przez okres wynikający z przepisów prawa (np. podatkowych, jeśli doszło do zawarcia umowy).",
    ],
  },
  {
    heading: "4. Pliki cookie i technologie śledzące",
    paragraphs: [
      "Aktualny stan: strona nie wykorzystuje własnych plików cookie analitycznych ani reklamowych i nie ma wgranych żadnych zewnętrznych narzędzi śledzących (Google Analytics, Meta Pixel, TikTok Pixel itp.). Jedyny zapis w przeglądarce to Twój wybór w banerze zgody na cookies, przechowywany lokalnie (localStorage), niezbędny do tego, by baner nie pojawiał się przy każdej wizycie.",
      "Jeśli w przyszłości wdrożymy narzędzia analityczne lub reklamowe, ta polityka oraz Polityka cookies zostaną zaktualizowane przed ich uruchomieniem, a odpowiednie skrypty będą ładowane dopiero po wyrażeniu zgody w banerze cookies.",
    ],
  },
  {
    heading: "5. Odbiorcy danych",
    paragraphs: [
      "Dane mogą być przekazywane podmiotom świadczącym na naszą rzecz usługi hostingowe, pocztowe lub księgowe, wyłącznie w zakresie niezbędnym do realizacji tych usług i na podstawie zawartych z nimi umów powierzenia przetwarzania danych.",
    ],
  },
  {
    heading: "6. Twoje prawa",
    paragraphs: ["Zgodnie z RODO przysługuje Ci prawo do:"],
    list: [
      "dostępu do swoich danych oraz otrzymania ich kopii,",
      "sprostowania (poprawiania) danych,",
      "usunięcia lub ograniczenia przetwarzania danych,",
      "wniesienia sprzeciwu wobec przetwarzania,",
      "przenoszenia danych,",
      "wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.",
    ],
  },
  {
    heading: "7. Kontakt",
    paragraphs: [`W sprawach dotyczących ochrony danych osobowych napisz na ${contact.email}.`],
  },
];

export default function PrivacyPolicyPage() {
  return <LegalPage eyebrow="Prawnie" title="Polityka prywatności" sections={sections} />;
}
