/**
 * Custom Holiday Builder types — shared between the client-side wizard
 * (live price preview) and the server action that recomputes the
 * authoritative price before saving (src/lib/holiday-builder/
 * pricing-calculator.ts runs identically on both sides).
 */

export type StayType = "resort" | "local_island" | "safari";
export type MealPlanKey = "breakfast" | "half_board" | "full_board" | "all_inclusive";
export type TransferKey = "shared_speedboat" | "private_speedboat";
export type BedPreference = "double" | "twin" | "single";

export type PricingUnit = "per_room_per_night" | "per_person_per_night" | "per_person_per_way" | "per_boat_per_way";

export interface PricingConfigRow {
  id: string;
  category: "resort_room" | "local_island_room" | "safari_cabin" | "meal_plan_resort" | "meal_plan_local_island" | "transfer";
  stayType: StayType | null;
  key: string;
  label: string;
  priceUsd: number;
  unit: PricingUnit;
  sortOrder: number;
}

/** One room-type option offered for a given stay type, as shown to the
 * customer — derived from PricingConfigRow rows filtered by category. */
export interface RoomTypeOption {
  key: string;
  label: string;
  priceUsd: number;
  unit: PricingUnit;
}

/** One real activity a customer can add to a specific day — a thin
 * projection of ActivitySummary (src/lib/activities/types.ts), not a
 * duplicate record; the real activity id is kept so the server can
 * re-verify the price at submission time. */
export interface HolidayActivityOption {
  nodeId: string;
  slug: string;
  title: string;
  category: string;
  priceFrom: number | null;
  currency: string | null;
  durationMinutes: number | null;
}

/** One segment of the stay — a single stay-type/room/meal-plan/night-count
 * block. A non-split-stay holiday has exactly one segment covering every
 * night; a Split Stay holiday has 2+ segments whose nights sum to the
 * total holiday nights. */
export interface StaySegment {
  id: string;
  stayType: StayType;
  roomKey: string;
  bedPreference: BedPreference;
  mealPlan: MealPlanKey;
  nights: number;
}

/** One activity added to one specific day of the holiday (day 1 = arrival
 * day). A day may have zero or more activities. */
export interface DayActivitySelection {
  day: number;
  activity: HolidayActivityOption;
}

export interface HolidaySelection {
  arrivalDate: string;
  nights: number;
  adults: number;
  children: number;
  rooms: number;
  destinationLabel: string | null;
  destinationLocationId: string | null;
  isMultiIsland: boolean;
  segments: StaySegment[];
  dayActivities: DayActivitySelection[];
  transfer: TransferKey;
}

export interface PriceBreakdownLine {
  label: string;
  amount: number;
}

export interface PriceBreakdown {
  currency: "USD";
  accommodationTotal: number;
  mealPlanTotal: number;
  activitiesTotal: number;
  transferTotal: number;
  grandTotal: number;
  lines: PriceBreakdownLine[];
}

export const STAY_TYPE_LABELS: Record<StayType, string> = {
  resort: "Resort",
  local_island: "Local Island",
  safari: "Safari (Liveaboard)",
};

export const MEAL_PLAN_LABELS: Record<MealPlanKey, string> = {
  breakfast: "Breakfast",
  half_board: "Half Board",
  full_board: "Full Board",
  all_inclusive: "All-Inclusive",
};

export const ACTIVITY_CATEGORIES_FOR_BUILDER = ["diving", "fishing", "surfing", "watersports", "excursion"] as const;
