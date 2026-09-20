import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingToggle } from "@/components/bookings/booking-toggle";
import { PackageCard } from "@/components/packages/package-card";
import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { CARD_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getPackagesByTransferRoute } from "@/lib/packages/repository";
import { breadcrumbJsonLd, canonicalUrl, getSiteUrl } from "@/lib/seo/site";
import { getTransferRouteBySlug, getTransferRoutesByOrigin } from "@/lib/transfers/repository";
import type { SharedOrPrivate, TransferRouteDetail, TransferService, TransferType } from "@/lib/transfers/types";

const TRANSFER_TYPE_LABEL: Record<TransferType, string> = {
  speedboat: "Speedboat",
  seaplane: "Seaplane",
  domestic_flight: "Domestic Flight",
  ferry: "Ferry",
  private_yacht: "Private Yacht",
  land_transfer: "Land Transfer",
};

const MODE_LABEL: Record<SharedOrPrivate, string> = {
  shared: "Shared",
  private: "Private",
};

const DAY_LABEL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatDuration(minutes: number | null): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hour${hours === 1 ? "" : "s"}` : `${hours.toFixed(1)} hours`;
}

function locationHref(location: { slug: string; locationType: string }): string {
  if (location.locationType === "island") return `/maldives/islands/${location.slug}/`;
  if (location.locationType === "atoll") return `/maldives/atolls/${location.slug}/`;
  // Airports/seaports/harbours don't have their own directory route yet —
  // link to the transfers directory pre-filtered to that endpoint instead
  // of a 404.
  return `/maldives/transfers/?from=${location.slug}`;
}

export async function transferRouteDetailMetadata(slug: string): Promise<Metadata> {
  const route = await getTransferRouteBySlug(slug);
  if (!route) return {};

  const originTitle = route.origin?.title ?? "Origin";
  const destinationTitle = route.destination?.title ?? "Destination";
  const title = route.metaTitle ?? `${originTitle} to ${destinationTitle} Transfers | Maldives Tour Guide`;
  const types = Array.from(new Set(route.services.map((s) => TRANSFER_TYPE_LABEL[s.transferType])));
  const description =
    route.metaDescription ??
    route.summary ??
    `Transfers from ${originTitle} to ${destinationTitle}${types.length > 0 ? ` — ${types.join(", ")}` : ""}.`;
  const url = canonicalUrl(`/maldives/transfers/${route.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

/** Real, visible-on-page facts only — no ratings/reviews/availability
 * claims (Task 18 explicitly disallows fabricating any of those). */
function routeJsonLd(route: TransferRouteDetail) {
  const url = canonicalUrl(`/maldives/transfers/${route.slug}`);
  const cheapest = route.services.reduce<TransferService | null>(
    (min, s) => (min === null || s.price < min.price ? s : min),
    null,
  );

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: route.title,
    description: route.summary ?? `Transfer from ${route.origin?.title ?? "Velana International Airport"} to ${route.destination?.title ?? route.title}.`,
    url,
    areaServed: "Maldives",
    provider: { "@type": "Organization", name: "Maldives Tour Guide", url: getSiteUrl() },
    offers: cheapest
      ? { "@type": "Offer", price: cheapest.price, priceCurrency: cheapest.currency, availability: "https://schema.org/InStock" }
      : undefined,
  };
}

