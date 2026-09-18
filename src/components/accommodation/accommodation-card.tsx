import Link from "next/link";

import { ACCOMMODATION_TYPE_SEGMENT, type AccommodationSummary } from "@/lib/accommodations/types";

const PRICE_TIER_LABEL: Record<string, string> = {
  budget: "Budget",
  mid: "Mid-range",
  luxury: "Luxury",
  ultra_luxury: "Ultra-luxury",
};

export function AccommodationCard({ accommodation }: { accommodation: AccommodationSummary }) {
  const href = `/maldives/${ACCOMMODATION_TYPE_SEGMENT[accommodation.accommodationType]}/${accommodation.slug}/`;

  return (
    <li className="rounded border border-neutral-200 p-4">
      <Link href={href} className="text-lg font-medium hover:underline">
        {accommodation.title}
      </Link>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
        {accommodation.primaryLocation && <span>{accommodation.primaryLocation.title}</span>}
        {accommodation.starRating && <span>{accommodation.starRating}★</span>}
        {accommodation.priceTier && <span>{PRICE_TIER_LABEL[accommodation.priceTier] ?? accommodation.priceTier}</span>}
        {accommodation.allInclusive && <span>All-inclusive</span>}
        {accommodation.overwaterVillas && <span>Overwater villas</span>}
      </div>
    </li>
  );
}
