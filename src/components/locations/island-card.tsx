import Link from "next/link";

import { CARD_CLASS } from "@/components/ui/card";
import type { LocationSummary } from "@/lib/locations/types";

/** No island-specific hero images exist yet (see the Phase 2 audit) — this
 * card is intentionally text-only rather than showing a placeholder or a
 * borrowed generic image. */
export function IslandCard({ island }: { island: LocationSummary }) {
  return (
    <li className={CARD_CLASS}>
      <Link href={`/maldives/islands/${island.slug}/`} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
        {island.title}
      </Link>
      {island.summary && <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">{island.summary}</p>}
    </li>
  );
}
