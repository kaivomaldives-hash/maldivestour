import type { Locale } from "@/lib/i18n/locales";

/**
 * The remaining hardcoded-English bits of the site chrome (header "Pages"
 * menu, mobile bottom bar extras, footer copy) -- nav/footer destination
 * labels themselves come from ui-strings.ts (ui.nav / ui.footerLinks).
 */
export interface ChromeStrings {
  pagesMenu: string;
  liveaboards: string;
  whatsappChat: string;
  footerTagline: string;
  footerTravelHeading: string;
  becomePartner: string;
  becomeAffiliate: string;
  becomeAgent: string;
  terms: string;
  privacy: string;
  rights: string;
  moreDestinations: string;
  fewerDestinations: string;
  viewPackage: string;
  whereToStay: string;
  whereToStayIntro: string;
  staysOn: string;
  moreStaysIn: string;
  theArea: string;
  browseAllStays: string;
  /** Card/quick-facts labels -- "{n}" / "{nights}" / "{days}" are placeholders. */
  cardFrom: string;
  minutes: string;
  hours: string;
  locationsCount: string;
  mtgCurated: string;
  nightsDays: string;
  minRead: string;
  activityCategories: Record<string, string>;
  difficulty: Record<string, string>;
  quickFacts: { category: string; duration: string; level: string; difficulty: string; minimumAge: string; maxParticipants: string; priceFrom: string; location: string; atoll: string };
}

const EN: ChromeStrings = {
  pagesMenu: "Pages",
  liveaboards: "Liveaboards",
  whatsappChat: "Chat with us on WhatsApp",
  footerTagline: "A directory and travel guide for the Maldives — real atolls, islands, resorts, activities and transfers, sourced and kept up to date.",
  footerTravelHeading: "Travel",
  becomePartner: "Become a Partner",
  becomeAffiliate: "Become an Affiliate",
  becomeAgent: "Become a Travel Agent",
  terms: "Terms and Conditions",
  privacy: "Privacy Policy",
  rights: "All information is provided for travel planning purposes.",
  moreDestinations: "Show more destinations",
  fewerDestinations: "Show fewer destinations",
  viewPackage: "View Package",
  whereToStay: "Where to Stay",
  whereToStayIntro: "Real places to stay in the area — not affiliated with or operating this activity.",
  staysOn: "Stays on {name}",
  moreStaysIn: "More Stays in {name}",
  theArea: "the Area",
  browseAllStays: "Browse all places to stay →",
  cardFrom: "From",
  minutes: "{n} min",
  hours: "{n} hr",
  locationsCount: "{n} locations",
  mtgCurated: "MTG-curated",
  nightsDays: "{nights} Nights / {days} Days",
  minRead: "{n} min read",
  activityCategories: { general: "General", fishing: "Fishing", diving: "Diving", surfing: "Surfing", watersports: "Watersports", excursion: "Excursion", island_hopping: "Island Hopping", spa: "Spa", culture: "Culture" },
  difficulty: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", all_levels: "All levels" },
  quickFacts: { category: "Category", duration: "Duration", level: "Level", difficulty: "Difficulty", minimumAge: "Minimum age", maxParticipants: "Max participants", priceFrom: "Price from", location: "Location", atoll: "Atoll" },
};

