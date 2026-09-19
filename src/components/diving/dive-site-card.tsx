import Link from "next/link";

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
    <li className="rounded border border-neutral-200 p-4">
      <Link href={`/maldives/dive-sites/${site.slug}/`} className="text-lg font-medium hover:underline">
        {site.title}
      </Link>
      {site.siteType && (
        <div className="mt-1 text-sm text-neutral-600">{SITE_TYPE_LABEL[site.siteType] ?? site.siteType}</div>
      )}
    </li>
  );
}
