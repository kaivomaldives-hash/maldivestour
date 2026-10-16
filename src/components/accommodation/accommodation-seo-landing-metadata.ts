import type { Metadata } from "next";

import type { AccommodationType } from "@/lib/accommodations/types";
import { getAccommodationSeoLandingSpec } from "@/lib/accommodations/seo-landing-content";
import { getAccommodationSeoLandingResults } from "@/lib/accommodations/seo-landing-repository";
import { canonicalUrl } from "@/lib/seo/site";
import { ACCOMMODATION_TYPE_SEGMENT } from "@/lib/accommodations/types";

/** Indexable only when the spec's own live result count clears its
 * minResults bar — an empty or near-empty curated landing page is noindex
 * rather than published thin. Checked here with the exact same
 * getAccommodationSeoLandingResults() call the page and the sitemap use,
 * so all three can never disagree. */
export async function accommodationSeoLandingMetadata(type: AccommodationType, slug: string): Promise<Metadata> {
  const spec = getAccommodationSeoLandingSpec(type, slug);
  if (!spec) return { robots: { index: false, follow: false } };

  const segment = ACCOMMODATION_TYPE_SEGMENT[type];
  const url = canonicalUrl(`/maldives/${segment}/${slug}`);
  const { meetsThreshold } = await getAccommodationSeoLandingResults(spec);

  return {
    title: spec.metaTitle,
    description: spec.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: spec.metaTitle, description: spec.metaDescription, url },
    robots: meetsThreshold ? undefined : { index: false, follow: true },
  };
}
