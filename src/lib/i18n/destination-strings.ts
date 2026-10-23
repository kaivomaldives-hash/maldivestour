import type { Locale } from "@/lib/i18n/locales";

/**
 * Surrounding copy for the translated destination pages -- atolls,
 * islands, dive sites, attractions (src/app/[locale]/maldives/{atolls,
 * islands,dive-sites,attractions}/). Same role as ui-strings.ts, kept in
 * its own module so that file doesn't grow a fifth set of near-identical
 * hub blocks per locale. These hubs are UI-strings-only (no
 * page_translations row -- like the Travel Guide hub), so the set of
 * locales defined here IS each hub's published-locale set
 * (DESTINATION_STRINGS_LOCALES).
 *
 * Templates use a literal "{name}" placeholder (see fill()) rather than
 * string concatenation, since word order around a place name differs per
 * language ("Islands in Kaafu Atoll" vs "Kaafu環礁の島々").
 */
export interface DestinationStrings {
  nav: { atolls: string; islands: string; diveSites: string; attractions: string };
  atollsHub: { heroEyebrow: string; title: string; description: string; metaTitle: string; inhabitedIslandsLabel: string };
  islandsHub: { heroEyebrow: string; title: string; description: string; metaTitle: string; searchInEnglish: string };
  diveSitesHub: { heroEyebrow: string; title: string; description: string; metaTitle: string; intro: string };
  attractionsHub: { heroEyebrow: string; title: string; description: string; metaTitle: string; intro: string };
  detail: {
    atollEyebrow: string;
    capitalCityEyebrow: string;
    islandEyebrow: string;
    diveSiteEyebrow: string;
    attractionEyebrow: string;
    administrativeCode: string;
    inhabitedIslands: string;
    inhabited: string;
    yes: string;
    no: string;
    atoll: string;
    island: string;
    nearbyIsland: string;
    siteType: string;
    depth: string;
    experienceLevel: string;
    conditions: string;
    marineLife: string;
    type: string;
    mapHeading: string;
    mapIntro: string;
    islandsIn: string;
    diveSitesIn: string;
    attractionsIn: string;
    attractionsOn: string;
    diveSitesNear: string;
    moreDiveSitesIn: string;
    nearbyIslands: string;
    diveSiteNote: string;
    attractionNote: string;
    englishOnlyNote: string;
    exploreAllOf: string;
    exploreMoreTitle: string;
    englishVersionLink: string;
  };
  siteTypes: Record<string, string>;
  experienceLevels: Record<string, string>;
  attractionTypes: Record<string, string>;
  attractionGroups: Record<"natural" | "marine" | "cultural", string>;
}

