import Link from "next/link";

import { Price } from "@/components/currency/price";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import { ACCOMMODATION_TYPE_SEGMENT, type AccommodationSummary } from "@/lib/accommodations/types";
import { isSupportedCurrency } from "@/lib/currency/types";
import type { LinkLocalizer } from "@/lib/i18n/link-localizer";

const PRICE_TIER_LABEL: Record<string, string> = {
  budget: "Budget",
  mid: "Mid-range",
  luxury: "Luxury",
  ultra_luxury: "Ultra-luxury",
};

export function AccommodationCard({ accommodation, localize }: { accommodation: AccommodationSummary; localize?: LinkLocalizer }) {
  const englishHref = `/maldives/${ACCOMMODATION_TYPE_SEGMENT[accommodation.accommodationType]}/${accommodation.slug}/`;
  const href = localize ? localize.href(englishHref) : englishHref;
  const title = localize ? localize.title(englishHref, accommodation.title) : accommodation.title;
  const priceFromCurrency = accommodation.priceFromCurrency ?? "USD";

  return (
    <li className={CARD_CLASS}>
      {accommodation.heroImage && (
        <div className={CARD_IMAGE_BLEED_CLASS}>
          <MediaImage asset={accommodation.heroImage} alt={title} aspectClassName="aspect-[16/10]" />
        </div>
      )}
      <Link href={href} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
        {title}
      </Link>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
        {accommodation.primaryLocation && <span>{accommodation.primaryLocation.title}</span>}
        {accommodation.starRating && <span>{accommodation.starRating}★</span>}
        {accommodation.priceTier && <span>{PRICE_TIER_LABEL[accommodation.priceTier] ?? accommodation.priceTier}</span>}
        {accommodation.allInclusive && <span>All-inclusive</span>}
        {accommodation.overwaterVillas && <span>Overwater villas</span>}
      </div>
      {/* A real "from" figure is fine on a card/listing — it's the one
          place the task spec allows a price at all. The property's own
          detail page never shows one (see accommodation-detail-page.tsx's
          Request-an-Offer CTA) since a single legacy snapshot price isn't
          a live rate. <Price> only changes the *display* currency (Task 19
          §21-24) -- this remains a "from" indicator, never a bookable rate. */}
      {accommodation.priceFrom !== null && (
        <p className="mt-2 text-sm text-neutral-600">
          From{" "}
          <span className="font-semibold text-ocean-900">
            {isSupportedCurrency(priceFromCurrency) ? (
              <Price baseAmount={accommodation.priceFrom} baseCurrency={priceFromCurrency} />
            ) : (
              <>
                {priceFromCurrency === "USD" ? "$" : `${priceFromCurrency} `}
                {accommodation.priceFrom.toLocaleString()}
              </>
            )}
          </span>{" "}
          / night
        </p>
      )}
    </li>
  );
}
