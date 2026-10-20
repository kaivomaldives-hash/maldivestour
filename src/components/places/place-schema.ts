import { publicStorageUrl } from "@/lib/media/types";
import type { PlaceCategory, PlaceSummary } from "@/lib/places/types";
import { canonicalUrl } from "@/lib/seo/site";

/** The real schema.org type for each category — distinct from the
 * generic "LocalBusiness" the shared itemListJsonLd() helper
 * (src/lib/seo/site.ts) would otherwise emit, since Google's rich-result
 * eligibility and the more specific structured properties (cuisine,
 * fitness, etc. aside) are keyed off these exact subtypes. */
const SCHEMA_TYPE: Record<PlaceCategory, string> = {
  restaurant: "Restaurant",
  shop: "Store",
  hospital: "Hospital",
  school: "School",
  gym: "ExerciseGym",
};

/** ItemList of a places directory page's own category, each item typed
 * correctly for schema.org and carrying real telephone/geo data when the
 * submitter provided it — a bespoke builder rather than reusing the
 * shared itemListJsonLd() (which only knows title/href/summary) since a
 * place actually has structured fields worth surfacing. There's no
 * per-place detail page to hang its own JSON-LD off, so each place's
 * full structured data lives inside this list instead. */
export function placesItemListJsonLd(category: PlaceCategory, items: PlaceSummary[], fallbackHref: string) {
  const itemType = SCHEMA_TYPE[category];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((place, index) => {
      const href = place.island ? `/maldives/islands/${place.island.slug}/` : place.atoll ? `/maldives/atolls/${place.atoll.slug}/` : fallbackHref;
      const areaTitle = place.island?.title ?? place.atoll?.title;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": itemType,
          name: place.title,
          description: place.summary ?? undefined,
          url: canonicalUrl(href),
          telephone: place.phone ?? undefined,
          address: areaTitle ? { "@type": "PostalAddress", addressRegion: areaTitle, addressCountry: "MV" } : undefined,
          geo: place.lat != null && place.lng != null ? { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng } : undefined,
          image: place.heroImage?.storagePath ? (publicStorageUrl(place.heroImage.storagePath) ?? undefined) : undefined,
        },
      };
    }),
  };
}