const EN: DestinationStrings = {
  nav: { atolls: "Atolls", islands: "Islands", diveSites: "Dive Sites", attractions: "Attractions" },
  atollsHub: {
    heroEyebrow: "Destinations",
    title: "Atolls of the Maldives",
    description: "Every administrative atoll of the Maldives, with its inhabited islands.",
    metaTitle: "Maldives Atolls | MTG",
    inhabitedIslandsLabel: "Inhabited islands",
  },
  islandsHub: {
    heroEyebrow: "Destinations",
    title: "Islands of the Maldives",
    description: "Every inhabited and resort island in the Maldives, by atoll.",
    metaTitle: "Maldives Islands | MTG",
    searchInEnglish: "Search all islands (English)",
  },
  diveSitesHub: {
    heroEyebrow: "Diving",
    title: "Maldives Dive Sites",
    description: "Real, documented Maldives dive sites — reefs, thilas, channels and wrecks — by atoll.",
    metaTitle: "Maldives Dive Sites | MTG",
    intro: "These are physical dive sites, not bookable products — see diving trips for operators running dives to them.",
  },
  attractionsHub: {
    heroEyebrow: "Things to see",
    title: "Maldives Attractions",
    description: "Real, individually documented Maldives attractions — mosques, museums, monuments, beaches and natural wonders.",
    metaTitle: "Maldives Attractions | Landmarks, Museums & Places to Visit | MTG",
    intro: "Every attraction below is a real place, not a bookable product — see activities for trips and experiences nearby.",
  },
  detail: {
    atollEyebrow: "Atoll",
    capitalCityEyebrow: "Capital City",
    islandEyebrow: "Island",
    diveSiteEyebrow: "Dive site",
    attractionEyebrow: "Attraction",
    administrativeCode: "Administrative code",
    inhabitedIslands: "Inhabited islands",
    inhabited: "Inhabited",
    yes: "Yes",
    no: "No",
    atoll: "Atoll",
    island: "Island",
    nearbyIsland: "Nearby island",
    siteType: "Site type",
    depth: "Depth",
    experienceLevel: "Experience level",
    conditions: "Conditions",
    marineLife: "Marine life",
    type: "Type",
    mapHeading: "Where is {name}?",
    mapIntro: "Explore the location on the map.",
    islandsIn: "Islands in {name}",
    diveSitesIn: "Dive sites in {name}",
    attractionsIn: "Attractions in {name}",
    attractionsOn: "Attractions on {name}",
    diveSitesNear: "Dive sites near {name}",
    moreDiveSitesIn: "More dive sites in {name}",
    nearbyIslands: "Nearby islands",
    diveSiteNote: "A physical dive site — not a bookable product.",
    attractionNote: "A physical attraction — not a bookable product.",
    englishOnlyNote: "Shown in English.",
    exploreAllOf: "Explore all of {name} →",
    exploreMoreTitle: "Explore More Maldives",
    englishVersionLink: "View this page in English",
  },
  siteTypes: { reef: "Reef", thila: "Thila", channel: "Channel", wreck: "Wreck", pinnacle: "Pinnacle", wall: "Wall", cave: "Cave" },
  experienceLevels: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", "all levels": "All levels" },
  attractionTypes: {
    religious: "Religious site",
    museum: "Museum",
    monument: "Monument",
    park: "Park",
    beach: "Beach",
    market: "Market",
    landmark: "Landmark",
    infrastructure: "Landmark",
    natural: "Natural site",
    marine: "Marine & wildlife site",
  },
  attractionGroups: { natural: "Natural Attractions", marine: "Marine & Wildlife", cultural: "Cultural & Historical" },
};

