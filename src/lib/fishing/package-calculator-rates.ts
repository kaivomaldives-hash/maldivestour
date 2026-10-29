// Fishing package calculator (/maldives/fishing/calculator/ and the embed
// on the /maldives/fishing/ hub): config shape, built-in defaults,
// validation and the quote formula. Plain module (no server-only) — the
// client calculator imports the types and quoteFishingPackage().
//
// The live config is admin-editable (/admin/fishing-calculator, stored in
// fishing_calculator_settings); DEFAULT_FISHING_CALCULATOR_CONFIG is used
// until the first admin save, or if the stored row can't be read.

export interface FishingCalculatorLocation {
  key: string;
  label: string;
  /** Return transfer, per person. */
  transferUsd: number;
  /** Full-board twin-share room, per room per night. */
  roomUsd: number;
  /** e.g. "domestic flight", "speedboat" — shown in the inclusions. */
  transferLabel: string;
}

export interface FishingCalculatorPublishedRates {
  /** The published table applies only at this location. */
  locationKey: string;
  /** Per-person package rate keyed by fishing days; index 0 = 1 guest. */
  perPersonByDays: Record<string, number[]>;
}

export interface FishingCalculatorPackage {
  key: string;
  label: string;
  /** Charter rate per boat per fishing day. */
  pricePerDay: number;
  active: boolean;
  /** Fixed per-person rates that replace the formula where they apply. */
  publishedRates: FishingCalculatorPublishedRates | null;
}

export interface FishingCalculatorBoat {
  name: string;
  detail: string;
  facts: string;
}

export interface FishingCalculatorConfig {
  /** Markup on cost for the standard package rate (1.2 = +20%). */
  markup: number;
  maxGuests: number;
  /** Selectable package lengths and their long-stay saving (0.05 = 5%). */
  durations: { days: number; discount: number }[];
  locations: FishingCalculatorLocation[];
  packages: FishingCalculatorPackage[];
  fleet: FishingCalculatorBoat[];
}

// Owner's adjustment, 2026-10-29: the published fly fishing tables are
// B2C rates, so fly fishing is 10% lower; every other fishing type (reef
// and tuna) is 10% higher than the calculator export. Applied once to the
// export's figures to build the defaults below.
const FLY_FISHING_ADJUSTMENT = 0.9;
const OTHER_FISHING_ADJUSTMENT = 1.1;

const round2 = (value: number) => Math.round(value * 100) / 100;
const adjustTable = (table: Record<string, number[]>) =>
  Object.fromEntries(Object.entries(table).map(([days, rates]) => [days, rates.map((rate) => round2(rate * FLY_FISHING_ADJUSTMENT))]));

const FLY_FULL_DAY_B2C: Record<string, number[]> = {
  2: [1600.24, 1298.59, 1209.6, 1010.02, 890.62, 721.44],
  3: [2462.4, 1936.22, 1804.03, 1505.95, 1328.14, 1075.68],
  4: [3274.56, 2573.86, 2398.46, 2002.89, 1765.67, 1429.92],
  5: [4086.72, 3211.49, 2992.9, 2497.82, 2203.2, 1784.16],
  6: [4898.88, 3849.12, 3587.33, 2993.76, 2640.73, 2138.4],
  7: [5711.04, 4486.75, 4181.76, 3489.7, 3078.26, 2492.64],
};
const FLY_HALF_DAY_B2C: Record<string, number[]> = {
  2: [1237.68, 973.94, 907.2, 757.51, 667.96, 541.08],
  3: [1846.8, 1452.17, 1353.02, 1129.46, 996.11, 806.76],
  4: [2455.92, 1930.39, 1798.86, 1501.42, 1324.25, 1072.44],
  5: [3065.04, 2408.62, 2244.67, 1873.37, 1652.4, 1338.12],
  6: [3674.16, 2886.84, 2690.5, 2245.32, 1980.55, 1603.8],
  7: [4283.28, 3365.06, 3136.32, 2617.27, 2308.69, 1869.48],
};

