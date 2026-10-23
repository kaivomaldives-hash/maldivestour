import Link from "next/link";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import type { NearbyAccommodations } from "@/lib/accommodations/repository";
import { getChromeStrings } from "@/lib/i18n/chrome-strings";
import type { LinkLocalizer } from "@/lib/i18n/link-localizer";

export interface WhereToStaySectionProps {
  nearby: NearbyAccommodations;
  islandTitle: string | null;
  atollTitle: string | null;
  /** On a translated page: keeps card links, headings and the stays link in that language. */
  localize?: LinkLocalizer;
}

/**
 * The reverse of NearbyActivitiesSection — real accommodations near an
 * activity/attraction, completing the two-way accommodation↔activity
 * graph (never claiming the activity is operated by or included with any
 * listed stay).
 */
export function WhereToStaySection({ nearby, islandTitle, atollTitle, localize }: WhereToStaySectionProps) {
  const t = getChromeStrings(localize?.locale ?? "en");
  const { islandAccommodations, atollAccommodations } = nearby;
  if (islandAccommodations.length === 0 && atollAccommodations.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ocean-900">{t.whereToStay}</h2>
      <p className="mt-1 text-sm text-neutral-600">{t.whereToStayIntro}</p>

      {islandAccommodations.length > 0 && (
        <div className="mt-4">
          {atollAccommodations.length > 0 && islandTitle && (
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{t.staysOn.replace("{name}", islandTitle)}</h3>
          )}
          <ul className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 ${atollAccommodations.length > 0 && islandTitle ? "mt-3" : ""}`}>
            {islandAccommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} localize={localize} />
            ))}
          </ul>
        </div>
      )}

      {atollAccommodations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{t.moreStaysIn.replace("{name}", atollTitle ?? t.theArea)}</h3>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {atollAccommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} localize={localize} />
            ))}
          </ul>
        </div>
      )}

      <Link href={localize ? localize.href("/maldives/stays/") : "/maldives/resorts/"} className="mt-4 inline-block text-sm font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
        {t.browseAllStays}
      </Link>
    </section>
  );
}
