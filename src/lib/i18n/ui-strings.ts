import type { Locale } from "@/lib/i18n/locales";

/**
 * Navigation/CTA/section copy — small, fixed, code-adjacent strings that
 * ship with the app rather than living in the translations table (Task
 * 19 §30-31). Every locale must have an entry; locales without a real
 * translation fall back to English rather than showing an empty label,
 * but only English/German are populated with genuine copy today (see
 * data/maldives/i18n/translation-status.json for rollout status).
 *
 * `home` and `maldivesHub` mirror the section structure of the real
 * English pages (src/app/page.tsx, src/app/maldives/page.tsx) — every
 * section title/description/CTA label here has a matching section in
 * the English page, so the German homepage and hub render the same real
 * listings (atolls, resorts, activities, transfers, packages, articles)
 * with the same depth, just with German surrounding copy. The listings
 * themselves (resort names, activity titles, etc.) stay as their real,
 * un-translated entity data -- translating individual entities is
 * separate, larger follow-up work (see the Task 19 final report's
 * "remaining work" section), not something silently faked here.
 */
export interface UiStrings {
  nav: {
    maldives: string;
    stays: string;
    activities: string;
    diving: string;
    fishing: string;
    transfers: string;
    packages: string;
    travelGuide: string;
  };
  breadcrumbHome: string;
  ctaGetInTouch: string;
  languageSwitcherLabel: string;
  currencySwitcherLabel: string;
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
    ctaExplore: string;
    ctaPackages: string;
    statsAtolls: string;
    statsIslands: string;
    statsStays: string;
    destinationsEyebrow: string;
    destinationsTitle: string;
    destinationsDescription: string;
    destinationsCta: string;
    staysEyebrow: string;
    staysTitle: string;
    staysDescription: string;
    staysCta: string;
    staysHotelsLink: string;
    staysGuesthousesLink: string;
    activitiesEyebrow: string;
    activitiesTitle: string;
    activitiesDescription: string;
    activitiesCta: string;
    divingLink: string;
    fishingLink: string;
    surfingLink: string;
    attractionsEyebrow: string;
    attractionsTitle: string;
    attractionsDescription: string;
    attractionsCta: string;
    transfersEyebrow: string;
    transfersTitle: string;
    transfersDescription: string;
    transfersCta: string;
    transferCategoryAirport: string;
    transferCategorySpeedboat: string;
    transferCategoryIsland: string;
    packagesEyebrow: string;
    packagesTitle: string;
    packagesDescription: string;
    packagesCta: string;
    guideEyebrow: string;
    guideTitle: string;
    guideDescription: string;
    guideCta: string;
    finalCtaTitle: string;
    finalCtaDescription: string;
    finalCtaExplore: string;
    finalCtaWhatsapp: string;
  };
  maldivesHub: {
    heroEyebrow: string;
    introPrefix: string;
    introMiddle: string;
    introSuffix: string;
    atollsEyebrow: string;
    atollsTitle: string;
    atollsDescription: string;
    atollsCta: string;
    islandsTitle: string;
    islandsDescription: string;
    islandsCta: string;
    localIslandsTitle: string;
    localIslandsP1: string;
    localIslandsP2: string;
    localIslandsCtaIslands: string;
    localIslandsCtaOr: string;
    localIslandsCtaGuesthouses: string;
    exploreMoreTitle: string;
    statsAtolls: string;
    statsIslands: string;
  };
  travelGuideHub: {
    heroEyebrow: string;
    title: string;
    description: string;
    emptyStateTitle: string;
    comingSoonNote: string;
  };
  articleDetail: {
    minRead: string;
    relatedPlaces: string;
    relatedBookable: string;
    topic: string;
    relatedArticles: string;
    backToGuide: string;
  };
}

