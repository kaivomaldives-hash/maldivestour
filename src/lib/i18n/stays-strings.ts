import type { Locale } from "@/lib/i18n/locales";

/**
 * Surrounding copy for the translated stays pages
 * (src/app/[locale]/maldives/{stays,resorts,hotels,guesthouses}/) -- same
 * role and conventions as destination-strings.ts: UI-strings-only hubs,
 * so the locales defined here ARE those hubs' published-locale set
 * (STAYS_STRINGS_LOCALES), and "{name}" templates go through fill().
 */
type StayType = "resort" | "hotel" | "guesthouse";

export interface StaysStrings {
  nav: { stays: string; resort: string; hotel: string; guesthouse: string };
  hub: {
    heroEyebrow: string;
    title: string;
    description: string;
    metaTitle: string;
    typeDescriptions: Record<StayType, string>;
    viewAll: string;
    liveaboardsTitle: string;
    liveaboardsText: string;
  };
  directory: Record<StayType, { title: string; description: string; metaTitle: string }>;
  detail: {
    typeLabel: Record<StayType, string>;
    type: string;
    starRating: string;
    priceTier: string;
    rooms: string;
    allInclusive: string;
    overwaterVillas: string;
    island: string;
    atoll: string;
    yes: string;
    no: string;
    fullDescriptionEnglish: string;
    gallery: string;
    photoAlt: string;
    roomsTitle: string;
    roomsIntro: string;
    bed: string;
    maxGuests: string;
    from: string;
    perNight: string;
    mapHeading: string;
    mapIntro: string;
    requestOfferTitle: string;
    requestOfferIntro: string;
    exploreMoreTitle: string;
    englishVersionLink: string;
  };
  priceTiers: Record<string, string>;
  allInclusiveBadge: string;
  overwaterBadge: string;
}

const EN: StaysStrings = {
  nav: { stays: "Stays", resort: "Resorts", hotel: "Hotels", guesthouse: "Guesthouses" },
  hub: {
    heroEyebrow: "Where to Stay",
    title: "Maldives Stays",
    description: "Resorts, hotels and guesthouses across the Maldives — real properties, never invented.",
    metaTitle: "Maldives Stays — Resorts, Hotels & Guesthouses | MTG",
    typeDescriptions: {
      resort: "Private-island resorts across the Maldives, each with real rooms, photos and (where we have one) a starting price.",
      hotel: "City and local-island hotels — Male, Hulhumale, Maafushi and more.",
      guesthouse: "Budget-friendly guesthouses on local islands, for the local-island tourism side of the Maldives.",
    },
    viewAll: "View all",
    liveaboardsTitle: "Liveaboards",
    liveaboardsText: "We don't yet have a verified liveaboard directory — message us on WhatsApp if you're looking for a liveaboard trip and we'll point you in the right direction.",
  },
  directory: {
    resort: { title: "Maldives Resorts", description: "Private-island resorts across the Maldives.", metaTitle: "Maldives Resorts | MTG" },
    hotel: { title: "Maldives Hotels", description: "City and local-island hotels across the Maldives.", metaTitle: "Maldives Hotels | MTG" },
    guesthouse: { title: "Maldives Guesthouses", description: "Guesthouses on the Maldives' local islands.", metaTitle: "Maldives Guesthouses | MTG" },
  },
  detail: {
    typeLabel: { resort: "Resort", hotel: "Hotel", guesthouse: "Guesthouse" },
    type: "Type",
    starRating: "Star rating",
    priceTier: "Price tier",
    rooms: "Rooms",
    allInclusive: "All-inclusive",
    overwaterVillas: "Overwater villas",
    island: "Island",
    atoll: "Atoll",
    yes: "Yes",
    no: "No",
    fullDescriptionEnglish: "Read the full description (English) →",
    gallery: "Gallery",
    photoAlt: "photo",
    roomsTitle: "Rooms & Villas",
    roomsIntro: "Prices shown are historical figures from our own records, not live rates — request an offer for current pricing.",
    bed: "bed",
    maxGuests: "Max",
    from: "From",
    perNight: "/ night",
    mapHeading: "Where is {name}?",
    mapIntro: "Explore the location on the map.",
    requestOfferTitle: "Request an Offer",
    requestOfferIntro: "Prices change with season and availability — tell us your dates and we'll send current rates.",
    exploreMoreTitle: "Explore More Maldives",
    englishVersionLink: "View this page in English",
  },
  priceTiers: { budget: "Budget", mid: "Mid-range", luxury: "Luxury", ultra_luxury: "Ultra-luxury" },
  allInclusiveBadge: "All-inclusive",
  overwaterBadge: "Overwater villas",
};

