import "server-only";

import { cachedRead } from "@/lib/cache/cached-read";
import {
  getLocationSummariesByIds,
  getLocationsByType,
  getLocationsByTypeAndAtoll,
  getNodeAttributesByIds,
} from "@/lib/locations/repository";
import type { LocationSummary } from "@/lib/locations/types";
import { getHeroMediaByNodeIds } from "@/lib/media/repository";
import type { MediaAsset } from "@/lib/media/types";
import type { GetPlacesOptions, PaginatedResult, PlaceCategory, PlaceSummary } from "@/lib/places/types";

/**
 * Restaurants/shops/hospitals/schools/gyms compose the existing location
 * repository exactly the way src/lib/attractions/repository.ts composes
 * it for attractions — no new query logic beyond swapping
 * location_type='poi' for 'place' and attraction_type for
 * place_category. lat/lng are the place's own locations.lat/lng (the
 * optional map-picker pin), not the parent's.
 */

function toPlaceSummary(
  location: LocationSummary,
  attributes: Record<string, unknown> | undefined,
  heroImage: MediaAsset | null,
  island: LocationSummary | null,
  atoll: LocationSummary | null,
): PlaceSummary {
  const placeCategory = typeof attributes?.place_category === "string" ? (attributes.place_category as PlaceCategory) : null;
  const phone = typeof attributes?.phone === "string" ? attributes.phone : null;
  return {
    id: location.id,
    slug: location.slug,
    title: location.title,
    summary: location.summary,
    placeCategory,
    phone,
    lat: location.lat,
    lng: location.lng,
    heroImage,
    island,
    atoll,
  };
}

/** Every place's direct parent is the island it's physically on, or —
 * for the rare place tied straight to an atoll rather than one island —
 * the atoll directly. Same two-step batched parent/atoll resolution as
 * attractions' getDirectParentsById/getAtollsForDirectParents. */
async function getDirectParentsById(items: LocationSummary[]): Promise<Map<string, LocationSummary>> {
  const parentIds = Array.from(new Set(items.map((i) => i.parentId).filter((id): id is string => Boolean(id))));
  if (parentIds.length === 0) return new Map();
  const parentsById = await getLocationSummariesByIds(parentIds);
  const result = new Map<string, LocationSummary>();
  for (const item of items) {
    if (item.parentId && parentsById.has(item.parentId)) result.set(item.id, parentsById.get(item.parentId)!);
  }
  return result;
}

async function getAtollsForDirectParents(directParentById: Map<string, LocationSummary>): Promise<Map<string, LocationSummary>> {
  const result = new Map<string, LocationSummary>();
  const islandParentIdsToResolve = new Set<string>();
  for (const parent of directParentById.values()) {
    if (parent.locationType === "island" && parent.parentId) islandParentIdsToResolve.add(parent.parentId);
  }
  const atollsByIslandParentId = islandParentIdsToResolve.size > 0 ? await getLocationSummariesByIds(Array.from(islandParentIdsToResolve)) : new Map();

  for (const [itemId, parent] of directParentById) {
    if (parent.locationType === "atoll") {
      result.set(itemId, parent);
    } else if (parent.locationType === "island" && parent.parentId) {
      const atoll = atollsByIslandParentId.get(parent.parentId);
      if (atoll?.locationType === "atoll") result.set(itemId, atoll);
    }
  }
  return result;
}

async function getPlacesUncached(category: PlaceCategory, options: GetPlacesOptions = {}): Promise<PaginatedResult<PlaceSummary>> {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 48;

  let items: LocationSummary[];
  let total: number;
  if (options.atollId) {
    items = await getLocationsByTypeAndAtoll("place", options.atollId);
    total = items.length;
  } else {
    const result = await getLocationsByType("place", { page, pageSize });
    items = result.items;
    total = result.total;
  }

  if (options.islandId) {
    items = items.filter((i) => i.parentId === options.islandId);
    total = items.length;
  }

  const [attrsById, heroById, directParentById] = await Promise.all([
    getNodeAttributesByIds(items.map((i) => i.id)),
    getHeroMediaByNodeIds(items.map((i) => i.id)),
    getDirectParentsById(items),
  ]);
  const atollById = await getAtollsForDirectParents(directParentById);
  let places = items.map((i) => {
    const directParent = directParentById.get(i.id) ?? null;
    const island = directParent?.locationType === "island" ? directParent : null;
    return toPlaceSummary(i, attrsById.get(i.id), heroById.get(i.id) ?? null, island, atollById.get(i.id) ?? null);
  });

  // Filter to this directory's own category — 'place' rows cover all
  // five (restaurant/shop/hospital/school/gym), split by
  // attributes.place_category.
  places = places.filter((p) => p.placeCategory === category);
  total = places.length;

  return { items: places, total, page, pageSize };
}

export const getPlaces = cachedRead(getPlacesUncached, ["places:list"], 300);

export async function getPlacesByIsland(islandId: string, category: PlaceCategory): Promise<PlaceSummary[]> {
  const result = await getPlaces(category, { islandId, pageSize: 100 });
  return result.items;
}

export async function getPlacesByAtoll(atollId: string, category: PlaceCategory): Promise<PlaceSummary[]> {
  const result = await getPlaces(category, { atollId, pageSize: 100 });
  return result.items;
}
