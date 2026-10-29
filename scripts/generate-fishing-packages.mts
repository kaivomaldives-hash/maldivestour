// Generates, from the fishing package calculator's default (Huvadhoo) rates:
//   src/lib/packages/mfh-price-tables.ts — per-person price by group size
//   supabase/migrations/20261115002100_fishing_packages_by_type.sql
// Run: node --experimental-strip-types scripts/generate-fishing-packages.mts
import { writeFileSync } from "node:fs";

import { DEFAULT_FISHING_CALCULATOR_CONFIG as CONFIG, quoteFishingPackage } from "../src/lib/fishing/package-calculator-rates.ts";
import {
  FISHING_PACKAGE_NIGHTS,
  FISHING_PACKAGE_TYPES,
  FISHING_PACKAGE_TYPE_LABELS,
  fishingPackageSlug,
  fishingPackageTitle,
  type FishingPackageType,
} from "../src/lib/packages/fishing-package-types.ts";

const LOCATION = "huvadhoo";
const GUESTS = Array.from({ length: CONFIG.maxGuests }, (_, i) => i + 1);
const q = (s: string) => `'${s.replace(/'/g, "''")}'`;

const CHARTER: Record<FishingPackageType, string> = {
  fullReef: "private-full-day-fishing-charter",
  halfReef: "private-half-day-fishing-charter",
  fullTuna: "private-full-day-fishing-charter",
  halfTuna: "private-half-day-fishing-charter",
  flyFull: "fly-fishing-full-day-charter",
  flyHalf: "fly-fishing-half-day-charter",
};
const ACTIVITY_NOTE: Record<FishingPackageType, (d: number) => string> = {
  fullReef: (d) => `${d} days of full-day reef fishing — popping, jigging and bottom fishing along the reef edges and channels.`,
  halfReef: (d) => `${d} days of half-day reef fishing — popping, jigging and bottom fishing along the reef edges and channels.`,
  fullTuna: (d) => `${d} days of full-day tuna fishing — trolling and jigging offshore for yellowfin, skipjack and dogtooth tuna.`,
  halfTuna: (d) => `${d} days of half-day tuna fishing — trolling and jigging offshore for yellowfin, skipjack and dogtooth tuna.`,
  flyFull: (d) => `${d} days of full-day fly fishing on the flats and reef edges.`,
  flyHalf: (d) => `${d} days of half-day fly fishing on the flats and reef edges.`,
};
const CALC_KEY: Record<FishingPackageType, string> = {
  fullReef: "fullReef",
  halfReef: "halfReef",
  fullTuna: "fullTuna",
  halfTuna: "halfTuna",
  flyFull: "flyFull",
  flyHalf: "flyHalf",
};
// Packages that already exist (renamed/repriced in place); the rest are new.
const EXISTING = new Set<string>([
  ...FISHING_PACKAGE_NIGHTS.flatMap((n) => [fishingPackageSlug(n, "fullReef"), fishingPackageSlug(n, "halfReef")]),
  fishingPackageSlug(3, "flyFull"),
  fishingPackageSlug(5, "flyFull"),
]);
// Nearest existing package of the same kind — new packages copy its
// provider, location and categories.
const templateSlug = (n: number, type: FishingPackageType) =>
  type === "flyFull" || type === "flyHalf" ? fishingPackageSlug(n <= 4 ? 3 : 5, "flyFull") : fishingPackageSlug(n, type.startsWith("half") ? "halfReef" : "fullReef");

