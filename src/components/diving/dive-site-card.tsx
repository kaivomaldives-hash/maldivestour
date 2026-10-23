import Link from "next/link";

import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import type { DiveSiteSummary } from "@/lib/diving/types";
import { getDestinationStrings } from "@/lib/i18n/destination-strings";
import type { LinkLocalizer } from "@/lib/i18n/link-localizer";

const SITE_TYPE_LABEL: Record<string, string> = {
  reef: "Reef",
  thila: "Thila",
  channel: "Channel",
  wreck: "Wreck",
  pinnacle: "Pinnacle",
  wall: "Wall",
  cave: "Cave",
};

export function DiveSiteCard({ site, localize }: { site: DiveSiteSummary; localize?: LinkLocalizer }) {
  const englishHref = `/maldives/dive-sites/${site.slug}/`;
  const href = localize ? localize.href(englishHref) : englishHref;
  const title = localize ? localize.title(englishHref, site.title) : site.title;
  return (
    <li className={CARD_CLASS}>
      {site.heroImage && (
        <div className={CARD_IMAGE_BLEED_CLASS}>
          <MediaImage asset={site.heroImage} alt={title} aspectClassName="aspect-[4/3]" />
        </div>
      )}
      <Link href={href} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
        {title}
      </Link>
      {site.siteType && (
        <div className="mt-1.5 text-sm text-neutral-600">{(localize ? getDestinationStrings(localize.locale).siteTypes : SITE_TYPE_LABEL)[site.siteType] ?? site.siteType}</div>
      )}
    </li>
  );
}