const EN: UiStrings = {
  nav: {
    maldives: "Maldives",
    stays: "Stays",
    activities: "Activities",
    diving: "Diving",
    fishing: "Fishing",
    transfers: "Transfers",
    packages: "Packages",
    travelGuide: "Travel Guide",
  },
  breadcrumbHome: "Home",
  ctaGetInTouch: "Get in touch",
  languageSwitcherLabel: "Language",
  currencySwitcherLabel: "Currency",
  home: {
    heroEyebrow: "Maldives Tour Guide",
    heroTitle: "A real, source-verified guide to the Maldives",
    heroDescription:
      "Atolls, islands, resorts, hotels and guesthouses, activities, diving, fishing, surfing, transfers and travel packages — researched and kept up to date, not generated.",
    ctaExplore: "Explore the Maldives",
    ctaPackages: "See travel packages",
    statsAtolls: "atolls",
    statsIslands: "inhabited islands",
    statsStays: "resorts listed",
    destinationsEyebrow: "Destinations",
    destinationsTitle: "Explore the Maldives",
    destinationsDescription: "26 natural atolls, grouped into administrative atolls — each with its own inhabited islands.",
    destinationsCta: "View all atolls",
    staysEyebrow: "Places to stay",
    staysTitle: "Resorts, hotels and guesthouses",
    staysDescription: "Real, individually verified accommodation across the Maldives.",
    staysCta: "Browse all resorts",
    staysHotelsLink: "Hotels",
    staysGuesthousesLink: "Guesthouses",
    activitiesEyebrow: "Things to do",
    activitiesTitle: "Activities, diving, fishing and surfing",
    activitiesDescription: "Real operators and activities, sourced island by island.",
    activitiesCta: "View all activities",
    divingLink: "Diving",
    fishingLink: "Fishing",
    surfingLink: "Surfing",
    attractionsEyebrow: "Places to visit",
    attractionsTitle: "Maldives Attractions",
    attractionsDescription:
      "Real, individually documented landmarks, museums, monuments and public beaches — not bookable, but part of any Maldives trip.",
    attractionsCta: "Explore Maldives attractions",
    transfersEyebrow: "Getting around",
    transfersTitle: "Maldives Transfers",
    transfersDescription: "Real airport, speedboat, resort and island transfer routes from Velana International Airport, with source-verified prices.",
    transfersCta: "Find your transfer",
    transferCategoryAirport: "Airport Transfers",
    transferCategorySpeedboat: "Private Speedboats",
    transferCategoryIsland: "Island Transfers",
    packagesEyebrow: "Packages",
    packagesTitle: "Maldives holiday packages",
    packagesDescription:
      "Multi-day itineraries built from real accommodation, activities and transfers — honeymoon, family, diving, fishing, surfing, luxury and budget.",
    packagesCta: "View all packages",
    guideEyebrow: "Travel Guide",
    guideTitle: "In-depth Maldives travel guides",
    guideDescription: "Real, researched guides to islands, atolls, diving, weather and culture.",
    guideCta: "View all guides",
    finalCtaTitle: "Planning a trip to the Maldives?",
    finalCtaDescription: "Browse real atolls, islands, resorts and activities, or message us directly on WhatsApp for help planning your trip.",
    finalCtaExplore: "Start exploring",
    finalCtaWhatsapp: "WhatsApp us",
  },
  maldivesHub: {
    heroEyebrow: "Maldives Tour Guide",
    introPrefix: "The Maldives is a nation of coral atolls in the Indian Ocean, made up of the capital Malé, a scattering of resort islands, and ",
    introMiddle: " inhabited local islands spread across ",
    introSuffix:
      " administrative atolls. Most travellers stay in one of two very different ways: a private resort island — one island, one property, all-inclusive — or a local island, where guesthouses sit inside a real Maldivian community alongside its mosque, school and harbour. Both give access to the same reefs, lagoons and marine life; what differs is the kind of trip. Everything below — atolls, islands, stays, activities, transfers, packages and travel guides — links back to the same real MTG catalogue, so wherever you start, you can get to everything else.",
    atollsEyebrow: "Destinations",
    atollsTitle: "Browse by atoll",
    atollsDescription: "The Maldives is organized into administrative atolls, each made up of inhabited islands.",
    atollsCta: "View all atolls",
    islandsTitle: "Featured local islands",
    islandsDescription: "A starting point, not the whole list — every inhabited island has its own page.",
    islandsCta: "View all islands",
    localIslandsTitle: "Maldives Local Islands",
    localIslandsP1:
      "A “local island” is simply an inhabited Maldivian island that welcomes overnight guests — usually in small, independently run guesthouses rather than a single resort operator. You’ll be staying inside a real community: shops, a mosque, a school, a working harbour, and neighbours going about daily life around you.",
    localIslandsP2:
      "It’s generally the more affordable way to experience the Maldives, since you pay for a room and meals rather than an entire private island. Local dress and behaviour norms are more conservative than on a resort island — swimwear is for designated “bikini beaches” only, for example — and in exchange you get easier access to real Maldivian food, culture and everyday life.",
    localIslandsCtaIslands: "Browse every local island →",
    localIslandsCtaOr: "or see",
    localIslandsCtaGuesthouses: "guesthouses",
    exploreMoreTitle: "Explore More Maldives",
    statsAtolls: "administrative atolls",
    statsIslands: "inhabited islands",
  },
  travelGuideHub: {
    heroEyebrow: "Travel Guide",
    title: "Maldives Travel Guide",
    description: "Real, in-depth guides to the islands, atolls, diving, weather, and culture of the Maldives.",
    emptyStateTitle: "No guides in this language yet",
    comingSoonNote: "More guides are being translated — browse the full English Travel Guide meanwhile.",
  },
  articleDetail: {
    minRead: "min read",
    relatedPlaces: "Related places",
    relatedBookable: "You might also book",
    topic: "Topic",
    relatedArticles: "Related Travel Guide articles",
    backToGuide: "← Back to Travel Guide",
  },
};

