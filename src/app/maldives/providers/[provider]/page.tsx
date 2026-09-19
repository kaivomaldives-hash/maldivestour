import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Link from "next/link";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { ActivityCard } from "@/components/activity/activity-card";
import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getAccommodationsByProvider } from "@/lib/accommodations/repository";
import { getActivitiesByProvider } from "@/lib/activities/repository";
import { getProviderBySlug } from "@/lib/providers/repository";
import { canonicalUrl } from "@/lib/seo/site";
import { getTransferServicesByProvider } from "@/lib/transfers/repository";

const TRANSFER_TYPE_LABEL: Record<string, string> = {
  speedboat: "Speedboat",
  seaplane: "Seaplane",
  domestic_flight: "Domestic Flight",
  ferry: "Ferry",
  private_yacht: "Private Yacht",
  land_transfer: "Land Transfer",
};

export const revalidate = 3600;

interface Params {
  provider: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { provider: slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return {};

  const title = provider.metaTitle ?? `${provider.title} | Maldives Providers | MTG`;
  const description = provider.metaDescription ?? provider.summary ?? undefined;
  const url = canonicalUrl(`/maldives/providers/${provider.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function ProviderDetailPage({ params }: { params: Promise<Params> }) {
  const { provider: slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const [accommodations, activities, transferServices] = await Promise.all([
    getAccommodationsByProvider(provider.id),
    getActivitiesByProvider(provider.id),
    getTransferServicesByProvider(provider.id),
  ]);
  // See the identical split on the island/atoll pages (Task 7, Task 8, Task 9).
  const fishingActivities = activities.filter((a) => a.activityCategory === "fishing");
  const divingActivities = activities.filter((a) => a.activityCategory === "diving");
  const surfingActivities = activities.filter((a) => a.activityCategory === "surfing");
  const otherActivities = activities.filter(
    (a) => a.activityCategory !== "fishing" && a.activityCategory !== "diving" && a.activityCategory !== "surfing",
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Providers", href: "/maldives/providers/" },
          { label: provider.title },
        ]}
      />
      <h1 className="mt-4 text-3xl font-semibold">{provider.title}</h1>
      {provider.summary && <p className="mt-3 text-neutral-700">{provider.summary}</p>}
      {provider.websiteUrl && (
        <p className="mt-2 text-sm">
          <a href={provider.websiteUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {provider.websiteUrl}
          </a>
        </p>
      )}

      {accommodations.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Accommodation operated by {provider.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {accommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </ul>
        </section>
      )}

      {fishingActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Fishing operated by {provider.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fishingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {divingActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Diving operated by {provider.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {divingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {surfingActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Surfing operated by {provider.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {surfingActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {otherActivities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Activities operated by {provider.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {otherActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        </section>
      )}

      {transferServices.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Transfer services operated by {provider.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {transferServices.map((service) => (
              <li key={service.id} className="rounded border border-neutral-200 p-4">
                <Link href={`/maldives/transfers/${service.route.slug}/`} className="text-lg font-medium hover:underline">
                  {service.route.title}
                </Link>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
                  <span>{TRANSFER_TYPE_LABEL[service.transferType] ?? service.transferType}</span>
                  <span className="capitalize">{service.sharedOrPrivate}</span>
                  <span>
                    {service.currency} {service.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
