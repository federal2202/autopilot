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
  { label: "Partnerzy", href: "#partnerzy" },
  { label: "Kontakt", href: "#kontakt" },
];

export const hero = {
  eyebrow: "Jedna subskrypcja. Kompletny wizerunek.",
  headingParts: ["Auto", "pilot"],
  heading: "Autopilot",
  lead: "Dedykowany film, sesja zdjęciowa i strona internetowa Twojego biznesu.",
  ctas: [
    { label: "Zobacz ofertę", href: "#oferta", kind: "primary" },
    { label: "Umów rozmowę", href: "#kontakt", kind: "secondary" },
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
      badge: "Flagowa usługa",
      name: "Dedykowany Film Dokumentalny",
      bullets: ["Twoja historia, opowiedziana od A do Z", "Kamera, scenariusz, montaż kinowy", "Co miesiąc nowe Shorts i Rolki"],
    },
    {
      name: "Sesja Zdjęciowa",
      bullets: ["Miejsce, zespół i usługi w kadrze", "Gotowe do strony i social media", "Spójny, kinowy styl"],
    },
    {
      name: "Nowoczesna Strona WWW",
      bullets: ["Zaprojektowana pod Twój biznes", "Film, zdjęcia i marka w jednym miejscu", "Pierwsze wrażenie, które konwertuje"],
    },
  ],
  cta: { label: "Zamów Autopilota", href: "#kontakt" },
};

export const partners = {
  eyebrow: "Km 160 — sojusznicy",
  heading: "Partnerzy sprzętowi i lifestyle'owi",
  subtext: "Ekipa, dzięki której każda produkcja wychodzi z warsztatu na najwyższym poziomie.",
  list: [
    {
      name: "PROZONE.RENT",
      badge: "Partner sprzętowy",
      logo: "/partners/prozone-rent.png",
      description:
        "Technologiczne serce naszego studia. Dzięki udostępnianym przez nich **profesjonalnym kamerom i mikrofonom**, każda nasza produkcja zyskuje kinową jakość.",
      href: "https://prozone.rent",
      cta: "Strona partnera",
    },
    {
      name: "COFFEELAB",
      badge: "Partner",
      logo: "/partners/coffeelab.png",
      description:
        "Rzemieślnicza palarnia kawy specialty — dla nich, tak jak dla nas, liczy się **proces, pasja i dbałość o detal**.",
      href: "https://coffeelab.pl",
      cta: "Sklep partnera",
    },
    {
      name: "INSPIRED by ID",
      badge: "Partner",
      logo: "/partners/id-logo.png",
      description:
        "Marka premium stawiająca na **jakość wykonania i ponadczasowy design** — wartości, które widać w każdej naszej produkcji.",
      href: "https://www.inspiredbyid.com/",
      cta: "Sklep partnera",
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
