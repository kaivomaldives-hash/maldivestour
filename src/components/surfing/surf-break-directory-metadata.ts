import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export interface SurfBreakDirectorySearchParams {
  page?: string;
  type?: string;
  atoll?: string;
}

function hasAnyFilter(sp: SurfBreakDirectorySearchParams): boolean {
  return Boolean(sp.type || sp.atoll);
}

export async function surfBreakDirectoryMetadata(searchParams: Promise<SurfBreakDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Surf Breaks | MTG";
  const description = "Real, documented Maldives surf breaks — reef, point, and beach breaks, and channels — by atoll and type.";
  const url = canonicalUrl("/maldives/surf-breaks");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}