export const DEFAULT_FISHING_CALCULATOR_CONFIG: FishingCalculatorConfig = {
  markup: 1.2,
  maxGuests: 6,
  durations: [
    { days: 2, discount: 0 },
    { days: 3, discount: 0.05 },
    { days: 4, discount: 0.08 },
    { days: 5, discount: 0.1 },
    { days: 6, discount: 0.12 },
    { days: 7, discount: 0.15 },
  ],
  locations: [
    { key: "huvadhoo", label: "South Huvadhoo Atoll", transferUsd: 365, roomUsd: 120, transferLabel: "domestic flight" },
    { key: "kaafu", label: "Kaafu Atoll", transferUsd: 60, roomUsd: 150, transferLabel: "speedboat" },
  ],
  packages: [
    { key: "halfReef", label: "Half-day reef fishing", pricePerDay: round2(600 * OTHER_FISHING_ADJUSTMENT), active: true, publishedRates: null },
    { key: "fullReef", label: "Full-day reef fishing", pricePerDay: round2(1000 * OTHER_FISHING_ADJUSTMENT), active: true, publishedRates: null },
    { key: "halfTuna", label: "Half-day tuna fishing", pricePerDay: round2(800 * OTHER_FISHING_ADJUSTMENT), active: true, publishedRates: null },
    { key: "fullTuna", label: "Full-day tuna fishing", pricePerDay: round2(1200 * OTHER_FISHING_ADJUSTMENT), active: true, publishedRates: null },
    {
      key: "flyFull",
      label: "Full-day fly fishing",
      pricePerDay: round2(600 * FLY_FISHING_ADJUSTMENT),
      active: true,
      publishedRates: { locationKey: "huvadhoo", perPersonByDays: adjustTable(FLY_FULL_DAY_B2C) },
    },
    {
      key: "flyHalf",
      label: "Half-day fly fishing",
      pricePerDay: round2(600 * FLY_FISHING_ADJUSTMENT),
      active: true,
      publishedRates: { locationKey: "huvadhoo", perPersonByDays: adjustTable(FLY_HALF_DAY_B2C) },
    },
  ],
  fleet: [
    { name: "Emperor", detail: "32 ft fishing boat · maximum 5 passengers", facts: "Twin 200 HP engines · GPS · radar · VHF radio" },
    { name: "Bluefin", detail: "36 ft fishing boat · maximum 6 passengers", facts: "Professional captain and crew · safety equipment" },
  ],
};

export interface PackageQuote {
  total: number;
  perPerson: number;
  rooms: number;
  nights: number;
  /** Long-stay saving applied (0 when a published rate is used). */
  discount: number;
  usedPublishedRate: boolean;
}

export function quoteFishingPackage(
  config: FishingCalculatorConfig,
  locationKey: string,
  packageKey: string,
  days: number,
  guests: number,
): PackageQuote | null {
  const location = config.locations.find((item) => item.key === locationKey);
  const pkg = config.packages.find((item) => item.key === packageKey);
  const duration = config.durations.find((item) => item.days === days);
  if (!location || !pkg || !duration || guests < 1) return null;

  const rooms = Math.ceil(guests / 2);
  // Arrival and departure nights are both included.
  const nights = days + 1;

  const published = pkg.publishedRates?.locationKey === locationKey ? pkg.publishedRates.perPersonByDays[String(days)]?.[guests - 1] : undefined;
  if (published && published > 0) {
    return { total: round2(published * guests), perPerson: published, rooms, nights, discount: 0, usedPublishedRate: true };
  }

  const cost = days * pkg.pricePerDay + nights * rooms * location.roomUsd + guests * location.transferUsd;
  const total = round2(cost * config.markup * (1 - duration.discount));
  return { total, perPerson: round2(total / guests), rooms, nights, discount: duration.discount, usedPublishedRate: false };
}

// ---- Validation (admin saves and stored rows both go through this) ----

