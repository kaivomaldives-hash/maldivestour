import type { Metadata } from "next";

import { DESTINATION_STRINGS_LOCALES } from "@/lib/i18n/destination-strings";
import { canonicalUrl, hreflangAlternates } from "@/lib/seo/site";

export interface DiveSiteDirectorySearchParams {
  page?: string;
  type?: string;
  atoll?: string;
}

function hasAnyFilter(sp: DiveSiteDirectorySearchParams): boolean {
  return Boolean(sp.type || sp.atoll);
}

export async function diveSiteDirectoryMetadata(searchParams: Promise<DiveSiteDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Dive Sites | MTG";
  const description = "Real, documented Maldives dive sites — reefs, thilas, channels, and wrecks — by atoll and type.";
  const url = canonicalUrl("/maldives/dive-sites");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/dive-sites/", DESTINATION_STRINGS_LOCALES) },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}
