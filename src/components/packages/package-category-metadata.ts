import type { Metadata } from "next";

import { PACKAGE_CATEGORY_CONTENT } from "@/lib/packages/category-content";
import { canonicalUrl } from "@/lib/seo/site";
import type { PackageCategorySlug } from "@/lib/packages/view-types";

export interface PackageCategoryPageSearchParams {
  q?: string;
  page?: string;
  atoll?: string;
  duration?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
}

function hasAnyFilter(sp: PackageCategoryPageSearchParams): boolean {
  return Boolean(sp.q || sp.atoll || sp.duration || sp.minPrice || sp.maxPrice || sp.minRating);
}

export async function packageCategoryMetadata(category: PackageCategorySlug, searchParams: Promise<PackageCategoryPageSearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const content = PACKAGE_CATEGORY_CONTENT[category];
  const url = canonicalUrl(`/maldives/packages/${category}`);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: content.metaTitle, description: content.metaDescription, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}
