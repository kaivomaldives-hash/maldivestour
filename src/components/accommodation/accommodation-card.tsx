import Link from "next/link";

import { CARD_CLASS } from "@/components/ui/card";
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
    <li className={CARD_CLASS}>
      <Link href={href} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
        {accommodation.title}
      </Link>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
        {accommodation.primaryLocation && <span>{accommodation.primaryLocation.title}</span>}
        {accommodation.starRating && <span>{accommodation.starRating}★</span>}
        {accommodation.priceTier && <span>{PRICE_TIER_LABEL[accommodation.priceTier] ?? accommodation.priceTier}</span>}
        {accommodation.allInclusive && <span>All-inclusive</span>}
        {accommodation.overwaterVillas && <span>Overwater villas</span>}
      </div>
    </li>
  );
}
