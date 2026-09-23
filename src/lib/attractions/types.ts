import type { LocationSummary } from "@/lib/locations/types";
import type { MediaAsset } from "@/lib/media/types";

/**
 * Maldives Attractions — real, physical points of interest (landmarks,
 * museums, monuments, public beaches, markets). Represented as `locations`
 * rows (location_type = 'poi'), the exact same architecture already used
 * for dive sites (location_type = 'dive_site') and surf breaks
 * (location_type = 'surf_break') — no new table, no duplicate entity
 * model. An attraction is a place, never a bookable product — it is
 * deliberately NOT an `activities` row.
 */
export type AttractionType =
  | "religious"
  | "museum"
  | "monument"
  | "park"
  | "beach"
  | "market"
  | "landmark"
  | "infrastructure";

export interface AttractionSummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  attractionType: AttractionType | null;
  heroImage: MediaAsset | null;
  island: LocationSummary | null;
}

export interface AttractionDetail extends AttractionSummary {
  atoll: LocationSummary | null;
  body: string | null;
  bestFor: string | null;
  sourceArticleSlug: string | null;
}

export interface GetAttractionsOptions {
  page?: number;
  pageSize?: number;
  atollId?: string;
  islandId?: string;
  attractionType?: AttractionType;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function attractionHref(attraction: { slug: string }): string {
  return `/maldives/attractions/${attraction.slug}/`;
}
