// The Maamendhoo (Gaafu Alifu) fishing packages by fishing type — one
// package per type for 3 to 8 nights (2 to 7 fishing days), priced from
// the fishing package calculator's Huvadhoo rates. Plain module with no
// imports so scripts/generate-fishing-packages.mts can use it directly.

export const FISHING_PACKAGE_TYPES = ["fullReef", "halfReef", "fullTuna", "halfTuna", "flyFull", "flyHalf"] as const;
export type FishingPackageType = (typeof FISHING_PACKAGE_TYPES)[number];

export const FISHING_PACKAGE_NIGHTS = [3, 4, 5, 6, 7, 8] as const;

export const FISHING_PACKAGE_TYPE_LABELS: Record<FishingPackageType, string> = {
  fullReef: "Full-Day Reef Fishing",
  halfReef: "Half-Day Reef Fishing",
  fullTuna: "Full-Day Tuna Fishing",
  halfTuna: "Half-Day Tuna Fishing",
  flyFull: "Full-Day Fly Fishing",
  flyHalf: "Half-Day Fly Fishing",
};

/** Package slug. The reef slugs are the original "full-day-fishing" /
 * "half-day-fishing" packages (renamed to reef fishing, URLs kept), and the
 * full-day fly slug is the original "fly-fishing-holiday". */
export function fishingPackageSlug(nights: number, type: FishingPackageType): string {
  switch (type) {
    case "fullReef":
      return `${nights}-night-maldives-fishing-package-full-day-fishing`;
    case "halfReef":
      return `${nights}-night-maldives-fishing-package-half-day-fishing`;
    case "fullTuna":
      return `${nights}-night-maldives-fishing-package-full-day-tuna-fishing`;
    case "halfTuna":
      return `${nights}-night-maldives-fishing-package-half-day-tuna-fishing`;
    case "flyFull":
      return `${nights}-night-maldives-fly-fishing-holiday`;
    case "flyHalf":
      return `${nights}-night-maldives-fly-fishing-holiday-half-day`;
  }
}

export function fishingPackageTitle(nights: number, type: FishingPackageType): string {
  const base = type === "flyFull" || type === "flyHalf" ? `${nights}-Night Maldives Fly Fishing Holiday` : `${nights}-Night Maldives Fishing Package`;
  return `${base} — ${FISHING_PACKAGE_TYPE_LABELS[type]}`;
}
