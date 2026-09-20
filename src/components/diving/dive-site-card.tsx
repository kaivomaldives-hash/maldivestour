import Link from "next/link";

import { CARD_CLASS } from "@/components/ui/card";
import type { DiveSiteSummary } from "@/lib/diving/types";

const SITE_TYPE_LABEL: Record<string, string> = {
  reef: "Reef",
  thila: "Thila",
  channel: "Channel",
  wreck: "Wreck",
  pinnacle: "Pinnacle",
  wall: "Wall",
  cave: "Cave",
};

export function DiveSiteCard({ site }: { site: DiveSiteSummary }) {
  return (
    <li className={CARD_CLASS}>
      <Link href={`/maldives/dive-sites/${site.slug}/`} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
        {site.title}
      </Link>
      {site.siteType && (
        <div className="mt-1.5 text-sm text-neutral-600">{SITE_TYPE_LABEL[site.siteType] ?? site.siteType}</div>
      )}
    </li>
  );
}
