import type { Metadata } from "next";

import { getDiveSites } from "@/lib/diving/repository";
import { getPublishedLocalesForPage } from "@/lib/i18n/repository";
import { canonicalUrl, hreflangAlternates } from "@/lib/seo/site";

export interface DivingDirectorySearchParams {
  q?: string;
  page?: string;
  type?: string;
  atoll?: string;
  island?: string;
  difficulty?: string;
  maxPrice?: string;
}

function hasAnyFilter(sp: DivingDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.type || sp.atoll || sp.island || sp.difficulty || sp.maxPrice);
}

export async function divingDirectoryMetadata(searchParams: Promise<DivingDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  // Real, live-counted total — never a hand-set number that can go stale,
  // since this route has no revalidate/ISR cache and re-runs every request.
  const { total: diveSiteTotal } = await getDiveSites({ pageSize: 1 });
  const year = new Date().getFullYear();
  const title =
    diveSiteTotal > 0
      ? `Maldives Diving ${year} | ${diveSiteTotal} Dive Sites, Trips & Packages`
      : "Maldives Diving | Dive Trips, Packages & Dive Sites";
  const description = "Real, source-verified Maldives diving activities, dive centers, dive sites and diving packages — search by type, location and provider.";
  const url = canonicalUrl("/maldives/diving");
  const publishedLocales = await getPublishedLocalesForPage("diving-hub");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/diving/", publishedLocales) },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}
