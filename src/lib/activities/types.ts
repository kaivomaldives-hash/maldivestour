import type { LocationSummary } from "@/lib/locations/types";
import type { ProviderSummary } from "@/lib/providers/types";

export type ActivityCategory =
  | "general"
  | "fishing"
  | "diving"
  | "surfing"
  | "watersports"
  | "excursion"
  | "island_hopping"
  | "spa"
  | "culture";

export type ActivityDifficulty = "beginner" | "intermediate" | "advanced" | "all_levels";

export interface ActivitySummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  activityCategory: ActivityCategory;
  durationMinutes: number | null;
  difficulty: ActivityDifficulty | null;
  priceFrom: number | null;
  currency: string | null;
  primaryLocation: LocationSummary | null;
}

export interface ActivityDetail extends ActivitySummary {
  minAge: number | null;
  maxParticipants: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  provider: ProviderSummary | null;
  atoll: LocationSummary | null;
  isBookable: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ActivityFilters {
  category?: ActivityCategory;
  atollId?: string;
  locationId?: string;
  providerId?: string;
  difficulty?: ActivityDifficulty;
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
  minAge?: number;
  maxPriceFrom?: number;
  maxParticipants?: number;
  /** Restrict results to this exact set of node ids — used to compose a
   * further filter (e.g. "tagged with fishing type X" via node_categories)
   * on top of the relational filters above, without duplicating query
   * logic in a specialized-vertical repository. Added in Task 7. */
  nodeIds?: string[];
}

/**
 * URL segment each activity category resolves to. Categories with their
 * own dedicated vertical (fishing since Task 7, diving since Task 8,
 * surfing since Task 9) map to their own segment — that is their one
 * canonical location, per
 * docs/SYSTEM_ARCHITECTURE_AND_DATABASE_DESIGN.md §13/§19. Every other
 * category falls back to the shared /maldives/activities/ directory
 * established in Task 6.
 */
export const ACTIVITY_CATEGORY_SEGMENT: Partial<Record<ActivityCategory, string>> = {
  fishing: "fishing",
  diving: "diving",
  surfing: "surfing",
};

export function activityDirectorySegment(category: ActivityCategory): string {
  return ACTIVITY_CATEGORY_SEGMENT[category] ?? "activities";
}

export function activityHref(activity: { activityCategory: ActivityCategory; slug: string }): string {
  return `/maldives/${activityDirectorySegment(activity.activityCategory)}/${activity.slug}/`;
}

/** True when `category` has moved to its own dedicated vertical route and
 * should no longer be independently reachable at /maldives/activities/. */
export function hasDedicatedRoute(category: ActivityCategory): boolean {
  return category in ACTIVITY_CATEGORY_SEGMENT;
}