const DE: StaysStrings = {
  nav: { stays: "Unterkünfte", resort: "Resorts", hotel: "Hotels", guesthouse: "Gästehäuser" },
  hub: {
    heroEyebrow: "Unterkünfte",
    title: "Unterkünfte auf den Malediven",
    description: "Resorts, Hotels und Gästehäuser auf den gesamten Malediven — echte Unterkünfte, niemals erfunden.",
    metaTitle: "Unterkünfte auf den Malediven — Resorts, Hotels & Gästehäuser | MTG",
    typeDescriptions: {
      resort: "Resorts auf Privatinseln auf den gesamten Malediven, jeweils mit echten Zimmern, Fotos und (sofern vorhanden) einem Ab-Preis.",
      hotel: "Stadt- und Einheimischeninsel-Hotels — Malé, Hulhumalé, Maafushi und mehr.",
      guesthouse: "Preiswerte Gästehäuser auf Einheimischeninseln — für die lokale Seite des Malediven-Tourismus.",
    },
    viewAll: "Alle ansehen",
    liveaboardsTitle: "Tauchsafaris (Liveaboards)",
    liveaboardsText: "Ein geprüftes Verzeichnis für Tauchsafari-Schiffe haben wir noch nicht — schreiben Sie uns auf WhatsApp, wenn Sie eine Liveaboard-Reise suchen, und wir helfen Ihnen weiter.",
  },
  directory: {
    resort: { title: "Resorts auf den Malediven", description: "Resorts auf Privatinseln auf den gesamten Malediven.", metaTitle: "Resorts auf den Malediven | MTG" },
    hotel: { title: "Hotels auf den Malediven", description: "Stadt- und Einheimischeninsel-Hotels auf den Malediven.", metaTitle: "Hotels auf den Malediven | MTG" },
    guesthouse: { title: "Gästehäuser auf den Malediven", description: "Gästehäuser auf den Einheimischeninseln der Malediven.", metaTitle: "Gästehäuser auf den Malediven | MTG" },
  },
  detail: {
    typeLabel: { resort: "Resort", hotel: "Hotel", guesthouse: "Gästehaus" },
    type: "Art",
    starRating: "Sterne",
    priceTier: "Preisklasse",
    rooms: "Zimmer",
    allInclusive: "All-inclusive",
    overwaterVillas: "Wasservillen",
    island: "Insel",
    atoll: "Atoll",
    yes: "Ja",
    no: "Nein",
    fullDescriptionEnglish: "Vollständige Beschreibung lesen (Englisch) →",
    gallery: "Galerie",
    photoAlt: "Foto",
    roomsTitle: "Zimmer & Villen",
    roomsIntro: "Die angezeigten Preise sind historische Werte aus unseren eigenen Unterlagen, keine Live-Preise — fragen Sie ein Angebot für aktuelle Preise an.",
    bed: "Bett",
    maxGuests: "Max.",
    from: "Ab",
    perNight: "/ Nacht",
    mapHeading: "{name} auf der Karte",
    mapIntro: "Entdecken Sie den Ort auf der Karte.",
    requestOfferTitle: "Angebot anfragen",
    requestOfferIntro: "Die Preise ändern sich je nach Saison und Verfügbarkeit — nennen Sie uns Ihre Reisedaten und wir senden Ihnen aktuelle Preise.",
    exploreMoreTitle: "Mehr von den Malediven entdecken",
    englishVersionLink: "Diese Seite auf Englisch ansehen",
  },
  priceTiers: { budget: "Günstig", mid: "Mittelklasse", luxury: "Luxus", ultra_luxury: "Ultra-Luxus" },
  allInclusiveBadge: "All-inclusive",
  overwaterBadge: "Wasservillen",
};