const DE: DestinationStrings = {
  nav: { atolls: "Atolle", islands: "Inseln", diveSites: "Tauchplätze", attractions: "Sehenswürdigkeiten" },
  atollsHub: {
    heroEyebrow: "Reiseziele",
    title: "Die Atolle der Malediven",
    description: "Alle Verwaltungsatolle der Malediven mit ihren bewohnten Inseln.",
    metaTitle: "Atolle der Malediven | MTG",
    inhabitedIslandsLabel: "Bewohnte Inseln",
  },
  islandsHub: {
    heroEyebrow: "Reiseziele",
    title: "Die Inseln der Malediven",
    description: "Alle bewohnten Inseln und Resortinseln der Malediven, nach Atoll geordnet.",
    metaTitle: "Inseln der Malediven | MTG",
    searchInEnglish: "Alle Inseln durchsuchen (Englisch)",
  },
  diveSitesHub: {
    heroEyebrow: "Tauchen",
    title: "Tauchplätze der Malediven",
    description: "Echte, dokumentierte Tauchplätze der Malediven — Riffe, Thilas, Kanäle und Wracks — nach Atoll.",
    metaTitle: "Tauchplätze der Malediven | MTG",
    intro: "Dies sind reale Tauchplätze, keine buchbaren Produkte — Anbieter, die dort Tauchgänge durchführen, finden Sie bei den Tauchausflügen.",
  },
  attractionsHub: {
    heroEyebrow: "Sehenswertes",
    title: "Sehenswürdigkeiten der Malediven",
    description: "Echte, einzeln dokumentierte Sehenswürdigkeiten der Malediven — Moscheen, Museen, Denkmäler, Strände und Naturwunder.",
    metaTitle: "Sehenswürdigkeiten der Malediven | Wahrzeichen, Museen & Ausflugsziele | MTG",
    intro: "Jede Sehenswürdigkeit hier ist ein realer Ort, kein buchbares Produkt — Ausflüge und Erlebnisse in der Nähe finden Sie bei den Aktivitäten.",
  },
  detail: {
    atollEyebrow: "Atoll",
    capitalCityEyebrow: "Hauptstadt",
    islandEyebrow: "Insel",
    diveSiteEyebrow: "Tauchplatz",
    attractionEyebrow: "Sehenswürdigkeit",
    administrativeCode: "Verwaltungscode",
    inhabitedIslands: "Bewohnte Inseln",
    inhabited: "Bewohnt",
    yes: "Ja",
    no: "Nein",
    atoll: "Atoll",
    island: "Insel",
    nearbyIsland: "Nächstgelegene Insel",
    siteType: "Art des Tauchplatzes",
    depth: "Tiefe",
    experienceLevel: "Erfahrungsstufe",
    conditions: "Bedingungen",
    marineLife: "Meeresleben",
    type: "Art",
    mapHeading: "{name} auf der Karte",
    mapIntro: "Entdecken Sie den Ort auf der Karte.",
    islandsIn: "Inseln im {name}",
    diveSitesIn: "Tauchplätze im {name}",
    attractionsIn: "Sehenswürdigkeiten im {name}",
    attractionsOn: "Sehenswürdigkeiten auf {name}",
    diveSitesNear: "Tauchplätze in der Nähe von {name}",
    moreDiveSitesIn: "Weitere Tauchplätze im {name}",
    nearbyIslands: "Inseln in der Nähe",
    diveSiteNote: "Ein realer Tauchplatz — kein buchbares Produkt.",
    attractionNote: "Eine reale Sehenswürdigkeit — kein buchbares Produkt.",
    englishOnlyNote: "Auf Englisch angezeigt.",
    exploreAllOf: "{name} entdecken →",
    exploreMoreTitle: "Mehr von den Malediven entdecken",
    englishVersionLink: "Diese Seite auf Englisch ansehen",
  },
  siteTypes: { reef: "Riff", thila: "Thila", channel: "Kanal", wreck: "Wrack", pinnacle: "Felsnadel", wall: "Steilwand", cave: "Höhle" },
  experienceLevels: { beginner: "Anfänger", intermediate: "Fortgeschrittene", advanced: "Erfahrene", "all levels": "Alle Stufen" },
  attractionTypes: {
    religious: "Religiöse Stätte",
    museum: "Museum",
    monument: "Denkmal",
    park: "Park",
    beach: "Strand",
    market: "Markt",
    landmark: "Wahrzeichen",
    infrastructure: "Wahrzeichen",
    natural: "Naturstätte",
    marine: "Meeres- & Tierwelt",
  },
  attractionGroups: { natural: "Naturattraktionen", marine: "Meer & Tierwelt", cultural: "Kultur & Geschichte" },
};

