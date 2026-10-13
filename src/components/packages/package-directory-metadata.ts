import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export interface PackageDirectorySearchParams {
  q?: string;
  page?: string;
  category?: string;
  atoll?: string;
  duration?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
}

export function hasAnyFilter(sp: PackageDirectorySearchParams): boolean {
  return Boolean(sp.q || sp.category || sp.atoll || sp.duration || sp.minPrice || sp.maxPrice || sp.minRating);
}

export async function packageDirectoryMetadata(searchParams: Promise<PackageDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const title = "Maldives Packages | Holiday, Vacation & Travel Packages";
  const description =
    "Real Maldives holiday, honeymoon, family, diving, fishing, surfing, luxury and budget packages — search by destination, filter by duration, price and category, and enquire directly.";
  const url = canonicalUrl("/maldives/packages");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}