// ---- Translations ----
type Loc = "de" | "es" | "it" | "ru" | "ja" | "zh";
const ru = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};
const isFly = (t: FishingPackageType) => t === "flyFull" || t === "flyHalf";
const LOCALES: Record<Loc, {
  types: Record<FishingPackageType, string>;
  title: (n: number, t: FishingPackageType, T: string) => string;
  slug: (n: number, t: FishingPackageType) => string;
  summary: (title: string, n: number, d: number, T: string, p: string) => string;
  meta: (n: number, d: number, T: string, p: string) => string;
}> = {
  de: {
    types: { fullReef: "Ganztägiges Riffangeln", halfReef: "Halbtägiges Riffangeln", fullTuna: "Ganztägiges Thunfischangeln", halfTuna: "Halbtägiges Thunfischangeln", flyFull: "Ganztägiges Fliegenfischen", flyHalf: "Halbtägiges Fliegenfischen" },
    title: (n, t, T) => (isFly(t) ? `${n}-Nächte-Fliegenfischen-Urlaub auf den Malediven — ${T}` : `${n}-Nächte-Maledivenangelpaket — ${T}`),
    slug: (n, t) =>
      isFly(t)
        ? `${n}-naechte-fliegenfischen-urlaub-malediven${t === "flyHalf" ? "-halbtag" : ""}`
        : `${n}-naechte-malediven-angelpaket-${t.startsWith("half") ? "halbtag" : "ganztag"}${t.endsWith("Tuna") ? "-thunfisch" : ""}`,
    summary: (title, n, d, T, p) =>
      `${title}: ${n} Nächte mit ${d} Angeltagen (${T}) in der Maldives Fishing and Holidays Lodge auf Maamendhoo, Gaafu-Alifu-Atoll – inklusive Vollpension im Doppelzimmer, Hin- und Rückflug im Inland, Bootstransfer und einem privaten Boot für Ihre Gruppe. Ab USD ${p} pro Person (6 Gäste teilen sich das Boot).`,
    meta: (n, d, T, p) => `${n} Nächte, ${d} Angeltage (${T}) ab Maamendhoo, Gaafu Alifu. Vollpension, Inlandsflug und Boot inklusive. Ab USD ${p} pro Person.`,
  },
  es: {
    types: { fullReef: "Pesca de Arrecife de Día Completo", halfReef: "Pesca de Arrecife de Medio Día", fullTuna: "Pesca de Atún de Día Completo", halfTuna: "Pesca de Atún de Medio Día", flyFull: "Pesca con Mosca de Día Completo", flyHalf: "Pesca con Mosca de Medio Día" },
    title: (n, t, T) => (isFly(t) ? `Vacaciones de Pesca con Mosca en Maldivas de ${n} Noches — ${T}` : `Paquete de Pesca en Maldivas de ${n} Noches — ${T}`),
    slug: (n, t) =>
      isFly(t)
        ? `vacaciones-pesca-mosca-maldivas-${n}-noches${t === "flyHalf" ? "-medio-dia" : ""}`
        : `paquete-pesca-maldivas-${n}-noches-${t.startsWith("half") ? "medio-dia" : "dia-completo"}${t.endsWith("Tuna") ? "-atun" : ""}`,
    summary: (title, n, d, T, p) =>
      `${title}: ${n} noches y ${d} días de pesca (${T.toLowerCase()}) en Maldives Fishing and Holidays Lodge, en Maamendhoo, atolón de Gaafu Alifu, con pensión completa en habitación doble, vuelo doméstico de ida y vuelta, traslado en barco y un barco privado para su grupo. Desde USD ${p} por persona (6 huéspedes compartiendo el barco).`,
    meta: (n, d, T, p) => `${n} noches y ${d} días de pesca (${T.toLowerCase()}) desde Maamendhoo, Gaafu Alifu. Pensión completa, vuelo doméstico y barco incluidos. Desde USD ${p} por persona.`,
  },
  it: {
    types: { fullReef: "Pesca sul Reef Giornata Intera", halfReef: "Pesca sul Reef Mezza Giornata", fullTuna: "Pesca al Tonno Giornata Intera", halfTuna: "Pesca al Tonno Mezza Giornata", flyFull: "Fly Fishing Giornata Intera", flyHalf: "Fly Fishing Mezza Giornata" },
    title: (n, t, T) => (isFly(t) ? `Vacanza di Fly Fishing alle Maldive di ${n} Notti — ${T}` : `Pacchetto di Pesca alle Maldive di ${n} Notti — ${T}`),
    slug: (n, t) =>
      isFly(t)
        ? `vacanza-fly-fishing-maldive-${n}-notti${t === "flyHalf" ? "-mezza-giornata" : ""}`
        : `pacchetto-pesca-maldive-${n}-notti-${t.startsWith("half") ? "mezza-giornata" : "giornata-intera"}${t.endsWith("Tuna") ? "-tonno" : ""}`,
    summary: (title, n, d, T, p) =>
      `${title}: ${n} notti con ${d} giorni di pesca (${T.toLowerCase()}) al Maldives Fishing and Holidays Lodge di Maamendhoo, atollo di Gaafu Alifu, con pensione completa in camera doppia, volo domestico andata e ritorno, trasferimento in barca e una barca privata per il vostro gruppo. Da USD ${p} a persona (6 ospiti che condividono la barca).`,
    meta: (n, d, T, p) => `${n} notti e ${d} giorni di pesca (${T.toLowerCase()}) da Maamendhoo, Gaafu Alifu. Pensione completa, volo domestico e barca inclusi. Da USD ${p} a persona.`,
  },
  ru: {
    types: { fullReef: "рифовая рыбалка на весь день", halfReef: "рифовая рыбалка на полдня", fullTuna: "ловля тунца на весь день", halfTuna: "ловля тунца на полдня", flyFull: "нахлыст на весь день", flyHalf: "нахлыст на полдня" },
    title: (n, t, T) => {
      const nights = ru(n, "ночь", "ночи", "ночей");
      return isFly(t) ? `Отпуск для нахлыстовой рыбалки на Мальдивах на ${n} ${nights} — ${T}` : `Мальдивский рыболовный пакет на ${n} ${nights} — ${T}`;
    },
    slug: (n, t) =>
      isFly(t)
        ? `otpusk-nahlystovaya-rybalka-maldivy-${n}-nochey${t === "flyHalf" ? "-polden" : ""}`
        : `maldivskiy-rybolovnyy-paket-${n}-nochey-${t.startsWith("half") ? "polden" : "polnyy-den"}${t.endsWith("Tuna") ? "-tunets" : ""}`,
    summary: (title, n, d, T, p) =>
      `${title}: ${n} ${ru(n, "ночь", "ночи", "ночей")} и ${d} ${ru(d, "день", "дня", "дней")} рыбалки (${T}) в Maldives Fishing and Holidays Lodge на острове Маамендху, атолл Гаафу Алифу, включая полный пансион в двухместном номере, внутренний перелёт туда и обратно, трансфер на лодке и частную лодку для вашей группы. От USD ${p} с человека (6 гостей делят лодку).`,
    meta: (n, d, T, p) =>
      `${n} ${ru(n, "ночь", "ночи", "ночей")} и ${d} ${ru(d, "день", "дня", "дней")} рыбалки (${T}) с острова Маамендху, Гаафу Алифу. Полный пансион, перелёт и лодка включены. От USD ${p} с человека.`,
  },
  ja: {
    types: { fullReef: "終日リーフフィッシング", halfReef: "半日リーフフィッシング", fullTuna: "終日マグロ釣り", halfTuna: "半日マグロ釣り", flyFull: "終日フライフィッシング", flyHalf: "半日フライフィッシング" },
    title: (n, t, T) => (isFly(t) ? `${n}泊モルディブ フライフィッシング ホリデー — ${T}` : `${n}泊モルディブ釣りパッケージ — ${T}`),
    slug: (n, t) =>
      isFly(t)
        ? `morudibu-furaifisshingu-horide-${n}-haku${t === "flyHalf" ? "-hannichi" : ""}`
        : `morudibu-tsuri-pakkeji-${n}-haku-${t.startsWith("half") ? "hannichi" : "shuujitsu"}${t.endsWith("Tuna") ? "-maguro" : ""}`,
    summary: (title, n, d, T, p) =>
      `${title}：ガーフ・アリフ環礁マーメンドゥー島のMaldives Fishing and Holidays Lodgeに${n}泊し、${T}を${d}日間楽しむ釣り旅行です。3食付きのツインルーム、国内線往復、ボート送迎、グループ専用のボートが含まれます。お一人様USD ${p}から（6名でボートを共有する場合）。`,
    meta: (n, d, T, p) => `マーメンドゥー島（ガーフ・アリフ環礁）発、${n}泊・${T}${d}日間。3食、国内線、ボート込み。お一人様USD ${p}から。`,
  },
  zh: {
    types: { fullReef: "全天礁石钓鱼", halfReef: "半天礁石钓鱼", fullTuna: "全天金枪鱼钓鱼", halfTuna: "半天金枪鱼钓鱼", flyFull: "全天飞钓", flyHalf: "半天飞钓" },
    title: (n, t, T) => (isFly(t) ? `${n}晚马尔代夫飞钓假期——${T}` : `${n}晚马尔代夫钓鱼套餐——${T}`),
    slug: (n, t) =>
      isFly(t)
        ? `maerdaifu-feidiao-jiaqi-${n}-wan${t === "flyHalf" ? "-bantian" : ""}`
        : `maerdaifu-diaoyu-taocan-${n}-wan-${t.startsWith("half") ? "bantian" : "quantian"}${t.endsWith("Tuna") ? "-jinqiangyu" : ""}`,
    summary: (title, n, d, T, p) =>
      `${title}：在加夫阿利夫环礁马门杜岛的 Maldives Fishing and Holidays Lodge 入住${n}晚，享受${d}天${T}。包含全膳双人间住宿、往返国内航班、船只接送以及团队专属船只。每人 USD ${p} 起（6 位客人共享一条船）。`,
    meta: (n, d, T, p) => `从加夫阿利夫环礁马门杜岛出发，${n}晚、${d}天${T}。含全膳、国内航班和船只。每人 USD ${p} 起。`,
  },
};