const ES: StaysStrings = {
  nav: { stays: "Alojamiento", resort: "Resorts", hotel: "Hoteles", guesthouse: "Casas de huéspedes" },
  hub: {
    heroEyebrow: "Dónde alojarse",
    title: "Alojamiento en Maldivas",
    description: "Resorts, hoteles y casas de huéspedes en todo Maldivas — alojamientos reales, nunca inventados.",
    metaTitle: "Alojamiento en Maldivas — Resorts, hoteles y casas de huéspedes | MTG",
    typeDescriptions: {
      resort: "Resorts en islas privadas de todo Maldivas, cada uno con habitaciones y fotos reales y (cuando lo tenemos) un precio desde.",
      hotel: "Hoteles urbanos y en islas locales — Malé, Hulhumalé, Maafushi y más.",
      guesthouse: "Casas de huéspedes económicas en islas locales, la cara del turismo local de Maldivas.",
    },
    viewAll: "Ver todos",
    liveaboardsTitle: "Cruceros de buceo (liveaboards)",
    liveaboardsText: "Todavía no tenemos un directorio verificado de cruceros de buceo — escríbenos por WhatsApp si buscas un viaje en liveaboard y te orientaremos.",
  },
  directory: {
    resort: { title: "Resorts en Maldivas", description: "Resorts en islas privadas de todo Maldivas.", metaTitle: "Resorts en Maldivas | MTG" },
    hotel: { title: "Hoteles en Maldivas", description: "Hoteles urbanos y en islas locales de Maldivas.", metaTitle: "Hoteles en Maldivas | MTG" },
    guesthouse: { title: "Casas de huéspedes en Maldivas", description: "Casas de huéspedes en las islas locales de Maldivas.", metaTitle: "Casas de huéspedes en Maldivas | MTG" },
  },
  detail: {
    typeLabel: { resort: "Resort", hotel: "Hotel", guesthouse: "Casa de huéspedes" },
    type: "Tipo",
    starRating: "Estrellas",
    priceTier: "Categoría de precio",
    rooms: "Habitaciones",
    allInclusive: "Todo incluido",
    overwaterVillas: "Villas sobre el agua",
    island: "Isla",
    atoll: "Atolón",
    yes: "Sí",
    no: "No",
    fullDescriptionEnglish: "Leer la descripción completa (en inglés) →",
    gallery: "Galería",
    photoAlt: "foto",
    roomsTitle: "Habitaciones y villas",
    roomsIntro: "Los precios mostrados son cifras históricas de nuestros propios registros, no tarifas en vivo — solicita una oferta para conocer los precios actuales.",
    bed: "cama",
    maxGuests: "Máx.",
    from: "Desde",
    perNight: "/ noche",
    mapHeading: "{name} en el mapa",
    mapIntro: "Explora la ubicación en el mapa.",
    requestOfferTitle: "Solicitar una oferta",
    requestOfferIntro: "Los precios cambian según la temporada y la disponibilidad — dinos tus fechas y te enviaremos las tarifas actuales.",
    exploreMoreTitle: "Descubre más de Maldivas",
    englishVersionLink: "Ver esta página en inglés",
  },
  priceTiers: { budget: "Económico", mid: "Gama media", luxury: "Lujo", ultra_luxury: "Ultra lujo" },
  allInclusiveBadge: "Todo incluido",
  overwaterBadge: "Villas sobre el agua",
};

