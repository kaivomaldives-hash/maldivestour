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

const IT: UiStrings = {
  nav: {
    maldives: "Maldive",
    stays: "Alloggi",
    activities: "Attività",
    diving: "Immersioni",
    fishing: "Pesca",
    transfers: "Trasferimenti",
    packages: "Pacchetti",
    travelGuide: "Guida di Viaggio",
  },
  breadcrumbHome: "Home",
  ctaGetInTouch: "Contattaci",
  languageSwitcherLabel: "Lingua",
  currencySwitcherLabel: "Valuta",
  home: {
    heroEyebrow: "Guida di Viaggio alle Maldive",
    heroTitle: "Una guida reale e verificata alle Maldive",
    heroDescription:
      "Atolli, isole, resort, hotel e pensioni, attività, immersioni, pesca, surf, trasferimenti e pacchetti vacanza — ricercati e tenuti aggiornati, non generati.",
    ctaExplore: "Esplora le Maldive",
    ctaPackages: "Vedi i pacchetti vacanza",
    statsAtolls: "atolli",
    statsIslands: "isole abitate",
    statsStays: "resort elencati",
    destinationsEyebrow: "Destinazioni",
    destinationsTitle: "Esplora le Maldive",
    destinationsDescription: "26 atolli naturali, raggruppati in atolli amministrativi — ciascuno con le proprie isole abitate.",
    destinationsCta: "Vedi tutti gli atolli",
    staysEyebrow: "Dove alloggiare",
    staysTitle: "Resort, hotel e pensioni",
    staysDescription: "Alloggi reali, verificati singolarmente, in tutte le Maldive.",
    staysCta: "Vedi tutti i resort",
    staysHotelsLink: "Hotel",
    staysGuesthousesLink: "Pensioni",
    activitiesEyebrow: "Cosa fare",
    activitiesTitle: "Attività, immersioni, pesca e surf",
    activitiesDescription: "Operatori e attività reali, ricercati isola per isola.",
    activitiesCta: "Vedi tutte le attività",
    divingLink: "Immersioni",
    fishingLink: "Pesca",
    surfingLink: "Surf",
    attractionsEyebrow: "Luoghi da visitare",
    attractionsTitle: "Attrazioni delle Maldive",
    attractionsDescription:
      "Monumenti, musei, luoghi iconici e spiagge pubbliche documentati singolarmente — non prenotabili, ma parte di ogni viaggio alle Maldive.",
    attractionsCta: "Esplora le attrazioni delle Maldive",
    transfersEyebrow: "Come spostarsi",
    transfersTitle: "Trasferimenti alle Maldive",
    transfersDescription: "Percorsi reali di trasferimento aeroportuale, in motoscafo, verso resort e isole dall'Aeroporto Internazionale di Velana, con prezzi verificati.",
    transfersCta: "Trova il tuo trasferimento",
    transferCategoryAirport: "Trasferimenti aeroportuali",
    transferCategorySpeedboat: "Motoscafi privati",
    transferCategoryIsland: "Trasferimenti tra isole",
    packagesEyebrow: "Pacchetti",
    packagesTitle: "Pacchetti vacanza alle Maldive",
    packagesDescription:
      "Itinerari di più giorni costruiti con alloggi, attività e trasferimenti reali — luna di miele, famiglia, immersioni, pesca, surf, lusso e budget.",
    packagesCta: "Vedi tutti i pacchetti",
    guideEyebrow: "Guida di Viaggio",
    guideTitle: "Guide di viaggio approfondite sulle Maldive",
    guideDescription: "Guide reali e ben documentate su isole, atolli, immersioni, clima e cultura.",
    guideCta: "Vedi tutte le guide",
    finalCtaTitle: "Stai pianificando un viaggio alle Maldive?",
    finalCtaDescription: "Esplora atolli, isole, resort e attività reali, oppure scrivici direttamente su WhatsApp per un aiuto nella pianificazione del tuo viaggio.",
    finalCtaExplore: "Inizia a esplorare",
    finalCtaWhatsapp: "Scrivici su WhatsApp",
  },
  maldivesHub: {
    heroEyebrow: "Guida di Viaggio alle Maldive",
    introPrefix: "Le Maldive sono una nazione di atolli corallini nell'Oceano Indiano, formata dalla capitale Malé, un insieme di isole resort e ",
    introMiddle: " isole abitate distribuite su ",
    introSuffix:
      " atolli amministrativi. La maggior parte dei viaggiatori sceglie tra due modi molto diversi di soggiornare: un'isola resort privata — un'isola, una struttura, tutto incluso — oppure un'isola locale, dove le pensioni convivono all'interno di una vera comunità maldiviana, con la sua moschea, la scuola e il porto. Entrambe offrono accesso agli stessi reef, lagune e vita marina; a cambiare è il tipo di viaggio. Tutto quanto segue — atolli, isole, alloggi, attività, trasferimenti, pacchetti e guide di viaggio — rimanda allo stesso catalogo reale di MTG, così da qualunque punto si parta si può arrivare a tutto il resto.",
    atollsEyebrow: "Destinazioni",
    atollsTitle: "Esplora per atollo",
    atollsDescription: "Le Maldive sono organizzate in atolli amministrativi, ciascuno formato da isole abitate.",
    atollsCta: "Vedi tutti gli atolli",
    islandsTitle: "Isole locali in evidenza",
    islandsDescription: "Un punto di partenza, non l'elenco completo — ogni isola abitata ha una propria pagina.",
    islandsCta: "Vedi tutte le isole",
    localIslandsTitle: "Isole locali delle Maldive",
    localIslandsP1:
      "Un'«isola locale» è semplicemente un'isola maldiviana abitata che accoglie ospiti — solitamente in piccole pensioni a gestione indipendente anziché in un unico resort. Si alloggia all'interno di una vera comunità: negozi, una moschea, una scuola, un porto attivo e vicini che vivono la loro quotidianità intorno a te.",
    localIslandsP2:
      "È generalmente il modo più economico per vivere le Maldive, poiché si paga per una camera e i pasti anziché per un'intera isola privata. Le norme di abbigliamento e comportamento sono più conservative rispetto a un'isola resort — il costume da bagno si indossa solo nelle apposite «spiagge bikini», ad esempio — e in cambio si ha un accesso più diretto al vero cibo, alla cultura e alla vita quotidiana maldiviana.",
    localIslandsCtaIslands: "Vedi tutte le isole locali →",
    localIslandsCtaOr: "oppure vedi",
    localIslandsCtaGuesthouses: "le pensioni",
    exploreMoreTitle: "Esplora altro delle Maldive",
    statsAtolls: "atolli amministrativi",
    statsIslands: "isole abitate",
  },
  travelGuideHub: {
    heroEyebrow: "Guida di Viaggio",
    title: "Guida di Viaggio alle Maldive",
    description: "Guide reali e approfondite sulle isole, gli atolli, le immersioni, il clima e la cultura delle Maldive.",
    emptyStateTitle: "Nessuna guida ancora in questa lingua",
    comingSoonNote: "Altre guide sono in fase di traduzione — nel frattempo sfoglia la Guida di Viaggio completa in inglese.",
  },
  articleDetail: {
    minRead: "min di lettura",
    relatedPlaces: "Luoghi correlati",
    relatedBookable: "Potrebbe interessarti anche",
    topic: "Argomento",
    relatedArticles: "Altri articoli della Guida di Viaggio",
    backToGuide: "← Torna alla Guida di Viaggio",
  },
};

