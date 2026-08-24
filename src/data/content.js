// Źródło prawdy dla całej treści serwisu — edytuj tekst tutaj, nie w komponentach.

export const site = {
  name: "AR Autopilot",
  title: "AR Autopilot — system subskrypcyjny dla marek i lokali",
  description:
    "AR Autopilot to agencja marketingowa, która stawia Twój rozwój na autopilocie: profesjonalna produkcja wideo i foto, montaż, prowadzenie social media, poszukiwanie współprac i dedykowane strony internetowe.",
  url: "https://www.ar-autopilot.pl",
  locale: "pl_PL",
};

export const contact = {
  eyebrow: "Kontrola misji",
  heading: "Włącz autopilota",
  subtext:
    "Masz lokal, klinikę, siłownię albo markę osobistą? Napisz — dobierzemy pakiet i ustawimy kurs razem.",
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
  { label: "Segmenty", href: "#segmenty" },
  { label: "Usługi pojedyncze", href: "#usluGi" },
  { label: "Partnerzy", href: "#partnerzy" },
  { label: "Kontakt", href: "#kontakt" },
];

export const hero = {
  eyebrow: "System subskrypcyjny & oferta usług",
  heading: "Autopilot",
  lead:
    "Nowoczesna wizytówka agencji: pakiety abonamentowe i usługi dedykowane, które przyspieszają wzrost Twojego lokalu, kliniki, siłowni czy marki osobistej.",
  chipTop: {
    text: "Profesjonalny sprzęt, montaż i social media — bez zarządzania zespołem po Twojej stronie.",
  },
  chipBottom: {
    text: "Ty prowadzisz biznes. My prowadzimy jego wizerunek.",
  },
  ctas: [
    { label: "Zobacz pakiety", href: "#segmenty", kind: "primary" },
    { label: "Usługi pojedyncze", href: "#usluGi", kind: "secondary" },
    { label: "Napisz do nas", href: "#kontakt", kind: "ghost" },
  ],
};

// Etapy trasy autopilota — napędzają scrollową sekcję GrowthPath.
export const growthPath = {
  eyebrow: "Jak działa autopilot",
  heading: "Jedna trasa, cztery etapy",
  subtext: "Każdy pakiet przejeżdża tę samą, sprawdzoną trasę do widoczności.",
  stops: [
    {
      km: "01",
      word: "Produkcja",
      title: "Produkcja",
      text: "Profesjonalne kamery filmowe i aparaty na miejscu — nagrania i sesje, które budują kinowy wizerunek.",
    },
    {
      km: "02",
      word: "Montaż",
      title: "Montaż",
      text: "Zaawansowany montaż wideo w programach klasy profesjonalnej — z materiału robimy historię.",
    },
    {
      km: "03",
      word: "Zasięgi",
      title: "Social media",
      text: "Analiza, prowadzenie i podnoszenie jakości profilu — zasięgi rosną, bo rośnie jakość.",
    },
    {
      km: "04",
      word: "Premiera",
      title: "Web & współprace",
      text: "Dedykowana strona internetowa, automatyzacja procesów i aktywne poszukiwanie partnerstw — domykamy pełny obraz marki.",
    },
  ],
};

