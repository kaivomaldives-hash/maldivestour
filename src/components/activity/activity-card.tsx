import Link from "next/link";

import { Price } from "@/components/currency/price";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import { activityHref, type ActivitySummary } from "@/lib/activities/types";
import { getChromeStrings } from "@/lib/i18n/chrome-strings";
import type { LinkLocalizer } from "@/lib/i18n/link-localizer";
import { isSupportedCurrency } from "@/lib/currency/types";

const CATEGORY_LABEL: Record<string, string> = {
  general: "General",
  fishing: "Fishing",
  diving: "Diving",
  surfing: "Surfing",
  watersports: "Watersports",
  excursion: "Excursion",
  island_hopping: "Island Hopping",
  spa: "Spa",
  culture: "Culture",
};

function formatDuration(minutes: number | null, units: { minutes: string; hours: string }): string | null {
  if (!minutes) return null;
  if (minutes < 60) return units.minutes.replace("{n}", String(minutes));
  const hours = minutes / 60;
  return units.hours.replace("{n}", Number.isInteger(hours) ? String(hours) : hours.toFixed(1));
}

export function ActivityCard({ activity, localize }: { activity: ActivitySummary; localize?: LinkLocalizer }) {
  const englishHref = activityHref(activity);
  const href = localize ? localize.href(englishHref) : englishHref;
  const title = localize ? localize.title(englishHref, activity.title) : activity.title;
  // English labels unless shown on a translated page (`localize`).
  const t = getChromeStrings(localize?.locale ?? "en");
  const duration = formatDuration(activity.durationMinutes, t);
  const priceCurrency = activity.currency ?? "USD";

  return (
    <li className={CARD_CLASS}>
      {activity.heroImage && (
        <div className={CARD_IMAGE_BLEED_CLASS}>
          <MediaImage asset={activity.heroImage} alt={title} aspectClassName="aspect-[4/3]" />
        </div>
      )}
      <Link href={href} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
        {title}
      </Link>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
        <span>{(localize ? t.activityCategories : CATEGORY_LABEL)[activity.activityCategory] ?? activity.activityCategory}</span>
        {activity.locations.length > 1 ? (
          <span>{t.locationsCount.replace("{n}", String(activity.locations.length))}</span>
        ) : (
          activity.primaryLocation && <span>{activity.primaryLocation.title}</span>
        )}
        {duration && <span>{duration}</span>}
        {activity.difficulty && <span className="capitalize">{localize ? (t.difficulty[activity.difficulty] ?? activity.difficulty) : activity.difficulty.replace("_", " ")}</span>}
        {activity.priceFrom && (
          <span>
            {t.cardFrom}{" "}
            {isSupportedCurrency(priceCurrency) ? (
              <Price baseAmount={activity.priceFrom} baseCurrency={priceCurrency} />
            ) : (
              `${priceCurrency} ${activity.priceFrom}`
            )}
          </span>
        )}
      </div>
    </li>
  );
}
