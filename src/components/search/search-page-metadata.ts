import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export interface SearchPageSearchParams {
  q?: string;
  type?: string;
  page?: string;
}

export async function searchPageMetadata(searchParams: Promise<SearchPageSearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const canonical = canonicalUrl("/maldives/search");

  const title = q ? `Search results for "${q}" | MTG` : "Search | Maldives Tour Guide";
  const description = q
    ? `Search results for "${q}" across Maldives atolls, islands, resorts, hotels, guesthouses, activities, transfers, and packages.`
    : "Search MTG for real Maldives atolls, islands, resorts, hotels, guesthouses, activities, diving, fishing, surfing, transfers, and packages.";

  return {
    title,
    description,
    // Task 13 §5/§28: the canonical URL always stays the clean search
    // page — query/filter/page params never become their own indexable
    // landing pages.
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
    // Any actual query is a dynamic, per-visitor discovery view — keep it
    // out of the index while still letting crawlers follow its links.
    robots: q ? { index: false, follow: true } : undefined,
  };
}
