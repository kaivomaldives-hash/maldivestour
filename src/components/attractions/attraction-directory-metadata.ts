import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export interface AttractionDirectorySearchParams {
  page?: string;
  type?: string;
  atoll?: string;
}

function hasAnyFilter(sp: AttractionDirectorySearchParams): boolean {
  return Boolean(sp.type || sp.atoll);
}

export async function attractionDirectoryMetadata(searchParams: Promise<AttractionDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Attractions | Landmarks, Museums & Places to Visit";
  const description = "Real, individually documented Maldives attractions — mosques, museums, monuments, beaches and markets — starting with Male's must-see landmarks.";
  const url = canonicalUrl("/maldives/attractions");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}