const KEY_PATTERN = /^[A-Za-z0-9_-]{1,40}$/;

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function num(value: unknown, field: string, min: number, max: number): number {
  const n = typeof value === "string" ? Number(value) : value;
  if (typeof n !== "number" || !Number.isFinite(n) || n < min || n > max) throw new Error(`${field} must be a number between ${min} and ${max}.`);
  return round2(n);
}
function text(value: unknown, field: string, max = 120): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required.`);
  if (value.trim().length > max) throw new Error(`${field} must be at most ${max} characters.`);
  return value.trim();
}
function key(value: unknown, field: string): string {
  const k = text(value, field, 40);
  if (!KEY_PATTERN.test(k)) throw new Error(`${field} may only use letters, numbers, - and _.`);
  return k;
}
function list(value: unknown, field: string, maxItems: number): unknown[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`Add at least one ${field}.`);
  if (value.length > maxItems) throw new Error(`At most ${maxItems} ${field}s.`);
  return value;
}
function assertUnique(keys: (string | number)[], field: string) {
  const seen = new Set<string | number>();
  for (const k of keys) {
    if (seen.has(k)) throw new Error(`Duplicate ${field}: ${k}.`);
    seen.add(k);
  }
}

export function parseFishingCalculatorConfig(raw: unknown): Parsed<FishingCalculatorConfig> {
  try {
    if (!isRecord(raw)) throw new Error("Invalid calculator settings.");
    const maxGuests = Math.round(num(raw.maxGuests, "Maximum guests", 1, 20));

    const durations = list(raw.durations, "package length", 30)
      .map((item, i) => {
        if (!isRecord(item)) throw new Error(`Package length ${i + 1} is invalid.`);
        return { days: Math.round(num(item.days, `Package length ${i + 1} days`, 1, 30)), discount: num(item.discount, `Package length ${i + 1} saving`, 0, 0.9) };
      })
      .sort((a, b) => a.days - b.days);
    assertUnique(durations.map((d) => d.days), "package length");

    const locations = list(raw.locations, "atoll", 30).map((item, i) => {
      if (!isRecord(item)) throw new Error(`Atoll ${i + 1} is invalid.`);
      return {
        key: key(item.key, `Atoll ${i + 1} key`),
        label: text(item.label, `Atoll ${i + 1} name`),
        transferUsd: num(item.transferUsd, `Atoll ${i + 1} transfer`, 0, 100000),
        roomUsd: num(item.roomUsd, `Atoll ${i + 1} room rate`, 0, 100000),
        transferLabel: text(item.transferLabel, `Atoll ${i + 1} transfer type`, 60),
      };
    });
    assertUnique(locations.map((l) => l.key), "atoll key");
    const locationKeys = new Set(locations.map((l) => l.key));

    const packages = list(raw.packages, "fishing package", 50).map((item, i) => {
      if (!isRecord(item)) throw new Error(`Fishing package ${i + 1} is invalid.`);
      const label = text(item.label, `Fishing package ${i + 1} name`);
      let publishedRates: FishingCalculatorPublishedRates | null = null;
      if (item.publishedRates != null) {
        const pr = item.publishedRates;
        if (!isRecord(pr) || !isRecord(pr.perPersonByDays)) throw new Error(`${label}: published rates are invalid.`);
        const locationKey = key(pr.locationKey, `${label} published-rate atoll`);
        if (!locationKeys.has(locationKey)) throw new Error(`${label}: published rates use an atoll that doesn't exist.`);
        const perPersonByDays: Record<string, number[]> = {};
        for (const [days, rates] of Object.entries(pr.perPersonByDays)) {
          if (!/^\d{1,2}$/.test(days) || !Array.isArray(rates) || rates.length > maxGuests) throw new Error(`${label}: published rates for ${days} days are invalid.`);
          // 0 = no published rate for that group size (the formula is used).
          perPersonByDays[days] = rates.map((rate, g) => num(rate ?? 0, `${label} ${days} days, ${g + 1} guests`, 0, 1000000));
        }
        publishedRates = { locationKey, perPersonByDays };
      }
      return {
        key: key(item.key, `${label} key`),
        label,
        pricePerDay: num(item.pricePerDay, `${label} rate per day`, 0, 100000),
        active: item.active !== false,
        publishedRates,
      };
    });
    assertUnique(packages.map((p) => p.key), "fishing package key");
    if (!packages.some((p) => p.active)) throw new Error("At least one fishing package must be active.");

    const fleet = (Array.isArray(raw.fleet) ? raw.fleet : []).slice(0, 10).map((item, i) => {
      if (!isRecord(item)) throw new Error(`Boat ${i + 1} is invalid.`);
      return { name: text(item.name, `Boat ${i + 1} name`, 60), detail: text(item.detail, `Boat ${i + 1} details`, 200), facts: text(item.facts, `Boat ${i + 1} facts`, 200) };
    });

    return { ok: true, value: { markup: num(raw.markup, "Markup", 1, 5), maxGuests, durations, locations, packages, fleet } };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid calculator settings." };
  }
}

/** Machine key from a display name, e.g. "Night fishing" -> "night-fishing". */
export function packageKeyFromLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "package";
}