const DE: UiStrings = {
  nav: {
    maldives: "Malediven",
    stays: "Unterkünfte",
    activities: "Aktivitäten",
    diving: "Tauchen",
    fishing: "Angeln",
    transfers: "Transfer",
    packages: "Pakete",
    travelGuide: "Reiseführer",
  },
  breadcrumbHome: "Startseite",
  ctaGetInTouch: "Kontakt aufnehmen",
  languageSwitcherLabel: "Sprache",
  currencySwitcherLabel: "Währung",
  home: {
    heroEyebrow: "Malediven Reiseführer",
    heroTitle: "Ein echter, quellengeprüfter Guide für die Malediven",
    heroDescription:
      "Atolle, Inseln, Resorts, Hotels und Pensionen, Aktivitäten, Tauchen, Angeln, Surfen, Transfer und Reisepakete — recherchiert und aktuell gehalten, nicht generiert.",
    ctaExplore: "Malediven entdecken",
    ctaPackages: "Reisepakete ansehen",
    statsAtolls: "Atolle",
    statsIslands: "bewohnte Inseln",
    statsStays: "gelistete Resorts",
    destinationsEyebrow: "Reiseziele",
    destinationsTitle: "Die Malediven entdecken",
    destinationsDescription: "26 natürliche Atolle, gegliedert in Verwaltungsatolle — jedes mit eigenen bewohnten Inseln.",
    destinationsCta: "Alle Atolle ansehen",
    staysEyebrow: "Unterkünfte",
    staysTitle: "Resorts, Hotels und Pensionen",
    staysDescription: "Echte, einzeln geprüfte Unterkünfte auf den Malediven.",
    staysCta: "Alle Resorts ansehen",
    staysHotelsLink: "Hotels",
    staysGuesthousesLink: "Pensionen",
    activitiesEyebrow: "Unternehmungen",
    activitiesTitle: "Aktivitäten, Tauchen, Angeln und Surfen",
    activitiesDescription: "Echte Anbieter und Aktivitäten, Insel für Insel recherchiert.",
    activitiesCta: "Alle Aktivitäten ansehen",
    divingLink: "Tauchen",
    fishingLink: "Angeln",
    surfingLink: "Surfen",
    attractionsEyebrow: "Sehenswürdigkeiten",
    attractionsTitle: "Malediven Sehenswürdigkeiten",
    attractionsDescription:
      "Echte, einzeln dokumentierte Wahrzeichen, Museen, Denkmäler und öffentliche Strände — nicht buchbar, aber Teil jeder Malediven-Reise.",
    attractionsCta: "Sehenswürdigkeiten entdecken",
    transfersEyebrow: "Fortbewegung",
    transfersTitle: "Malediven Transfer",
    transfersDescription: "Echte Flughafen-, Speedboot-, Resort- und Inseltransfers ab dem Flughafen Velana International, mit geprüften Preisen.",
    transfersCta: "Transfer finden",
    transferCategoryAirport: "Flughafentransfer",
    transferCategorySpeedboat: "Private Speedboote",
    transferCategoryIsland: "Inseltransfer",
    packagesEyebrow: "Reisepakete",
    packagesTitle: "Malediven Pauschalreisen",
    packagesDescription:
      "Mehrtägige Reiserouten aus echten Unterkünften, Aktivitäten und Transfers — Flitterwochen, Familie, Tauchen, Angeln, Surfen, Luxus und Budget.",
    packagesCta: "Alle Pakete ansehen",
    guideEyebrow: "Reiseführer",
    guideTitle: "Ausführliche Malediven-Reiseführer",
    guideDescription: "Echte, recherchierte Guides zu Inseln, Atollen, Tauchen, Wetter und Kultur.",
    guideCta: "Alle Guides ansehen",
    finalCtaTitle: "Planen Sie eine Reise auf die Malediven?",
    finalCtaDescription: "Entdecken Sie echte Atolle, Inseln, Resorts und Aktivitäten, oder schreiben Sie uns direkt auf WhatsApp für Hilfe bei der Reiseplanung.",
    finalCtaExplore: "Jetzt entdecken",
    finalCtaWhatsapp: "WhatsApp schreiben",
  },
  maldivesHub: {
    heroEyebrow: "Malediven Reiseführer",
    introPrefix:
      "Die Malediven sind eine Nation aus Koralleninseln im Indischen Ozean, bestehend aus der Hauptstadt Malé, einer Reihe von Resortinseln und ",
    introMiddle: " bewohnten Inseln, verteilt auf ",
    introSuffix:
      " Verwaltungsatolle. Die meisten Reisenden wählen zwischen zwei sehr unterschiedlichen Reisearten: einer privaten Resortinsel — eine Insel, eine Unterkunft, All-inclusive — oder einer bewohnten Insel, auf der Pensionen inmitten einer echten maledivischen Gemeinschaft liegen, mit Moschee, Schule und Hafen. Beide bieten Zugang zu denselben Riffen, Lagunen und derselben Unterwasserwelt — der Unterschied liegt in der Art der Reise. Alles Folgende — Atolle, Inseln, Unterkünfte, Aktivitäten, Transfer, Reisepakete und Reiseführer — führt zurück zum selben echten MTG-Katalog, sodass Sie von jedem Startpunkt aus alles Weitere erreichen.",
    atollsEyebrow: "Reiseziele",
    atollsTitle: "Nach Atoll durchsuchen",
    atollsDescription: "Die Malediven sind in Verwaltungsatolle gegliedert, die jeweils aus bewohnten Inseln bestehen.",
    atollsCta: "Alle Atolle ansehen",
    islandsTitle: "Ausgewählte bewohnte Inseln",
    islandsDescription: "Ein Ausgangspunkt, nicht die vollständige Liste — jede bewohnte Insel hat ihre eigene Seite.",
    islandsCta: "Alle Inseln ansehen",
    localIslandsTitle: "Bewohnte Inseln der Malediven",
    localIslandsP1:
      "Eine „bewohnte Insel“ ist eine bewohnte maledivische Insel, die Übernachtungsgäste willkommen heißt — meist in kleinen, unabhängig geführten Pensionen statt in einem einzelnen Resortbetrieb. Sie wohnen inmitten einer echten Gemeinschaft: Geschäfte, eine Moschee, eine Schule, ein Hafen und Nachbarn, die ihrem Alltag nachgehen.",
    localIslandsP2:
      "Es ist im Allgemeinen die günstigere Art, die Malediven zu erleben, da Sie für ein Zimmer und Verpflegung statt für eine ganze Privatinsel bezahlen. Kleidungs- und Verhaltensnormen sind konservativer als auf einer Resortinsel — Badebekleidung ist beispielsweise nur an ausgewiesenen „Bikini-Stränden“ erlaubt — und im Gegenzug erhalten Sie leichteren Zugang zu echtem maledivischem Essen, echter Kultur und echtem Alltag.",
    localIslandsCtaIslands: "Alle bewohnten Inseln ansehen →",
    localIslandsCtaOr: "oder siehe",
    localIslandsCtaGuesthouses: "Pensionen",
    exploreMoreTitle: "Mehr von den Malediven entdecken",
    statsAtolls: "Verwaltungsatolle",
    statsIslands: "bewohnte Inseln",
  },
  travelGuideHub: {
    heroEyebrow: "Reiseführer",
    title: "Malediven Reiseführer",
    description: "Echte, ausführliche Guides zu den Inseln, Atollen, dem Tauchen, dem Wetter und der Kultur der Malediven.",
    emptyStateTitle: "Noch keine Guides in dieser Sprache",
    comingSoonNote: "Weitere Guides werden derzeit übersetzt — stöbern Sie in der Zwischenzeit im vollständigen englischen Reiseführer.",
  },
  articleDetail: {
    minRead: "Min. Lesezeit",
    relatedPlaces: "Passende Orte",
    relatedBookable: "Das könnte Sie auch interessieren",
    topic: "Thema",
    relatedArticles: "Weitere Reiseführer-Artikel",
    backToGuide: "← Zurück zum Reiseführer",
  },
};