// ---- Build ----
interface Row { guests: number; price: number; isBestValue: boolean }
const tables: Record<string, Row[]> = {};
const summaryJson: Record<string, { title: string; type: FishingPackageType; nights: number; from: number; prices: number[] }> = {};
const sql: string[] = [];

sql.push(`-- Fishing packages by fishing type (owner request 2026-10-29).
-- GENERATED by scripts/generate-fishing-packages.mts from the fishing
-- package calculator's default South Huvadhoo rates
-- (src/lib/fishing/package-calculator-rates.ts) — do not hand-edit.
--
-- * The 12 existing 3-8 night "full-day / half-day fishing" packages are
--   renamed to full-day / half-day REEF fishing (URLs unchanged) and
--   repriced.
-- * The 2 existing fly fishing holidays (3 and 5 nights) become full-day
--   fly fishing packages with the charter included, repriced from the
--   published fly fishing rates.
-- * New: full-day and half-day tuna fishing (3-8 nights), half-day fly
--   fishing (3-8 nights) and full-day fly fishing for 4, 6, 7 and 8 nights.
-- * The 2-night packages are archived and redirected to the 3-night
--   package of the same kind.
-- price_from = the lowest per-person rate (6 guests sharing the boat);
-- the full 1-6 guest table is in src/lib/packages/mfh-price-tables.ts.
`);

