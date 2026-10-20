import Link from "next/link";

import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import type { PlaceSummary } from "@/lib/places/types";

/** No individual detail page exists for a place (unlike attractions) —
 * the title links to its island's own page instead, since that's where
 * a visitor actually finds more context (map, nearby things, how to
 * get there). */
export function PlaceCard({ place }: { place: PlaceSummary }) {
  const href = place.island ? `/maldives/islands/${place.island.slug}/` : place.atoll ? `/maldives/atolls/${place.atoll.slug}/` : null;

  return (
    <li className={CARD_CLASS}>
      {place.heroImage && (
        <div className={CARD_IMAGE_BLEED_CLASS}>
          <MediaImage asset={place.heroImage} alt={place.title} aspectClassName="aspect-[4/3]" />
        </div>
      )}
      {href ? (
        <Link href={href} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
          {place.title}
        </Link>
      ) : (
        <p className="text-lg font-medium text-ocean-900">{place.title}</p>
      )}
      {place.island && <p className="mt-1.5 text-sm text-neutral-600">{place.island.title}</p>}
      {place.summary && <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">{place.summary}</p>}
      {place.phone && <p className="mt-1.5 text-sm text-neutral-500">{place.phone}</p>}
    </li>
  );
}