const RU: UiStrings = {
  nav: {
    maldives: "Мальдивы",
    stays: "Проживание",
    activities: "Активности",
    diving: "Дайвинг",
    fishing: "Рыбалка",
    transfers: "Трансферы",
    packages: "Туры",
    travelGuide: "Путеводитель",
  },
  breadcrumbHome: "Главная",
  ctaGetInTouch: "Связаться с нами",
  languageSwitcherLabel: "Язык",
  currencySwitcherLabel: "Валюта",
  home: {
    heroEyebrow: "Путеводитель по Мальдивам",
    heroTitle: "Настоящий, проверенный путеводитель по Мальдивам",
    heroDescription:
      "Атоллы, острова, курорты, отели и гестхаусы, активности, дайвинг, рыбалка, сёрфинг, трансферы и туристические пакеты — исследовано и регулярно обновляется, а не сгенерировано.",
    ctaExplore: "Исследовать Мальдивы",
    ctaPackages: "Смотреть туры",
    statsAtolls: "атоллов",
    statsIslands: "обитаемых островов",
    statsStays: "курортов в каталоге",
    destinationsEyebrow: "Направления",
    destinationsTitle: "Исследуйте Мальдивы",
    destinationsDescription: "26 природных атоллов, объединённых в административные атоллы — каждый со своими обитаемыми островами.",
    destinationsCta: "Смотреть все атоллы",
    staysEyebrow: "Где остановиться",
    staysTitle: "Курорты, отели и гестхаусы",
    staysDescription: "Настоящие, индивидуально проверенные варианты размещения по всем Мальдивам.",
    staysCta: "Смотреть все курорты",
    staysHotelsLink: "Отели",
    staysGuesthousesLink: "Гестхаусы",
    activitiesEyebrow: "Чем заняться",
    activitiesTitle: "Активности, дайвинг, рыбалка и сёрфинг",
    activitiesDescription: "Реальные операторы и активности, проверенные на каждом острове.",
    activitiesCta: "Смотреть все активности",
    divingLink: "Дайвинг",
    fishingLink: "Рыбалка",
    surfingLink: "Сёрфинг",
    attractionsEyebrow: "Куда сходить",
    attractionsTitle: "Достопримечательности Мальдив",
    attractionsDescription:
      "Индивидуально задокументированные памятники, музеи, знаковые места и общественные пляжи — не для бронирования, но часть любой поездки на Мальдивы.",
    attractionsCta: "Смотреть достопримечательности Мальдив",
    transfersEyebrow: "Как добраться",
    transfersTitle: "Трансферы на Мальдивах",
    transfersDescription: "Реальные маршруты трансферов из аэропорта, на скоростных катерах, до курортов и островов от международного аэропорта Велана, с проверенными ценами.",
    transfersCta: "Найти свой трансфер",
    transferCategoryAirport: "Трансферы из аэропорта",
    transferCategorySpeedboat: "Частные скоростные катера",
    transferCategoryIsland: "Межостровные трансферы",
    packagesEyebrow: "Туры",
    packagesTitle: "Туристические пакеты на Мальдивы",
    packagesDescription:
      "Многодневные маршруты, составленные из реального размещения, активностей и трансферов — медовый месяц, для семьи, дайвинг, рыбалка, сёрфинг, люкс и бюджетные варианты.",
    packagesCta: "Смотреть все туры",
    guideEyebrow: "Путеводитель",
    guideTitle: "Подробные путеводители по Мальдивам",
    guideDescription: "Настоящие, тщательно исследованные материалы об островах, атоллах, дайвинге, погоде и культуре.",
    guideCta: "Смотреть все статьи",
    finalCtaTitle: "Планируете поездку на Мальдивы?",
    finalCtaDescription: "Изучите реальные атоллы, острова, курорты и активности или напишите нам напрямую в WhatsApp, чтобы спланировать поездку.",
    finalCtaExplore: "Начать изучение",
    finalCtaWhatsapp: "Написать в WhatsApp",
  },
  maldivesHub: {
    heroEyebrow: "Путеводитель по Мальдивам",
    introPrefix: "Мальдивы — государство из коралловых атоллов в Индийском океане, состоящее из столицы Мале, группы курортных островов и ",
    introMiddle: " обитаемых островов, расположенных в ",
    introSuffix:
      " административных атоллах. Большинство путешественников выбирают один из двух совершенно разных форматов отдыха: частный курортный остров — один остров, один отель, всё включено — или местный остров, где гестхаусы находятся внутри настоящей мальдивской общины рядом с мечетью, школой и гаванью. Оба варианта дают доступ к одним и тем же рифам, лагунам и морской жизни; различается лишь сам формат поездки. Всё, что указано ниже — атоллы, острова, проживание, активности, трансферы, туры и путеводители — ведёт к одному и тому же реальному каталогу MTG, так что с какой бы страницы вы ни начали, вы сможете добраться до всего остального.",
    atollsEyebrow: "Направления",
    atollsTitle: "Выбрать по атоллу",
    atollsDescription: "Мальдивы разделены на административные атоллы, каждый из которых состоит из обитаемых островов.",
    atollsCta: "Смотреть все атоллы",
    islandsTitle: "Избранные местные острова",
    islandsDescription: "Это лишь отправная точка, а не полный список — у каждого обитаемого острова есть собственная страница.",
    islandsCta: "Смотреть все острова",
    localIslandsTitle: "Местные острова Мальдив",
    localIslandsP1:
      "«Местный остров» — это просто обитаемый мальдивский остров, который принимает гостей — обычно в небольших, независимо управляемых гестхаусах, а не в едином курортном комплексе. Вы остановитесь в настоящей общине: с магазинами, мечетью, школой, действующей гаванью и соседями, занятыми повседневными делами вокруг вас.",
    localIslandsP2:
      "Как правило, это более доступный способ познакомиться с Мальдивами, поскольку вы платите за номер и питание, а не за целый частный остров. Нормы одежды и поведения здесь более консервативны, чем на курортном острове — купальники допустимы только на специально отведённых «бикини-пляжах», — но взамен вы получаете более близкий доступ к настоящей мальдивской еде, культуре и повседневной жизни.",
    localIslandsCtaIslands: "Смотреть все местные острова →",
    localIslandsCtaOr: "или смотрите",
    localIslandsCtaGuesthouses: "гестхаусы",
    exploreMoreTitle: "Узнать больше о Мальдивах",
    statsAtolls: "административных атоллов",
    statsIslands: "обитаемых островов",
  },
  travelGuideHub: {
    heroEyebrow: "Путеводитель",
    title: "Путеводитель по Мальдивам",
    description: "Настоящие, подробные материалы об островах, атоллах, дайвинге, погоде и культуре Мальдив.",
    emptyStateTitle: "Пока нет статей на этом языке",
    comingSoonNote: "Другие статьи переводятся — а пока ознакомьтесь с полным путеводителем на английском языке.",
  },
  articleDetail: {
    minRead: "мин. чтения",
    relatedPlaces: "Похожие места",
    relatedBookable: "Вас также может заинтересовать",
    topic: "Тема",
    relatedArticles: "Другие статьи путеводителя",
    backToGuide: "← Назад к путеводителю",
  },
};

