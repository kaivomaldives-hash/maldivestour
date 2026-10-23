import Link from "next/link";

import type { ActivityDetail } from "@/lib/activities/types";
import type { LinkLocalizer } from "@/lib/i18n/link-localizer";

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

/** The "Quick facts" dl shared by every activity-shaped detail page
 * (generic activities, fishing, diving, surfing) — each page supplies its
 * own pre-formatted duration string and opts into the fields its category
 * actually has (fishing has neither difficulty nor a minimum age). */
export function ActivityQuickFacts({
  activity,
  duration,
  showCategory = false,
  difficultyLabel = "Level",
  showDifficulty = true,
  showMinAge = true,
  localize,
}: {
  activity: ActivityDetail;
  duration: string | null;
  showCategory?: boolean;
  difficultyLabel?: string;
  showDifficulty?: boolean;
  showMinAge?: boolean;
  /** On a translated page: links the location/atoll to their own translated pages. */
  localize?: LinkLocalizer;
}) {
  const link = (href: string, title: string) => (localize ? { href: localize.href(href), title: localize.title(href, title) } : { href, title });
  const location =
    activity.primaryLocation &&
    link(
      activity.primaryLocation.locationType === "island" ? `/maldives/islands/${activity.primaryLocation.slug}/` : `/maldives/atolls/${activity.primaryLocation.slug}/`,
      activity.primaryLocation.title,
    );
  const atoll = activity.atoll && link(`/maldives/atolls/${activity.atoll.slug}/`, activity.atoll.title);
  return (
    <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
      {showCategory && (
        <div>
          <dt className="text-neutral-500">Category</dt>
          <dd className="font-medium">{CATEGORY_LABEL[activity.activityCategory] ?? activity.activityCategory}</dd>
        </div>
      )}
      {duration && (
        <div>
          <dt className="text-neutral-500">Duration</dt>
          <dd className="font-medium">{duration}</dd>
        </div>
      )}
      {showDifficulty && activity.difficulty && (
        <div>
          <dt className="text-neutral-500">{difficultyLabel}</dt>
          <dd className="font-medium capitalize">{activity.difficulty.replace("_", " ")}</dd>
        </div>
      )}
      {showMinAge && activity.minAge !== null && (
        <div>
          <dt className="text-neutral-500">Minimum age</dt>
          <dd className="font-medium">{activity.minAge}</dd>
        </div>
      )}
      {activity.maxParticipants !== null && (
        <div>
          <dt className="text-neutral-500">Max participants</dt>
          <dd className="font-medium">{activity.maxParticipants}</dd>
        </div>
      )}
      {activity.priceFrom !== null && (
        <div>
          <dt className="text-neutral-500">Price from</dt>
          <dd className="font-medium">
            {activity.currency ?? "USD"} {activity.priceFrom}
          </dd>
        </div>
      )}
      {location && (
        <div>
          <dt className="text-neutral-500">Location</dt>
          <dd className="font-medium">
            <Link href={location.href} className="hover:underline">
              {location.title}
            </Link>
          </dd>
        </div>
      )}
      {atoll && (
        <div>
          <dt className="text-neutral-500">Atoll</dt>
          <dd className="font-medium">
            <Link href={atoll.href} className="hover:underline">
              {atoll.title}
            </Link>
          </dd>
        </div>
      )}
    </dl>
  );
}
