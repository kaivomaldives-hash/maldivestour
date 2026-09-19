import Link from "next/link";

import type { PackageSummary } from "@/lib/packages/types";

export function PackageCard({ pkg }: { pkg: PackageSummary }) {
  const primaryDestination = pkg.destinations[0] ?? null;

  return (
    <li className="rounded border border-neutral-200 p-4">
      <Link href={`/maldives/packages/${pkg.slug}/`} className="text-lg font-medium hover:underline">
        {pkg.title}
      </Link>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
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
        {!pkg.provider && <span>MTG-curated</span>}
      </div>
    </li>
  );
}
