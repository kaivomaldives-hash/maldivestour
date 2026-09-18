import type { LocationSummary } from "@/lib/locations/types";
import type { ProviderSummary } from "@/lib/providers/types";

export type AccommodationType = "hotel" | "resort" | "guesthouse" | "villa" | "other";
export type PriceTier = "budget" | "mid" | "luxury" | "ultra_luxury";

export interface AccommodationSummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  accommodationType: AccommodationType;
  starRating: number | null;
  priceTier: PriceTier | null;
  allInclusive: boolean | null;
  overwaterVillas: boolean | null;
  primaryLocation: LocationSummary | null;
}

export interface AccommodationDetail extends AccommodationSummary {
  roomCount: number | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  currency: string | null;
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

export interface AccommodationFilters {
  type?: AccommodationType;
  atollId?: string;
  locationId?: string;
  priceTier?: PriceTier;
  starRating?: number;
  allInclusive?: boolean;
  overwaterVillas?: boolean;
}

/** URL path segment per accommodation type — the canonical routing rule
 * from docs/SYSTEM_ARCHITECTURE_AND_DATABASE_DESIGN.md §13/§19 (Rev 3). */
export const ACCOMMODATION_TYPE_SEGMENT: Record<AccommodationType, string> = {
  hotel: "hotels",
  resort: "resorts",
  guesthouse: "guesthouses",
  villa: "villas",
  other: "hotels", // no dedicated segment specified for "other"; grouped with hotels
};