const JA: UiStrings = {
  nav: {
    maldives: "モルディブ",
    stays: "宿泊施設",
    activities: "アクティビティ",
    diving: "ダイビング",
    fishing: "フィッシング",
    transfers: "送迎",
    packages: "パッケージ",
    travelGuide: "旅行ガイド",
  },
  breadcrumbHome: "ホーム",
  ctaGetInTouch: "お問い合わせ",
  languageSwitcherLabel: "言語",
  currencySwitcherLabel: "通貨",
  home: {
    heroEyebrow: "モルディブ旅行ガイド",
    heroTitle: "本物の、検証済みのモルディブ旅行ガイド",
    heroDescription:
      "環礁、島々、リゾート、ホテル、ゲストハウス、アクティビティ、ダイビング、フィッシング、サーフィン、送迎、ツアーパッケージ――生成されたものではなく、実際に調査し定期的に更新しています。",
    ctaExplore: "モルディブを探す",
    ctaPackages: "パッケージを見る",
    statsAtolls: "環礁",
    statsIslands: "有人島",
    statsStays: "掲載リゾート",
    destinationsEyebrow: "目的地",
    destinationsTitle: "モルディブを探す",
    destinationsDescription: "26の自然環礁が行政環礁にまとめられ、それぞれに有人島があります。",
    destinationsCta: "すべての環礁を見る",
    staysEyebrow: "宿泊先",
    staysTitle: "リゾート、ホテル、ゲストハウス",
    staysDescription: "モルディブ全域で個別に確認された本物の宿泊施設。",
    staysCta: "すべてのリゾートを見る",
    staysHotelsLink: "ホテル",
    staysGuesthousesLink: "ゲストハウス",
    activitiesEyebrow: "楽しみ方",
    activitiesTitle: "アクティビティ、ダイビング、フィッシング、サーフィン",
    activitiesDescription: "各島で確認された実際のオペレーターとアクティビティ。",
    activitiesCta: "すべてのアクティビティを見る",
    divingLink: "ダイビング",
    fishingLink: "フィッシング",
    surfingLink: "サーフィン",
    attractionsEyebrow: "見どころ",
    attractionsTitle: "モルディブの観光スポット",
    attractionsDescription:
      "個別に記録されたランドマーク、博物館、名所、パブリックビーチ――予約はできませんが、モルディブ旅行には欠かせない場所です。",
    attractionsCta: "モルディブの観光スポットを見る",
    transfersEyebrow: "行き方",
    transfersTitle: "モルディブの送迎",
    transfersDescription: "ヴェラナ国際空港からの空港送迎、スピードボート、リゾートや島への送迎ルートと、確認済みの料金。",
    transfersCta: "送迎を探す",
    transferCategoryAirport: "空港送迎",
    transferCategorySpeedboat: "プライベートスピードボート",
    transferCategoryIsland: "島間送迎",
    packagesEyebrow: "パッケージ",
    packagesTitle: "モルディブツアーパッケージ",
    packagesDescription:
      "実際の宿泊施設、アクティビティ、送迎を組み合わせた複数日程の旅程――ハネムーン、ファミリー、ダイビング、フィッシング、サーフィン、ラグジュアリー、格安プランまで。",
    packagesCta: "すべてのパッケージを見る",
    guideEyebrow: "旅行ガイド",
    guideTitle: "モルディブの詳細ガイド",
    guideDescription: "島、環礁、ダイビング、気候、文化について本物の、丹念に調査された記事。",
    guideCta: "すべての記事を見る",
    finalCtaTitle: "モルディブ旅行を計画中ですか？",
    finalCtaDescription: "実際の環礁、島、リゾート、アクティビティを探すか、WhatsAppで直接ご連絡いただき旅行の計画をお手伝いします。",
    finalCtaExplore: "探索を始める",
    finalCtaWhatsapp: "WhatsAppでメッセージ",
  },
  maldivesHub: {
    heroEyebrow: "モルディブ旅行ガイド",
    introPrefix: "モルディブはインド洋に浮かぶサンゴ環礁の国で、首都マレ、リゾートアイランド群、そして",
    introMiddle: "の有人島があり、それらは",
    introSuffix:
      "の行政環礁に分かれています。ほとんどの旅行者は全く異なる2つの滞在スタイルのいずれかを選びます――1島1リゾートのオールインクルーシブなプライベートリゾートアイランド、または、モスクや学校、港のあるモルディブの実際のコミュニティの中にゲストハウスがあるローカルアイランドです。どちらも同じリーフやラグーン、海洋生物にアクセスできます。違うのは旅のスタイルだけです。以下にある環礁、島、宿泊施設、アクティビティ、送迎、パッケージ、ガイドはすべて同じMTGの実際のカタログにつながっているので、どのページから始めても他のすべてにたどり着けます。",
    atollsEyebrow: "目的地",
    atollsTitle: "環礁で選ぶ",
    atollsDescription: "モルディブは行政環礁に分かれており、それぞれに有人島があります。",
    atollsCta: "すべての環礁を見る",
    islandsTitle: "注目のローカルアイランド",
    islandsDescription: "これは出発点にすぎず、全リストではありません――すべての有人島に専用ページがあります。",
    islandsCta: "すべての島を見る",
    localIslandsTitle: "モルディブのローカルアイランド",
    localIslandsP1:
      "「ローカルアイランド」とは、宿泊客を受け入れているモルディブの有人島のことで、通常は単一のリゾート複合施設ではなく、小規模で独立経営のゲストハウスがあります。実際のコミュニティに滞在することになります――お店、モスク、学校、稼働中の港、日常生活を送る隣人たちに囲まれて。",
    localIslandsP2:
      "一般的に、島全体を借りるのではなく部屋と食事に対して料金を支払うため、モルディブを体験するより手頃な方法です。服装や振る舞いのマナーはリゾートアイランドよりも保守的です――水着は指定された「ビキニビーチ」のみで着用可能――ですが、その代わりに本物のモルディブの食事、文化、日常生活により近づくことができます。",
    localIslandsCtaIslands: "すべてのローカルアイランドを見る →",
    localIslandsCtaOr: "または",
    localIslandsCtaGuesthouses: "ゲストハウスを見る",
    exploreMoreTitle: "モルディブについてもっと知る",
    statsAtolls: "行政環礁",
    statsIslands: "有人島",
  },
  travelGuideHub: {
    heroEyebrow: "旅行ガイド",
    title: "モルディブ旅行ガイド",
    description: "モルディブの島、環礁、ダイビング、気候、文化についての本物の詳細な記事。",
    emptyStateTitle: "この言語の記事はまだありません",
    comingSoonNote: "さらに多くの記事を翻訳中です――その間、英語版の完全なガイドをご覧ください。",
  },
  articleDetail: {
    minRead: "分で読めます",
    relatedPlaces: "関連スポット",
    relatedBookable: "こちらもおすすめ",
    topic: "トピック",
    relatedArticles: "ガイドの他の記事",
    backToGuide: "← ガイドに戻る",
  },
};

const UI_STRINGS: Partial<Record<Locale, UiStrings>> = { en: EN, de: DE, es: ES, it: IT, ru: RU, ja: JA };

/** Falls back to English for any locale that doesn't have real copy yet
 * — never throws, never renders a blank label. */
export function getUiStrings(locale: Locale): UiStrings {
  return UI_STRINGS[locale] ?? EN;
}