const IT: StaysStrings = {
  nav: { stays: "Alloggi", resort: "Resort", hotel: "Hotel", guesthouse: "Guesthouse" },
  hub: {
    heroEyebrow: "Dove dormire",
    title: "Alloggi alle Maldive",
    description: "Resort, hotel e guesthouse in tutte le Maldive — strutture reali, mai inventate.",
    metaTitle: "Alloggi alle Maldive — Resort, hotel e guesthouse | MTG",
    typeDescriptions: {
      resort: "Resort su isole private in tutte le Maldive, ciascuno con camere e foto reali e (quando disponibile) un prezzo a partire da.",
      hotel: "Hotel in città e sulle isole locali — Malé, Hulhumalé, Maafushi e altro.",
      guesthouse: "Guesthouse economiche sulle isole locali, il lato del turismo locale delle Maldive.",
    },
    viewAll: "Vedi tutti",
    liveaboardsTitle: "Crociere subacquee (liveaboard)",
    liveaboardsText: "Non abbiamo ancora un elenco verificato di crociere subacquee — scrivici su WhatsApp se cerchi un viaggio in liveaboard e ti indirizzeremo.",
  },
  directory: {
    resort: { title: "Resort alle Maldive", description: "Resort su isole private in tutte le Maldive.", metaTitle: "Resort alle Maldive | MTG" },
    hotel: { title: "Hotel alle Maldive", description: "Hotel in città e sulle isole locali delle Maldive.", metaTitle: "Hotel alle Maldive | MTG" },
    guesthouse: { title: "Guesthouse alle Maldive", description: "Guesthouse sulle isole locali delle Maldive.", metaTitle: "Guesthouse alle Maldive | MTG" },
  },
  detail: {
    typeLabel: { resort: "Resort", hotel: "Hotel", guesthouse: "Guesthouse" },
    type: "Tipo",
    starRating: "Stelle",
    priceTier: "Fascia di prezzo",
    rooms: "Camere",
    allInclusive: "All inclusive",
    overwaterVillas: "Ville sull'acqua",
    island: "Isola",
    atoll: "Atollo",
    yes: "Sì",
    no: "No",
    fullDescriptionEnglish: "Leggi la descrizione completa (in inglese) →",
    gallery: "Galleria",
    photoAlt: "foto",
    roomsTitle: "Camere e ville",
    roomsIntro: "I prezzi indicati sono valori storici dai nostri archivi, non tariffe in tempo reale — richiedi un'offerta per i prezzi attuali.",
    bed: "letto",
    maxGuests: "Max",
    from: "Da",
    perNight: "/ notte",
    mapHeading: "{name} sulla mappa",
    mapIntro: "Esplora la posizione sulla mappa.",
    requestOfferTitle: "Richiedi un'offerta",
    requestOfferIntro: "I prezzi cambiano in base alla stagione e alla disponibilità — indicaci le tue date e ti invieremo le tariffe aggiornate.",
    exploreMoreTitle: "Scopri di più sulle Maldive",
    englishVersionLink: "Visualizza questa pagina in inglese",
  },
  priceTiers: { budget: "Economico", mid: "Fascia media", luxury: "Lusso", ultra_luxury: "Ultra lusso" },
  allInclusiveBadge: "All inclusive",
  overwaterBadge: "Ville sull'acqua",
};

const RU: StaysStrings = {
  nav: { stays: "Проживание", resort: "Курорты", hotel: "Отели", guesthouse: "Гостевые дома" },
  hub: {
    heroEyebrow: "Где остановиться",
    title: "Проживание на Мальдивах",
    description: "Курорты, отели и гостевые дома по всем Мальдивам — реальные объекты, никогда не выдуманные.",
    metaTitle: "Проживание на Мальдивах — курорты, отели и гостевые дома | MTG",
    typeDescriptions: {
      resort: "Курорты на частных островах по всем Мальдивам — с реальными номерами, фотографиями и (если есть) ценой «от».",
      hotel: "Городские отели и отели на местных островах — Мале, Хулхумале, Маафуши и другие.",
      guesthouse: "Недорогие гостевые дома на местных островах — для отдыха на Мальдивах по-местному.",
    },
    viewAll: "Смотреть все",
    liveaboardsTitle: "Дайв-сафари (лайвбортов)",
    liveaboardsText: "Проверенного каталога дайв-сафари у нас пока нет — напишите нам в WhatsApp, если ищете поездку на лайвборде, и мы подскажем, куда обратиться.",
  },
  directory: {
    resort: { title: "Курорты Мальдив", description: "Курорты на частных островах по всем Мальдивам.", metaTitle: "Курорты Мальдив | MTG" },
    hotel: { title: "Отели Мальдив", description: "Городские отели и отели на местных островах Мальдив.", metaTitle: "Отели Мальдив | MTG" },
    guesthouse: { title: "Гостевые дома на Мальдивах", description: "Гостевые дома на местных островах Мальдив.", metaTitle: "Гостевые дома на Мальдивах | MTG" },
  },
  detail: {
    typeLabel: { resort: "Курорт", hotel: "Отель", guesthouse: "Гостевой дом" },
    type: "Тип",
    starRating: "Звёзды",
    priceTier: "Ценовая категория",
    rooms: "Номера",
    allInclusive: "Всё включено",
    overwaterVillas: "Виллы на воде",
    island: "Остров",
    atoll: "Атолл",
    yes: "Да",
    no: "Нет",
    fullDescriptionEnglish: "Полное описание (на английском) →",
    gallery: "Галерея",
    photoAlt: "фото",
    roomsTitle: "Номера и виллы",
    roomsIntro: "Указанные цены — исторические данные из наших записей, а не актуальные тарифы; запросите предложение, чтобы узнать текущие цены.",
    bed: "кровать",
    maxGuests: "Макс.",
    from: "От",
    perNight: "/ ночь",
    mapHeading: "Где находится {name}?",
    mapIntro: "Посмотрите расположение на карте.",
    requestOfferTitle: "Запросить предложение",
    requestOfferIntro: "Цены зависят от сезона и наличия мест — сообщите нам даты поездки, и мы пришлём актуальные тарифы.",
    exploreMoreTitle: "Больше о Мальдивах",
    englishVersionLink: "Открыть эту страницу на английском",
  },
  priceTiers: { budget: "Бюджетный", mid: "Средний", luxury: "Люкс", ultra_luxury: "Ультра-люкс" },
  allInclusiveBadge: "Всё включено",
  overwaterBadge: "Виллы на воде",
};