const fmt = (n: number) => n.toLocaleString("en-US");
const translationValues: string[] = [];

for (const type of FISHING_PACKAGE_TYPES) {
  for (const nights of FISHING_PACKAGE_NIGHTS) {
    const days = nights - 1;
    const slug = fishingPackageSlug(nights, type);
    const title = fishingPackageTitle(nights, type);
    const prices = GUESTS.map((g) => {
      const quote = quoteFishingPackage(CONFIG, LOCATION, CALC_KEY[type], days, g);
      if (!quote) throw new Error(`No quote for ${slug} ${g}`);
      return Math.round(quote.perPerson);
    });
    const from = Math.min(...prices);
    tables[slug] = prices.map((price, i) => ({ guests: i + 1, price, isBestValue: price === from && i === prices.lastIndexOf(from) }));
    summaryJson[slug] = { title, type, nights, from, prices };

    const label = FISHING_PACKAGE_TYPE_LABELS[type].toLowerCase();
    const summary = `${title} is a ${nights}-night, ${days}-day fishing holiday at Maldives Fishing and Holidays Lodge on Maamendhoo, Gaafu Alifu Atoll, including full-board twin-share accommodation, return domestic flight, boat transfer and ${days} days of ${label} on a private boat for your group. From USD ${fmt(from)} per person (6 guests sharing the boat).`;
    const metaTitle = `${title} | Maldives Fishing Packages | MTG`;
    const metaDescription = `${nights} nights with ${days} days of ${label} from Maamendhoo, Gaafu Alifu Atoll. Full board, domestic flight and boat transfer included. From USD ${fmt(from)} per person.`;
    const stageDescription = `${nights} nights at Maldives Fishing and Holidays Lodge, Maamendhoo, Gaafu Alifu Atoll, with ${days} days of ${label} on a private boat for your group. Full-board meals, twin-share rooms, airport meet and greet, return domestic flight and boat transfer included.`;
    const node = `(select id from nodes where node_type = 'package' and slug = ${q(slug)})`;

    sql.push(`-- ${slug}`);
    if (EXISTING.has(slug)) {
      sql.push(`update nodes set title = ${q(title)}, summary = ${q(summary)}, meta_title = ${q(metaTitle)}, meta_description = ${q(metaDescription)}, status = 'published' where node_type = 'package' and slug = ${q(slug)};`);
      sql.push(`update packages set price_from = ${from}, currency = 'USD', price_type = 'per-person' where id = ${node};`);
      sql.push(`update bookable_products set base_price = ${from}, currency = 'USD' where id = ${node};`);
      sql.push(`update package_itinerary_stages set description = ${q(stageDescription)} where package_id = ${node} and stage_number = 1;`);
      sql.push(
        `update package_itinerary_items i set quantity = ${days}, notes = ${q(ACTIVITY_NOTE[type](days))}, component_node_id = (select id from nodes where node_type = 'activity' and slug = ${q(CHARTER[type])}) from package_itinerary_stages s where i.stage_id = s.id and s.package_id = ${node} and s.stage_number = 1 and i.component_role = 'activity';`,
      );
    } else {
      const template = `(select id from nodes where node_type = 'package' and slug = ${q(templateSlug(nights, type))})`;
      sql.push(
        `insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at) values ('package', ${q(slug)}, ${q(title)}, ${q(summary)}, 'published', ${q(metaTitle)}, ${q(metaDescription)}, now()) on conflict (node_type, slug) do nothing;`,
      );
      sql.push(
        `insert into packages (id, duration_nights, price_from, currency, operated_by_provider_id, price_type) select ${node}, ${nights}, ${from}, 'USD', p.operated_by_provider_id, 'per-person' from packages p where p.id = ${template} on conflict (id) do nothing;`,
      );
      sql.push(`insert into bookable_products (id, booking_mode, base_price, currency) select ${node}, 'inquiry', ${from}, 'USD' on conflict (id) do nothing;`);
      sql.push(`insert into node_categories (node_id, category_id) select ${node}, category_id from node_categories where node_id = ${template} on conflict (node_id, category_id) do nothing;`);
      sql.push(`insert into node_locations (node_id, location_id, relation) select ${node}, location_id, relation from node_locations where node_id = ${template} on conflict (node_id, location_id) do nothing;`);
      sql.push(
        `insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order) values (${node}, 1, 1, ${nights}, ${nights}, 'Maldives Fishing and Holidays Lodge', ${q(stageDescription)}, 1) on conflict (package_id, stage_number) do nothing;`,
      );
      sql.push(
        `insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order) values (${node}, 2, ${nights + 1}, ${nights + 1}, 0, 'Departure', 'Boat transfer to the domestic airport and return domestic flight to Velana International Airport, timed around the guest''s international flight.', 2) on conflict (package_id, stage_number) do nothing;`,
      );
      sql.push(
        `insert into package_itinerary_items (stage_id, component_type, component_node_id, component_role, quantity, sort_order) select s.id, 'node', (select id from nodes where node_type = 'accommodation' and slug = 'maldives-fishing-and-holidays-lodge'), 'accommodation', 1, 0 from package_itinerary_stages s where s.package_id = ${node} and s.stage_number = 1 and not exists (select 1 from package_itinerary_items i where i.stage_id = s.id);`,
      );
      sql.push(
        `insert into package_itinerary_items (stage_id, component_type, component_node_id, component_role, quantity, notes, sort_order) select s.id, 'node', (select id from nodes where node_type = 'activity' and slug = ${q(CHARTER[type])}), 'activity', ${days}, ${q(ACTIVITY_NOTE[type](days))}, 1 from package_itinerary_stages s where s.package_id = ${node} and s.stage_number = 1 and not exists (select 1 from package_itinerary_items i where i.stage_id = s.id and i.component_role = 'activity');`,
      );
    }

    for (const [locale, t] of Object.entries(LOCALES) as [Loc, (typeof LOCALES)[Loc]][]) {
      const T = t.types[type];
      const ltitle = t.title(nights, type, T);
      const p = fmt(from);
      const lsummary = t.summary(ltitle, nights, days, T, p);
      translationValues.push(`(${node}, 'package', '${locale}', ${q(t.slug(nights, type))}, ${q(ltitle)}, ${q(lsummary)}, ${q(lsummary)}, ${q(`${ltitle} | MTG`)}, ${q(t.meta(nights, days, T, p))})`);
    }
  }
}

