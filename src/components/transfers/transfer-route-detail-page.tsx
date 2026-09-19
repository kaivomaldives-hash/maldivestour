import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getTransferRouteBySlug } from "@/lib/transfers/repository";
import type { SharedOrPrivate, TransferService, TransferType } from "@/lib/transfers/types";
import { canonicalUrl } from "@/lib/seo/site";

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

function ServiceCard({ service }: { service: TransferService }) {
  const duration = formatDuration(service.durationMinutes);

  return (
    <li className="rounded border border-neutral-200 p-4">
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
    </li>
  );
}

export async function TransferRouteDetailPage({ slug }: { slug: string }) {
  const route = await getTransferRouteBySlug(slug);
  if (!route) notFound();

  const reverseSlug = route.origin && route.destination ? `${route.destination.slug}-to-${route.origin.slug}` : null;
  const reverseRoute = reverseSlug ? await getTransferRouteBySlug(reverseSlug) : null;

  const duration = formatDuration(route.typicalDurationMinutes);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Transfers", href: "/maldives/transfers/" },
          { label: route.title },
        ]}
      />
      <h1 className="mt-4 text-3xl font-semibold">{route.title}</h1>
      {route.summary && <p className="mt-3 text-neutral-700">{route.summary}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
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
        <h2 className="text-xl font-semibold">Transfer services</h2>
        {route.services.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">No verified transfer services recorded for this route yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {route.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </ul>
        )}
      </section>

      {/* Booking/inquiry UI is not built yet — Task 10 only establishes the
          bookings.transfer_service_id connection (see service.isBookable). */}
    </main>
  );
}
