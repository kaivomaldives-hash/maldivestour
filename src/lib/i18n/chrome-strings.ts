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
  },
};

export function getChromeStrings(locale: Locale): ChromeStrings {
  return CHROME[locale] ?? EN;
}
