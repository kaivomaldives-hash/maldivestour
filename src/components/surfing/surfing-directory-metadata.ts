import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export interface SurfingDirectorySearchParams {
  q?: string;
  page?: string;
  type?: string;
  atoll?: string;
  island?: string;
}

function hasAnyFilter(sp: SurfingDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.type || sp.atoll || sp.island);
}

export async function surfingDirectoryMetadata(searchParams: Promise<SurfingDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Surfing in the Maldives | MTG";
  const description = "Real, source-verified surf lessons, camps, and surf breaks in the Maldives.";
  const url = canonicalUrl("/maldives/surfing");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}
