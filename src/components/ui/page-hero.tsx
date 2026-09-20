import type { ReactNode } from "react";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/location/breadcrumbs";
import { CONTAINER_CLASS } from "@/components/ui/container";

/**
 * Reusable hero for directory/category pages (Task 12 §10). Two variants:
 *  - "ocean": a dark ocean-gradient band, reserved for the handful of top-
 *    level gateway pages (the homepage's own hero, /maldives/) so the
 *    gradient reads as a landmark rather than wallpaper everywhere.
 *  - "plain" (default): a calm off-white band, used on the rest of the
 *    directory/detail pages — keeps the site from being "entirely bright
 *    blue" per the design brief while still giving every page a proper,
 *    consistent hero band instead of a bare heading.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  meta,
  action,
  variant = "plain",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  meta?: ReactNode;
  action?: ReactNode;
  variant?: "ocean" | "plain";
}) {
  const isOcean = variant === "ocean";

  return (
    <section className={isOcean ? "bg-gradient-to-br from-ocean-900 via-ocean-800 to-maldives-600 text-white" : "bg-sand-50"}>
      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} tone={isOcean ? "inverted" : "default"} />}

        {eyebrow && (
          <p className={`mt-4 text-xs font-semibold uppercase tracking-wide ${isOcean ? "text-lagoon-200" : "text-maldives-600"}`}>
            {eyebrow}
          </p>
        )}

        <h1 className={`${breadcrumbs || eyebrow ? "mt-2" : ""} text-3xl font-semibold tracking-tight sm:text-4xl ${isOcean ? "text-white" : "text-ocean-900"}`}>
          {title}
        </h1>

        {description && (
          <p className={`mt-3 max-w-2xl text-base ${isOcean ? "text-lagoon-100" : "text-neutral-600"}`}>{description}</p>
        )}

        {meta && <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">{meta}</div>}

        {action && <div className="mt-6">{action}</div>}
      </div>
    </section>
  );
}