function ServiceCard({ service, route }: { service: TransferService; route: TransferRouteDetail }) {
  const duration = formatDuration(service.durationMinutes);

  return (
    <li className={CARD_CLASS}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-lg font-medium">
          {service.provider ? (
            <Link href={`/maldives/providers/${service.provider.slug}/`} className="hover:underline">
              {service.provider.title}
            </Link>
          ) : (
            "Operator not specified"
          )}
        </span>
        <span className="text-lg font-semibold">
          {service.currency} {service.price}
        </span>
      </div>

      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
        <span>{TRANSFER_TYPE_LABEL[service.transferType]}</span>
        <span>{MODE_LABEL[service.sharedOrPrivate]}</span>
        {duration && <span>{duration}</span>}
        {service.capacity !== null && <span>Capacity {service.capacity}</span>}
        {service.status !== "active" && <span className="capitalize">{service.status}</span>}
      </div>

      {service.vehicleType && <p className="mt-2 text-sm text-neutral-700">{service.vehicleType}</p>}
      {service.description && <p className="mt-2 text-sm text-neutral-700">{service.description}</p>}

      <dl className="mt-3 space-y-2 text-sm">
        {service.luggageAllowance && (
          <div>
            <dt className="text-neutral-500">Luggage allowance</dt>
            <dd className="mt-0.5">{service.luggageAllowance}</dd>
          </div>
        )}
        {service.pickupInstructions && (
          <div>
            <dt className="text-neutral-500">Pickup</dt>
            <dd className="mt-0.5">{service.pickupInstructions}</dd>
          </div>
        )}
        {service.dropoffInstructions && (
          <div>
            <dt className="text-neutral-500">Drop-off</dt>
            <dd className="mt-0.5">{service.dropoffInstructions}</dd>
          </div>
        )}
        {service.bookingRequirements && (
          <div>
            <dt className="text-neutral-500">Requirements</dt>
            <dd className="mt-0.5">{service.bookingRequirements}</dd>
          </div>
        )}
        {service.cancellationPolicy && (
          <div>
            <dt className="text-neutral-500">Cancellation policy</dt>
            <dd className="mt-0.5">{service.cancellationPolicy}</dd>
          </div>
        )}
      </dl>

      {service.schedules.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-neutral-500">Departures</p>
          <ul className="mt-1 space-y-1 text-sm">
            {service.schedules.map((schedule) => (
              <li key={schedule.id}>
                {schedule.dayOfWeek !== null ? DAY_LABEL[schedule.dayOfWeek] : "Daily"}
                {schedule.departureTime && ` · departs ${schedule.departureTime}`}
                {schedule.arrivalTime && ` · arrives ${schedule.arrivalTime}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {service.isBookable && (
        <BookingToggle
          transferServiceId={service.id}
          originLocationId={route.origin?.id ?? null}
          destinationLocationId={route.destination?.id ?? null}
          originTitle={route.origin?.title ?? "Velana International Airport"}
          destinationTitle={route.destination?.title ?? route.title}
          price={service.price}
          currency={service.currency}
        />
      )}
    </li>
  );
}

export async function TransferRouteDetailPage({ slug }: { slug: string }) {
  const route = await getTransferRouteBySlug(slug);
  if (!route) notFound();

  const reverseSlug = route.origin && route.destination ? `${route.destination.slug}-to-${route.origin.slug}` : null;
  const [reverseRoute, packages, originRoutes] = await Promise.all([
    reverseSlug ? getTransferRouteBySlug(reverseSlug) : Promise.resolve(null),
    getPackagesByTransferRoute(route.id),
    route.origin ? getTransferRoutesByOrigin(route.origin.id) : Promise.resolve([]),
  ]);
  const relatedRoutes = originRoutes.filter((r) => r.id !== route.id).slice(0, 4);

  const duration = formatDuration(route.typicalDurationMinutes);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(routeJsonLd(route)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Transfers", href: "/maldives/transfers/" }, { label: route.title }],
              `/maldives/transfers/${route.slug}`,
            ),
          ),
        }}
      />
      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Transfers", href: "/maldives/transfers/" },
          { label: route.title },
        ]}
        eyebrow="Transfer route"
        title={route.title}
        description={route.summary ?? undefined}
        image={route.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        {route.origin && (
          <div>
            <dt className="text-neutral-500">From</dt>
            <dd className="font-medium">
              <Link href={locationHref(route.origin)} className="hover:underline">
                {route.origin.title}
              </Link>
            </dd>
          </div>
        )}
        {route.destination && (
          <div>
            <dt className="text-neutral-500">To</dt>
            <dd className="font-medium">
              <Link href={locationHref(route.destination)} className="hover:underline">
                {route.destination.title}
              </Link>
            </dd>
          </div>
        )}
        {duration && (
          <div>
            <dt className="text-neutral-500">Typical duration</dt>
            <dd className="font-medium">{duration}</dd>
          </div>
        )}
        {route.distanceKm !== null && (
          <div>
            <dt className="text-neutral-500">Distance</dt>
            <dd className="font-medium">{route.distanceKm} km</dd>
          </div>
        )}
      </dl>

      {reverseRoute && (
        <p className="mt-3 text-sm text-neutral-600">
          Travelling the other way?{" "}
          <Link href={`/maldives/transfers/${reverseRoute.slug}/`} className="underline">
            {reverseRoute.title} →
          </Link>
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ocean-900">Transfer services</h2>
        {route.services.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">No verified transfer services recorded for this route yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {route.services.map((service) => (
              <ServiceCard key={service.id} service={service} route={route} />
            ))}
          </ul>
        )}
      </section>

      {packages.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Packages using this route</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </ul>
        </section>
      )}

      {relatedRoutes.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Other transfers from {route.origin?.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {relatedRoutes.map((r) => (
              <TransferRouteCard key={r.id} route={r} />
            ))}
          </ul>
        </section>
      )}
      </div>
    </main>
  );
}
