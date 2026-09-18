// Domain types for the location read layer. Hand-written rather than
// derived from src/types/database.ts because that file is still the
// Task 3 placeholder (no live Supabase project was available to generate
// real types from — see that file's header and the Task 4 report for why).
// Once real generated types exist, these can be narrowed to
// `Database["public"]["Tables"]["nodes"]["Row"]` etc.

export type LocationType =
  | "country"
  | "atoll"
  | "island"
  | "locality"
  | "airport"
  | "seaport"
  | "harbour"
  | "poi"
  | "dive_site"
  | "surf_break"
  | "fishing_spot";

/** Shared fields every location listing/detail view needs. */
export interface LocationSummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  locationType: LocationType;
  parentId: string | null;
  isInhabited: boolean | null;
}

/** Adds the fields a detail page needs beyond a listing card. */
export interface LocationDetail extends LocationSummary {
  metaTitle: string | null;
  metaDescription: string | null;
  lat: number | null;
  lng: number | null;
  administrativeCode: string | null;
  path: string;
}

export interface AtollSummary extends LocationSummary {
  locationType: "atoll";
  islandCount: number;
}

export interface AtollDetail extends LocationDetail {
  locationType: "atoll";
}

export interface IslandSummary extends LocationSummary {
  locationType: "island";
  atollId: string | null;
}

export interface IslandDetail extends LocationDetail {
  locationType: "island";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
