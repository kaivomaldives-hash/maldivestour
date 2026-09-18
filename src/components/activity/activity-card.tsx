import Link from "next/link";

import { activityHref, type ActivitySummary } from "@/lib/activities/types";

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

function formatDuration(minutes: number | null): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hr` : `${hours.toFixed(1)} hr`;
}

export function ActivityCard({ activity }: { activity: ActivitySummary }) {
  const duration = formatDuration(activity.durationMinutes);

  return (
    <li className="rounded border border-neutral-200 p-4">
      <Link href={activityHref(activity)} className="text-lg font-medium hover:underline">
        {activity.title}
      </Link>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
        <span>{CATEGORY_LABEL[activity.activityCategory] ?? activity.activityCategory}</span>
        {activity.primaryLocation && <span>{activity.primaryLocation.title}</span>}
        {duration && <span>{duration}</span>}
        {activity.difficulty && <span className="capitalize">{activity.difficulty.replace("_", " ")}</span>}
        {activity.priceFrom && (
          <span>
            From {activity.currency ?? "USD"} {activity.priceFrom}
          </span>
        )}
      </div>
    </li>
  );
}