const CHROME: Partial<Record<Locale, ChromeStrings>> = {
  en: EN,
  de: {
    pagesMenu: "Seiten",
    liveaboards: "Tauchsafaris",
    whatsappChat: "Schreiben Sie uns auf WhatsApp",
    footerTagline: "Verzeichnis und Reiseführer für die Malediven — echte Atolle, Inseln, Resorts, Aktivitäten und Transfers, recherchiert und aktuell gehalten.",
    footerTravelHeading: "Reisen",
    becomePartner: "Partner werden",
    becomeAffiliate: "Affiliate werden",
    becomeAgent: "Reisebüro-Partner werden",
    terms: "AGB",
    privacy: "Datenschutz",
    rights: "Alle Informationen dienen der Reiseplanung.",
    moreDestinations: "Mehr Ziele anzeigen",
    fewerDestinations: "Weniger Ziele anzeigen",
    viewPackage: "Paket ansehen",
    whereToStay: "Unterkünfte in der Nähe",
    whereToStayIntro: "Echte Unterkünfte in der Gegend — nicht mit diesem Angebot verbunden.",
    staysOn: "Unterkünfte auf {name}",
    moreStaysIn: "Weitere Unterkünfte: {name}",
    theArea: "Umgebung",
    browseAllStays: "Alle Unterkünfte ansehen →",
    cardFrom: "Ab",
    minutes: "{n} Min.",
    hours: "{n} Std.",
    locationsCount: "{n} Orte",
    mtgCurated: "Von MTG kuratiert",
    nightsDays: "{nights} Nächte / {days} Tage",
    minRead: "{n} Min. Lesezeit",
    activityCategories: { general: "Allgemein", fishing: "Angeln", diving: "Tauchen", surfing: "Surfen", watersports: "Wassersport", excursion: "Ausflug", island_hopping: "Inselhopping", spa: "Spa", culture: "Kultur" },
    difficulty: { beginner: "Einsteiger", intermediate: "Fortgeschrittene", advanced: "Erfahrene", all_levels: "Alle Niveaus" },
    quickFacts: { category: "Kategorie", duration: "Dauer", level: "Niveau", difficulty: "Schwierigkeit", minimumAge: "Mindestalter", maxParticipants: "Max. Teilnehmer", priceFrom: "Preis ab", location: "Ort", atoll: "Atoll" },
  },
  es: {
    pagesMenu: "Páginas",
    liveaboards: "Cruceros de buceo",
    whatsappChat: "Escríbenos por WhatsApp",
    footerTagline: "Directorio y guía de viaje de Maldivas: atolones, islas, resorts, actividades y traslados reales, verificados y actualizados.",
    footerTravelHeading: "Viajar",
    becomePartner: "Hazte socio",
    becomeAffiliate: "Hazte afiliado",
    becomeAgent: "Hazte agente de viajes",
    terms: "Términos y condiciones",
    privacy: "Política de privacidad",
    rights: "Toda la información se ofrece para planificar viajes.",
    moreDestinations: "Mostrar más destinos",
    fewerDestinations: "Mostrar menos destinos",
    viewPackage: "Ver paquete",
    whereToStay: "Dónde alojarse",
    whereToStayIntro: "Alojamientos reales en la zona, sin relación con esta actividad.",
    staysOn: "Alojamientos en {name}",
    moreStaysIn: "Más alojamientos: {name}",
    theArea: "la zona",
    browseAllStays: "Ver todos los alojamientos →",
    cardFrom: "Desde",
    minutes: "{n} min",
    hours: "{n} h",
    locationsCount: "{n} ubicaciones",
    mtgCurated: "Seleccionado por MTG",
    nightsDays: "{nights} noches / {days} días",
    minRead: "{n} min de lectura",
    activityCategories: { general: "General", fishing: "Pesca", diving: "Buceo", surfing: "Surf", watersports: "Deportes acuáticos", excursion: "Excursión", island_hopping: "Salto de islas", spa: "Spa", culture: "Cultura" },
    difficulty: { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado", all_levels: "Todos los niveles" },
    quickFacts: { category: "Categoría", duration: "Duración", level: "Nivel", difficulty: "Dificultad", minimumAge: "Edad mínima", maxParticipants: "Máx. participantes", priceFrom: "Precio desde", location: "Ubicación", atoll: "Atolón" },
  },
  it: {
    pagesMenu: "Pagine",
    liveaboards: "Crociere sub",
    whatsappChat: "Scrivici su WhatsApp",
    footerTagline: "Guida e directory delle Maldive: atolli, isole, resort, attività e trasferimenti reali, verificati e aggiornati.",
    footerTravelHeading: "Viaggi",
    becomePartner: "Diventa partner",
    becomeAffiliate: "Diventa affiliato",
    becomeAgent: "Diventa agente di viaggio",
    terms: "Termini e condizioni",
    privacy: "Informativa sulla privacy",
    rights: "Tutte le informazioni sono fornite per la pianificazione del viaggio.",
    moreDestinations: "Mostra più destinazioni",
    fewerDestinations: "Mostra meno destinazioni",
    viewPackage: "Vedi pacchetto",
    whereToStay: "Dove dormire",
    whereToStayIntro: "Strutture reali nella zona, non collegate a questa attività.",
    staysOn: "Alloggi a {name}",
    moreStaysIn: "Altri alloggi: {name}",
    theArea: "la zona",
    browseAllStays: "Vedi tutti gli alloggi →",
    cardFrom: "Da",
    minutes: "{n} min",
    hours: "{n} h",
    locationsCount: "{n} località",
    mtgCurated: "Selezionato da MTG",
    nightsDays: "{nights} notti / {days} giorni",
    minRead: "{n} min di lettura",
    activityCategories: { general: "Generale", fishing: "Pesca", diving: "Immersioni", surfing: "Surf", watersports: "Sport acquatici", excursion: "Escursione", island_hopping: "Island hopping", spa: "Spa", culture: "Cultura" },
    difficulty: { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzato", all_levels: "Tutti i livelli" },
    quickFacts: { category: "Categoria", duration: "Durata", level: "Livello", difficulty: "Difficoltà", minimumAge: "Età minima", maxParticipants: "Max partecipanti", priceFrom: "Prezzo da", location: "Località", atoll: "Atollo" },
  },
  ru: {
    pagesMenu: "Разделы",
    liveaboards: "Дайв-сафари",
    whatsappChat: "Напишите нам в WhatsApp",
    footerTagline: "Справочник и путеводитель по Мальдивам: реальные атоллы, острова, курорты, развлечения и трансферы — проверенные и актуальные.",
    footerTravelHeading: "Путешествия",
    becomePartner: "Стать партнёром",
    becomeAffiliate: "Стать аффилиатом",
    becomeAgent: "Стать турагентом",
    terms: "Условия использования",
    privacy: "Политика конфиденциальности",
    rights: "Вся информация предоставляется для планирования поездки.",
    moreDestinations: "Показать больше направлений",
    fewerDestinations: "Показать меньше направлений",
    viewPackage: "Подробнее о пакете",
    whereToStay: "Где остановиться",
    whereToStayIntro: "Реальные варианты проживания поблизости — не связаны с этой услугой.",
    staysOn: "Проживание на острове {name}",
    moreStaysIn: "Ещё варианты: {name}",
    theArea: "окрестности",
    browseAllStays: "Все варианты проживания →",
    cardFrom: "От",
    minutes: "{n} мин",
    hours: "{n} ч",
    locationsCount: "Мест: {n}",
    mtgCurated: "Подборка MTG",
    nightsDays: "Ночей: {nights} / дней: {days}",
    minRead: "{n} мин чтения",
    activityCategories: { general: "Общее", fishing: "Рыбалка", diving: "Дайвинг", surfing: "Сёрфинг", watersports: "Водные виды спорта", excursion: "Экскурсия", island_hopping: "Островной тур", spa: "Спа", culture: "Культура" },
    difficulty: { beginner: "Для начинающих", intermediate: "Средний уровень", advanced: "Продвинутый уровень", all_levels: "Любой уровень" },
    quickFacts: { category: "Категория", duration: "Длительность", level: "Уровень", difficulty: "Сложность", minimumAge: "Минимальный возраст", maxParticipants: "Макс. участников", priceFrom: "Цена от", location: "Место", atoll: "Атолл" },
  },
  ja: {
    pagesMenu: "ページ",
    liveaboards: "ライブアボード",
    whatsappChat: "WhatsAppでお問い合わせ",
    footerTagline: "モルディブのディレクトリ＆旅行ガイド。実在する環礁、島、リゾート、アクティビティ、送迎を調査し、最新の情報をお届けします。",
    footerTravelHeading: "旅行",
    becomePartner: "パートナーになる",
    becomeAffiliate: "アフィリエイトになる",
    becomeAgent: "旅行代理店として登録",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    rights: "掲載情報は旅行計画のためのものです。",
    moreDestinations: "目的地をもっと見る",
    fewerDestinations: "目的地を閉じる",
    viewPackage: "パッケージを見る",
    whereToStay: "周辺の宿泊施設",
    whereToStayIntro: "周辺にある実在の宿泊施設です（このアクティビティとは提携していません）。",
    staysOn: "{name}の宿泊施設",
    moreStaysIn: "{name}のその他の宿泊施設",
    theArea: "周辺",
    browseAllStays: "すべての宿泊施設を見る →",
    cardFrom: "料金",
    minutes: "{n}分",
    hours: "{n}時間",
    locationsCount: "{n}か所",
    mtgCurated: "MTG厳選",
    nightsDays: "{nights}泊{days}日",
    minRead: "約{n}分で読めます",
    activityCategories: { general: "一般", fishing: "釣り", diving: "ダイビング", surfing: "サーフィン", watersports: "マリンスポーツ", excursion: "エクスカーション", island_hopping: "アイランドホッピング", spa: "スパ", culture: "文化" },
    difficulty: { beginner: "初心者向け", intermediate: "中級者向け", advanced: "上級者向け", all_levels: "全レベル" },
    quickFacts: { category: "カテゴリー", duration: "所要時間", level: "レベル", difficulty: "難易度", minimumAge: "最低年齢", maxParticipants: "最大参加人数", priceFrom: "料金", location: "場所", atoll: "環礁" },
  },
  zh: {
    pagesMenu: "页面",
    liveaboards: "潜水船宿",
    whatsappChat: "通过WhatsApp联系我们",
    footerTagline: "马尔代夫目录与旅行指南——真实的环礁、岛屿、度假村、活动和接送服务,经过核实并持续更新。",
    footerTravelHeading: "旅行",
    becomePartner: "成为合作伙伴",
    becomeAffiliate: "成为推广联盟成员",
    becomeAgent: "成为旅行代理",
    terms: "条款与条件",
    privacy: "隐私政策",
    rights: "所有信息仅供旅行规划参考。",
    moreDestinations: "显示更多目的地",
    fewerDestinations: "收起目的地",
    viewPackage: "查看套餐",
    whereToStay: "附近住宿",
    whereToStayIntro: "该地区真实的住宿选择——与本活动无关联。",
    staysOn: "{name}的住宿",
    moreStaysIn: "{name}的更多住宿",
    theArea: "周边",
    browseAllStays: "浏览所有住宿 →",
    cardFrom: "起价",
    minutes: "{n}分钟",
    hours: "{n}小时",
    locationsCount: "{n}个地点",
    mtgCurated: "MTG精选",
    nightsDays: "{nights}晚{days}天",
    minRead: "阅读约{n}分钟",
    activityCategories: { general: "综合", fishing: "钓鱼", diving: "潜水", surfing: "冲浪", watersports: "水上运动", excursion: "一日游", island_hopping: "跳岛游", spa: "水疗", culture: "文化" },
    difficulty: { beginner: "初学者", intermediate: "中级", advanced: "高级", all_levels: "不限水平" },
    quickFacts: { category: "类别", duration: "时长", level: "水平", difficulty: "难度", minimumAge: "最低年龄", maxParticipants: "最多人数", priceFrom: "起价", location: "地点", atoll: "环礁" },
  },
};

export function getChromeStrings(locale: Locale): ChromeStrings {
  return CHROME[locale] ?? EN;
}
