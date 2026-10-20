import type { Metadata } from "next";

import type { PlaceDirectorySearchParams } from "@/components/places/place-directory-page";
import type { PlaceCategory } from "@/lib/places/types";
import { canonicalUrl } from "@/lib/seo/site";

function hasAnyFilter(sp: PlaceDirectorySearchParams): boolean {
  return Boolean(sp.atoll);
}

const METADATA_BY_CATEGORY: Record<PlaceCategory, { title: string; description: string; path: string }> = {
  restaurant: {
    title: "Maldives Restaurants | Places to Eat",
    description: "Community-submitted Maldives restaurants, checked by our team before they're listed, by island and atoll.",
    path: "/maldives/restaurants",
  },
  shop: {
    title: "Maldives Shops",
    description: "Community-submitted Maldives shops, checked by our team before they're listed, by island and atoll.",
    path: "/maldives/shops",
  },
  hospital: {
    title: "Maldives Hospitals | Hospitals & Clinics",
    description: "Community-submitted Maldives hospitals and clinics, checked by our team before they're listed, by island and atoll.",
    path: "/maldives/hospitals",
  },
  school: {
    title: "Maldives Schools",
    description: "Community-submitted Maldives schools, checked by our team before they're listed, by island and atoll.",
    path: "/maldives/schools",
  },
  gym: {
    title: "Maldives Gyms",
    description: "Community-submitted Maldives gyms, checked by our team before they're listed, by island and atoll.",
    path: "/maldives/gyms",
  },
};

export async function placeDirectoryMetadata(category: PlaceCategory, searchParams: Promise<PlaceDirectorySearchParams>): Promise<Metadata> {
  const sp = await searchParams;
  const { title, description, path } = METADATA_BY_CATEGORY[category];
  const url = canonicalUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: hasAnyFilter(sp) ? { index: false, follow: true } : undefined,
  };
}
