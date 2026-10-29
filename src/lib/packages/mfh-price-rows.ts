import { MFH_PRICE_TABLES } from "@/lib/packages/mfh-price-tables";

export type MfhDayType = "full-day" | "half-day";

export function mfhPackageSlug(nights: number, dayType: MfhDayType): string {
  return `${nights}-night-maldives-fishing-package-${dayType}-fishing`;
}

/** Per-person website price for an MFH package and group size, from the
 * same generated table the package pages render (never hand-typed). */
export function mfhPrice(slug: string, guests: number): string {
  const tier = MFH_PRICE_TABLES[slug]?.find((g) => g.guests === guests);
  return tier ? `USD ${tier.websitePrice.toLocaleString("en-US")}` : "On request";
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
