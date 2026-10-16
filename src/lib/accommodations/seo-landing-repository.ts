import "server-only";

import { getAccommodations } from "@/lib/accommodations/repository";
import type { AccommodationSummary } from "@/lib/accommodations/types";
import type { AccommodationSeoLandingSpec } from "@/lib/accommodations/seo-landing-content";

const LANDING_PAGE_SIZE = 60;

export interface AccommodationSeoLandingResult {
  items: AccommodationSummary[];
  total: number;
  /** Whether this page currently clears its own minResults bar — the
   * single source of truth both generateMetadata() (index/noindex) and
   * sitemap.ts (include/exclude) read, so the two can never disagree
   * about whether a given landing page is "live". */
  meetsThreshold: boolean;
}

/** Fetches a curated landing page's real results against live data —
 * never a static/assumed count. Shared by the page component, its
 * metadata (robots/canonical), and the sitemap. */
export async function getAccommodationSeoLandingResults(spec: AccommodationSeoLandingSpec): Promise<AccommodationSeoLandingResult> {
  const result = await getAccommodations({
    type: spec.accommodationType,
    priceTier: spec.filters.priceTier,
    priceTiers: spec.filters.priceTiers,
    allInclusive: spec.filters.allInclusive,
    overwaterVillas: spec.filters.overwaterVillas,
    pageSize: LANDING_PAGE_SIZE,
  });
  return { items: result.items, total: result.total, meetsThreshold: result.total >= spec.minResults };
}