sql.push(`
-- Translations: new packages get a row; existing rows keep their slug and get the new title, text and price.
insert into translations (entity_id, entity_type, locale, slug, title, short_description, description, meta_title, meta_description, translation_status, translated_by)
select v.entity_id, v.entity_type, v.locale, v.slug, v.title, v.short_description, v.description, v.meta_title, v.meta_description, 'published', 'claude'
from (values
${translationValues.join(",\n")}
) as v(entity_id, entity_type, locale, slug, title, short_description, description, meta_title, meta_description)
where v.entity_id is not null
on conflict (entity_id, locale) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  description = excluded.description,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  translation_status = 'published';
`);

sql.push(`-- 2-night packages: archived (fishing packages now start at 3 nights) and redirected.`);
for (const [kind, type] of [["full-day", "fullReef"], ["half-day", "halfReef"]] as const) {
  const old = `2-night-maldives-fishing-package-${kind}-fishing`;
  const target = fishingPackageSlug(3, type);
  sql.push(`update nodes set status = 'archived' where node_type = 'package' and slug = ${q(old)};`);
  sql.push(`update translations set translation_status = 'draft' where entity_id = (select id from nodes where node_type = 'package' and slug = ${q(old)});`);
  sql.push(
    `insert into url_redirects (source_path, target_type, target_path, status_code, is_active, notes) values (${q(`/maldives/packages/${old}`)}, 'path', ${q(`/maldives/packages/${target}/`)}, 301, true, 'Fishing packages start at 3 nights since 2026-10-29; 2-night package archived.') on conflict (source_path) do update set target_path = excluded.target_path, is_active = true;`,
  );
}

writeFileSync("supabase/migrations/20261115002100_fishing_packages_by_type.sql", sql.join("\n") + "\n");

const ts = `// Per-person price by group size for the Maamendhoo fishing packages.
// GENERATED by scripts/generate-fishing-packages.mts from the fishing
// package calculator's default South Huvadhoo rates
// (src/lib/fishing/package-calculator-rates.ts) — do not hand-edit.
// packages.price_from holds the lowest of these (6 guests sharing the boat).

export interface MfhGuestPrice {
  guests: number;
  price: number;
  isBestValue: boolean;
}

export const MFH_PRICE_TABLES: Record<string, MfhGuestPrice[]> = {
${Object.entries(tables)
  .map(([slug, rows]) => `  "${slug}": [\n${rows.map((r) => `    { guests: ${r.guests}, price: ${r.price}, isBestValue: ${r.isBestValue} },`).join("\n")}\n  ],`)
  .join("\n")}
};
`;
writeFileSync("src/lib/packages/mfh-price-tables.ts", ts);
writeFileSync(process.argv[2] ?? "/dev/null", JSON.stringify(summaryJson, null, 2));
console.log(Object.keys(tables).length, "packages");