export const segments = {
  eyebrow: "Km 0 — wybierz trasę",
  heading: "Trzy segmenty, jeden autopilot",
  subtext:
    "Każdy pakiet ma jasno rozpisany zakres korzyści — od sprzętu filmowego, przez montaż, po social media i web dev.",
  list: [
    {
      id: "gastronomia",
      label: "Gastronomia & Lokale",
      shortLabel: "Gastronomia",
      heading: "Gastronomia & Lokale Usługowe",
      subtext: "Restauracje, barberzy i kawiarnie — pakiety budujące tłum i przyciągające klientów.",
      packages: [
        {
          name: "Magnes & Echo",
          niche: "Restauracja",
          bullets: [
            "Profesjonalne kamery filmowe i aparaty fotograficzne",
            "Zaawansowany montaż wideo budujący apetyczny wizerunek",
            "Kompleksowa analiza i prowadzenie mediów społecznościowych",
            "Stworzenie spersonalizowanej strony internetowej",
          ],
        },
        {
          name: "Autopilot Tłumu",
          niche: "Barber",
          bullets: [
            "Dynamiczne materiały z profesjonalnych kamer i aparatów",
            "Wysokiej jakości montaż wideo przyciągający klientów",
            "Optymalizacja wyglądu i jakości profilu w social media",
            "Spersonalizowana strona www z systemem rezerwacji",
          ],
        },
        {
          name: "Magnes Klientów",
          niche: "Kawiarnia",
          bullets: [
            "Klimatyczne sesje zdjęciowe i filmowe profesjonalnym sprzętem",
            "Montaż krótkich form wideo budujących społeczność",
            "Strategiczna poprawa estetyki profilu i jakości treści",
            "Dedykowana strona internetowa dla Twojego lokalu",
          ],
        },
      ],
    },
    {
      id: "zdrowie",
      label: "Zdrowie, Ruch & Fitness",
      shortLabel: "Zdrowie & Fitness",
      heading: "Zdrowie, Ruch & Fitness",
      subtext: "Kliniki, trenerzy i siłownie — pakiety budujące fundament, progres i ruch.",
      packages: [
        {
          name: "Fundament & Progres",
          niche: "Klinika Fizjoterapii",
          bullets: [
            "Wysokiej klasy produkcja wideo i foto sprzętem filmowym",
            "Montaż materiałów edukacyjnych i wizerunkowych",
            "Budowanie autorytetu i profesjonalnego PR-u profilu",
            "Aktywne szukanie współprac i spersonalizowana strona www",
          ],
        },
        {
          name: "Autopilot Ruchu",
          niche: "Trenerzy / Fizjoterapeuci",
          bullets: [
            "Profesjonalne nagrania z sesji i treningów",
            "Dynamiczny montaż angażujących materiałów",
            "Analiza profilu i podniesienie jakości wizualnej",
            "Stworzenie nowoczesnej strony internetowej marki",
          ],
        },
        {
          name: "Autopilot Progresu",
          niche: "Siłownia",
          bullets: [
            "Pełna produkcja filmowa i fotograficzna na obiekcie",
            "Profesjonalny montaż motywacyjnych materiałów wideo",
            "Rozwój zasięgów, analiza i pozyskiwanie partnerstw",
            "Dedykowana, responsywna strona internetowa",
          ],
        },
      ],
    },
    {
      id: "marki",
      label: "Marki Osobiste & Twórcy",
      shortLabel: "Marki Osobiste",
      heading: "Marki Osobiste & Twórcy",
      subtext: "Sportowcy, podróżnicy i projektanci odzieży — pełny autopilot wizerunkowy i kinowa jakość.",
      packages: [
        {
          name: "Autopilot Marki",
          niche: "Sportowcy",
          bullets: [
            "Kinowa jakość nagrań z profesjonalnych kamer i aparatów",
            "Montaż materiałów podkreślających sportową sylwetkę i sukces",
            "Kompleksowy PR profilu i pozyskiwanie lukratywnych współprac",
            "Spersonalizowana strona internetowa budująca markę",
          ],
        },
        {
          name: "Autopilot Podróży",
          niche: "Podróżnicy",
          bullets: [
            "Zapierające dech w piersiach materiały filmowe i zdjęcia",
            "Montaż wideo w profesjonalnych programach edycyjnych",
            "Analiza zasięgów, optymalizacja profilu i monetyzacja",
            "Autorska strona internetowa prezentująca wyprawy",
          ],
        },
        {
          name: "Autopilot Projektu",
          niche: "Projektanci Odzieży",
          bullets: [
            "Profesjonalne sesje lookbookowe i filmowe kampanie",
            "Montaż dynamicznych shortów i rolek produktowych",
            "Strategia wizerunkowa i szukanie strategicznych partnerstw",
            "Nowoczesny sklep / strona internetowa marki odzieżowej",
          ],
        },
      ],
    },
  ],
};

export const singleServices = {
  eyebrow: "Poza abonamentem",
  heading: "Oferta usług pojedynczych",
  subtext: "Nie potrzebujesz pełnego pakietu? Wybierz punktowe wsparcie.",
  list: [
    {
      name: "Film Promocyjny",
      niche: "Dla usługi / osoby",
      bullets: [
        "Nagranie profesjonalnymi kamerami i aparatami",
        "Wysokiej jakości montaż w profesjonalnych programach",
        "Analiza wizualna i dopasowanie do grupy docelowej",
      ],
    },
    {
      name: "Analiza Profilu",
      niche: "Audyt & Strategia",
      bullets: [
        "Szczegółowa rozmowa analizująca media społecznościowe",
        "Konkretne sugestie dalszych kroków i poprawy wizerunku",
        "Strategia rozwoju i zwiększania konwersji",
      ],
    },
    {
      name: "Strona WWW & Sesja",
      niche: "Cyfrowy Wizerunek",
      bullets: [
        "Stworzenie spersonalizowanej, nowoczesnej strony internetowej",
        "Profesjonalna sesja zdjęciowa wysokiej jakości",
        "Kompleksowe podniesienie estetyki i jakości wizualnej",
      ],
    },
  ],
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
  heading: "Kompleksowy partner Twojego sukcesu online",
  text: "Wybierz swój pakiet i przyspiesz swój wzrost.",
  cta: { label: "Wybierz swój pakiet", href: "#segmenty" },
};

export const footer = {
  tagline: "Ustaw kurs. My poprowadzimy.",
  rightsLine: "AR Autopilot. Wszelkie prawa zastrzeżone.",
};
