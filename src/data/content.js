// Źródło prawdy dla całej treści serwisu — edytuj tekst tutaj, nie w komponentach.

export const site = {
  name: "AR Autopilot",
  title: "AR Autopilot — Rolki, strona WWW i automatyzacje dla Twojej firmy",
  description:
    "AR Autopilot nagrywa Rolki, prowadzi social media, buduje profesjonalne strony WWW i wdraża automatyzacje dla Twojej firmy. Pakiet AUTOPILOT albo usługi osobno — dopasowane do Twoich potrzeb.",
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
  // Big pinned statement further down the page (PinnedTagline.jsx) —
  // separate from the hero's own tagline below.
  lead: "Zamieniamy Twoją stronę z przedpotopowego PowerPointa w maszynę, która pracuje za Ciebie w Google.",
  // Sales-pitch line under the hero wordmark itself, replacing the old
  // eyebrow/lead/CTA cluster — nbnzia's hero is wordmark-only, so the
  // only text living inside Hero.jsx now is this one short statement.
  tagline: [
    "Nie masz czasu na social media i marketing?",
    "My robimy to za Ciebie — Ty zarabiasz więcej.",
  ],
};

// Krótki pas faktów + akapit "o nas" — odpowiednik sekcji stat-strip/about
// w referencji. Same sformułowania z hero/offer, przełożone na nowy kształt.
export const intro = {
  stats: ["Pakiet AUTOPILOT.", "Rolki. Strona. Automatyzacje.", "Albo usługi osobno.", "Warunki dopasowane do Ciebie."],
  about:
    "AR Autopilot to pełen zestaw dla Twojej firmy: Rolki i social media, profesjonalna strona WWW, automatyzacje i sesje zdjęciowe. Weź cały pakiet AUTOPILOT albo zamów tylko to, czego potrzebujesz.",
  ctaPrimary: { label: "Porozmawiajmy", href: "#kontakt" },
  ctaSecondary: { label: "Zobacz ofertę", href: "#oferta" },
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
  eyebrow: "Cała oferta AR Autopilot",
  heading: "Pakiet AUTOPILOT — albo usługi osobno",
  subtext:
    "Rekomendujemy pełny pakiet AUTOPILOT. Możesz też zamówić dowolną usługę osobno, np. samą stronę i Rolki albo samą stronę i automatyzacje — dogadujemy się indywidualnie pod Twoją firmę.",
  items: [
    {
      name: "Rolki & Social Media",
      description:
        "Nagrywamy Twoje produkty i usługi, montujemy Rolki i Shorts i prowadzimy Twoje profile w social mediach, kiedy Ty nie masz na to czasu.",
      thumb: "/pc1.JPG",
    },
    {
      name: "Strony WWW",
      description:
        "Zamieniamy amatorskie strony w profesjonalne i widoczne w Google. Stawiamy sklepy, wdrażamy rezerwację terminów (fizjoterapeuci, prawnicy, doradcy podatkowi, kawiarnie, nauczyciele angielskiego) i podpinamy przekierowania do zewnętrznych systemów rezerwacji, np. Booksy.",
      thumb: "/pc2.JPG",
    },
    {
      name: "Automatyzacje",
      description:
        "Auto-responder w wiadomościach i komentarzach (np. ktoś pisze hasło, a system sam wysyła link na priv), asystent głosowy na telefonie/infolinii i automatyzacja publikacji — oszczędzasz czas i koszt sekretarki.",
      thumb: "/pc3.JPG",
    },
    {
      name: "Oprawa fotograficzna",
      description:
        "Profesjonalne sesje zdjęciowe Twoich produktów, zespołu i miejsca — gotowe od razu pod stronę WWW i social media.",
      thumb: "/pc4.JPG",
    },
    {
      name: "Film dokumentalny Premium",
      description:
        "Ekskluzywny, pełnometrażowy format w stylu Netflixa dla dużych marek, klubów sportowych i firm z prawdziwą, głęboką historią do opowiedzenia. To nie jest usługa dla zwykłego gabinetu.",
      thumb: "/pc5.JPG",
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
  heading: "Film, zdjęcia i strona, które sprzedają Twój biznes",
  text: "Pakiet AUTOPILOT albo pojedyncza usługa — Ty wybierasz, my dowozimy efekt.",
  cta: { label: "Zamów Autopilota", href: "#kontakt" },
};

export const footer = {
  tagline: "Ustaw kurs. My poprowadzimy.",
  rightsLine: "AR Autopilot. Wszelkie prawa zastrzeżone.",
  // Prozone.rent — wypożyczalnia sprzętu filmowego/fotograficznego (Warszawa),
  // znaleziona na prośbę klienta ("możesz sam znaleźć stronę Prozone Rent").
  techPartner: { label: "Prozone Rent", url: "https://prozone.rent/" },
};
