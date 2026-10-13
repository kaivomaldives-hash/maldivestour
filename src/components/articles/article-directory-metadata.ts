import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export interface ArticleDirectorySearchParams {
  page?: string;
  category?: string;
}

export async function articleDirectoryMetadata(searchParams: Promise<ArticleDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Travel Guide | MTG";
  const description = "Real, in-depth Maldives travel guides — islands, atolls, diving, weather, culture, and more.";
  const url = canonicalUrl("/maldives/travel-guide");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    // A category filter narrows results to a non-canonical view — keep it
    // out of the index; the plain directory (and its pagination) stays
    // indexable, same rule as the packages/search directories.
    robots: sp.category ? { index: false, follow: true } : undefined,
  };
}