const ES: DestinationStrings = {
  nav: { atolls: "Atolones", islands: "Islas", diveSites: "Puntos de buceo", attractions: "Atracciones" },
  atollsHub: {
    heroEyebrow: "Destinos",
    title: "Los atolones de Maldivas",
    description: "Todos los atolones administrativos de Maldivas, con sus islas habitadas.",
    metaTitle: "Atolones de Maldivas | MTG",
    inhabitedIslandsLabel: "Islas habitadas",
  },
  islandsHub: {
    heroEyebrow: "Destinos",
    title: "Las islas de Maldivas",
    description: "Todas las islas habitadas y de resort de Maldivas, por atolón.",
    metaTitle: "Islas de Maldivas | MTG",
    searchInEnglish: "Buscar todas las islas (inglés)",
  },
  diveSitesHub: {
    heroEyebrow: "Buceo",
    title: "Puntos de buceo en Maldivas",
    description: "Puntos de buceo reales y documentados de Maldivas — arrecifes, thilas, canales y pecios — por atolón.",
    metaTitle: "Puntos de buceo en Maldivas | MTG",
    intro: "Son puntos de buceo físicos, no productos reservables — consulta las excursiones de buceo para ver los operadores que realizan inmersiones en ellos.",
  },
  attractionsHub: {
    heroEyebrow: "Qué ver",
    title: "Atracciones de Maldivas",
    description: "Atracciones reales y documentadas una a una en Maldivas — mezquitas, museos, monumentos, playas y maravillas naturales.",
    metaTitle: "Atracciones de Maldivas | Monumentos, museos y lugares que visitar | MTG",
    intro: "Cada atracción de esta página es un lugar real, no un producto reservable — consulta las actividades para excursiones y experiencias cercanas.",
  },
  detail: {
    atollEyebrow: "Atolón",
    capitalCityEyebrow: "Capital",
    islandEyebrow: "Isla",
    diveSiteEyebrow: "Punto de buceo",
    attractionEyebrow: "Atracción",
    administrativeCode: "Código administrativo",
    inhabitedIslands: "Islas habitadas",
    inhabited: "Habitada",
    yes: "Sí",
    no: "No",
    atoll: "Atolón",
    island: "Isla",
    nearbyIsland: "Isla cercana",
    siteType: "Tipo de punto",
    depth: "Profundidad",
    experienceLevel: "Nivel de experiencia",
    conditions: "Condiciones",
    marineLife: "Vida marina",
    type: "Tipo",
    mapHeading: "{name} en el mapa",
    mapIntro: "Explora la ubicación en el mapa.",
    islandsIn: "{name}: islas",
    diveSitesIn: "{name}: puntos de buceo",
    attractionsIn: "{name}: atracciones",
    attractionsOn: "Atracciones en {name}",
    diveSitesNear: "Puntos de buceo cerca de {name}",
    moreDiveSitesIn: "{name}: más puntos de buceo",
    nearbyIslands: "Islas cercanas",
    diveSiteNote: "Un punto de buceo físico — no es un producto reservable.",
    attractionNote: "Una atracción física — no es un producto reservable.",
    englishOnlyNote: "Se muestra en inglés.",
    exploreAllOf: "Descubre {name} →",
    exploreMoreTitle: "Descubre más de Maldivas",
    englishVersionLink: "Ver esta página en inglés",
  },
  siteTypes: { reef: "Arrecife", thila: "Thila", channel: "Canal", wreck: "Pecio", pinnacle: "Pináculo", wall: "Pared", cave: "Cueva" },
  experienceLevels: { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado", "all levels": "Todos los niveles" },
  attractionTypes: {
    religious: "Lugar religioso",
    museum: "Museo",
    monument: "Monumento",
    park: "Parque",
    beach: "Playa",
    market: "Mercado",
    landmark: "Lugar emblemático",
    infrastructure: "Lugar emblemático",
    natural: "Paraje natural",
    marine: "Vida marina y fauna",
  },
  attractionGroups: { natural: "Atracciones naturales", marine: "Vida marina y fauna", cultural: "Cultura e historia" },
};

const IT: DestinationStrings = {
  nav: { atolls: "Atolli", islands: "Isole", diveSites: "Siti di immersione", attractions: "Attrazioni" },
  atollsHub: {
    heroEyebrow: "Destinazioni",
    title: "Gli atolli delle Maldive",
    description: "Tutti gli atolli amministrativi delle Maldive, con le loro isole abitate.",
    metaTitle: "Atolli delle Maldive | MTG",
    inhabitedIslandsLabel: "Isole abitate",
  },
  islandsHub: {
    heroEyebrow: "Destinazioni",
    title: "Le isole delle Maldive",
    description: "Tutte le isole abitate e le isole resort delle Maldive, per atollo.",
    metaTitle: "Isole delle Maldive | MTG",
    searchInEnglish: "Cerca tra tutte le isole (inglese)",
  },
  diveSitesHub: {
    heroEyebrow: "Immersioni",
    title: "Siti di immersione delle Maldive",
    description: "Siti di immersione reali e documentati delle Maldive — reef, thila, canali e relitti — per atollo.",
    metaTitle: "Siti di immersione delle Maldive | MTG",
    intro: "Sono siti di immersione fisici, non prodotti prenotabili — consulta le escursioni subacquee per gli operatori che vi organizzano immersioni.",
  },
  attractionsHub: {
    heroEyebrow: "Cosa vedere",
    title: "Attrazioni delle Maldive",
    description: "Attrazioni reali delle Maldive, documentate una per una — moschee, musei, monumenti, spiagge e meraviglie naturali.",
    metaTitle: "Attrazioni delle Maldive | Monumenti, musei e luoghi da visitare | MTG",
    intro: "Ogni attrazione in questa pagina è un luogo reale, non un prodotto prenotabile — consulta le attività per escursioni ed esperienze nelle vicinanze.",
  },
  detail: {
    atollEyebrow: "Atollo",
    capitalCityEyebrow: "Capitale",
    islandEyebrow: "Isola",
    diveSiteEyebrow: "Sito di immersione",
    attractionEyebrow: "Attrazione",
    administrativeCode: "Codice amministrativo",
    inhabitedIslands: "Isole abitate",
    inhabited: "Abitata",
    yes: "Sì",
    no: "No",
    atoll: "Atollo",
    island: "Isola",
    nearbyIsland: "Isola vicina",
    siteType: "Tipo di sito",
    depth: "Profondità",
    experienceLevel: "Livello di esperienza",
    conditions: "Condizioni",
    marineLife: "Vita marina",
    type: "Tipo",
    mapHeading: "{name} sulla mappa",
    mapIntro: "Esplora la posizione sulla mappa.",
    islandsIn: "Isole dell'{name}",
    diveSitesIn: "Siti di immersione nell'{name}",
    attractionsIn: "Attrazioni nell'{name}",
    attractionsOn: "Attrazioni a {name}",
    diveSitesNear: "Siti di immersione vicino a {name}",
    moreDiveSitesIn: "Altri siti di immersione nell'{name}",
    nearbyIslands: "Isole vicine",
    diveSiteNote: "Un sito di immersione fisico — non un prodotto prenotabile.",
    attractionNote: "Un'attrazione fisica — non un prodotto prenotabile.",
    englishOnlyNote: "Mostrato in inglese.",
    exploreAllOf: "Scopri {name} →",
    exploreMoreTitle: "Scopri di più sulle Maldive",
    englishVersionLink: "Visualizza questa pagina in inglese",
  },
  siteTypes: { reef: "Reef", thila: "Thila", channel: "Canale", wreck: "Relitto", pinnacle: "Pinnacolo", wall: "Parete", cave: "Grotta" },
  experienceLevels: { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzato", "all levels": "Tutti i livelli" },
  attractionTypes: {
    religious: "Luogo religioso",
    museum: "Museo",
    monument: "Monumento",
    park: "Parco",
    beach: "Spiaggia",
    market: "Mercato",
    landmark: "Luogo simbolo",
    infrastructure: "Luogo simbolo",
    natural: "Sito naturale",
    marine: "Vita marina e fauna",
  },
  attractionGroups: { natural: "Attrazioni naturali", marine: "Vita marina e fauna", cultural: "Cultura e storia" },
};

const RU: DestinationStrings = {
  nav: { atolls: "Атоллы", islands: "Острова", diveSites: "Дайв-сайты", attractions: "Достопримечательности" },
  atollsHub: {
    heroEyebrow: "Направления",
    title: "Атоллы Мальдив",
    description: "Все административные атоллы Мальдив с их обитаемыми островами.",
    metaTitle: "Атоллы Мальдив | MTG",
    inhabitedIslandsLabel: "Обитаемых островов",
  },
  islandsHub: {
    heroEyebrow: "Направления",
    title: "Острова Мальдив",
    description: "Все обитаемые и курортные острова Мальдив по атоллам.",
    metaTitle: "Острова Мальдив | MTG",
    searchInEnglish: "Поиск по всем островам (на английском)",
  },
  diveSitesHub: {
    heroEyebrow: "Дайвинг",
    title: "Дайв-сайты Мальдив",
    description: "Реальные, задокументированные дайв-сайты Мальдив — рифы, тилы, каналы и затонувшие суда — по атоллам.",
    metaTitle: "Дайв-сайты Мальдив | MTG",
    intro: "Это реальные места для погружений, а не бронируемые продукты — операторов, которые возят туда дайверов, смотрите в разделе дайв-туров.",
  },
  attractionsHub: {
    heroEyebrow: "Что посмотреть",
    title: "Достопримечательности Мальдив",
    description: "Реальные, отдельно описанные достопримечательности Мальдив — мечети, музеи, памятники, пляжи и природные чудеса.",
    metaTitle: "Достопримечательности Мальдив | Памятники, музеи и интересные места | MTG",
    intro: "Каждая достопримечательность здесь — реальное место, а не бронируемый продукт; экскурсии и впечатления поблизости смотрите в разделе активностей.",
  },
  detail: {
    atollEyebrow: "Атолл",
    capitalCityEyebrow: "Столица",
    islandEyebrow: "Остров",
    diveSiteEyebrow: "Дайв-сайт",
    attractionEyebrow: "Достопримечательность",
    administrativeCode: "Административный код",
    inhabitedIslands: "Обитаемые острова",
    inhabited: "Обитаемый",
    yes: "Да",
    no: "Нет",
    atoll: "Атолл",
    island: "Остров",
    nearbyIsland: "Ближайший остров",
    siteType: "Тип сайта",
    depth: "Глубина",
    experienceLevel: "Уровень подготовки",
    conditions: "Условия",
    marineLife: "Морская жизнь",
    type: "Тип",
    mapHeading: "Где находится {name}?",
    mapIntro: "Посмотрите расположение на карте.",
    islandsIn: "Острова: {name}",
    diveSitesIn: "Дайв-сайты: {name}",
    attractionsIn: "Достопримечательности: {name}",
    attractionsOn: "Достопримечательности: {name}",
    diveSitesNear: "Дайв-сайты рядом: {name}",
    moreDiveSitesIn: "Другие дайв-сайты: {name}",
    nearbyIslands: "Острова поблизости",
    diveSiteNote: "Реальное место для погружений — не бронируемый продукт.",
    attractionNote: "Реальная достопримечательность — не бронируемый продукт.",
    englishOnlyNote: "Показано на английском.",
    exploreAllOf: "Подробнее: {name} →",
    exploreMoreTitle: "Больше о Мальдивах",
    englishVersionLink: "Открыть эту страницу на английском",
  },
  siteTypes: { reef: "Риф", thila: "Тила", channel: "Канал", wreck: "Затонувшее судно", pinnacle: "Пик", wall: "Стена", cave: "Пещера" },
  experienceLevels: { beginner: "Начальный", intermediate: "Средний", advanced: "Продвинутый", "all levels": "Любой уровень" },
  attractionTypes: {
    religious: "Религиозное место",
    museum: "Музей",
    monument: "Памятник",
    park: "Парк",
    beach: "Пляж",
    market: "Рынок",
    landmark: "Достопримечательность",
    infrastructure: "Достопримечательность",
    natural: "Природный объект",
    marine: "Морская жизнь",
  },
  attractionGroups: { natural: "Природные достопримечательности", marine: "Морская жизнь", cultural: "Культура и история" },
};

const JA: DestinationStrings = {
  nav: { atolls: "環礁", islands: "島", diveSites: "ダイブポイント", attractions: "観光スポット" },
  atollsHub: {
    heroEyebrow: "目的地",
    title: "モルディブの環礁",
    description: "モルディブのすべての行政環礁と、そこにある有人島。",
    metaTitle: "モルディブの環礁 | MTG",
    inhabitedIslandsLabel: "有人島",
  },
  islandsHub: {
    heroEyebrow: "目的地",
    title: "モルディブの島々",
    description: "モルディブのすべての有人島とリゾート島を環礁別に掲載。",
    metaTitle: "モルディブの島々 | MTG",
    searchInEnglish: "すべての島を検索(英語)",
  },
  diveSitesHub: {
    heroEyebrow: "ダイビング",
    title: "モルディブのダイブポイント",
    description: "実在し記録されたモルディブのダイブポイント——リーフ、ティラ、チャネル、沈船——を環礁別に掲載。",
    metaTitle: "モルディブのダイブポイント | MTG",
    intro: "ここに掲載しているのは実在のダイブポイントで、予約可能な商品ではありません。そこでダイビングを催行する事業者はダイビングツアーをご覧ください。",
  },
  attractionsHub: {
    heroEyebrow: "見どころ",
    title: "モルディブの観光スポット",
    description: "一つひとつ記録された実在のモルディブの観光スポット——モスク、博物館、記念碑、ビーチ、自然の驚異。",
    metaTitle: "モルディブの観光スポット | 名所・博物館・訪れたい場所 | MTG",
    intro: "ここに掲載している観光スポットはすべて実在の場所で、予約可能な商品ではありません。周辺のツアーや体験はアクティビティをご覧ください。",
  },
  detail: {
    atollEyebrow: "環礁",
    capitalCityEyebrow: "首都",
    islandEyebrow: "島",
    diveSiteEyebrow: "ダイブポイント",
    attractionEyebrow: "観光スポット",
    administrativeCode: "行政コード",
    inhabitedIslands: "有人島",
    inhabited: "有人",
    yes: "はい",
    no: "いいえ",
    atoll: "環礁",
    island: "島",
    nearbyIsland: "最寄りの島",
    siteType: "ポイントの種類",
    depth: "水深",
    experienceLevel: "経験レベル",
    conditions: "コンディション",
    marineLife: "海洋生物",
    type: "種類",
    mapHeading: "{name}はどこ?",
    mapIntro: "地図で場所を確認しましょう。",
    islandsIn: "{name}の島々",
    diveSitesIn: "{name}のダイブポイント",
    attractionsIn: "{name}の観光スポット",
    attractionsOn: "{name}の観光スポット",
    diveSitesNear: "{name}周辺のダイブポイント",
    moreDiveSitesIn: "{name}のその他のダイブポイント",
    nearbyIslands: "近くの島",
    diveSiteNote: "実在のダイブポイントです。予約可能な商品ではありません。",
    attractionNote: "実在の観光スポットです。予約可能な商品ではありません。",
    englishOnlyNote: "英語で表示しています。",
    exploreAllOf: "{name}をもっと見る →",
    exploreMoreTitle: "モルディブをもっと探す",
    englishVersionLink: "このページを英語で見る",
  },
  siteTypes: { reef: "リーフ", thila: "ティラ", channel: "チャネル", wreck: "沈船", pinnacle: "根", wall: "ドロップオフ", cave: "洞窟" },
  experienceLevels: { beginner: "初心者", intermediate: "中級者", advanced: "上級者", "all levels": "全レベル" },
  attractionTypes: {
    religious: "宗教施設",
    museum: "博物館",
    monument: "記念碑",
    park: "公園",
    beach: "ビーチ",
    market: "市場",
    landmark: "名所",
    infrastructure: "名所",
    natural: "自然スポット",
    marine: "海洋生物スポット",
  },
  attractionGroups: { natural: "自然の見どころ", marine: "海の生き物", cultural: "文化・歴史" },
};

const ZH: DestinationStrings = {
  nav: { atolls: "环礁", islands: "岛屿", diveSites: "潜水点", attractions: "景点" },
  atollsHub: {
    heroEyebrow: "目的地",
    title: "马尔代夫的环礁",
    description: "马尔代夫所有行政环礁及其有人居住的岛屿。",
    metaTitle: "马尔代夫环礁 | MTG",
    inhabitedIslandsLabel: "有人岛",
  },
  islandsHub: {
    heroEyebrow: "目的地",
    title: "马尔代夫的岛屿",
    description: "按环礁列出马尔代夫所有有人居住的岛屿和度假岛。",
    metaTitle: "马尔代夫岛屿 | MTG",
    searchInEnglish: "搜索所有岛屿(英文)",
  },
  diveSitesHub: {
    heroEyebrow: "潜水",
    title: "马尔代夫潜水点",
    description: "真实且有记录的马尔代夫潜水点——礁石、Thila、水道和沉船——按环礁列出。",
    metaTitle: "马尔代夫潜水点 | MTG",
    intro: "这些是真实存在的潜水点,而非可预订的产品——如需前往这些潜水点的运营商,请查看潜水行程。",
  },
  attractionsHub: {
    heroEyebrow: "必看景点",
    title: "马尔代夫景点",
    description: "逐一记录的真实马尔代夫景点——清真寺、博物馆、纪念碑、海滩和自然奇观。",
    metaTitle: "马尔代夫景点 | 地标、博物馆与游览胜地 | MTG",
    intro: "这里的每个景点都是真实存在的地点,而非可预订的产品——附近的行程和体验请查看活动页面。",
  },
  detail: {
    atollEyebrow: "环礁",
    capitalCityEyebrow: "首都",
    islandEyebrow: "岛屿",
    diveSiteEyebrow: "潜水点",
    attractionEyebrow: "景点",
    administrativeCode: "行政代码",
    inhabitedIslands: "有人岛",
    inhabited: "有人居住",
    yes: "是",
    no: "否",
    atoll: "环礁",
    island: "岛屿",
    nearbyIsland: "附近岛屿",
    siteType: "潜水点类型",
    depth: "深度",
    experienceLevel: "经验等级",
    conditions: "水况",
    marineLife: "海洋生物",
    type: "类型",
    mapHeading: "{name}在哪里?",
    mapIntro: "在地图上查看位置。",
    islandsIn: "{name}的岛屿",
    diveSitesIn: "{name}的潜水点",
    attractionsIn: "{name}的景点",
    attractionsOn: "{name}的景点",
    diveSitesNear: "{name}附近的潜水点",
    moreDiveSitesIn: "{name}的更多潜水点",
    nearbyIslands: "附近岛屿",
    diveSiteNote: "真实存在的潜水点——非可预订产品。",
    attractionNote: "真实存在的景点——非可预订产品。",
    englishOnlyNote: "以英文显示。",
    exploreAllOf: "探索{name}全部内容 →",
    exploreMoreTitle: "探索更多马尔代夫",
    englishVersionLink: "查看英文版页面",
  },
  siteTypes: { reef: "礁石", thila: "Thila(水下礁峰)", channel: "水道", wreck: "沉船", pinnacle: "礁柱", wall: "峭壁", cave: "洞穴" },
  experienceLevels: { beginner: "初级", intermediate: "中级", advanced: "高级", "all levels": "所有级别" },
  attractionTypes: {
    religious: "宗教场所",
    museum: "博物馆",
    monument: "纪念碑",
    park: "公园",
    beach: "海滩",
    market: "市场",
    landmark: "地标",
    infrastructure: "地标",
    natural: "自然景观",
    marine: "海洋生物景点",
  },
  attractionGroups: { natural: "自然景观", marine: "海洋与野生动物", cultural: "文化与历史" },
};

const DESTINATION_STRINGS: Partial<Record<Locale, DestinationStrings>> = { en: EN, de: DE, es: ES, it: IT, ru: RU, ja: JA, zh: ZH };

/** Falls back to English for any locale without real copy yet. */
export function getDestinationStrings(locale: Locale): DestinationStrings {
  return DESTINATION_STRINGS[locale] ?? EN;
}

/** Every non-English locale with real destination copy -- the
 * published-locale set for the atolls/islands/dive-sites/attractions
 * hubs' hreflang and sitemap entries. */
export const DESTINATION_STRINGS_LOCALES: Locale[] = Object.keys(DESTINATION_STRINGS).filter((l): l is Locale => l !== "en") as Locale[];

/** Substitutes `{name}` in a template from this module. */
export function fill(template: string, name: string): string {
  return template.replace("{name}", name);
}

/** Localized label for a raw attribute value (site type, experience level,
 * attraction type), falling back to the raw value itself. */
export function labelFor(labels: Record<string, string>, value: string | null | undefined): string | null {
  if (!value) return null;
  return labels[value] ?? labels[value.toLowerCase()] ?? value;
}
