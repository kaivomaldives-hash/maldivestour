import type { Locale } from "@/lib/i18n/locales";
import type { PageKey, PageTranslation } from "@/lib/i18n/repository";

/**
 * Hub copy that's committed as a migration but can't be in the live DB
 * yet: supabase/migrations/20261115000900_transfers_hub_page_translations.sql
 * first widens page_translations' page_key check constraint (DDL), which
 * only the SQL editor / migration pipeline can run. Until it is, these
 * same rows stand in so /{locale}/maldives/transfers/ (linked from the
 * nav, footer and mobile bar) doesn't 404. A real DB row always wins.
 */
type FallbackRow = Omit<PageTranslation, "pageKey" | "locale" | "sections">;

const ROWS: Partial<Record<PageKey, Partial<Record<Locale, FallbackRow>>>> = {
  "transfers-hub": {
    de: {
      slug: "transfer",
      title: "Malediven-Transfers",
      metaTitle: "Malediven-Transfers | MTG",
      metaDescription: "Echte Flughafen-, Resort-, Insel- und Speedboot-Transferrouten auf den Malediven — nach Ziel suchen oder eine private Charter anfragen.",
      heroHeading: "Malediven-Transfers",
      heroIntro: "Jede Route unten ist ein echter, einzeln geprüfter Transfer — keine generische Schätzung. Die vollständige englische Liste bietet Suche und Filter.",
    },
    es: {
      slug: "traslados",
      title: "Traslados en Maldivas",
      metaTitle: "Traslados en Maldivas | MTG",
      metaDescription: "Rutas reales de traslado en aeropuerto, resort, isla y lancha rápida por todas las Maldivas — busca por destino o solicita un chárter privado.",
      heroHeading: "Traslados en Maldivas",
      heroIntro: "Cada ruta de abajo es un traslado real, verificado individualmente — no una estimación genérica. Consulta el listado completo en inglés para buscar y filtrar.",
    },
    it: {
      slug: "trasferimenti",
      title: "Trasferimenti alle Maldive",
      metaTitle: "Trasferimenti alle Maldive | MTG",
      metaDescription: "Percorsi di trasferimento reali per aeroporto, resort, isola e motoscafo in tutte le Maldive — cerca per destinazione o richiedi un charter privato.",
      heroHeading: "Trasferimenti alle Maldive",
      heroIntro: "Ogni percorso qui sotto è un trasferimento reale, verificato individualmente — non una stima generica. Consulta l'elenco completo in inglese per ricerca e filtri.",
    },
    ru: {
      slug: "transfery",
      title: "Трансферы на Мальдивах",
      metaTitle: "Трансферы на Мальдивах | MTG",
      metaDescription: "Настоящие маршруты трансфера из аэропорта, в курорт, на остров и на скоростном катере по всем Мальдивам — ищите по направлению или запросите частный чартер.",
      heroHeading: "Трансферы на Мальдивах",
      heroIntro: "Каждый маршрут ниже — это настоящий, индивидуально проверенный трансфер, а не общая оценка. Полный список на английском языке с поиском и фильтрами доступен отдельно.",
    },
    ja: {
      slug: "sogei",
      title: "モルディブの送迎",
      metaTitle: "モルディブの送迎 | MTG",
      metaDescription: "モルディブ全土の空港、リゾート、島、スピードボートの実際の送迎ルート——目的地で検索するか、プライベートチャーターをリクエストできます。",
      heroHeading: "モルディブの送迎",
      heroIntro: "以下の各ルートは実在し個別に確認された送迎です——一般的な推定ではありません。検索とフィルター機能付きの完全な英語版リストもご覧いただけます。",
    },
    zh: {
      slug: "jiesong",
      title: "马尔代夫接送服务",
      metaTitle: "马尔代夫接送服务 | MTG",
      metaDescription: "马尔代夫各地真实的机场、度假村、岛屿和快艇接送路线——按目的地搜索,或申请私人租船服务。",
      heroHeading: "马尔代夫接送服务",
      heroIntro: "以下每条路线均为真实、经过单独核实的接送服务,而非笼统估算。完整的英文列表提供搜索和筛选功能。",
    },
  },
};

export function pageTranslationFallback(pageKey: PageKey, locale: Locale): PageTranslation | null {
  const row = ROWS[pageKey]?.[locale];
  return row ? { pageKey, locale, sections: {}, ...row } : null;
}

export function pageTranslationFallbackLocales(pageKey: PageKey): Locale[] {
  return Object.keys(ROWS[pageKey] ?? {}) as Locale[];
}