const JA: StaysStrings = {
  nav: { stays: "宿泊", resort: "リゾート", hotel: "ホテル", guesthouse: "ゲストハウス" },
  hub: {
    heroEyebrow: "宿泊先",
    title: "モルディブの宿泊施設",
    description: "モルディブ各地のリゾート、ホテル、ゲストハウス——実在する施設のみを掲載しています。",
    metaTitle: "モルディブの宿泊施設 — リゾート・ホテル・ゲストハウス | MTG",
    typeDescriptions: {
      resort: "モルディブ各地のプライベートアイランド・リゾート。実際の客室、写真、(ある場合は)最低料金を掲載しています。",
      hotel: "マレ、フルマーレ、マーフシなどの都市型ホテルやローカル島のホテル。",
      guesthouse: "ローカル島にある手頃なゲストハウス。モルディブのローカル島観光を楽しめます。",
    },
    viewAll: "すべて見る",
    liveaboardsTitle: "ダイビングクルーズ(ライブアボード)",
    liveaboardsText: "ライブアボードの確認済みリストはまだありません。ライブアボードの旅をお探しの方はWhatsAppでご連絡ください。ご案内いたします。",
  },
  directory: {
    resort: { title: "モルディブのリゾート", description: "モルディブ各地のプライベートアイランド・リゾート。", metaTitle: "モルディブのリゾート | MTG" },
    hotel: { title: "モルディブのホテル", description: "モルディブの都市型ホテルとローカル島のホテル。", metaTitle: "モルディブのホテル | MTG" },
    guesthouse: { title: "モルディブのゲストハウス", description: "モルディブのローカル島にあるゲストハウス。", metaTitle: "モルディブのゲストハウス | MTG" },
  },
  detail: {
    typeLabel: { resort: "リゾート", hotel: "ホテル", guesthouse: "ゲストハウス" },
    type: "種類",
    starRating: "星評価",
    priceTier: "価格帯",
    rooms: "客室数",
    allInclusive: "オールインクルーシブ",
    overwaterVillas: "水上ヴィラ",
    island: "島",
    atoll: "環礁",
    yes: "あり",
    no: "なし",
    fullDescriptionEnglish: "詳しい説明を読む(英語)→",
    gallery: "ギャラリー",
    photoAlt: "写真",
    roomsTitle: "客室・ヴィラ",
    roomsIntro: "表示価格は当社記録にある過去の参考価格で、最新の料金ではありません。最新料金はお見積もりをご依頼ください。",
    bed: "ベッド",
    maxGuests: "最大",
    from: "",
    perNight: "〜 / 泊",
    mapHeading: "{name}の場所",
    mapIntro: "地図で場所を確認しましょう。",
    requestOfferTitle: "お見積もり依頼",
    requestOfferIntro: "料金はシーズンや空室状況によって変わります。ご希望の日程をお知らせいただければ、最新料金をお送りします。",
    exploreMoreTitle: "モルディブをもっと探す",
    englishVersionLink: "このページを英語で見る",
  },
  priceTiers: { budget: "エコノミー", mid: "ミドルクラス", luxury: "ラグジュアリー", ultra_luxury: "ウルトララグジュアリー" },
  allInclusiveBadge: "オールインクルーシブ",
  overwaterBadge: "水上ヴィラ",
};

