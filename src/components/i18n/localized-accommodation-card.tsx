import Link from "next/link";

import { Price } from "@/components/currency/price";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import type { AccommodationSummary } from "@/lib/accommodations/types";
import { isSupportedCurrency } from "@/lib/currency/types";
import type { LocalizedCard } from "@/lib/i18n/repository";
import type { StaysStrings } from "@/lib/i18n/stays-strings";

/**
 * Translated-page twin of AccommodationCard: same layout and "from" price
 * (still a display-only indicator, never a bookable rate), with the
 * property's translated URL/summary from localizeCards() and localized
 * tier/feature labels. Island names stay their real Latin-script titles.
 */
export function LocalizedAccommodationCard({
  accommodation,
  card,
  s,
}: {
  accommodation: AccommodationSummary;
  card: LocalizedCard;
  s: StaysStrings;
}) {
  const currency = accommodation.priceFromCurrency ?? "USD";

  return (
    <li className={CARD_CLASS}>
      {accommodation.heroImage && (
        <div className={CARD_IMAGE_BLEED_CLASS}>
          <MediaImage asset={accommodation.heroImage} alt={card.title} aspectClassName="aspect-[16/10]" />
        </div>
      )}
      <Link href={card.href} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
        {card.title}
      </Link>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
        {accommodation.primaryLocation && <span>{accommodation.primaryLocation.title}</span>}
        {accommodation.starRating && <span>{accommodation.starRating}★</span>}
        {accommodation.priceTier && <span>{s.priceTiers[accommodation.priceTier] ?? accommodation.priceTier}</span>}
        {accommodation.allInclusive && <span>{s.allInclusiveBadge}</span>}
        {accommodation.overwaterVillas && <span>{s.overwaterBadge}</span>}
      </div>
      {accommodation.priceFrom !== null && (
        <p className="mt-2 text-sm text-neutral-600">
          {s.detail.from}{" "}
          <span className="font-semibold text-ocean-900">
            {isSupportedCurrency(currency) ? (
              <Price baseAmount={accommodation.priceFrom} baseCurrency={currency} />
            ) : (
              <>
                {currency === "USD" ? "$" : `${currency} `}
                {accommodation.priceFrom.toLocaleString()}
              </>
            )}
          </span>{" "}
          {s.detail.perNight}
        </p>
      )}
    </li>
  );
}
