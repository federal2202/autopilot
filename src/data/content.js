// Źródło prawdy dla całej treści serwisu — edytuj tekst tutaj, nie w komponentach.

export const site = {
  name: "AR Autopilot",
  title: "AR Autopilot — Full-Stack Media & Automation Studio",
  description:
    "Przejmujemy kompleksowo media społecznościowe, produkcję kinowego wideo, kampanie Meta i Google Ads, PR oraz Design & Tech. Wdrażamy automatyzacje AI, które zamieniają odbiorców w płacących klientów 24/7.",
  url: "https://www.ar-autopilot.pl",
  locale: "pl_PL",
};

export const contact = {
  eyebrow: "Kontrola misji",
  heading: "Włącz autopilota",
  subtext: "Porozmawiajmy o Twojej marce i wprowadźmy Twój biznes na najwyższy poziom.",
  email: "kontakt@ar-autopilot.pl",
  emailLabel: "Napisz do nas bezpośrednio",
  emailCta: "Napisz e-mail",
  phone: {
    name: "Stanisław Dękierowski",
    number: "+48 574 350 159",
    display: "574 350 159",
    photo: "/stas.JPG",
    // "Napisana przez niego" wiadomość w pływającym CallWidget.jsx — stąd
    // pierwsza osoba, nie firmowe "Zadzwoń teraz".
    widgetMessage: "Cześć! 👋 Masz pytania o Autopilota? Zadzwoń, chętnie pomogę.",
  },
  // TODO: podaj link do Instagrama Autostrady Rozwoju (np.
  // "https://www.instagram.com/autostradarozwoju") — dopóki zostaje `null`,
  // Contact.jsx nie renderuje karty/ikony (patrz komentarz tam), żeby na
  // stronie nie wisiał martwy link.
  instagram: null,
};