const ES: UiStrings = {
  nav: {
    maldives: "Maldivas",
    stays: "Alojamientos",
    activities: "Actividades",
    diving: "Buceo",
    fishing: "Pesca",
    transfers: "Traslados",
    packages: "Paquetes",
    travelGuide: "Guía de Viaje",
  },
  breadcrumbHome: "Inicio",
  ctaGetInTouch: "Contáctanos",
  languageSwitcherLabel: "Idioma",
  currencySwitcherLabel: "Moneda",
  home: {
    heroEyebrow: "Guía de Viaje a Maldivas",
    heroTitle: "Una guía real y verificada de Maldivas",
    heroDescription:
      "Atolones, islas, resorts, hoteles y pensiones, actividades, buceo, pesca, surf, traslados y paquetes de viaje — investigados y actualizados, no generados.",
    ctaExplore: "Explorar Maldivas",
    ctaPackages: "Ver paquetes de viaje",
    statsAtolls: "atolones",
    statsIslands: "islas habitadas",
    statsStays: "resorts listados",
    destinationsEyebrow: "Destinos",
    destinationsTitle: "Explora Maldivas",
    destinationsDescription: "26 atolones naturales, agrupados en atolones administrativos — cada uno con sus propias islas habitadas.",
    destinationsCta: "Ver todos los atolones",
    staysEyebrow: "Dónde alojarse",
    staysTitle: "Resorts, hoteles y pensiones",
    staysDescription: "Alojamientos reales, verificados individualmente, en todas las Maldivas.",
    staysCta: "Ver todos los resorts",
    staysHotelsLink: "Hoteles",
    staysGuesthousesLink: "Pensiones",
    activitiesEyebrow: "Qué hacer",
    activitiesTitle: "Actividades, buceo, pesca y surf",
    activitiesDescription: "Operadores y actividades reales, investigados isla por isla.",
    activitiesCta: "Ver todas las actividades",
    divingLink: "Buceo",
    fishingLink: "Pesca",
    surfingLink: "Surf",
    attractionsEyebrow: "Lugares para visitar",
    attractionsTitle: "Atracciones de Maldivas",
    attractionsDescription:
      "Monumentos, museos, lugares emblemáticos y playas públicas documentados individualmente — no reservables, pero parte de cualquier viaje a Maldivas.",
    attractionsCta: "Explorar atracciones de Maldivas",
    transfersEyebrow: "Cómo moverse",
    transfersTitle: "Traslados en Maldivas",
    transfersDescription: "Rutas reales de traslado en aeropuerto, lancha rápida, resort e isla desde el Aeropuerto Internacional de Velana, con precios verificados.",
    transfersCta: "Encuentra tu traslado",
    transferCategoryAirport: "Traslados de aeropuerto",
    transferCategorySpeedboat: "Lanchas rápidas privadas",
    transferCategoryIsland: "Traslados entre islas",
    packagesEyebrow: "Paquetes",
    packagesTitle: "Paquetes de vacaciones en Maldivas",
    packagesDescription:
      "Itinerarios de varios días creados a partir de alojamiento, actividades y traslados reales — luna de miel, familia, buceo, pesca, surf, lujo y presupuesto ajustado.",
    packagesCta: "Ver todos los paquetes",
    guideEyebrow: "Guía de Viaje",
    guideTitle: "Guías detalladas de viaje a Maldivas",
    guideDescription: "Guías reales e investigadas sobre islas, atolones, buceo, clima y cultura.",
    guideCta: "Ver todas las guías",
    finalCtaTitle: "¿Planeando un viaje a Maldivas?",
    finalCtaDescription: "Explora atolones, islas, resorts y actividades reales, o escríbenos directamente por WhatsApp para ayudarte a planear tu viaje.",
    finalCtaExplore: "Empezar a explorar",
    finalCtaWhatsapp: "Escríbenos por WhatsApp",
  },
  maldivesHub: {
    heroEyebrow: "Guía de Viaje a Maldivas",
    introPrefix: "Maldivas es una nación de atolones de coral en el Océano Índico, formada por la capital Malé, un conjunto de islas resort y ",
    introMiddle: " islas habitadas repartidas en ",
    introSuffix:
      " atolones administrativos. La mayoría de los viajeros se alojan de dos formas muy distintas: una isla resort privada — una isla, una propiedad, todo incluido — o una isla local, donde las pensiones conviven dentro de una comunidad maldiva real junto a su mezquita, escuela y puerto. Ambas opciones dan acceso a los mismos arrecifes, lagunas y vida marina; lo que cambia es el tipo de viaje. Todo lo que sigue — atolones, islas, alojamientos, actividades, traslados, paquetes y guías de viaje — enlaza con el mismo catálogo real de MTG, así que sin importar por dónde empieces, puedes llegar a todo lo demás.",
    atollsEyebrow: "Destinos",
    atollsTitle: "Explorar por atolón",
    atollsDescription: "Maldivas está organizada en atolones administrativos, cada uno formado por islas habitadas.",
    atollsCta: "Ver todos los atolones",
    islandsTitle: "Islas locales destacadas",
    islandsDescription: "Un punto de partida, no la lista completa — cada isla habitada tiene su propia página.",
    islandsCta: "Ver todas las islas",
    localIslandsTitle: "Islas locales de Maldivas",
    localIslandsP1:
      "Una «isla local» es simplemente una isla maldiva habitada que recibe huéspedes — normalmente en pensiones pequeñas y de gestión independiente, en lugar de un único operador de resort. Te alojarás dentro de una comunidad real: tiendas, una mezquita, una escuela, un puerto en funcionamiento y vecinos haciendo su vida diaria a tu alrededor.",
    localIslandsP2:
      "Suele ser la forma más económica de conocer Maldivas, ya que pagas por una habitación y comidas en lugar de una isla privada entera. Las normas de vestimenta y comportamiento son más conservadoras que en una isla resort — el bañador solo se usa en las «playas bikini» designadas, por ejemplo — y a cambio tienes un acceso más fácil a la comida, la cultura y la vida cotidiana maldiva reales.",
    localIslandsCtaIslands: "Ver todas las islas locales →",
    localIslandsCtaOr: "o ver",
    localIslandsCtaGuesthouses: "pensiones",
    exploreMoreTitle: "Explorar más de Maldivas",
    statsAtolls: "atolones administrativos",
    statsIslands: "islas habitadas",
  },
  travelGuideHub: {
    heroEyebrow: "Guía de Viaje",
    title: "Guía de Viaje a Maldivas",
    description: "Guías reales y detalladas sobre las islas, atolones, buceo, clima y cultura de Maldivas.",
    emptyStateTitle: "Aún no hay guías en este idioma",
    comingSoonNote: "Se están traduciendo más guías — mientras tanto, explora la Guía de Viaje completa en inglés.",
  },
  articleDetail: {
    minRead: "min. de lectura",
    relatedPlaces: "Lugares relacionados",
    relatedBookable: "También te puede interesar",
    topic: "Tema",
    relatedArticles: "Más artículos de la Guía de Viaje",
    backToGuide: "← Volver a la Guía de Viaje",
  },
};

const UI_STRINGS: Partial<Record<Locale, UiStrings>> = { en: EN, de: DE, es: ES };

/** Falls back to English for any locale that doesn't have real copy yet
 * — never throws, never renders a blank label. */
export function getUiStrings(locale: Locale): UiStrings {
  return UI_STRINGS[locale] ?? EN;
}
