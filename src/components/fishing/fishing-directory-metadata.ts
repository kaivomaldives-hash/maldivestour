import type { Metadata } from "next";

import { getPublishedLocalesForPage } from "@/lib/i18n/repository";
import { canonicalUrl, hreflangAlternates } from "@/lib/seo/site";

export interface FishingDirectorySearchParams {
  q?: string;
  page?: string;
  type?: string;
  atoll?: string;
  island?: string;
  duration?: string;
  maxPrice?: string;
}

function hasAnyFilter(sp: FishingDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.type || sp.atoll || sp.island || sp.duration || sp.maxPrice);
}

export async function fishingDirectoryMetadata(searchParams: Promise<FishingDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Fishing | Fishing Charters, Trips & Packages";
  const description =
    "Maldives fishing charters, trips and packages: private boats from USD 980, GT popping and jigging, trolling, big game and reef fishing, plus sunset trips.";
  const url = canonicalUrl("/maldives/fishing");
  const publishedLocales = await getPublishedLocalesForPage("fishing-hub");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/fishing/", publishedLocales) },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}