const ZH: StaysStrings = {
  nav: { stays: "住宿", resort: "度假村", hotel: "酒店", guesthouse: "民宿" },
  hub: {
    heroEyebrow: "住宿推荐",
    title: "马尔代夫住宿",
    description: "马尔代夫各地的度假村、酒店和民宿——均为真实存在的住宿,绝无虚构。",
    metaTitle: "马尔代夫住宿 — 度假村、酒店与民宿 | MTG",
    typeDescriptions: {
      resort: "马尔代夫各地的私人岛屿度假村,均附有真实的房型、照片以及(如有)起价。",
      hotel: "城市及本地岛屿酒店——马累、胡鲁马累、马富士等地。",
      guesthouse: "本地岛屿上经济实惠的民宿,体验马尔代夫的本地岛屿旅游。",
    },
    viewAll: "查看全部",
    liveaboardsTitle: "潜水船宿(Liveaboard)",
    liveaboardsText: "我们暂时还没有经过核实的潜水船宿目录——如果您在寻找船宿行程,请通过WhatsApp联系我们,我们会为您指引。",
  },
  directory: {
    resort: { title: "马尔代夫度假村", description: "马尔代夫各地的私人岛屿度假村。", metaTitle: "马尔代夫度假村 | MTG" },
    hotel: { title: "马尔代夫酒店", description: "马尔代夫的城市及本地岛屿酒店。", metaTitle: "马尔代夫酒店 | MTG" },
    guesthouse: { title: "马尔代夫民宿", description: "马尔代夫本地岛屿上的民宿。", metaTitle: "马尔代夫民宿 | MTG" },
  },
  detail: {
    typeLabel: { resort: "度假村", hotel: "酒店", guesthouse: "民宿" },
    type: "类型",
    starRating: "星级",
    priceTier: "价格档次",
    rooms: "客房数",
    allInclusive: "全包",
    overwaterVillas: "水上别墅",
    island: "岛屿",
    atoll: "环礁",
    yes: "是",
    no: "否",
    fullDescriptionEnglish: "阅读完整介绍(英文)→",
    gallery: "图库",
    photoAlt: "照片",
    roomsTitle: "客房与别墅",
    roomsIntro: "所示价格为我们记录中的历史价格,并非实时房价——如需当前价格,请提交询价。",
    bed: "床",
    maxGuests: "最多",
    from: "起价",
    perNight: "/ 晚",
    mapHeading: "{name}在哪里?",
    mapIntro: "在地图上查看位置。",
    requestOfferTitle: "询价",
    requestOfferIntro: "价格随季节和房态而变化——告诉我们您的日期,我们会发送最新报价。",
    exploreMoreTitle: "探索更多马尔代夫",
    englishVersionLink: "查看英文版页面",
  },
  priceTiers: { budget: "经济型", mid: "中档", luxury: "豪华", ultra_luxury: "超豪华" },
  allInclusiveBadge: "全包",
  overwaterBadge: "水上别墅",
};

const STAYS_STRINGS: Partial<Record<Locale, StaysStrings>> = { en: EN, de: DE, es: ES, it: IT, ru: RU, ja: JA, zh: ZH };

/** Falls back to English for any locale without real copy yet. */
export function getStaysStrings(locale: Locale): StaysStrings {
  return STAYS_STRINGS[locale] ?? EN;
}

/** Published-locale set for the stays hub and the resorts/hotels/
 * guesthouses directories (hreflang + sitemap). */
export const STAYS_STRINGS_LOCALES: Locale[] = Object.keys(STAYS_STRINGS).filter((l): l is Locale => l !== "en") as Locale[];
