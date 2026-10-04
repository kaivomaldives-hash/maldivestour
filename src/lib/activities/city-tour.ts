import "server-only";

import { getActivities } from "@/lib/activities/repository";
import type { ActivitySummary } from "@/lib/activities/types";
import { getCategoryBySlug, getNodeIdsByCategory } from "@/lib/categories/repository";

/** Display order for the Male City Tour hub page (src/components/activity/
 * male-city-tour-page.tsx) — getActivities() orders alphabetically by
 * title, which doesn't match the short-tours-then-half-day-tours grouping
 * the page renders, so callers sort by this instead. */
export const MALE_CITY_TOUR_SHORT_SLUGS = [
  "male-city-walking-tour",
  "male-city-bike-tour",
  "male-city-car-tour",
  "male-city-mini-bus-tour",
  "male-city-large-bus-tour",
];

export const MALE_CITY_TOUR_HALF_DAY_SLUGS = ["male-city-half-day-walking-tour", "male-city-half-day-bike-tour"];

/** Every activity tagged with the 'city-tour' activity-type category
 * (walking/bike/car/mini-bus/large-bus short tours plus the 2 half-day
 * variants — see 20250201000100_male_city_tour_and_whale_submarine.sql
 * and 20261001004500_city_tour_uploads_and_bus_tours.sql). */
export async function getMaleCityTourActivities(): Promise<ActivitySummary[]> {
  const category = await getCategoryBySlug("city-tour", "activity-type");
  if (!category) return [];
  const nodeIds = await getNodeIdsByCategory(category.id);
  if (nodeIds.length === 0) return [];
  const { items } = await getActivities({ nodeIds, pageSize: 20 });
  return items;
}
