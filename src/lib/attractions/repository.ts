import "server-only";

import type { AttractionDetail, AttractionSummary, AttractionType, GetAttractionsOptions, PaginatedResult } from "@/lib/attractions/types";
import {
  getLocationBySlugAndType,
  getLocationSummariesByIds,
  getLocationSummaryById,
  getLocationsByType,
  getLocationsByTypeAndAtoll,
  getNodeAttributesByIds,
} from "@/lib/locations/repository";
import type { LocationSummary } from "@/lib/locations/types";
import { getHeroMediaByNodeIds } from "@/lib/media/repository";
import type { MediaAsset } from "@/lib/media/types";

/**
 * Attractions compose the existing location repository exactly the way
 * src/lib/diving/repository.ts composes it for dive sites — no new query
 * logic, no new table.
 */

function toAttractionSummary(
  location: LocationSummary,
  attributes: Record<string, unknown> | undefined,
  heroImage: MediaAsset | null,
  island: LocationSummary | null,
): AttractionSummary {
  const attractionType = typeof attributes?.attraction_type === "string" ? (attributes.attraction_type as AttractionType) : null;
  return {
    id: location.id,
    slug: location.slug,
    title: location.title,
    summary: location.summary,
    attractionType,
    heroImage,
    island,
  };
}

export async function getAttractions(options: GetAttractionsOptions = {}): Promise<PaginatedResult<AttractionSummary>> {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 48;

  let items: LocationSummary[];
  let total: number;
  if (options.atollId) {
    items = await getLocationsByTypeAndAtoll("poi", options.atollId);
    total = items.length;
  } else {
    const result = await getLocationsByType("poi", { page, pageSize });
    items = result.items;
    total = result.total;
  }

  if (options.islandId) {
    items = items.filter((i) => i.parentId === options.islandId);
    total = items.length;
  }

  const [attrsById, heroById, islandById] = await Promise.all([
    getNodeAttributesByIds(items.map((i) => i.id)),
    getHeroMediaByNodeIds(items.map((i) => i.id)),
    getIslandsByParentId(items),
  ]);
  let attractions = items.map((i) => toAttractionSummary(i, attrsById.get(i.id), heroById.get(i.id) ?? null, islandById.get(i.id) ?? null));

  if (options.attractionType) {
    attractions = attractions.filter((a) => a.attractionType === options.attractionType);
    total = attractions.length;
  }

  return { items: attractions, total, page, pageSize };
}

/** Every attraction's direct parent location is the island (or, for a
 * handful that aren't tied to one inhabited island, the atoll) it's
 * physically on — a single batched getLocationSummariesByIds over each
 * item's parentId, no per-item round trip. */
async function getIslandsByParentId(items: LocationSummary[]): Promise<Map<string, LocationSummary>> {
  const parentIds = Array.from(new Set(items.map((i) => i.parentId).filter((id): id is string => Boolean(id))));
  if (parentIds.length === 0) return new Map();
  const parentsById = await getLocationSummariesByIds(parentIds);
  const result = new Map<string, LocationSummary>();
  for (const item of items) {
    if (item.parentId && parentsById.has(item.parentId)) result.set(item.id, parentsById.get(item.parentId)!);
  }
  return result;
}

export async function getAttractionsByIsland(islandId: string): Promise<AttractionSummary[]> {
  const result = await getAttractions({ islandId, pageSize: 100 });
  return result.items;
}

export async function getAttractionsByAtoll(atollId: string): Promise<AttractionSummary[]> {
  const result = await getAttractions({ atollId, pageSize: 100 });
  return result.items;
}

export async function getAttractionBySlug(slug: string): Promise<AttractionDetail | null> {
  const location = await getLocationBySlugAndType(slug, "poi");
  if (!location) return null;

  const [attrs, hero, parent] = await Promise.all([
    getNodeAttributesByIds([location.id]).then((m) => m.get(location.id) ?? {}),
    getHeroMediaByNodeIds([location.id]).then((m) => m.get(location.id) ?? null),
    location.parentId ? getLocationSummaryById(location.parentId) : Promise.resolve(null),
  ]);

  // The direct parent is an island for every attraction seeded so far; a
  // future atoll-direct attraction (no single host island) would have
  // island === null and atoll set instead — both read the same parent.
  const island = parent?.locationType === "island" ? parent : null;
  const atoll = parent?.locationType === "atoll" ? parent : island ? await resolveIslandAtoll(island) : null;

  return {
    ...toAttractionSummary(location, attrs, hero, island),
    atoll,
    body: typeof attrs.body === "string" ? attrs.body : null,
    bestFor: typeof attrs.best_for === "string" ? attrs.best_for : null,
    sourceArticleSlug: typeof attrs.source_article_slug === "string" ? attrs.source_article_slug : null,
  };
}

async function resolveIslandAtoll(island: LocationSummary): Promise<LocationSummary | null> {
  if (!island.parentId) return null;
  const parent = await getLocationSummaryById(island.parentId);
  return parent?.locationType === "atoll" ? parent : null;
}

export type { AttractionType };
