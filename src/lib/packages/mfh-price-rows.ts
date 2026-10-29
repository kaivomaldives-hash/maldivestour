import { fishingPackageSlug, type FishingPackageType } from "@/lib/packages/fishing-package-types";
import { MFH_PRICE_TABLES } from "@/lib/packages/mfh-price-tables";

/** "full-day" / "half-day" are the reef fishing packages (their original
 * slugs); the other fishing types are named directly. */
export type MfhDayType = "full-day" | "half-day" | FishingPackageType;

export function mfhPackageSlug(nights: number, dayType: MfhDayType): string {
  const type: FishingPackageType = dayType === "full-day" ? "fullReef" : dayType === "half-day" ? "halfReef" : dayType;
  return fishingPackageSlug(nights, type);
}

/** Per-person website price for a fishing package and group size, from the
 * same generated table the package pages render (never hand-typed). */
export function mfhPrice(slug: string, guests: number): string {
  const tier = MFH_PRICE_TABLES[slug]?.find((g) => g.guests === guests);
  return tier ? `USD ${tier.price.toLocaleString("en-US")}` : "On request";
}

/** Table row: package link, fishing days, then the per-person price for
 * each requested group size. */
export function mfhPackageRow(nights: number, dayType: MfhDayType, guests: number[]) {
  const slug = mfhPackageSlug(nights, dayType);
  return [
    { text: `${nights} nights`, href: `/maldives/packages/${slug}/` },
    { text: String(nights - 1) },
    ...guests.map((g) => ({ text: mfhPrice(slug, g) })),
  ];
}
