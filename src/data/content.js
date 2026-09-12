// Źródło prawdy dla całej treści serwisu — edytuj tekst tutaj, nie w komponentach.

export const site = {
  name: "AR Autopilot",
  title: "AR Autopilot — Film, sesja i strona WWW w jednej subskrypcji",
  description:
    "AR Autopilot tworzy dla Twojego biznesu dedykowany film dokumentalny, montuje z niego Shorts i Rolki, robi profesjonalną sesję zdjęciową i buduje nowoczesną stronę internetową — wszystko w jednej miesięcznej subskrypcji.",
  url: "https://www.ar-autopilot.pl",
  locale: "pl_PL",
};

export const contact = {
  eyebrow: "Kontrola misji",
  heading: "Włącz autopilota",
  subtext: "Masz lokal, klinikę, siłownię albo markę osobistą? Napisz — ustalimy szczegóły produkcji i ustawimy kurs razem.",
  email: "kontakt@ar-autopilot.pl",
  emailLabel: "Napisz do nas bezpośrednio",
  emailCta: "Napisz e-mail",
  phone: {
    name: "Stanisław Dękierowski",
    number: "+48 574 350 159",
    display: "574 350 159",
  },
};

export const navLinks = [
  { label: "Oferta", href: "#oferta" },
  { label: "Jak to działa", href: "#jak-to-dziala" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

export const hero = {
  headingParts: ["Auto", "pilot"],
  // Big pinned statement further down the page (PinnedTagline.jsx) —
  // separate from the hero's own tagline below.
  lead: "Dedykowany film, sesja zdjęciowa i strona internetowa Twojego biznesu.",
  // Sales-pitch line under the hero wordmark itself, replacing the old
  // eyebrow/lead/CTA cluster — nbnzia's hero is wordmark-only, so the
  // only text living inside Hero.jsx now is this one short statement.
  tagline: [
    "Twój biznes zasługuje na wizerunek, który działa sam.",
    "My go zbudujemy — i ustawimy na autopilocie.",
  ],
};

// Krótki pas faktów + akapit "o nas" — odpowiednik sekcji stat-strip/about
// w referencji. Same sformułowania z hero/offer, przełożone na nowy kształt.
export const intro = {
  stats: ["Jedna subskrypcja.", "Film. Sesja. Strona.", "Zero dopłat.", "Co miesiąc nowe materiały."],
  about:
    "AR Autopilot tworzy dla Twojego biznesu dedykowany film dokumentalny, montuje z niego Shorts i Rolki, robi profesjonalną sesję zdjęciową i buduje nowoczesną stronę internetową — wszystko w jednej miesięcznej subskrypcji.",
};

// Etapy trasy autopilota — napędzają sekcję ProcessSteps.
export const growthPath = {
  eyebrow: "Jak działa autopilot",
  heading: "Jeden film, cztery etapy",
  subtext: "Tak powstaje Twój Autopilot — od pierwszego ujęcia po gotową stronę internetową.",
  teaser: "Każdy etap prowadzi do jednego celu — gotowego wizerunku Twojej marki.",
  stops: [
    {
      km: "01",
      word: "Produkcja",
      title: "Produkcja filmu i sesji",
      text: "Kręcimy Twój film i sesję zdjęciową — profesjonalnym sprzętem, na miejscu.",
      tags: ["Kamera", "Dźwięk", "Sesja zdjęciowa", "Scenariusz"],
    },
    {
      km: "02",
      word: "Montaż",
      title: "Kinowy montaż",
      text: "Z materiału montujemy pełnoprawny film dokumentalny, gotowy na YouTube.",
      tags: ["Montaż kinowy", "Kolorystyka", "Muzyka"],
    },
    {
      km: "03",
      word: "Shorts",
      title: "Shorts & Rolki",
      text: "Ten sam materiał tniemy na Shorts i Rolki — bez dodatkowych sesji.",
      tags: ["Shorts", "Rolki", "Cięcie pionowe", "Napisy"],
    },
    {
      km: "04",
      word: "Premiera",
      title: "Strona WWW",
      text: "Strona internetowa spina film, zdjęcia i markę w jedną całość.",
      tags: ["Projekt strony", "Wdrożenie", "Media", "Publikacja"],
    },
  ],
};

export const offer = {
  eyebrow: "Jedna usługa. Zero wyboru.",
  heading: "Twój wizerunek w jednej subskrypcji",
  subtext: "Bez pakietów. Bez dopłat. Film, zdjęcia i strona — razem.",
  items: [
    {
      name: "Dedykowany Film Dokumentalny",
      description:
        "Kręcimy Twoją historię od pierwszego ujęcia po ostatnie cięcie — kamera, scenariusz i montaż kinowy w jednym pakiecie. Z tego samego materiału co miesiąc wycinamy nowe Shorts i Rolki, więc Twój kanał nigdy nie stoi w miejscu.",
    },
    {
      name: "Sesja Zdjęciowa",
      description:
        "Fotografujemy Twoje miejsce, zespół i usługi w spójnym, kinowym stylu — gotowe od razu pod stronę WWW i social media, bez dodatkowej obróbki po Twojej stronie.",
    },
    {
      name: "Nowoczesna Strona WWW",
      description:
        "Projektujemy stronę dopasowaną do Twojego biznesu, która spina film, zdjęcia i markę w jedną spójną całość — pierwsze wrażenie, które realnie zamienia odwiedzających w klientów.",
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
      question: "Czy mogę anulować subskrypcję w dowolnym momencie?",
      answer:
        "Tak. Subskrypcja jest miesięczna i możesz ją anulować w dowolnym momencie — bez umów długoterminowych i bez kar za rezygnację.",
    },
    {
      question: "Ile trwa pierwszy cykl produkcji?",
      answer:
        "Pierwszy film, sesja zdjęciowa i szkic strony są zwykle gotowe w ciągu 2–3 tygodni od dnia nagrania materiału.",
    },
    {
      question: "Ile poprawek jest wliczonych w cenę?",
      answer:
        "Każdy projekt obejmuje dwie rundy poprawek — dopracowujemy montaż, zdjęcia i stronę, aż efekt Ci odpowiada.",
    },
    {
      question: "Co jeśli materiał mi się nie spodoba?",
      answer:
        "Pracujemy na bieżąco z Twoim feedbackiem podczas montażu. Jeśli coś nie gra, poprawiamy to w ramach tej samej subskrypcji — nie zaczynasz od zera na dodatkowy koszt.",
    },
    {
      question: "Czy potrzebuję własnej osoby na planie podczas nagrania?",
      answer: "Nie. Nasza ekipa prowadzi cały dzień zdjęciowy od początku do końca — Ty po prostu prowadzisz swój biznes jak zwykle.",
    },
    {
      question: "Dla kogo to nie jest dobre rozwiązanie?",
      answer:
        "Jeśli szukasz jednorazowej sesji bez regularnych nowych materiałów, lepiej sprawdzi się zwykłe zlecenie. Autopilot jest dla biznesów, które chcą stałego dopływu treści co miesiąc.",
    },
  ],
};

export const closing = {
  eyebrow: "Cel podróży",
  heading: "Film, zdjęcia i strona, które sprzedają Twój biznes",
  text: "Jedna subskrypcja. Zero decyzji o pakietach — tylko efekt.",
  cta: { label: "Zamów Autopilota", href: "#kontakt" },
};

export const footer = {
  tagline: "Ustaw kurs. My poprowadzimy.",
  rightsLine: "AR Autopilot. Wszelkie prawa zastrzeżone.",
};