export const navLinks = [
  { label: "Oferta", href: "#oferta" },
  { label: "Jak to działa", href: "#jak-to-dziala" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
  { label: "Podcast", href: "https://www.autostradarozwoju.pl/", external: true },
];

export const hero = {
  headingParts: ["Auto", "pilot"],
  // Big pinned statement further down the page (PinnedTagline.jsx) — the
  // "MANIFEST MARKI" quote from the client's copy doc, since it's the
  // single punchiest line and this component is built for exactly that.
  lead: "Koniec z szukaniem pięciu różnych agencji i marnowaniem godzin na manualne odpisywanie. Dajemy Ci święty spokój i skalowalny system przychodu.",
  // Sales-pitch line under the hero wordmark itself, replacing the old
  // eyebrow/lead/CTA cluster — nbnzia's hero is wordmark-only, so the
  // only text living inside Hero.jsx now is this one short statement.
  tagline: [
    "Ty zajmujesz się biznesem.",
    "My robimy resztę na autopilocie.",
  ],
};

// Krótki pas faktów + akapit "o nas" — odpowiednik sekcji stat-strip/about
// w referencji. Same sformułowania z hero/offer, przełożone na nowy kształt.
export const intro = {
  stats: ["Performance Marketing.", "Social Media & Wideo.", "PR & Design.", "Automatyzacje AI 24/7."],
  about:
    "Przejmujemy kompleksowo Twoje media społecznościowe, produkcję kinowego wideo, płatne kampanie reklamowe Meta i Google Ads, PR oraz Design & Tech. Wdrażamy inteligentne automatyzacje AI, które zamieniają odbiorców w płacących klientów 24/7.",
  ctaPrimary: { label: "Porozmawiajmy", href: "#kontakt" },
  ctaSecondary: { label: "Zobacz ofertę", href: "#oferta" },
};

// Nowa sekcja "NASZA FILOZOFIA" z tekstu klienta — nie miała dotąd własnego
// miejsca na stronie. Philosophy.jsx renderuje ją w stylu Aceternity UI
// "Google Gemini Effect" (referencja klienta): 3 krótkie podpisy, żadnych
// akapitów — sens niosą linie, które łączą je w jeden wspólny punkt.
export const philosophy = {
  eyebrow: "Nasza filozofia",
  heading: "Czas, liczby, jeden zespół",
  // Krótka fraza w plakietce, do której zbiegają się wszystkie 3 linie —
  // domyka wizualną metaforę "3 zasady → jeden zespół".
  convergeLabel: "Jeden zgrany zespół",
  items: [
    {
      title: "Czas to Twój największy kapitał",
      icon: "clock",
      accent: "orange",
    },
    {
      title: "Twarde liczby zamiast pustych obietnic",
      icon: "chart",
      accent: "orange",
    },
    {
      title: "Wszystko w jednym ręku",
      icon: "layers",
      accent: "navy",
    },
  ],
};

// Etapy trasy autopilota — napędzają sekcję ProcessSteps.
export const growthPath = {
  eyebrow: "Jak działamy",
  heading: "Od audytu do pełnego autopilota",
  subtext: "Od analizy do wdrożenia w prostych krokach.",
  teaser: "Każdy etap prowadzi do jednego celu — systemu, który pracuje na Twój zysk każdego dnia.",
  stops: [
    {
      km: "01",
      word: "Audyt",
      title: "Audyt i Strategia",
      text: "Weryfikujemy Twoje obecne kanały, ofertę i wąskie gardła. Przygotowujemy plan kampanii, contentu i wdrożenia technologii.",
      tags: ["Audyt kanałów", "Analiza oferty", "Strategia", "Plan contentu"],
    },
    {
      km: "02",
      word: "Wdrożenie",
      title: "Produkcja, Wdrożenie i Start Kampanii",
      text: "Tworzymy materiały wideo, konfigurujemy infrastrukturę reklamową, uruchamiamy automatyzacje oraz dedykowane strony.",
      tags: ["Produkcja wideo", "Kampanie reklamowe", "Automatyzacje", "Strony"],
    },
    {
      km: "03",
      word: "Autopilot",
      title: "Pełny Autopilot",
      text: "System działa w tle: reklamy i content przyciągają ruch, boty natychmiast obsługują zapytania, a do Ciebie trafiają opłacone rezerwacje i nowi klienci.",
      tags: ["Ruch", "Boty 24/7", "Rezerwacje", "Nowi klienci"],
    },
  ],
};

export const offer = {
  eyebrow: "Pełne wsparcie. Zero kompromisów.",
  heading: "Full-Stack Media & Automation Studio",
  subtext: "Nie jesteśmy zwykłą agencją od postów. Budujemy kompletną machinę wzrostu dla Twojej marki.",
  items: [
    {
      name: "Płatne Kampanie Reklamowe (Performance Marketing)",
      description:
        "Skuteczne kampanie Meta Ads i Google Ads projektowane pod jeden cel: maksymalny zwrot z inwestycji (ROAS). Pozyskujemy klientów gotowych do zakupu i natychmiast zapełniamy Twoje wolne terminy w grafikach.",
      thumb: "/pc1.JPG",
    },
    {
      name: "Prowadzenie Social Media & Kinowe Wideo",
      description:
        "Kompleksowe zarządzanie Twoimi profilami od A do Z. Tworzymy scenariusze, nagrywamy i montujemy wysokiej klasy rolki, które budują pozycję lidera w Twojej branży i generują potężne zasięgi organiczne.",
      thumb: "/pc2.JPG",
    },
    {
      name: "PR, Branding oraz Design & Tech (D&T)",
      description:
        "Pozycjonujemy Twoją markę w segmencie premium. Projektujemy nowoczesną identyfikację wizualną oraz błyskawiczne, konwertujące strony internetowe i landing page'e, przy których konkurencja wygląda przeciętnie.",
      thumb: "/pc3.JPG",
    },
    {
      name: "Automatyzacje AI & Obsługa Klienta 24/7",
      description:
        "System natychmiastowej konwersji w wiadomościach prywatnych i komentarzach. Zainteresowany klient w ułamku sekundy otrzymuje odpowiedź i bezpośredni link do Twojego systemu rezerwacji (Booksy, Fitssey, Medfile) — bez odrywania Ciebie od pracy. Budujemy też dowolne automatyzacje dopasowane pod Twój system — nie ograniczamy się do powyższych rozwiązań.",
      thumb: "/pc4.JPG",
    },
  ],
  cta: { label: "Zamów Autopilota", href: "#kontakt" },
};

export const faq = {
  eyebrow: "Zanim zaczniemy",
  heading: "Częste pytania",
  subtext: "Wszystko, co warto wiedzieć, zanim ustawisz swój biznes na autopilocie.",
  items: [
    {
      question: "Ile trwa współpraca?",
      answer:
        "Czas i zakres współpracy ustalamy indywidualnie, na podstawie potrzeb Twojej firmy — dogadujemy się na czas trwania umowy dopasowany do Ciebie.",
    },
    {
      question: "Ile poprawek jest wliczonych w cenę?",
      answer:
        "Przed publikacją każdy materiał wysyłamy do Ciebie do akceptacji. Jesteśmy otwarci na feedback i wprowadzamy poprawki, aż efekt będzie zgodny z Twoimi oczekiwaniami.",
    },
    {
      question: "Czy potrzebuję własnej osoby na planie zdjęciowym?",
      answer:
        "Tak — na planie zdjęciowym przedstawiającym daną usługę musi być obecny pracownik, który będzie ją wykonywał (np. fizjoterapeuta podczas zabiegu).",
    },
  ],
};

export const closing = {
  eyebrow: "Cel podróży",
  heading: "Przełącz marketing i sprzedaż na Autopilot",
  text: "Zdejmij z siebie operacyjny ciężar i zyskaj skalowalny system, który pracuje na Twój zysk każdego dnia.",
  cta: { label: "Zamów Autopilota", href: "#kontakt" },
};

export const footer = {
  tagline: "Ustaw kurs. My poprowadzimy.",
  rightsLine: "AR Autopilot. Wszelkie prawa zastrzeżone.",
  // Prozone.rent — wypożyczalnia sprzętu filmowego/fotograficznego (Warszawa),
  // znaleziona na prośbę klienta ("możesz sam znaleźć stronę Prozone Rent").
  techPartner: { label: "Prozone Rent", url: "https://prozone.rent/" },
};
