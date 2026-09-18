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
}

/** Every activity category shares one canonical directory in Task 6 —
 * fishing/diving/surfing get their own dedicated systems in a later task.
 * See docs note in the activities repository module. */
export const ACTIVITY_DIRECTORY_SEGMENT = "activities";
