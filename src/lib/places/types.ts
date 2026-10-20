import type { LocationSummary } from "@/lib/locations/types";
import type { MediaAsset } from "@/lib/media/types";

/**
 * Restaurants, shops, hospitals, schools, and gyms — community-submitted
 * points of interest, represented as `locations` rows (location_type =
 * 'place'), the same no-new-table architecture src/lib/attractions/types.ts
 * already uses for attractions (location_type = 'poi'). A place is
 * never a bookable product.
 *
 * Attractions are deliberately NOT a PlaceCategory here — they already
 * have their own full type/repository/pages under location_type='poi'
 * (src/lib/attractions/types.ts). The shared "Add a Place" submission
 * form imports AttractionType/ATTRACTION_TYPE_LABEL from there directly
 * alongside this file's PlaceCategory, rather than this file
 * re-exporting it.
 */
export type PlaceCategory = "restaurant" | "shop" | "hospital" | "school" | "gym";

export const PLACE_CATEGORY_LABEL: Record<PlaceCategory, string> = {
  restaurant: "Restaurant",
  shop: "Shop",
  hospital: "Hospital",
  school: "School",
  gym: "Gym",
};

export interface PlaceSummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  placeCategory: PlaceCategory | null;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  heroImage: MediaAsset | null;
  island: LocationSummary | null;
  atoll: LocationSummary | null;
}

export interface GetPlacesOptions {
  page?: number;
  pageSize?: number;
  atollId?: string;
  islandId?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
