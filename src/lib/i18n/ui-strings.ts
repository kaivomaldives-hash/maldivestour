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
  packagesHub: {
    heroEyebrow: string;
    title: string;
    description: string;
    introP1: string;
    introP2: string;
    featuredTitle: string;
    styleTitle: string;
    categoryLuxury: string;
    categoryFamily: string;
    categoryAdultsOnly: string;
    categoryLongStay: string;
    categoryBudget: string;
    categoryHoneymoon: string;
    categorySolo: string;
    categoryDiving: string;
    categoryFishing: string;
    categorySurfing: string;
    categoryLiveaboard: string;
    faqTitle: string;
    faqs: { question: string; answer: string }[];
    exploreMoreTitle: string;
  };
  articleDetail: {
    minRead: string;
    relatedPlaces: string;
    relatedBookable: string;
    topic: string;
    relatedArticles: string;
    backToGuide: string;
  };
  packageDetail: {
    eyebrow: string;
    nightsDays: string;
    fromPrice: string;
    quoteOnRequest: string;
    perPerson: string;
    perCouple: string;
    perPackage: string;
    overviewTitle: string;
    galleryTitle: string;
    highlightsTitle: string;
    bestForTitle: string;
    itineraryTitle: string;
    accommodationTitle: string;
    includedTitle: string;
    excludedTitle: string;
    activitiesTitle: string;
    destinationTitle: string;
    faqTitle: string;
    relatedTitle: string;
    exploreMoreTitle: string;
    allPackagesLink: string;
    englishVersionLink: string;
  };
  transfersHub: {
    heroEyebrow: string;
    title: string;
    description: string;
    introP1: string;
    introP2: string;
    airportSectionTitle: string;
    resortSectionTitle: string;
    islandSectionTitle: string;
    faqTitle: string;
    faqs: { question: string; answer: string }[];
    exploreMoreTitle: string;
  };
  transferDetail: {
    eyebrow: string;
    fromLabel: string;
    toLabel: string;
    durationLabel: string;
    distanceLabel: string;
    reverseRoutePrompt: string;
    servicesTitle: string;
    noServicesNote: string;
    privateTransferTitle: string;
    privateTransferBody: string;
    privateTransferCta: string;
    packagesUsingRouteTitle: string;
    faqTitle: string;
    relatedTitle: string;
    exploreMoreTitle: string;
    allTransfersLink: string;
    englishVersionLink: string;
    typeSpeedboat: string;
    typeSeaplane: string;
    typeDomesticFlight: string;
    typeFerry: string;
    typePrivateYacht: string;
    typeLandTransfer: string;
    modeShared: string;
    modePrivate: string;
  };
  /** One label per src/components/site-footer.tsx TRAVEL_LINKS entry,
   * in the same order. Only the maldives/transfers/packages/travelGuide
   * entries resolve to a real localized href (via localizeHubPath) --
   * every other label is still shown in this language, but its link
   * stays the plain English URL since that vertical has no translated
   * route yet (same "translate the word, not a fabricated URL"
   * convention as everywhere else). */
  footerLinks: {
    maldives: string;
    atolls: string;
    islands: string;
    resorts: string;
    hotels: string;
    guesthouses: string;
    activities: string;
    fishing: string;
    diving: string;
    surfing: string;
    snorkeling: string;
    excursions: string;
    sandbankTours: string;
    waterSports: string;
    islandHopping: string;
    dolphinWhaleWatching: string;
    sightseeing: string;
    transfers: string;
    airportTransfers: string;
    resortTransfers: string;
    islandTransfers: string;
    speedboatCharter: string;
    ferrySchedule: string;
    packages: string;
    travelGuide: string;
    attractions: string;
    restaurants: string;
    shops: string;
    hospitals: string;
    schools: string;
    gyms: string;
  };
  fishingHub: {
    heroEyebrow: string;
    title: string;
    description: string;
    introP1: string;
    introP2: string;
    featuredTitle: string;
    faqTitle: string;
    faqs: { question: string; answer: string }[];
    exploreMoreTitle: string;
  };
  divingHub: {
    heroEyebrow: string;
    title: string;
    description: string;
    introP1: string;
    introP2: string;
    featuredTitle: string;
    faqTitle: string;
    faqs: { question: string; answer: string }[];
    exploreMoreTitle: string;
  };
  activitiesHub: {
    heroEyebrow: string;
    title: string;
    description: string;
    introP1: string;
    introP2: string;
    featuredTitle: string;
    faqTitle: string;
    faqs: { question: string; answer: string }[];
    exploreMoreTitle: string;
  };
  /** Shared chrome for the fishing/diving/generic-activities detail
   * pages -- the category-specific eyebrow text reuses ui.nav.fishing/
   * diving/activities rather than duplicating it here. */
  activityDetail: {
    durationLabel: string;
    bookingIntro: string;
    otherTripsTitle: string;
    packagesFeaturingTitle: string;
    pickupLocationsTitle: string;
    pickupLocationsIntro: string;
    exploreMoreTitle: string;
    allFishingLink: string;
    allDivingLink: string;
    allActivitiesLink: string;
    englishVersionLink: string;
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
    introPrefix: "The Maldives is a nation of coral atolls in the Indian Ocean, made up of the capital Male, a scattering of resort islands, and ",
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
  packagesHub: {
    heroEyebrow: "Maldives holidays",
    title: "Maldives Holiday Packages",
    description: "Discover Maldives holiday, honeymoon, family, diving, fishing, surfing, luxury and budget packages — search, filter, and enquire directly.",
    introP1:
      "Every package below is a real, multi-day itinerary built from real accommodation, activities and transfers — not a generic template. Browse by style, or see the full English listing for search and filters.",
    introP2:
      "Resort-island packages are all-inclusive, one-property stays; local-island packages combine independently run guesthouses with the same reefs and activities, usually at a much lower price.",
    featuredTitle: "Featured Maldives Packages",
    styleTitle: "Browse Packages by Style",
    categoryLuxury: "Luxury",
    categoryFamily: "Family",
    categoryAdultsOnly: "Adults-Only",
    categoryLongStay: "Long Stay",
    categoryBudget: "Budget",
    categoryHoneymoon: "Honeymoon",
    categorySolo: "Solo",
    categoryDiving: "Diving",
    categoryFishing: "Fishing",
    categorySurfing: "Surfing",
    categoryLiveaboard: "Liveaboard",
    faqTitle: "Common questions",
    faqs: [
      {
        question: "How many nights should I spend in the Maldives?",
        answer: "Most first-time visitors spend 5–7 nights. Shorter trips (3–4 nights) suit a quick resort escape; long-stay packages (10+ nights) suit travelers combining a resort and a local island, or wanting genuine downtime.",
      },
      {
        question: "Are Maldives packages inclusive of airport transfers?",
        answer: "It varies by package — check the Included section on each package's own page. Most resort-based packages include a speedboat or seaplane transfer; local-island packages usually use the public ferry.",
      },
      {
        question: "Can I customize a Maldives package?",
        answer: "Yes — every package's enquiry form lets you note your preferred dates and any changes. We confirm what's actually possible before you book, real availability permitting.",
      },
      {
        question: "Are flights included in package prices?",
        answer: "No — international flights to Velana International Airport are never included in any package price on this site; see each package's Excluded section.",
      },
    ],
    exploreMoreTitle: "Explore More Maldives",
  },
  articleDetail: {
    minRead: "min read",
    relatedPlaces: "Related places",
    relatedBookable: "You might also book",
    topic: "Topic",
    relatedArticles: "Related Travel Guide articles",
    backToGuide: "← Back to Travel Guide",
  },
  packageDetail: {
    eyebrow: "Maldives package",
    nightsDays: "Nights / Days",
    fromPrice: "From",
    quoteOnRequest: "Quote on request",
    perPerson: "per person",
    perCouple: "per couple",
    perPackage: "per package",
    overviewTitle: "Overview",
    galleryTitle: "Gallery",
    highlightsTitle: "Highlights",
    bestForTitle: "Who This Package Is For",
    itineraryTitle: "Itinerary",
    accommodationTitle: "Accommodation",
    includedTitle: "What's Included",
    excludedTitle: "What's Not Included",
    activitiesTitle: "Activities",
    destinationTitle: "Destination",
    faqTitle: "Common questions",
    relatedTitle: "You May Also Like",
    exploreMoreTitle: "Explore More Maldives",
    allPackagesLink: "All Maldives Packages",
    englishVersionLink: "View this package in English",
  },
  transfersHub: {
    heroEyebrow: "Maldives transportation",
    title: "Maldives Transfers",
    description: "Real airport, resort, island and speedboat transfer routes across the Maldives — search by destination, or request a private charter.",
    introP1: "Every route below is a real, individually verified transfer — not a generic estimate. See the full English listing for search and filters.",
    introP2: "Resort transfers run on each resort's own schedule; local-island transfers mostly run by public ferry or private speedboat.",
    airportSectionTitle: "Maldives Airport Transfers",
    resortSectionTitle: "Resort Transfers",
    islandSectionTitle: "Island Transfers",
    faqTitle: "Common questions",
    faqs: [
      {
        question: "How do Maldives airport transfers work?",
        answer: "You land at Velana International Airport, then continue by speedboat, ferry, seaplane, or domestic flight depending on your destination.",
      },
      {
        question: "Are Maldives speedboat transfers shared?",
        answer: "Both — most resorts offer a scheduled shared transfer, and a private transfer or full charter is also usually available. Each route page shows what's actually on offer.",
      },
      {
        question: "How early should I arrange my transfer?",
        answer: "As soon as your accommodation is confirmed, especially for resorts that time transfers to specific flights.",
      },
      {
        question: "What's the difference between a resort transfer and an island transfer?",
        answer: "A resort transfer goes to a private resort island; an island transfer goes to a local, inhabited Maldivian island with hotels or guesthouses rather than a resort.",
      },
    ],
    exploreMoreTitle: "Explore More Maldives",
  },
  transferDetail: {
    eyebrow: "Transfer route",
    fromLabel: "From",
    toLabel: "To",
    durationLabel: "Typical duration",
    distanceLabel: "Distance",
    reverseRoutePrompt: "Travelling the other way?",
    servicesTitle: "Transfer services",
    noServicesNote: "No verified transfer services recorded for this route yet.",
    privateTransferTitle: "Private Transfer",
    privateTransferBody: "Prefer your own boat and your own schedule? A private transfer means a private group, flexible timing, and a custom arrangement for this route.",
    privateTransferCta: "Book This Trip as a Private Transfer",
    packagesUsingRouteTitle: "Packages Using This Route",
    faqTitle: "Common questions",
    relatedTitle: "Related Transfers",
    exploreMoreTitle: "Explore More Maldives",
    allTransfersLink: "All Maldives Transfers",
    englishVersionLink: "View this route in English",
    typeSpeedboat: "Speedboat",
    typeSeaplane: "Seaplane",
    typeDomesticFlight: "Domestic Flight",
    typeFerry: "Ferry",
    typePrivateYacht: "Private Yacht",
    typeLandTransfer: "Land Transfer",
    modeShared: "Shared",
    modePrivate: "Private",
  },
  footerLinks: {
    maldives: "Maldives",
    atolls: "Atolls",
    islands: "Islands",
    resorts: "Resorts",
    hotels: "Hotels",
    guesthouses: "Guesthouses",
    activities: "Activities",
    fishing: "Fishing",
    diving: "Diving",
    surfing: "Surfing",
    snorkeling: "Snorkeling",
    excursions: "Excursions",
    sandbankTours: "Sandbank Tours",
    waterSports: "Water Sports",
    islandHopping: "Island Hopping",
    dolphinWhaleWatching: "Dolphin & Whale Watching",
    sightseeing: "Sightseeing",
    transfers: "Transfers",
    airportTransfers: "Airport Transfers",
    resortTransfers: "Resort Transfers",
    islandTransfers: "Island Transfers",
    speedboatCharter: "Private Speedboat Charter",
    ferrySchedule: "Ferry Schedule",
    packages: "Packages",
    travelGuide: "Travel Guide",
    attractions: "Attractions",
    restaurants: "Restaurants",
    shops: "Shops",
    hospitals: "Hospitals",
    schools: "Schools",
    gyms: "Gyms",
  },
  fishingHub: {
    heroEyebrow: "Maldives fishing",
    title: "Maldives Fishing",
    description: "Real fishing charters and trips across the Maldives — private full-day and half-day charters, big game, reef and traditional fishing, sourced from real operators.",
    introP1: "Every trip below is real and individually verified — not a generic directory listing. See the full English listing for search and filters.",
    introP2: "Private charters give you your own boat and crew; shared and local trips are a lower-cost way to get out on the water.",
    featuredTitle: "Fishing Trips & Charters",
    faqTitle: "Common questions",
    faqs: [
      {
        question: "What kinds of fishing are available in the Maldives?",
        answer: "Big game trolling, reef and bottom fishing, traditional handline trips, and night fishing — each page shows the real trip on offer.",
      },
      {
        question: "Can I book a private charter?",
        answer: "Yes — most operators offer a private full-day or half-day charter with your own boat and crew.",
      },
    ],
    exploreMoreTitle: "Explore More Maldives",
  },
  divingHub: {
    heroEyebrow: "Maldives diving",
    title: "Maldives Diving",
    description: "Real diving trips, courses and dive centers across the Maldives — fun dives, PADI courses, and Discover Scuba Diving, sourced from real operators.",
    introP1: "Every dive below is real and individually verified — not a generic directory listing. See the full English listing for search and filters.",
    introP2: "A fun dive suits certified divers; PADI courses and Discover Scuba Diving are for beginners with no certification yet.",
    featuredTitle: "Diving Trips & Courses",
    faqTitle: "Common questions",
    faqs: [
      {
        question: "Do I need a certification to dive in the Maldives?",
        answer: "No — Discover Scuba Diving lets you dive with an instructor with no certification; PADI courses let you get certified.",
      },
      {
        question: "What's a fun dive?",
        answer: "A guided reef dive for already-certified divers, usually a single tank.",
      },
    ],
    exploreMoreTitle: "Explore More Maldives",
  },
  activitiesHub: {
    heroEyebrow: "Things to do",
    title: "Maldives Activities",
    description: "Real, bookable Maldives activities and excursions — island hopping, watersports, dolphin cruises, city tours and more.",
    introP1: "Every activity below is real and individually verified — not a generic directory listing. See the full English listing for search and filters.",
    introP2: "Fishing, diving and surfing each have their own dedicated section — this page covers everything else: watersports, excursions, island hopping and more.",
    featuredTitle: "Popular Activities",
    faqTitle: "Common questions",
    faqs: [
      {
        question: "How do I book an activity?",
        answer: "Open the activity's page and send an enquiry with your preferred date and group size — we follow up directly.",
      },
      {
        question: "Where do I find fishing, diving or surfing?",
        answer: "Those have their own dedicated sections — see Explore More below.",
      },
    ],
    exploreMoreTitle: "Explore More Maldives",
  },
  activityDetail: {
    durationLabel: "Duration",
    bookingIntro: "Tell us your preferred date and group size and we'll follow up on availability.",
    otherTripsTitle: "Other trips on",
    packagesFeaturingTitle: "Packages featuring",
    pickupLocationsTitle: "Available with pickup from",
    pickupLocationsIntro: "This trip offers pickup from any of these resorts and islands.",
    exploreMoreTitle: "Explore More Maldives",
    allFishingLink: "All Maldives Fishing",
    allDivingLink: "All Maldives Diving",
    allActivitiesLink: "All Maldives Activities",
    englishVersionLink: "View this page in English",
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
      "Die Malediven sind eine Nation aus Koralleninseln im Indischen Ozean, bestehend aus der Hauptstadt Male, einer Reihe von Resortinseln und ",
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
  packagesHub: {
    heroEyebrow: "Malediven-Urlaub",
    title: "Malediven Urlaubspakete",
    description: "Entdecken Sie Malediven-Urlaubs-, Flitterwochen-, Familien-, Tauch-, Angel-, Surf-, Luxus- und Budgetpakete – suchen, filtern und direkt anfragen.",
    introP1:
      "Jedes Paket unten ist eine echte, mehrtägige Reiseroute, zusammengestellt aus realer Unterkunft, Aktivitäten und Transfers – keine generische Vorlage. Durchstöbern Sie nach Stil, oder sehen Sie die vollständige englische Liste mit Suche und Filtern.",
    introP2:
      "Resortinsel-Pakete sind All-Inclusive-Aufenthalte auf einer einzigen Insel; Pakete auf lokalen Inseln kombinieren unabhängig geführte Gästehäuser mit denselben Riffen und Aktivitäten, meist zu einem deutlich niedrigeren Preis.",
    featuredTitle: "Ausgewählte Malediven-Pakete",
    styleTitle: "Pakete nach Stil durchsuchen",
    categoryLuxury: "Luxus",
    categoryFamily: "Familie",
    categoryAdultsOnly: "Nur für Erwachsene",
    categoryLongStay: "Langzeitaufenthalt",
    categoryBudget: "Budget",
    categoryHoneymoon: "Flitterwochen",
    categorySolo: "Alleinreisende",
    categoryDiving: "Tauchen",
    categoryFishing: "Angeln",
    categorySurfing: "Surfen",
    categoryLiveaboard: "Liveaboard",
    faqTitle: "Häufige Fragen",
    faqs: [
      {
        question: "Wie viele Nächte sollte ich auf den Malediven verbringen?",
        answer: "Die meisten Erstbesucher verbringen 5-7 Nächte. Kürzere Reisen (3-4 Nächte) eignen sich für einen schnellen Resort-Ausflug; Langzeitpakete (10+ Nächte) eignen sich für Reisende, die ein Resort mit einer lokalen Insel kombinieren oder echte Ruhezeit suchen.",
      },
      {
        question: "Sind bei Malediven-Paketen Flughafentransfers enthalten?",
        answer: "Das variiert je nach Paket – prüfen Sie den Abschnitt \"Enthalten\" auf der jeweiligen Paketseite. Die meisten Resort-Pakete beinhalten einen Speedboot- oder Wasserflugzeug-Transfer; Pakete auf lokalen Inseln nutzen meist die öffentliche Fähre.",
      },
      {
        question: "Kann ich ein Malediven-Paket individuell anpassen?",
        answer: "Ja – im Anfrageformular jedes Pakets können Sie Ihre bevorzugten Daten und etwaige Änderungen angeben. Wir bestätigen vor Ihrer Buchung, was tatsächlich möglich ist, abhängig von der tatsächlichen Verfügbarkeit.",
      },
      {
        question: "Sind Flüge in den Paketpreisen enthalten?",
        answer: "Nein – internationale Flüge zum Flughafen Velana International sind in keinem Paketpreis auf dieser Website enthalten; siehe den Abschnitt \"Nicht enthalten\" jedes Pakets.",
      },
    ],
    exploreMoreTitle: "Mehr von den Malediven entdecken",
  },
  articleDetail: {
    minRead: "Min. Lesezeit",
    relatedPlaces: "Passende Orte",
    relatedBookable: "Das könnte Sie auch interessieren",
    topic: "Thema",
    relatedArticles: "Weitere Reiseführer-Artikel",
    backToGuide: "← Zurück zum Reiseführer",
  },
  packageDetail: {
    eyebrow: "Malediven-Paket",
    nightsDays: "Nächte / Tage",
    fromPrice: "Ab",
    quoteOnRequest: "Preis auf Anfrage",
    perPerson: "pro Person",
    perCouple: "pro Paar",
    perPackage: "pro Paket",
    overviewTitle: "Übersicht",
    galleryTitle: "Galerie",
    highlightsTitle: "Highlights",
    bestForTitle: "Für wen dieses Paket geeignet ist",
    itineraryTitle: "Reiseroute",
    accommodationTitle: "Unterkunft",
    includedTitle: "Was ist enthalten",
    excludedTitle: "Was ist nicht enthalten",
    activitiesTitle: "Aktivitäten",
    destinationTitle: "Reiseziel",
    faqTitle: "Häufige Fragen",
    relatedTitle: "Das könnte Ihnen auch gefallen",
    exploreMoreTitle: "Mehr von den Malediven entdecken",
    allPackagesLink: "Alle Malediven-Pakete",
    englishVersionLink: "Dieses Paket auf Englisch ansehen",
  },
  transfersHub: {
    heroEyebrow: "Fortbewegung auf den Malediven",
    title: "Malediven-Transfers",
    description: "Echte Flughafen-, Resort-, Insel- und Speedboot-Transferrouten auf den Malediven — nach Ziel suchen oder eine private Charter anfragen.",
    introP1: "Jede Route unten ist ein echter, einzeln geprüfter Transfer — keine generische Schätzung. Die vollständige englische Liste bietet Suche und Filter.",
    introP2: "Resort-Transfers laufen nach dem eigenen Zeitplan des jeweiligen Resorts; Transfers zu lokalen Inseln erfolgen meist per öffentlicher Fähre oder privatem Speedboot.",
    airportSectionTitle: "Malediven-Flughafentransfers",
    resortSectionTitle: "Resort-Transfers",
    islandSectionTitle: "Inseltransfers",
    faqTitle: "Häufige Fragen",
    faqs: [
      {
        question: "Wie funktionieren Flughafentransfers auf den Malediven?",
        answer: "Sie landen am Flughafen Velana International und reisen dann je nach Ziel per Speedboot, Fähre, Wasserflugzeug oder Inlandsflug weiter.",
      },
      {
        question: "Sind Speedboot-Transfers auf den Malediven geteilt?",
        answer: "Beides — die meisten Resorts bieten einen geplanten geteilten Transfer an, meist ist auch ein privater Transfer oder eine Komplett-Charter verfügbar. Jede Routenseite zeigt, was tatsächlich angeboten wird.",
      },
      {
        question: "Wie früh sollte ich meinen Transfer organisieren?",
        answer: "Sobald Ihre Unterkunft bestätigt ist, besonders bei Resorts, die Transfers auf bestimmte Flüge abstimmen.",
      },
      {
        question: "Was ist der Unterschied zwischen einem Resort- und einem Inseltransfer?",
        answer: "Ein Resort-Transfer führt zu einer privaten Resortinsel; ein Inseltransfer führt zu einer bewohnten maledivischen Insel mit Hotels oder Gästehäusern statt zu einem Resort.",
      },
    ],
    exploreMoreTitle: "Mehr von den Malediven entdecken",
  },
  transferDetail: {
    eyebrow: "Transferroute",
    fromLabel: "Von",
    toLabel: "Nach",
    durationLabel: "Typische Dauer",
    distanceLabel: "Entfernung",
    reverseRoutePrompt: "Reisen Sie in die andere Richtung?",
    servicesTitle: "Transferangebote",
    noServicesNote: "Für diese Route sind noch keine geprüften Transferangebote erfasst.",
    privateTransferTitle: "Privater Transfer",
    privateTransferBody: "Bevorzugen Sie Ihr eigenes Boot und Ihren eigenen Zeitplan? Ein privater Transfer bedeutet eine private Gruppe, flexible Zeiten und eine individuelle Vereinbarung für diese Route.",
    privateTransferCta: "Diese Fahrt als privaten Transfer buchen",
    packagesUsingRouteTitle: "Pakete mit dieser Route",
    faqTitle: "Häufige Fragen",
    relatedTitle: "Ähnliche Transfers",
    exploreMoreTitle: "Mehr von den Malediven entdecken",
    allTransfersLink: "Alle Malediven-Transfers",
    englishVersionLink: "Diese Route auf Englisch ansehen",
    typeSpeedboat: "Speedboot",
    typeSeaplane: "Wasserflugzeug",
    typeDomesticFlight: "Inlandsflug",
    typeFerry: "Fähre",
    typePrivateYacht: "Private Yacht",
    typeLandTransfer: "Landtransfer",
    modeShared: "Geteilt",
    modePrivate: "Privat",
  },
  footerLinks: {
    maldives: "Malediven",
    atolls: "Atolle",
    islands: "Inseln",
    resorts: "Resorts",
    hotels: "Hotels",
    guesthouses: "Gästehäuser",
    activities: "Aktivitäten",
    fishing: "Angeln",
    diving: "Tauchen",
    surfing: "Surfen",
    snorkeling: "Schnorcheln",
    excursions: "Ausflüge",
    sandbankTours: "Sandbank-Touren",
    waterSports: "Wassersport",
    islandHopping: "Inselhüpfen",
    dolphinWhaleWatching: "Delfin- & Walbeobachtung",
    sightseeing: "Sightseeing",
    transfers: "Transfer",
    airportTransfers: "Flughafentransfers",
    resortTransfers: "Resort-Transfers",
    islandTransfers: "Inseltransfers",
    speedboatCharter: "Private Speedboot-Charter",
    ferrySchedule: "Fährplan",
    packages: "Pakete",
    travelGuide: "Reiseführer",
    attractions: "Attraktionen",
    restaurants: "Restaurants",
    shops: "Geschäfte",
    hospitals: "Krankenhäuser",
    schools: "Schulen",
    gyms: "Fitnessstudios",
  },
  fishingHub: {
    heroEyebrow: "Angeln auf den Malediven",
    title: "Angeln auf den Malediven",
    description: "Echte Angelcharter und -ausflüge auf den Malediven — private Ganztags- und Halbtagscharter, Big-Game-, Riff- und traditionelles Angeln, von echten Anbietern.",
    introP1: "Jeder Ausflug unten ist real und einzeln geprüft — kein generisches Verzeichnis. Die vollständige englische Liste bietet Suche und Filter.",
    introP2: "Private Charter bieten ein eigenes Boot und eine eigene Crew; geteilte und lokale Ausflüge sind eine günstigere Möglichkeit, aufs Wasser zu kommen.",
    featuredTitle: "Angelausflüge & Charter",
    faqTitle: "Häufige Fragen",
    faqs: [
      {
        question: "Welche Arten des Angelns gibt es auf den Malediven?",
        answer: "Big-Game-Schleppangeln, Riff- und Grundangeln, traditionelles Handleinenangeln und Nachtangeln — jede Seite zeigt den tatsächlichen Ausflug.",
      },
      {
        question: "Kann ich einen privaten Charter buchen?",
        answer: "Ja — die meisten Anbieter bieten einen privaten Ganztags- oder Halbtagscharter mit eigenem Boot und eigener Crew an.",
      },
    ],
    exploreMoreTitle: "Mehr von den Malediven entdecken",
  },
  divingHub: {
    heroEyebrow: "Tauchen auf den Malediven",
    title: "Tauchen auf den Malediven",
    description: "Echte Tauchausflüge, Kurse und Tauchzentren auf den Malediven — Fun Dives, PADI-Kurse und Discover Scuba Diving, von echten Anbietern.",
    introP1: "Jeder Tauchgang unten ist real und einzeln geprüft — kein generisches Verzeichnis. Die vollständige englische Liste bietet Suche und Filter.",
    introP2: "Ein Fun Dive eignet sich für zertifizierte Taucher; PADI-Kurse und Discover Scuba Diving sind für Anfänger ohne Zertifizierung.",
    featuredTitle: "Tauchausflüge & Kurse",
    faqTitle: "Häufige Fragen",
    faqs: [
      {
        question: "Brauche ich eine Zertifizierung, um auf den Malediven zu tauchen?",
        answer: "Nein — bei Discover Scuba Diving tauchen Sie mit einem Lehrer ohne Zertifizierung; PADI-Kurse ermöglichen eine Zertifizierung.",
      },
      {
        question: "Was ist ein Fun Dive?",
        answer: "Ein geführter Riff-Tauchgang für bereits zertifizierte Taucher, meist mit einer Flasche.",
      },
    ],
    exploreMoreTitle: "Mehr von den Malediven entdecken",
  },
  activitiesHub: {
    heroEyebrow: "Unternehmungen",
    title: "Aktivitäten auf den Malediven",
    description: "Echte, buchbare Aktivitäten und Ausflüge auf den Malediven — Inselhüpfen, Wassersport, Delfintouren, Stadtrundfahrten und mehr.",
    introP1: "Jede Aktivität unten ist real und einzeln geprüft — kein generisches Verzeichnis. Die vollständige englische Liste bietet Suche und Filter.",
    introP2: "Angeln, Tauchen und Surfen haben jeweils ihren eigenen Bereich — diese Seite deckt alles andere ab: Wassersport, Ausflüge, Inselhüpfen und mehr.",
    featuredTitle: "Beliebte Aktivitäten",
    faqTitle: "Häufige Fragen",
    faqs: [
      {
        question: "Wie buche ich eine Aktivität?",
        answer: "Öffnen Sie die Seite der Aktivität und senden Sie eine Anfrage mit Ihrem bevorzugten Datum und Ihrer Gruppengröße — wir melden uns direkt.",
      },
      {
        question: "Wo finde ich Angeln, Tauchen oder Surfen?",
        answer: "Diese haben ihre eigenen Bereiche — siehe „Mehr entdecken\" unten.",
      },
    ],
    exploreMoreTitle: "Mehr von den Malediven entdecken",
  },
  activityDetail: {
    durationLabel: "Dauer",
    bookingIntro: "Teilen Sie uns Ihr bevorzugtes Datum und Ihre Gruppengröße mit — wir melden uns zur Verfügbarkeit.",
    otherTripsTitle: "Weitere Ausflüge auf",
    packagesFeaturingTitle: "Pakete mit",
    pickupLocationsTitle: "Verfügbar mit Abholung von",
    pickupLocationsIntro: "Dieser Ausflug bietet Abholung von jedem dieser Resorts und Inseln.",
    exploreMoreTitle: "Mehr von den Malediven entdecken",
    allFishingLink: "Alle Malediven-Angelausflüge",
    allDivingLink: "Alle Malediven-Tauchausflüge",
    allActivitiesLink: "Alle Malediven-Aktivitäten",
    englishVersionLink: "Diese Seite auf Englisch ansehen",
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
    introPrefix: "Maldivas es una nación de atolones de coral en el Océano Índico, formada por la capital Male, un conjunto de islas resort y ",
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
  packagesHub: {
    heroEyebrow: "Vacaciones en Maldivas",
    title: "Paquetes Vacacionales de Maldivas",
    description: "Descubre paquetes de vacaciones, luna de miel, familia, buceo, pesca, surf, lujo y presupuesto en Maldivas — busca, filtra y consulta directamente.",
    introP1:
      "Cada paquete a continuación es un itinerario real de varios días, construido con alojamiento, actividades y traslados reales, no una plantilla genérica. Explora por estilo, o consulta el listado completo en inglés para buscar y filtrar.",
    introP2:
      "Los paquetes de isla-resort son estancias todo incluido en una sola propiedad; los paquetes de isla local combinan pensiones gestionadas de forma independiente con los mismos arrecifes y actividades, normalmente a un precio mucho más bajo.",
    featuredTitle: "Paquetes Destacados de Maldivas",
    styleTitle: "Explorar Paquetes por Estilo",
    categoryLuxury: "Lujo",
    categoryFamily: "Familia",
    categoryAdultsOnly: "Solo Adultos",
    categoryLongStay: "Estancia Larga",
    categoryBudget: "Económico",
    categoryHoneymoon: "Luna de Miel",
    categorySolo: "Viajero Solo",
    categoryDiving: "Buceo",
    categoryFishing: "Pesca",
    categorySurfing: "Surf",
    categoryLiveaboard: "Liveaboard",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        question: "¿Cuántas noches debería pasar en Maldivas?",
        answer: "La mayoría de los visitantes primerizos pasan 5-7 noches. Los viajes más cortos (3-4 noches) son adecuados para una escapada rápida al resort; los paquetes de estancia larga (10+ noches) convienen a quienes combinan un resort con una isla local, o buscan un descanso genuino.",
      },
      {
        question: "¿Los paquetes de Maldivas incluyen traslados al aeropuerto?",
        answer: "Varía según el paquete — consulta la sección \"Incluye\" en la página de cada paquete. La mayoría de los paquetes en resorts incluyen un traslado en lancha rápida o hidroavión; los paquetes de isla local suelen usar el ferri público.",
      },
      {
        question: "¿Puedo personalizar un paquete de Maldivas?",
        answer: "Sí — el formulario de consulta de cada paquete te permite indicar tus fechas preferidas y cualquier cambio. Confirmamos lo que realmente es posible antes de reservar, según la disponibilidad real.",
      },
      {
        question: "¿Los vuelos están incluidos en el precio del paquete?",
        answer: "No — los vuelos internacionales al Aeropuerto Internacional de Velana nunca están incluidos en el precio de ningún paquete de este sitio; consulta la sección \"No incluye\" de cada paquete.",
      },
    ],
    exploreMoreTitle: "Explorar Más de Maldivas",
  },
  articleDetail: {
    minRead: "min. de lectura",
    relatedPlaces: "Lugares relacionados",
    relatedBookable: "También te puede interesar",
    topic: "Tema",
    relatedArticles: "Más artículos de la Guía de Viaje",
    backToGuide: "← Volver a la Guía de Viaje",
  },
  packageDetail: {
    eyebrow: "Paquete de Maldivas",
    nightsDays: "Noches / Días",
    fromPrice: "Desde",
    quoteOnRequest: "Precio a consultar",
    perPerson: "por persona",
    perCouple: "por pareja",
    perPackage: "por paquete",
    overviewTitle: "Resumen",
    galleryTitle: "Galería",
    highlightsTitle: "Puntos destacados",
    bestForTitle: "Para quién es este paquete",
    itineraryTitle: "Itinerario",
    accommodationTitle: "Alojamiento",
    includedTitle: "Qué incluye",
    excludedTitle: "Qué no incluye",
    activitiesTitle: "Actividades",
    destinationTitle: "Destino",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "También te puede gustar",
    exploreMoreTitle: "Explorar Más de Maldivas",
    allPackagesLink: "Todos los Paquetes de Maldivas",
    englishVersionLink: "Ver este paquete en inglés",
  },
  transfersHub: {
    heroEyebrow: "Transporte en Maldivas",
    title: "Traslados en Maldivas",
    description: "Rutas reales de traslado en aeropuerto, resort, isla y lancha rápida por todas las Maldivas — busca por destino o solicita un chárter privado.",
    introP1: "Cada ruta de abajo es un traslado real, verificado individualmente — no una estimación genérica. Consulta el listado completo en inglés para buscar y filtrar.",
    introP2: "Los traslados de resort siguen el propio horario de cada resort; los traslados a islas locales se hacen principalmente en ferry público o lancha rápida privada.",
    airportSectionTitle: "Traslados del Aeropuerto de Maldivas",
    resortSectionTitle: "Traslados a Resorts",
    islandSectionTitle: "Traslados a Islas",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        question: "¿Cómo funcionan los traslados del aeropuerto en Maldivas?",
        answer: "Aterrizas en el Aeropuerto Internacional de Velana y luego continúas en lancha rápida, ferry, hidroavión o vuelo doméstico según tu destino.",
      },
      {
        question: "¿Los traslados en lancha rápida en Maldivas son compartidos?",
        answer: "Ambos — la mayoría de los resorts ofrecen un traslado compartido programado, y normalmente también hay disponible un traslado privado o chárter completo. Cada página de ruta muestra lo que realmente se ofrece.",
      },
      {
        question: "¿Con cuánta antelación debo organizar mi traslado?",
        answer: "En cuanto se confirme tu alojamiento, especialmente en resorts que ajustan los traslados a vuelos específicos.",
      },
      {
        question: "¿Cuál es la diferencia entre un traslado de resort y un traslado de isla?",
        answer: "Un traslado de resort va a una isla privada de resort; un traslado de isla va a una isla maldiva habitada con hoteles o pensiones en lugar de un resort.",
      },
    ],
    exploreMoreTitle: "Explorar Más de Maldivas",
  },
  transferDetail: {
    eyebrow: "Ruta de traslado",
    fromLabel: "Desde",
    toLabel: "Hasta",
    durationLabel: "Duración típica",
    distanceLabel: "Distancia",
    reverseRoutePrompt: "¿Viajas en sentido contrario?",
    servicesTitle: "Servicios de traslado",
    noServicesNote: "Aún no hay servicios de traslado verificados registrados para esta ruta.",
    privateTransferTitle: "Traslado Privado",
    privateTransferBody: "¿Prefieres tu propio barco y tu propio horario? Un traslado privado significa un grupo privado, horario flexible y un arreglo personalizado para esta ruta.",
    privateTransferCta: "Reservar Este Viaje como Traslado Privado",
    packagesUsingRouteTitle: "Paquetes que Usan Esta Ruta",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Traslados Relacionados",
    exploreMoreTitle: "Explorar Más de Maldivas",
    allTransfersLink: "Todos los Traslados de Maldivas",
    englishVersionLink: "Ver esta ruta en inglés",
    typeSpeedboat: "Lancha rápida",
    typeSeaplane: "Hidroavión",
    typeDomesticFlight: "Vuelo doméstico",
    typeFerry: "Ferry",
    typePrivateYacht: "Yate privado",
    typeLandTransfer: "Traslado terrestre",
    modeShared: "Compartido",
    modePrivate: "Privado",
  },
  footerLinks: {
    maldives: "Maldivas",
    atolls: "Atolones",
    islands: "Islas",
    resorts: "Resorts",
    hotels: "Hoteles",
    guesthouses: "Pensiones",
    activities: "Actividades",
    fishing: "Pesca",
    diving: "Buceo",
    surfing: "Surf",
    snorkeling: "Esnórquel",
    excursions: "Excursiones",
    sandbankTours: "Tours a Bancos de Arena",
    waterSports: "Deportes Acuáticos",
    islandHopping: "Isla en Isla",
    dolphinWhaleWatching: "Avistamiento de Delfines y Ballenas",
    sightseeing: "Turismo",
    transfers: "Traslados",
    airportTransfers: "Traslados de Aeropuerto",
    resortTransfers: "Traslados de Resort",
    islandTransfers: "Traslados de Isla",
    speedboatCharter: "Chárter de Lancha Privada",
    ferrySchedule: "Horario de Ferris",
    packages: "Paquetes",
    travelGuide: "Guía de Viaje",
    attractions: "Atracciones",
    restaurants: "Restaurantes",
    shops: "Tiendas",
    hospitals: "Hospitales",
    schools: "Escuelas",
    gyms: "Gimnasios",
  },
  fishingHub: {
    heroEyebrow: "Pesca en Maldivas",
    title: "Pesca en Maldivas",
    description: "Chárteres y excursiones de pesca reales por toda Maldivas — chárteres privados de día completo y medio día, pesca de altura, de arrecife y tradicional, de operadores reales.",
    introP1: "Cada excursión de abajo es real y verificada individualmente — no un directorio genérico. Consulta el listado completo en inglés para buscar y filtrar.",
    introP2: "Los chárteres privados ofrecen tu propio barco y tripulación; las excursiones compartidas y locales son una forma más económica de salir al agua.",
    featuredTitle: "Excursiones y Chárteres de Pesca",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        question: "¿Qué tipos de pesca hay disponibles en Maldivas?",
        answer: "Pesca de altura con señuelo, pesca de arrecife y de fondo, excursiones tradicionales con sedal de mano y pesca nocturna — cada página muestra la excursión real disponible.",
      },
      {
        question: "¿Puedo reservar un chárter privado?",
        answer: "Sí — la mayoría de operadores ofrecen un chárter privado de día completo o medio día con tu propio barco y tripulación.",
      },
    ],
    exploreMoreTitle: "Explorar Más de Maldivas",
  },
  divingHub: {
    heroEyebrow: "Buceo en Maldivas",
    title: "Buceo en Maldivas",
    description: "Excursiones de buceo, cursos y centros de buceo reales por toda Maldivas — inmersiones de ocio, cursos PADI y Discover Scuba Diving, de operadores reales.",
    introP1: "Cada inmersión de abajo es real y verificada individualmente — no un directorio genérico. Consulta el listado completo en inglés para buscar y filtrar.",
    introP2: "Una inmersión de ocio es para buceadores certificados; los cursos PADI y Discover Scuba Diving son para principiantes sin certificación.",
    featuredTitle: "Excursiones y Cursos de Buceo",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        question: "¿Necesito una certificación para bucear en Maldivas?",
        answer: "No — con Discover Scuba Diving buceas con un instructor sin certificación; los cursos PADI te permiten certificarte.",
      },
      {
        question: "¿Qué es una inmersión de ocio?",
        answer: "Una inmersión guiada en arrecife para buceadores ya certificados, normalmente con una botella.",
      },
    ],
    exploreMoreTitle: "Explorar Más de Maldivas",
  },
  activitiesHub: {
    heroEyebrow: "Qué hacer",
    title: "Actividades en Maldivas",
    description: "Actividades y excursiones reales y reservables en Maldivas — isla en isla, deportes acuáticos, cruceros de delfines, tours urbanos y más.",
    introP1: "Cada actividad de abajo es real y verificada individualmente — no un directorio genérico. Consulta el listado completo en inglés para buscar y filtrar.",
    introP2: "La pesca, el buceo y el surf tienen cada uno su propia sección — esta página cubre todo lo demás: deportes acuáticos, excursiones, isla en isla y más.",
    featuredTitle: "Actividades Populares",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        question: "¿Cómo reservo una actividad?",
        answer: "Abre la página de la actividad y envía una consulta con tu fecha y tamaño de grupo preferidos — te responderemos directamente.",
      },
      {
        question: "¿Dónde encuentro pesca, buceo o surf?",
        answer: "Esos tienen sus propias secciones — ver Explorar Más abajo.",
      },
    ],
    exploreMoreTitle: "Explorar Más de Maldivas",
  },
  activityDetail: {
    durationLabel: "Duración",
    bookingIntro: "Indícanos tu fecha y tamaño de grupo preferidos y te responderemos sobre disponibilidad.",
    otherTripsTitle: "Otras excursiones en",
    packagesFeaturingTitle: "Paquetes que incluyen",
    pickupLocationsTitle: "Disponible con recogida desde",
    pickupLocationsIntro: "Esta excursión ofrece recogida desde cualquiera de estos resorts e islas.",
    exploreMoreTitle: "Explorar Más de Maldivas",
    allFishingLink: "Toda la Pesca en Maldivas",
    allDivingLink: "Todo el Buceo en Maldivas",
    allActivitiesLink: "Todas las Actividades en Maldivas",
    englishVersionLink: "Ver esta página en inglés",
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
    introPrefix: "Le Maldive sono una nazione di atolli corallini nell'Oceano Indiano, formata dalla capitale Male, un insieme di isole resort e ",
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
  packagesHub: {
    heroEyebrow: "Vacanze alle Maldive",
    title: "Pacchetti Vacanza alle Maldive",
    description: "Scopri pacchetti vacanza, luna di miele, famiglia, immersioni, pesca, surf, lusso ed economici alle Maldive — cerca, filtra e richiedi informazioni direttamente.",
    introP1:
      "Ogni pacchetto qui sotto è un itinerario reale di più giorni, costruito con alloggi, attività e trasferimenti reali — non un modello generico. Esplora per stile, oppure consulta l'elenco completo in inglese per la ricerca e i filtri.",
    introP2:
      "I pacchetti su isola-resort sono soggiorni all-inclusive in un'unica proprietà; i pacchetti su isola locale combinano guesthouse gestite in modo indipendente con le stesse barriere coralline e attività, solitamente a un prezzo molto più basso.",
    featuredTitle: "Pacchetti in Evidenza alle Maldive",
    styleTitle: "Esplora i Pacchetti per Stile",
    categoryLuxury: "Lusso",
    categoryFamily: "Famiglia",
    categoryAdultsOnly: "Solo Adulti",
    categoryLongStay: "Soggiorno Lungo",
    categoryBudget: "Economico",
    categoryHoneymoon: "Luna di Miele",
    categorySolo: "Viaggiatore Singolo",
    categoryDiving: "Immersioni",
    categoryFishing: "Pesca",
    categorySurfing: "Surf",
    categoryLiveaboard: "Liveaboard",
    faqTitle: "Domande frequenti",
    faqs: [
      {
        question: "Quante notti dovrei trascorrere alle Maldive?",
        answer: "La maggior parte dei visitatori alle prime armi trascorre 5-7 notti. I viaggi più brevi (3-4 notti) sono adatti per una rapida fuga in resort; i pacchetti di lunga durata (10+ notti) sono adatti a chi combina un resort con un'isola locale, o desidera un vero riposo.",
      },
      {
        question: "I pacchetti delle Maldive includono i trasferimenti aeroportuali?",
        answer: "Varia in base al pacchetto — controlla la sezione \"Incluso\" nella pagina di ciascun pacchetto. La maggior parte dei pacchetti basati su resort include un trasferimento in motoscafo o hydroplane; i pacchetti su isola locale di solito usano il traghetto pubblico.",
      },
      {
        question: "Posso personalizzare un pacchetto alle Maldive?",
        answer: "Sì — il modulo di richiesta di ogni pacchetto ti permette di indicare le date preferite e eventuali modifiche. Confermiamo cosa è effettivamente possibile prima della prenotazione, in base alla disponibilità reale.",
      },
      {
        question: "I voli sono inclusi nel prezzo del pacchetto?",
        answer: "No — i voli internazionali per l'Aeroporto Internazionale di Velana non sono mai inclusi nel prezzo di nessun pacchetto su questo sito; consulta la sezione \"Escluso\" di ogni pacchetto.",
      },
    ],
    exploreMoreTitle: "Esplora Altro delle Maldive",
  },
  articleDetail: {
    minRead: "min di lettura",
    relatedPlaces: "Luoghi correlati",
    relatedBookable: "Potrebbe interessarti anche",
    topic: "Argomento",
    relatedArticles: "Altri articoli della Guida di Viaggio",
    backToGuide: "← Torna alla Guida di Viaggio",
  },
  packageDetail: {
    eyebrow: "Pacchetto Maldive",
    nightsDays: "Notti / Giorni",
    fromPrice: "Da",
    quoteOnRequest: "Preventivo su richiesta",
    perPerson: "a persona",
    perCouple: "a coppia",
    perPackage: "a pacchetto",
    overviewTitle: "Panoramica",
    galleryTitle: "Galleria",
    highlightsTitle: "Punti salienti",
    bestForTitle: "Per chi è adatto questo pacchetto",
    itineraryTitle: "Itinerario",
    accommodationTitle: "Alloggio",
    includedTitle: "Cosa è incluso",
    excludedTitle: "Cosa non è incluso",
    activitiesTitle: "Attività",
    destinationTitle: "Destinazione",
    faqTitle: "Domande frequenti",
    relatedTitle: "Potrebbe interessarti anche",
    exploreMoreTitle: "Esplora Altro delle Maldive",
    allPackagesLink: "Tutti i Pacchetti delle Maldive",
    englishVersionLink: "Visualizza questo pacchetto in inglese",
  },
  transfersHub: {
    heroEyebrow: "Trasporti alle Maldive",
    title: "Trasferimenti alle Maldive",
    description: "Percorsi di trasferimento reali per aeroporto, resort, isola e motoscafo in tutte le Maldive — cerca per destinazione o richiedi un charter privato.",
    introP1: "Ogni percorso qui sotto è un trasferimento reale, verificato individualmente — non una stima generica. Consulta l'elenco completo in inglese per ricerca e filtri.",
    introP2: "I trasferimenti per resort seguono l'orario del resort stesso; i trasferimenti verso isole locali avvengono principalmente tramite traghetto pubblico o motoscafo privato.",
    airportSectionTitle: "Trasferimenti dall'Aeroporto delle Maldive",
    resortSectionTitle: "Trasferimenti per Resort",
    islandSectionTitle: "Trasferimenti per Isole",
    faqTitle: "Domande frequenti",
    faqs: [
      {
        question: "Come funzionano i trasferimenti aeroportuali alle Maldive?",
        answer: "Si arriva all'Aeroporto Internazionale di Velana e si prosegue poi in motoscafo, traghetto, hydroplane o volo nazionale in base alla destinazione.",
      },
      {
        question: "I trasferimenti in motoscafo alle Maldive sono condivisi?",
        answer: "Entrambi — la maggior parte dei resort offre un trasferimento condiviso programmato, ed è generalmente disponibile anche un trasferimento privato o un charter completo. Ogni pagina del percorso mostra cosa è realmente offerto.",
      },
      {
        question: "Con quanto anticipo dovrei organizzare il mio trasferimento?",
        answer: "Non appena l'alloggio è confermato, soprattutto per i resort che programmano i trasferimenti su voli specifici.",
      },
      {
        question: "Qual è la differenza tra un trasferimento per resort e un trasferimento per isola?",
        answer: "Un trasferimento per resort porta a un'isola privata di un resort; un trasferimento per isola porta a un'isola maldiviana abitata con hotel o guesthouse invece di un resort.",
      },
    ],
    exploreMoreTitle: "Esplora Altro delle Maldive",
  },
  transferDetail: {
    eyebrow: "Percorso di trasferimento",
    fromLabel: "Da",
    toLabel: "A",
    durationLabel: "Durata tipica",
    distanceLabel: "Distanza",
    reverseRoutePrompt: "Viaggi nella direzione opposta?",
    servicesTitle: "Servizi di trasferimento",
    noServicesNote: "Nessun servizio di trasferimento verificato ancora registrato per questo percorso.",
    privateTransferTitle: "Trasferimento Privato",
    privateTransferBody: "Preferisci la tua barca e il tuo orario? Un trasferimento privato significa un gruppo privato, orari flessibili e un accordo personalizzato per questo percorso.",
    privateTransferCta: "Prenota Questo Viaggio come Trasferimento Privato",
    packagesUsingRouteTitle: "Pacchetti che Usano Questo Percorso",
    faqTitle: "Domande frequenti",
    relatedTitle: "Trasferimenti Correlati",
    exploreMoreTitle: "Esplora Altro delle Maldive",
    allTransfersLink: "Tutti i Trasferimenti delle Maldive",
    englishVersionLink: "Visualizza questo percorso in inglese",
    typeSpeedboat: "Motoscafo",
    typeSeaplane: "Hydroplane",
    typeDomesticFlight: "Volo nazionale",
    typeFerry: "Traghetto",
    typePrivateYacht: "Yacht privato",
    typeLandTransfer: "Trasferimento terrestre",
    modeShared: "Condiviso",
    modePrivate: "Privato",
  },
  footerLinks: {
    maldives: "Maldive",
    atolls: "Atolli",
    islands: "Isole",
    resorts: "Resort",
    hotels: "Hotel",
    guesthouses: "Guesthouse",
    activities: "Attività",
    fishing: "Pesca",
    diving: "Immersioni",
    surfing: "Surf",
    snorkeling: "Snorkeling",
    excursions: "Escursioni",
    sandbankTours: "Tour ai Banchi di Sabbia",
    waterSports: "Sport Acquatici",
    islandHopping: "Island Hopping",
    dolphinWhaleWatching: "Avvistamento Delfini e Balene",
    sightseeing: "Turismo",
    transfers: "Trasferimenti",
    airportTransfers: "Trasferimenti Aeroportuali",
    resortTransfers: "Trasferimenti Resort",
    islandTransfers: "Trasferimenti Isola",
    speedboatCharter: "Charter Privato di Motoscafo",
    ferrySchedule: "Orario dei Traghetti",
    packages: "Pacchetti",
    travelGuide: "Guida di Viaggio",
    attractions: "Attrazioni",
    restaurants: "Ristoranti",
    shops: "Negozi",
    hospitals: "Ospedali",
    schools: "Scuole",
    gyms: "Palestre",
  },
  fishingHub: {
    heroEyebrow: "Pesca alle Maldive",
    title: "Pesca alle Maldive",
    description: "Charter ed escursioni di pesca reali in tutte le Maldive — charter privati di giornata intera e mezza giornata, pesca d'altura, di barriera e tradizionale, da operatori reali.",
    introP1: "Ogni escursione qui sotto è reale e verificata individualmente — non un elenco generico. Consulta l'elenco completo in inglese per ricerca e filtri.",
    introP2: "I charter privati offrono una barca e un equipaggio propri; le escursioni condivise e locali sono un modo più economico per uscire in acqua.",
    featuredTitle: "Escursioni e Charter di Pesca",
    faqTitle: "Domande frequenti",
    faqs: [
      {
        question: "Quali tipi di pesca sono disponibili alle Maldive?",
        answer: "Traina d'altura, pesca di barriera e di fondo, escursioni tradizionali con lenza a mano e pesca notturna — ogni pagina mostra l'escursione reale disponibile.",
      },
      {
        question: "Posso prenotare un charter privato?",
        answer: "Sì — la maggior parte degli operatori offre un charter privato di giornata intera o mezza giornata con barca ed equipaggio propri.",
      },
    ],
    exploreMoreTitle: "Esplora Altro delle Maldive",
  },
  divingHub: {
    heroEyebrow: "Immersioni alle Maldive",
    title: "Immersioni alle Maldive",
    description: "Escursioni di immersione, corsi e diving center reali in tutte le Maldive — immersioni ricreative, corsi PADI e Discover Scuba Diving, da operatori reali.",
    introP1: "Ogni immersione qui sotto è reale e verificata individualmente — non un elenco generico. Consulta l'elenco completo in inglese per ricerca e filtri.",
    introP2: "Un'immersione ricreativa è per sub già certificati; i corsi PADI e il Discover Scuba Diving sono per principianti senza certificazione.",
    featuredTitle: "Escursioni e Corsi di Immersione",
    faqTitle: "Domande frequenti",
    faqs: [
      {
        question: "Serve una certificazione per immergersi alle Maldive?",
        answer: "No — con il Discover Scuba Diving ti immergi con un istruttore senza certificazione; i corsi PADI permettono di certificarsi.",
      },
      {
        question: "Cos'è un'immersione ricreativa?",
        answer: "Un'immersione guidata in barriera per sub già certificati, di solito con una bombola.",
      },
    ],
    exploreMoreTitle: "Esplora Altro delle Maldive",
  },
  activitiesHub: {
    heroEyebrow: "Cosa fare",
    title: "Attività alle Maldive",
    description: "Attività ed escursioni reali e prenotabili alle Maldive — island hopping, sport acquatici, crociere con i delfini, tour cittadini e altro.",
    introP1: "Ogni attività qui sotto è reale e verificata individualmente — non un elenco generico. Consulta l'elenco completo in inglese per ricerca e filtri.",
    introP2: "Pesca, immersioni e surf hanno ciascuno una propria sezione — questa pagina copre tutto il resto: sport acquatici, escursioni, island hopping e altro.",
    featuredTitle: "Attività Popolari",
    faqTitle: "Domande frequenti",
    faqs: [
      {
        question: "Come prenoto un'attività?",
        answer: "Apri la pagina dell'attività e invia una richiesta con la data e la dimensione del gruppo preferite — ti risponderemo direttamente.",
      },
      {
        question: "Dove trovo pesca, immersioni o surf?",
        answer: "Hanno le loro sezioni dedicate — vedi Esplora Altro qui sotto.",
      },
    ],
    exploreMoreTitle: "Esplora Altro delle Maldive",
  },
  activityDetail: {
    durationLabel: "Durata",
    bookingIntro: "Indicaci la data e la dimensione del gruppo preferite e ti risponderemo sulla disponibilità.",
    otherTripsTitle: "Altre escursioni a",
    packagesFeaturingTitle: "Pacchetti che includono",
    pickupLocationsTitle: "Disponibile con pickup da",
    pickupLocationsIntro: "Questa escursione offre il pickup da uno di questi resort e isole.",
    exploreMoreTitle: "Esplora Altro delle Maldive",
    allFishingLink: "Tutta la Pesca alle Maldive",
    allDivingLink: "Tutte le Immersioni alle Maldive",
    allActivitiesLink: "Tutte le Attività alle Maldive",
    englishVersionLink: "Visualizza questa pagina in inglese",
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
  packagesHub: {
    heroEyebrow: "Отдых на Мальдивах",
    title: "Туристические пакеты на Мальдивы",
    description: "Откройте для себя туристические, свадебные, семейные, дайвинг-, рыболовные, серф-, люксовые и бюджетные пакеты на Мальдивы — ищите, фильтруйте и отправляйте запрос напрямую.",
    introP1:
      "Каждый пакет ниже — это реальный многодневный маршрут, составленный из реального проживания, активностей и трансферов, а не общий шаблон. Просматривайте по стилю или смотрите полный список на английском языке с поиском и фильтрами.",
    introP2:
      "Пакеты на курортных островах — это проживание всё включено на одном острове; пакеты на местных островах сочетают независимо управляемые гестхаусы с теми же рифами и активностями, обычно по гораздо более низкой цене.",
    featuredTitle: "Популярные пакеты на Мальдивы",
    styleTitle: "Выбрать пакет по стилю",
    categoryLuxury: "Люкс",
    categoryFamily: "Семейный",
    categoryAdultsOnly: "Только для взрослых",
    categoryLongStay: "Долгосрочное проживание",
    categoryBudget: "Бюджетный",
    categoryHoneymoon: "Медовый месяц",
    categorySolo: "Для одиночных путешественников",
    categoryDiving: "Дайвинг",
    categoryFishing: "Рыбалка",
    categorySurfing: "Серфинг",
    categoryLiveaboard: "Лайвабоард",
    faqTitle: "Часто задаваемые вопросы",
    faqs: [
      {
        question: "Сколько ночей нужно провести на Мальдивах?",
        answer: "Большинство новичков проводят 5-7 ночей. Короткие поездки (3-4 ночи) подходят для быстрого отдыха на курорте; пакеты на долгий срок (10+ ночей) подходят путешественникам, сочетающим курорт с местным островом, или желающим настоящего отдыха.",
      },
      {
        question: "Включены ли трансферы из аэропорта в пакеты на Мальдивы?",
        answer: "Это зависит от пакета — проверьте раздел «Включено» на странице каждого пакета. Большинство курортных пакетов включают трансфер на speedboat или гидросамолёте; пакеты на местных островах обычно используют общественный паром.",
      },
      {
        question: "Можно ли настроить пакет на Мальдивы по своему желанию?",
        answer: "Да — форма запроса каждого пакета позволяет указать предпочитаемые даты и любые изменения. Мы подтверждаем, что действительно возможно, перед бронированием, с учётом реальной доступности.",
      },
      {
        question: "Включены ли авиабилеты в стоимость пакета?",
        answer: "Нет — международные авиаперелёты до международного аэропорта Velana никогда не включены в стоимость пакетов на этом сайте; смотрите раздел «Не включено» каждого пакета.",
      },
    ],
    exploreMoreTitle: "Исследовать больше Мальдив",
  },
  articleDetail: {
    minRead: "мин. чтения",
    relatedPlaces: "Похожие места",
    relatedBookable: "Вас также может заинтересовать",
    topic: "Тема",
    relatedArticles: "Другие статьи путеводителя",
    backToGuide: "← Назад к путеводителю",
  },
  packageDetail: {
    eyebrow: "Пакет на Мальдивы",
    nightsDays: "Ночей / Дней",
    fromPrice: "От",
    quoteOnRequest: "Цена по запросу",
    perPerson: "на человека",
    perCouple: "на пару",
    perPackage: "за пакет",
    overviewTitle: "Обзор",
    galleryTitle: "Галерея",
    highlightsTitle: "Особенности",
    bestForTitle: "Для кого подходит этот пакет",
    itineraryTitle: "Маршрут",
    accommodationTitle: "Проживание",
    includedTitle: "Что включено",
    excludedTitle: "Что не включено",
    activitiesTitle: "Активности",
    destinationTitle: "Направление",
    faqTitle: "Часто задаваемые вопросы",
    relatedTitle: "Вам также может понравиться",
    exploreMoreTitle: "Исследовать больше Мальдив",
    allPackagesLink: "Все пакеты на Мальдивы",
    englishVersionLink: "Посмотреть этот пакет на английском",
  },
  transfersHub: {
    heroEyebrow: "Транспорт на Мальдивах",
    title: "Трансферы на Мальдивах",
    description: "Настоящие маршруты трансфера из аэропорта, в курорт, на остров и на скоростном катере по всем Мальдивам — ищите по направлению или запросите частный чартер.",
    introP1: "Каждый маршрут ниже — это настоящий, индивидуально проверенный трансфер, а не общая оценка. Полный список на английском языке с поиском и фильтрами доступен отдельно.",
    introP2: "Трансферы на курорты идут по собственному расписанию каждого курорта; трансферы на местные острова в основном осуществляются общественным паромом или частным скоростным катером.",
    airportSectionTitle: "Трансферы из аэропорта Мальдив",
    resortSectionTitle: "Трансферы на курорты",
    islandSectionTitle: "Трансферы на острова",
    faqTitle: "Часто задаваемые вопросы",
    faqs: [
      {
        question: "Как работают трансферы из аэропорта на Мальдивах?",
        answer: "Вы прилетаете в международный аэропорт Velana, а затем продолжаете путь на скоростном катере, пароме, гидросамолёте или внутреннем рейсе в зависимости от направления.",
      },
      {
        question: "Являются ли трансферы на скоростных катерах на Мальдивах общими?",
        answer: "И то, и другое — большинство курортов предлагают запланированный общий трансфер, а также, как правило, доступен частный трансфер или полный чартер. На странице каждого маршрута показано, что фактически предлагается.",
      },
      {
        question: "Как заранее нужно организовывать трансфер?",
        answer: "Сразу после подтверждения проживания, особенно для курортов, которые привязывают трансферы к конкретным рейсам.",
      },
      {
        question: "В чём разница между трансфером на курорт и трансфером на остров?",
        answer: "Трансфер на курорт ведёт на частный курортный остров; трансфер на остров ведёт на обитаемый мальдивский остров с отелями или гестхаусами вместо курорта.",
      },
    ],
    exploreMoreTitle: "Исследовать больше Мальдив",
  },
  transferDetail: {
    eyebrow: "Маршрут трансфера",
    fromLabel: "Из",
    toLabel: "В",
    durationLabel: "Типичная продолжительность",
    distanceLabel: "Расстояние",
    reverseRoutePrompt: "Едете в обратном направлении?",
    servicesTitle: "Услуги трансфера",
    noServicesNote: "Для этого маршрута пока не зарегистрировано проверенных услуг трансфера.",
    privateTransferTitle: "Частный трансфер",
    privateTransferBody: "Предпочитаете собственную лодку и собственное расписание? Частный трансфер означает отдельную группу, гибкое время и индивидуальную организацию для этого маршрута.",
    privateTransferCta: "Заказать эту поездку как частный трансфер",
    packagesUsingRouteTitle: "Пакеты с этим маршрутом",
    faqTitle: "Часто задаваемые вопросы",
    relatedTitle: "Похожие трансферы",
    exploreMoreTitle: "Исследовать больше Мальдив",
    allTransfersLink: "Все трансферы на Мальдивах",
    englishVersionLink: "Посмотреть этот маршрут на английском",
    typeSpeedboat: "Скоростной катер",
    typeSeaplane: "Гидросамолёт",
    typeDomesticFlight: "Внутренний рейс",
    typeFerry: "Паром",
    typePrivateYacht: "Частная яхта",
    typeLandTransfer: "Наземный трансфер",
    modeShared: "Общий",
    modePrivate: "Частный",
  },
  footerLinks: {
    maldives: "Мальдивы",
    atolls: "Атоллы",
    islands: "Острова",
    resorts: "Курорты",
    hotels: "Отели",
    guesthouses: "Гестхаусы",
    activities: "Активности",
    fishing: "Рыбалка",
    diving: "Дайвинг",
    surfing: "Сёрфинг",
    snorkeling: "Снорклинг",
    excursions: "Экскурсии",
    sandbankTours: "Туры на песчаные банки",
    waterSports: "Водные виды спорта",
    islandHopping: "Путешествие по островам",
    dolphinWhaleWatching: "Наблюдение за дельфинами и китами",
    sightseeing: "Экскурсии по достопримечательностям",
    transfers: "Трансферы",
    airportTransfers: "Трансферы из аэропорта",
    resortTransfers: "Трансферы на курорт",
    islandTransfers: "Трансферы на остров",
    speedboatCharter: "Частный чартер катера",
    ferrySchedule: "Расписание паромов",
    packages: "Пакеты",
    travelGuide: "Путеводитель",
    attractions: "Достопримечательности",
    restaurants: "Рестораны",
    shops: "Магазины",
    hospitals: "Больницы",
    schools: "Школы",
    gyms: "Спортзалы",
  },
  fishingHub: {
    heroEyebrow: "Рыбалка на Мальдивах",
    title: "Рыбалка на Мальдивах",
    description: "Настоящие рыболовные чартеры и поездки по всем Мальдивам — частные чартеры на полный и половину дня, глубоководная, рифовая и традиционная рыбалка от реальных операторов.",
    introP1: "Каждая поездка ниже — настоящая и индивидуально проверенная, а не общий каталог. Полный список на английском языке с поиском и фильтрами доступен отдельно.",
    introP2: "Частный чартер даёт собственную лодку и команду; совместные и местные поездки — более доступный способ выйти на воду.",
    featuredTitle: "Рыболовные поездки и чартеры",
    faqTitle: "Часто задаваемые вопросы",
    faqs: [
      {
        question: "Какие виды рыбалки доступны на Мальдивах?",
        answer: "Троллинг на крупную рыбу, рифовая и донная рыбалка, традиционная рыбалка на леску и ночная рыбалка — на каждой странице показана реальная предлагаемая поездка.",
      },
      {
        question: "Можно ли заказать частный чартер?",
        answer: "Да — большинство операторов предлагают частный чартер на полный или половину дня с собственной лодкой и командой.",
      },
    ],
    exploreMoreTitle: "Исследовать больше Мальдив",
  },
  divingHub: {
    heroEyebrow: "Дайвинг на Мальдивах",
    title: "Дайвинг на Мальдивах",
    description: "Настоящие дайвинг-поездки, курсы и дайв-центры по всем Мальдивам — развлекательные погружения, курсы PADI и Discover Scuba Diving от реальных операторов.",
    introP1: "Каждое погружение ниже — настоящее и индивидуально проверенное, а не общий каталог. Полный список на английском языке с поиском и фильтрами доступен отдельно.",
    introP2: "Развлекательное погружение подходит сертифицированным дайверам; курсы PADI и Discover Scuba Diving — для новичков без сертификации.",
    featuredTitle: "Дайвинг-поездки и курсы",
    faqTitle: "Часто задаваемые вопросы",
    faqs: [
      {
        question: "Нужна ли сертификация для дайвинга на Мальдивах?",
        answer: "Нет — Discover Scuba Diving позволяет погружаться с инструктором без сертификации; курсы PADI дают возможность сертифицироваться.",
      },
      {
        question: "Что такое развлекательное погружение?",
        answer: "Погружение на рифе с гидом для уже сертифицированных дайверов, обычно с одним баллоном.",
      },
    ],
    exploreMoreTitle: "Исследовать больше Мальдив",
  },
  activitiesHub: {
    heroEyebrow: "Чем заняться",
    title: "Активности на Мальдивах",
    description: "Настоящие, доступные для бронирования активности и экскурсии на Мальдивах — путешествия по островам, водные виды спорта, круизы с дельфинами, городские туры и многое другое.",
    introP1: "Каждая активность ниже — настоящая и индивидуально проверенная, а не общий каталог. Полный список на английском языке с поиском и фильтрами доступен отдельно.",
    introP2: "У рыбалки, дайвинга и сёрфинга есть собственные разделы — эта страница охватывает всё остальное: водные виды спорта, экскурсии, путешествия по островам и многое другое.",
    featuredTitle: "Популярные активности",
    faqTitle: "Часто задаваемые вопросы",
    faqs: [
      {
        question: "Как забронировать активность?",
        answer: "Откройте страницу активности и отправьте запрос с предпочитаемой датой и размером группы — мы свяжемся напрямую.",
      },
      {
        question: "Где найти рыбалку, дайвинг или сёрфинг?",
        answer: "У них есть собственные разделы — см. «Исследовать больше» ниже.",
      },
    ],
    exploreMoreTitle: "Исследовать больше Мальдив",
  },
  activityDetail: {
    durationLabel: "Продолжительность",
    bookingIntro: "Сообщите нам предпочитаемую дату и размер группы, и мы свяжемся с вами по поводу доступности.",
    otherTripsTitle: "Другие поездки на",
    packagesFeaturingTitle: "Пакеты с",
    pickupLocationsTitle: "Доступно с трансфером из",
    pickupLocationsIntro: "Эта поездка предлагает трансфер из любого из этих курортов и островов.",
    exploreMoreTitle: "Исследовать больше Мальдив",
    allFishingLink: "Вся рыбалка на Мальдивах",
    allDivingLink: "Весь дайвинг на Мальдивах",
    allActivitiesLink: "Все активности на Мальдивах",
    englishVersionLink: "Посмотреть эту страницу на английском",
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
  packagesHub: {
    heroEyebrow: "モルディブ旅行",
    title: "モルディブ ホリデーパッケージ",
    description: "モルディブの旅行、ハネムーン、ファミリー、ダイビング、フィッシング、サーフィン、ラグジュアリー、格安パッケージを発見――検索、フィルター、直接お問い合わせができます。",
    introP1:
      "以下の各パッケージは、実際の宿泊施設、アクティビティ、送迎から構成された本物の複数日程の旅程です――汎用的なテンプレートではありません。スタイル別に探すか、検索とフィルター機能付きの完全な英語版リストをご覧ください。",
    introP2:
      "リゾートアイランドのパッケージは一つの施設でのオールインクルーシブの滞在です。ローカルアイランドのパッケージは独立運営のゲストハウスと同じ礁やアクティビティを組み合わせ、通常はずっと低価格です。",
    featuredTitle: "モルディブのおすすめパッケージ",
    styleTitle: "スタイル別にパッケージを探す",
    categoryLuxury: "ラグジュアリー",
    categoryFamily: "ファミリー",
    categoryAdultsOnly: "アダルトオンリー",
    categoryLongStay: "長期滞在",
    categoryBudget: "格安",
    categoryHoneymoon: "ハネムーン",
    categorySolo: "ソロ旅行",
    categoryDiving: "ダイビング",
    categoryFishing: "フィッシング",
    categorySurfing: "サーフィン",
    categoryLiveaboard: "ライブアボード",
    faqTitle: "よくある質問",
    faqs: [
      {
        question: "モルディブには何泊すればよいですか?",
        answer: "初めての訪問者の多くは5〜7泊します。短い旅行(3〜4泊)はリゾートでの短い休暇に適しており、長期パッケージ(10泊以上)はリゾートとローカルアイランドを組み合わせたい方や本当の休息を求める方に適しています。",
      },
      {
        question: "モルディブのパッケージには空港送迎が含まれていますか?",
        answer: "パッケージによって異なります――各パッケージページの「含まれるもの」セクションをご確認ください。リゾートベースのパッケージの大半はスピードボートまたは水上飛行機の送迎を含みます。ローカルアイランドのパッケージは通常公共フェリーを利用します。",
      },
      {
        question: "モルディブのパッケージはカスタマイズできますか?",
        answer: "はい――各パッケージのお問い合わせフォームで希望の日程や変更点を記入できます。実際の空き状況に応じて、ご予約前に可能な内容を確認いたします。",
      },
      {
        question: "航空券はパッケージ料金に含まれていますか?",
        answer: "いいえ――ヴェラナ国際空港への国際線フライトは、当サイトのどのパッケージ料金にも含まれていません。各パッケージの「含まれないもの」セクションをご確認ください。",
      },
    ],
    exploreMoreTitle: "モルディブをもっと探る",
  },
  articleDetail: {
    minRead: "分で読めます",
    relatedPlaces: "関連スポット",
    relatedBookable: "こちらもおすすめ",
    topic: "トピック",
    relatedArticles: "ガイドの他の記事",
    backToGuide: "← ガイドに戻る",
  },
  packageDetail: {
    eyebrow: "モルディブパッケージ",
    nightsDays: "泊 / 日",
    fromPrice: "料金",
    quoteOnRequest: "お見積りはお問い合わせください",
    perPerson: "1人あたり",
    perCouple: "1組あたり",
    perPackage: "1パッケージあたり",
    overviewTitle: "概要",
    galleryTitle: "ギャラリー",
    highlightsTitle: "ハイライト",
    bestForTitle: "このパッケージがおすすめな方",
    itineraryTitle: "旅程",
    accommodationTitle: "宿泊施設",
    includedTitle: "含まれるもの",
    excludedTitle: "含まれないもの",
    activitiesTitle: "アクティビティ",
    destinationTitle: "目的地",
    faqTitle: "よくある質問",
    relatedTitle: "こちらもおすすめ",
    exploreMoreTitle: "モルディブをもっと探る",
    allPackagesLink: "モルディブの全パッケージ",
    englishVersionLink: "英語版でこのパッケージを見る",
  },
  transfersHub: {
    heroEyebrow: "モルディブの交通手段",
    title: "モルディブの送迎",
    description: "モルディブ全土の空港、リゾート、島、スピードボートの実際の送迎ルート——目的地で検索するか、プライベートチャーターをリクエストできます。",
    introP1: "以下の各ルートは実在し個別に確認された送迎です——一般的な推定ではありません。検索とフィルター機能付きの完全な英語版リストもご覧いただけます。",
    introP2: "リゾート送迎は各リゾート独自のスケジュールで運行され、ローカルアイランドへの送迎は主に公共フェリーまたはプライベートスピードボートで行われます。",
    airportSectionTitle: "モルディブ空港送迎",
    resortSectionTitle: "リゾート送迎",
    islandSectionTitle: "島への送迎",
    faqTitle: "よくある質問",
    faqs: [
      {
        question: "モルディブの空港送迎はどのように機能しますか?",
        answer: "ヴェラナ国際空港に到着後、目的地に応じてスピードボート、フェリー、水上飛行機、または国内線で移動を続けます。",
      },
      {
        question: "モルディブのスピードボート送迎は乗り合いですか?",
        answer: "どちらもあります——ほとんどのリゾートは予定された乗り合い送迎を提供し、通常はプライベート送迎やチャーターも利用可能です。各ルートページで実際に提供されている内容を確認できます。",
      },
      {
        question: "送迎はどれくらい前に手配すべきですか?",
        answer: "宿泊先が確定したらすぐに、特にフライトに合わせて送迎時間を設定するリゾートの場合は早めに手配してください。",
      },
      {
        question: "リゾート送迎と島送迎の違いは何ですか?",
        answer: "リゾート送迎はプライベートリゾートアイランドへ向かい、島送迎はリゾートではなくホテルやゲストハウスのある有人のモルディブの島へ向かいます。",
      },
    ],
    exploreMoreTitle: "モルディブをもっと探る",
  },
  transferDetail: {
    eyebrow: "送迎ルート",
    fromLabel: "出発地",
    toLabel: "目的地",
    durationLabel: "標準的な所要時間",
    distanceLabel: "距離",
    reverseRoutePrompt: "反対方向へ移動しますか?",
    servicesTitle: "送迎サービス",
    noServicesNote: "このルートには確認済みの送迎サービスがまだ登録されていません。",
    privateTransferTitle: "プライベート送迎",
    privateTransferBody: "自分のボートと自分のスケジュールをお好みですか?プライベート送迎とは、専用グループ、柔軟な時間設定、このルート専用の個別手配を意味します。",
    privateTransferCta: "この旅をプライベート送迎として予約する",
    packagesUsingRouteTitle: "このルートを使用するパッケージ",
    faqTitle: "よくある質問",
    relatedTitle: "関連する送迎",
    exploreMoreTitle: "モルディブをもっと探る",
    allTransfersLink: "モルディブの全送迎",
    englishVersionLink: "英語版でこのルートを見る",
    typeSpeedboat: "スピードボート",
    typeSeaplane: "水上飛行機",
    typeDomesticFlight: "国内線",
    typeFerry: "フェリー",
    typePrivateYacht: "プライベートヨット",
    typeLandTransfer: "陸路送迎",
    modeShared: "乗り合い",
    modePrivate: "プライベート",
  },
  footerLinks: {
    maldives: "モルディブ",
    atolls: "環礁",
    islands: "島",
    resorts: "リゾート",
    hotels: "ホテル",
    guesthouses: "ゲストハウス",
    activities: "アクティビティ",
    fishing: "フィッシング",
    diving: "ダイビング",
    surfing: "サーフィン",
    snorkeling: "シュノーケリング",
    excursions: "小旅行",
    sandbankTours: "サンドバンクツアー",
    waterSports: "ウォータースポーツ",
    islandHopping: "アイランドホッピング",
    dolphinWhaleWatching: "イルカ・クジラウォッチング",
    sightseeing: "観光",
    transfers: "送迎",
    airportTransfers: "空港送迎",
    resortTransfers: "リゾート送迎",
    islandTransfers: "島送迎",
    speedboatCharter: "プライベートスピードボートチャーター",
    ferrySchedule: "フェリースケジュール",
    packages: "パッケージ",
    travelGuide: "旅行ガイド",
    attractions: "観光スポット",
    restaurants: "レストラン",
    shops: "ショップ",
    hospitals: "病院",
    schools: "学校",
    gyms: "ジム",
  },
  fishingHub: {
    heroEyebrow: "モルディブの釣り",
    title: "モルディブの釣り",
    description: "モルディブ全土の本物の釣りチャーターとツアー——プライベートの終日・半日チャーター、大物釣り、リーフフィッシング、伝統釣りを実在のオペレーターから。",
    introP1: "以下の各ツアーは実在し個別に確認されたものです——一般的なディレクトリではありません。検索とフィルター機能付きの完全な英語版リストもご覧いただけます。",
    introP2: "プライベートチャーターは専用のボートとクルーを提供し、乗り合いやローカルツアーはより手頃に海に出る方法です。",
    featuredTitle: "釣りツアー&チャーター",
    faqTitle: "よくある質問",
    faqs: [
      {
        question: "モルディブではどのような釣りができますか?",
        answer: "ビッグゲームトローリング、リーフ・ボトムフィッシング、伝統的な手釣りツアー、ナイトフィッシングなど——各ページで実際のツアー内容を確認できます。",
      },
      {
        question: "プライベートチャーターは予約できますか?",
        answer: "はい——ほとんどのオペレーターが専用のボートとクルー付きの終日または半日のプライベートチャーターを提供しています。",
      },
    ],
    exploreMoreTitle: "モルディブをもっと探る",
  },
  divingHub: {
    heroEyebrow: "モルディブのダイビング",
    title: "モルディブのダイビング",
    description: "モルディブ全土の本物のダイビングツアー、コース、ダイブセンター——ファンダイブ、PADIコース、体験ダイビングを実在のオペレーターから。",
    introP1: "以下の各ダイブは実在し個別に確認されたものです——一般的なディレクトリではありません。検索とフィルター機能付きの完全な英語版リストもご覧いただけます。",
    introP2: "ファンダイブは認定ダイバー向け、PADIコースと体験ダイビングは認定資格のない初心者向けです。",
    featuredTitle: "ダイビングツアー&コース",
    faqTitle: "よくある質問",
    faqs: [
      {
        question: "モルディブでダイビングするには認定資格が必要ですか?",
        answer: "いいえ——体験ダイビングでは資格なしでインストラクターと一緒に潜ることができ、PADIコースで資格を取得できます。",
      },
      {
        question: "ファンダイブとは何ですか?",
        answer: "既に認定を受けたダイバー向けのガイド付きリーフダイブで、通常1本のタンクを使用します。",
      },
    ],
    exploreMoreTitle: "モルディブをもっと探る",
  },
  activitiesHub: {
    heroEyebrow: "やってみよう",
    title: "モルディブのアクティビティ",
    description: "モルディブの本物の予約可能なアクティビティとエクスカーション——アイランドホッピング、ウォータースポーツ、ドルフィンクルーズ、シティツアーなど。",
    introP1: "以下の各アクティビティは実在し個別に確認されたものです——一般的なディレクトリではありません。検索とフィルター機能付きの完全な英語版リストもご覧いただけます。",
    introP2: "釣り、ダイビング、サーフィンにはそれぞれ専用セクションがあります——このページではウォータースポーツ、エクスカーション、アイランドホッピングなど、その他すべてを扱います。",
    featuredTitle: "人気のアクティビティ",
    faqTitle: "よくある質問",
    faqs: [
      {
        question: "アクティビティはどのように予約しますか?",
        answer: "アクティビティのページを開き、希望の日付とグループ人数を記載してお問い合わせください——直接ご連絡いたします。",
      },
      {
        question: "釣り、ダイビング、サーフィンはどこにありますか?",
        answer: "それぞれ専用セクションがあります——下記の「もっと探る」をご覧ください。",
      },
    ],
    exploreMoreTitle: "モルディブをもっと探る",
  },
  activityDetail: {
    durationLabel: "所要時間",
    bookingIntro: "ご希望の日付とグループ人数をお知らせください。空き状況についてご連絡いたします。",
    otherTripsTitle: "その他のツアー:",
    packagesFeaturingTitle: "含まれるパッケージ:",
    pickupLocationsTitle: "送迎可能な場所",
    pickupLocationsIntro: "このツアーは以下のリゾートや島からの送迎が可能です。",
    exploreMoreTitle: "モルディブをもっと探る",
    allFishingLink: "モルディブの釣り全て",
    allDivingLink: "モルディブのダイビング全て",
    allActivitiesLink: "モルディブのアクティビティ全て",
    englishVersionLink: "英語版でこのページを見る",
  },
};

const ZH: UiStrings = {
  nav: {
    maldives: "马尔代夫",
    stays: "住宿",
    activities: "活动",
    diving: "潜水",
    fishing: "钓鱼",
    transfers: "接送服务",
    packages: "旅游套餐",
    travelGuide: "旅行指南",
  },
  breadcrumbHome: "首页",
  ctaGetInTouch: "联系我们",
  languageSwitcherLabel: "语言",
  currencySwitcherLabel: "货币",
  home: {
    heroEyebrow: "马尔代夫旅行指南",
    heroTitle: "真实、经过核实的马尔代夫旅行指南",
    heroDescription:
      "环礁、岛屿、度假村、酒店和民宿、各类活动、潜水、钓鱼、冲浪、接送服务和旅游套餐——经过实地调查并持续更新，而非凭空生成。",
    ctaExplore: "探索马尔代夫",
    ctaPackages: "查看旅游套餐",
    statsAtolls: "个环礁",
    statsIslands: "个有人居住岛屿",
    statsStays: "家收录度假村",
    destinationsEyebrow: "目的地",
    destinationsTitle: "探索马尔代夫",
    destinationsDescription: "26个自然环礁，组成若干行政环礁——每个环礁都有自己的有人居住岛屿。",
    destinationsCta: "查看所有环礁",
    staysEyebrow: "住宿地点",
    staysTitle: "度假村、酒店和民宿",
    staysDescription: "马尔代夫各地真实、经过逐一核实的住宿。",
    staysCta: "浏览所有度假村",
    staysHotelsLink: "酒店",
    staysGuesthousesLink: "民宿",
    activitiesEyebrow: "休闲活动",
    activitiesTitle: "活动、潜水、钓鱼和冲浪",
    activitiesDescription: "逐岛核实的真实运营商和活动项目。",
    activitiesCta: "查看所有活动",
    divingLink: "潜水",
    fishingLink: "钓鱼",
    surfingLink: "冲浪",
    attractionsEyebrow: "游览地点",
    attractionsTitle: "马尔代夫景点",
    attractionsDescription:
      "逐一记录的真实地标、博物馆、纪念碑和公共海滩——虽无法预订，但却是马尔代夫之旅的一部分。",
    attractionsCta: "探索马尔代夫景点",
    transfersEyebrow: "交通出行",
    transfersTitle: "马尔代夫接送服务",
    transfersDescription: "从维拉纳国际机场出发的真实机场、快艇、度假村和岛屿接送路线，价格均经过核实。",
    transfersCta: "查找您的接送服务",
    transferCategoryAirport: "机场接送",
    transferCategorySpeedboat: "私人快艇",
    transferCategoryIsland: "岛屿间接送",
    packagesEyebrow: "旅游套餐",
    packagesTitle: "马尔代夫假期套餐",
    packagesDescription:
      "由真实住宿、活动和接送服务组成的多日行程——蜜月、家庭、潜水、钓鱼、冲浪、豪华及经济型套餐。",
    packagesCta: "查看所有套餐",
    guideEyebrow: "旅行指南",
    guideTitle: "深度马尔代夫旅行指南",
    guideDescription: "关于岛屿、环礁、潜水、天气和文化的真实调查指南。",
    guideCta: "查看所有指南",
    finalCtaTitle: "正在计划马尔代夫之旅吗？",
    finalCtaDescription: "浏览真实的环礁、岛屿、度假村和活动，或直接通过WhatsApp联系我们，获取行程规划帮助。",
    finalCtaExplore: "开始探索",
    finalCtaWhatsapp: "WhatsApp联系我们",
  },
  maldivesHub: {
    heroEyebrow: "马尔代夫旅行指南",
    introPrefix: "马尔代夫是印度洋上的珊瑚环礁国家，由首都马累、一些度假岛屿，以及",
    introMiddle: "个分布在",
    introSuffix:
      "个行政环礁中的有人居住本地岛屿组成。大多数旅行者会选择两种截然不同的住宿方式之一：私人度假岛——一岛一酒店，全包式服务；或是本地岛屿，民宿坐落在真实的马尔代夫社区中，紧邻清真寺、学校和港口。两种方式都能让您接触到相同的珊瑚礁、潟湖和海洋生物，不同的只是旅行的形式。以下内容——环礁、岛屿、住宿、活动、接送服务、旅游套餐和旅行指南——都链接回同一个真实的MTG目录，因此无论从哪里开始，您都能找到其他所有内容。",
    atollsEyebrow: "目的地",
    atollsTitle: "按环礁浏览",
    atollsDescription: "马尔代夫被划分为若干行政环礁，每个环礁都由有人居住的岛屿组成。",
    atollsCta: "查看所有环礁",
    islandsTitle: "精选本地岛屿",
    islandsDescription: "这只是一个起点，并非完整列表——每个有人居住的岛屿都有自己的页面。",
    islandsCta: "查看所有岛屿",
    localIslandsTitle: "马尔代夫本地岛屿",
    localIslandsP1:
      "“本地岛屿”是指接待过夜客人的马尔代夫有人居住岛屿——通常是小型、独立经营的民宿，而非单一的度假村运营商。您将住在一个真实的社区中：商店、清真寺、学校、正在运作的港口，以及过着日常生活的邻居。",
    localIslandsP2:
      "这通常是体验马尔代夫更经济实惠的方式，因为您支付的是房费和餐费，而不是整个私人岛屿的费用。当地的着装和行为规范比度假岛更为保守——例如，泳装仅限在指定的“比基尼海滩”穿着——但作为回报，您能更轻松地接触到真正的马尔代夫美食、文化和日常生活。",
    localIslandsCtaIslands: "浏览所有本地岛屿 →",
    localIslandsCtaOr: "或查看",
    localIslandsCtaGuesthouses: "民宿",
    exploreMoreTitle: "探索更多马尔代夫内容",
    statsAtolls: "个行政环礁",
    statsIslands: "个有人居住岛屿",
  },
  travelGuideHub: {
    heroEyebrow: "旅行指南",
    title: "马尔代夫旅行指南",
    description: "关于马尔代夫岛屿、环礁、潜水、天气和文化的真实深度指南。",
    emptyStateTitle: "该语言暂无指南文章",
    comingSoonNote: "更多文章正在翻译中——在此期间，欢迎浏览完整的英文旅行指南。",
  },
  packagesHub: {
    heroEyebrow: "马尔代夫假期",
    title: "马尔代夫度假套餐",
    description: "探索马尔代夫度假、蜜月、家庭、潜水、钓鱼、冲浪、豪华和经济型套餐——搜索、筛选并直接咨询。",
    introP1:
      "下面的每个套餐都是由真实住宿、活动和接送服务组成的真实多日行程——不是通用模板。按风格浏览,或查看带有搜索和筛选功能的完整英文列表。",
    introP2:
      "度假村岛屿套餐是在单一物业内的全包式住宿;本地岛屿套餐则将独立经营的民宿与相同的珊瑚礁和活动结合,通常价格更为实惠。",
    featuredTitle: "马尔代夫精选套餐",
    styleTitle: "按风格浏览套餐",
    categoryLuxury: "豪华",
    categoryFamily: "家庭",
    categoryAdultsOnly: "仅限成人",
    categoryLongStay: "长住",
    categoryBudget: "经济型",
    categoryHoneymoon: "蜜月",
    categorySolo: "单人旅行",
    categoryDiving: "潜水",
    categoryFishing: "钓鱼",
    categorySurfing: "冲浪",
    categoryLiveaboard: "潜水船宿",
    faqTitle: "常见问题",
    faqs: [
      {
        question: "我应该在马尔代夫待几个晚上?",
        answer: "大多数首次到访者会停留5-7晚。较短的行程(3-4晚)适合快速的度假村之旅;长住套餐(10晚以上)适合将度假村与本地岛屿结合,或希望真正放松的旅行者。",
      },
      {
        question: "马尔代夫套餐是否包含机场接送?",
        answer: "这取决于具体套餐——请查看每个套餐页面上的「包含项目」部分。大多数基于度假村的套餐包含快艇或水上飞机接送;本地岛屿套餐通常使用公共渡轮。",
      },
      {
        question: "我可以定制马尔代夫套餐吗?",
        answer: "可以——每个套餐的咨询表单都允许您注明您偏好的日期和任何更改。我们会在您预订前确认实际可行的内容,取决于真实的可用性。",
      },
      {
        question: "套餐价格是否包含机票?",
        answer: "不包含——本网站任何套餐价格均不包含前往维拉纳国际机场的国际航班;请查看每个套餐的「不包含项目」部分。",
      },
    ],
    exploreMoreTitle: "探索更多马尔代夫",
  },
  articleDetail: {
    minRead: "分钟阅读",
    relatedPlaces: "相关地点",
    relatedBookable: "您可能还想预订",
    topic: "主题",
    relatedArticles: "更多旅行指南文章",
    backToGuide: "← 返回旅行指南",
  },
  packageDetail: {
    eyebrow: "马尔代夫套餐",
    nightsDays: "晚 / 天",
    fromPrice: "起价",
    quoteOnRequest: "询价",
    perPerson: "每人",
    perCouple: "每对",
    perPackage: "每套餐",
    overviewTitle: "概览",
    galleryTitle: "图库",
    highlightsTitle: "亮点",
    bestForTitle: "适合人群",
    itineraryTitle: "行程",
    accommodationTitle: "住宿",
    includedTitle: "包含项目",
    excludedTitle: "不包含项目",
    activitiesTitle: "活动",
    destinationTitle: "目的地",
    faqTitle: "常见问题",
    relatedTitle: "您可能还喜欢",
    exploreMoreTitle: "探索更多马尔代夫",
    allPackagesLink: "所有马尔代夫套餐",
    englishVersionLink: "查看英文版套餐",
  },
  transfersHub: {
    heroEyebrow: "马尔代夫交通",
    title: "马尔代夫接送服务",
    description: "马尔代夫各地真实的机场、度假村、岛屿和快艇接送路线——按目的地搜索,或申请私人租船服务。",
    introP1: "以下每条路线均为真实、经过单独核实的接送服务,而非笼统估算。完整的英文列表提供搜索和筛选功能。",
    introP2: "度假村接送按各度假村自己的时间表运行;本地岛屿接送主要通过公共渡轮或私人快艇进行。",
    airportSectionTitle: "马尔代夫机场接送",
    resortSectionTitle: "度假村接送",
    islandSectionTitle: "岛屿接送",
    faqTitle: "常见问题",
    faqs: [
      {
        question: "马尔代夫的机场接送如何运作?",
        answer: "您抵达维拉纳国际机场后,根据目的地继续乘坐快艇、渡轮、水上飞机或国内航班前往。",
      },
      {
        question: "马尔代夫的快艇接送是共享的吗?",
        answer: "两种都有——大多数度假村提供定时共享接送,通常也可提供私人接送或整船租赁。每个路线页面都会显示实际提供的服务。",
      },
      {
        question: "我应该提前多久安排接送?",
        answer: "一旦住宿确认后应尽快安排,尤其是那些将接送时间与特定航班对接的度假村。",
      },
      {
        question: "度假村接送和岛屿接送有什么区别?",
        answer: "度假村接送前往私人度假村岛屿;岛屿接送前往有酒店或民宿的马尔代夫有人居住岛屿,而非度假村。",
      },
    ],
    exploreMoreTitle: "探索更多马尔代夫",
  },
  transferDetail: {
    eyebrow: "接送路线",
    fromLabel: "出发地",
    toLabel: "目的地",
    durationLabel: "通常时长",
    distanceLabel: "距离",
    reverseRoutePrompt: "要前往相反方向吗?",
    servicesTitle: "接送服务",
    noServicesNote: "此路线暂无已核实的接送服务记录。",
    privateTransferTitle: "私人接送",
    privateTransferBody: "想要自己的船只和时间安排吗?私人接送意味着专属团队、灵活的时间以及针对此路线的定制安排。",
    privateTransferCta: "将此行程预订为私人接送",
    packagesUsingRouteTitle: "使用此路线的套餐",
    faqTitle: "常见问题",
    relatedTitle: "相关接送服务",
    exploreMoreTitle: "探索更多马尔代夫",
    allTransfersLink: "马尔代夫所有接送服务",
    englishVersionLink: "查看英文版路线",
    typeSpeedboat: "快艇",
    typeSeaplane: "水上飞机",
    typeDomesticFlight: "国内航班",
    typeFerry: "渡轮",
    typePrivateYacht: "私人游艇",
    typeLandTransfer: "陆路接送",
    modeShared: "共享",
    modePrivate: "私人",
  },
  footerLinks: {
    maldives: "马尔代夫",
    atolls: "环礁",
    islands: "岛屿",
    resorts: "度假村",
    hotels: "酒店",
    guesthouses: "民宿",
    activities: "活动",
    fishing: "钓鱼",
    diving: "潜水",
    surfing: "冲浪",
    snorkeling: "浮潜",
    excursions: "短途游览",
    sandbankTours: "沙洲之旅",
    waterSports: "水上运动",
    islandHopping: "跳岛游",
    dolphinWhaleWatching: "观赏海豚和鲸鱼",
    sightseeing: "观光",
    transfers: "接送服务",
    airportTransfers: "机场接送",
    resortTransfers: "度假村接送",
    islandTransfers: "岛屿接送",
    speedboatCharter: "私人快艇租赁",
    ferrySchedule: "渡轮时间表",
    packages: "套餐",
    travelGuide: "旅游指南",
    attractions: "景点",
    restaurants: "餐厅",
    shops: "商店",
    hospitals: "医院",
    schools: "学校",
    gyms: "健身房",
  },
  fishingHub: {
    heroEyebrow: "马尔代夫钓鱼",
    title: "马尔代夫钓鱼",
    description: "马尔代夫各地真实的钓鱼租船和行程——私人全天和半天租船、大物钓鱼、礁石钓鱼和传统钓鱼,均来自真实运营商。",
    introP1: "以下每个行程均为真实且经过单独核实,而非笼统的目录列表。完整的英文列表提供搜索和筛选功能。",
    introP2: "私人租船提供专属船只和船员;共享和本地行程则是更经济的出海方式。",
    featuredTitle: "钓鱼行程与租船",
    faqTitle: "常见问题",
    faqs: [
      {
        question: "马尔代夫有哪些钓鱼方式?",
        answer: "大物拖钓、礁石和底层钓鱼、传统手线钓鱼以及夜钓——每个页面都显示实际提供的行程。",
      },
      {
        question: "可以预订私人租船吗?",
        answer: "可以——大多数运营商提供配备专属船只和船员的全天或半天私人租船服务。",
      },
    ],
    exploreMoreTitle: "探索更多马尔代夫",
  },
  divingHub: {
    heroEyebrow: "马尔代夫潜水",
    title: "马尔代夫潜水",
    description: "马尔代夫各地真实的潜水行程、课程和潜水中心——休闲潜水、PADI课程和体验潜水,均来自真实运营商。",
    introP1: "以下每次潜水均为真实且经过单独核实,而非笼统的目录列表。完整的英文列表提供搜索和筛选功能。",
    introP2: "休闲潜水适合持证潜水员;PADI课程和体验潜水适合尚未获得认证的初学者。",
    featuredTitle: "潜水行程与课程",
    faqTitle: "常见问题",
    faqs: [
      {
        question: "在马尔代夫潜水需要潜水证吗?",
        answer: "不需要——体验潜水可让您在没有证书的情况下与教练一起潜水;PADI课程可让您获得认证。",
      },
      {
        question: "什么是休闲潜水?",
        answer: "适合已持证潜水员的有导潜陪同的礁石潜水,通常使用一个气瓶。",
      },
    ],
    exploreMoreTitle: "探索更多马尔代夫",
  },
  activitiesHub: {
    heroEyebrow: "休闲活动",
    title: "马尔代夫活动",
    description: "马尔代夫真实可预订的活动和短途游览——跳岛游、水上运动、海豚巡游、城市观光等。",
    introP1: "以下每项活动均为真实且经过单独核实,而非笼统的目录列表。完整的英文列表提供搜索和筛选功能。",
    introP2: "钓鱼、潜水和冲浪各有专属板块——本页面涵盖其余所有内容:水上运动、短途游览、跳岛游等。",
    featuredTitle: "热门活动",
    faqTitle: "常见问题",
    faqs: [
      {
        question: "如何预订活动?",
        answer: "打开活动页面,提交您偏好的日期和团队人数的咨询——我们会直接与您联系。",
      },
      {
        question: "在哪里可以找到钓鱼、潜水或冲浪?",
        answer: "这些都有各自的专属板块——请参见下方的「探索更多」。",
      },
    ],
    exploreMoreTitle: "探索更多马尔代夫",
  },
  activityDetail: {
    durationLabel: "时长",
    bookingIntro: "请告知我们您偏好的日期和团队人数,我们会就可用性与您联系。",
    otherTripsTitle: "其他行程,位于",
    packagesFeaturingTitle: "包含该项目的套餐",
    pickupLocationsTitle: "可提供接送的地点",
    pickupLocationsIntro: "此行程可从以下任意度假村或岛屿提供接送服务。",
    exploreMoreTitle: "探索更多马尔代夫",
    allFishingLink: "马尔代夫所有钓鱼项目",
    allDivingLink: "马尔代夫所有潜水项目",
    allActivitiesLink: "马尔代夫所有活动",
    englishVersionLink: "查看英文版页面",
  },
};

const UI_STRINGS: Partial<Record<Locale, UiStrings>> = { en: EN, de: DE, es: ES, it: IT, ru: RU, ja: JA, zh: ZH };

/** Falls back to English for any locale that doesn't have real copy yet
 * — never throws, never renders a blank label. */
export function getUiStrings(locale: Locale): UiStrings {
  return UI_STRINGS[locale] ?? EN;
}

/** Every non-English locale with real UI-strings copy -- used by pages
 * whose hub is pure static copy (no page_translations row to check a
 * "published" state against, e.g. the Travel Guide hub) to build their
 * hreflang alternates from the same rollout list this file itself
 * defines, rather than a second hardcoded locale array. */
export const UI_STRINGS_LOCALES: Locale[] = Object.keys(UI_STRINGS).filter((l): l is Locale => l !== "en") as Locale[];
