import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CARD_CLASS } from "@/components/ui/card";
import type { PackageSummary } from "@/lib/packages/types";

export function PackageCard({ pkg }: { pkg: PackageSummary }) {
  const primaryDestination = pkg.destinations[0] ?? null;

  return (
    <li className={CARD_CLASS}>
      <div className="flex items-start justify-between gap-2">
        <Link href={`/maldives/packages/${pkg.slug}/`} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
          {pkg.title}
        </Link>
        {!pkg.provider && (
          <Badge tone="aqua" className="shrink-0">
            MTG-curated
          </Badge>
        )}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
        {pkg.durationNights !== null && (
          <span>
            {pkg.durationNights} night{pkg.durationNights === 1 ? "" : "s"}
          </span>
        )}
        {primaryDestination && <span>{primaryDestination.title}</span>}
        {pkg.priceFrom !== null ? (
          <span>
            From {pkg.currency ?? "USD"} {pkg.priceFrom}
          </span>
        ) : (
          <span>Quote on request</span>
        )}
      </div>
    </li>
  );
}
