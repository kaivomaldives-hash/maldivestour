import type { Metadata } from "next";

import { getAccommodationBySlug } from "@/lib/accommodations/repository";
import { ACCOMMODATION_TYPE_SEGMENT, type AccommodationType } from "@/lib/accommodations/types";
import { canonicalUrl } from "@/lib/seo/site";

export const TYPE_LABEL: Record<AccommodationType, string> = {
  hotel: "Hotel",
  resort: "Resort",
  guesthouse: "Guesthouse",
  villa: "Villa",
  liveaboard: "Liveaboard",
  other: "Accommodation",
};

/**
 * Shared by every accommodation type's [slug] route. `type` must match the
 * requested URL segment — a hotel is only reachable at /maldives/hotels/,
 * never at /maldives/resorts/, even though slugs are globally unique
 * across accommodation types. This is what keeps the canonical URL for a
 * given accommodation to exactly one path.
 *
 * Lives here (not in accommodation-detail-page.tsx) rather than exported
 * from the component file, so that file exports only the page component
 * — see accommodationDetailMetadata below for why that split matters.
 */
export async function loadAndVerify(type: AccommodationType, slug: string) {
  const accommodation = await getAccommodationBySlug(slug);
  if (!accommodation || accommodation.accommodationType !== type) return null;
  return accommodation;
}

/**
 * Split out of accommodation-detail-page.tsx: a .tsx file that exports
 * both a component and a plain function loses Fast Refresh's ability to
 * preserve component state on edit (React has to fall back to a full
 * reload instead) — moving the non-component export to its own .ts file
 * fixes that for the component file without changing behavior here.
 */
export async function accommodationDetailMetadata(type: AccommodationType, slug: string): Promise<Metadata> {
  const accommodation = await loadAndVerify(type, slug);
  if (!accommodation) return {};

  const title = accommodation.metaTitle ?? `${accommodation.title} | Maldives ${TYPE_LABEL[type]}s | MTG`;
  const description = accommodation.metaDescription ?? accommodation.summary ?? undefined;
  const url = canonicalUrl(`/maldives/${ACCOMMODATION_TYPE_SEGMENT[type]}/${accommodation.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}
