import Link from "next/link";

import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import type { LocationSummary } from "@/lib/locations/types";
import type { LinkLocalizer } from "@/lib/i18n/link-localizer";

/** Real per-island photos now exist for 13 islands (see
 * scripts/attach-island-images.mjs) — most islands still have none, which
 * is the normal case, not an error; the card just renders without an
 * image rather than a placeholder or a borrowed generic photo. */
export function IslandCard({ island, localize }: { island: LocationSummary; localize?: LinkLocalizer }) {
  const englishHref = `/maldives/islands/${island.slug}/`;
  const href = localize ? localize.href(englishHref) : englishHref;
  const title = localize ? localize.title(englishHref, island.title) : island.title;
  return (
    <li className={CARD_CLASS}>
      {island.heroImage && (
        <div className={CARD_IMAGE_BLEED_CLASS}>
          <MediaImage asset={island.heroImage} alt={title} aspectClassName="aspect-[4/3]" />
        </div>
      )}
      <Link href={href} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
        {title}
      </Link>
      {island.summary && <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">{island.summary}</p>}
    </li>
  );
}
