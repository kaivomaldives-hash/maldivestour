export type FishingDurationBucket = "half-day" | "full-day" | "multi-day";

export const FISHING_DURATION_LABEL: Record<FishingDurationBucket, string> = {
  "half-day": "Half day (up to 4 hrs)",
  "full-day": "Full day (4–10 hrs)",
  "multi-day": "Multi-day",
};

/** Maps a duration-bucket URL value to the min/max minutes an
 * ActivityFilters query already understands (src/lib/activities/types.ts)
 * — no new query capability needed, just a friendlier UI over the
 * existing minDurationMinutes/maxDurationMinutes filters. */
export function fishingDurationBucketToMinutes(bucket: FishingDurationBucket | undefined): { minDurationMinutes?: number; maxDurationMinutes?: number } {
  switch (bucket) {
    case "half-day":
      return { maxDurationMinutes: 240 };
    case "full-day":
      return { minDurationMinutes: 241, maxDurationMinutes: 600 };
    case "multi-day":
      return { minDurationMinutes: 601 };
    default:
      return {};
  }
}

export function isFishingDurationBucket(value: string | undefined): value is FishingDurationBucket {
  return value === "half-day" || value === "full-day" || value === "multi-day";
}
