import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { ActivityCard } from "@/components/activity/activity-card";
import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getAccommodationsByProvider } from "@/lib/accommodations/repository";
import { getActivitiesByProvider } from "@/lib/activities/repository";
import { getProviderBySlug } from "@/lib/providers/repository";
import { canonicalUrl } from "@/lib/seo/site";

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

  const [accommodations, activities] = await Promise.all([
    getAccommodationsByProvider(provider.id),
    getActivitiesByProvider(provider.id),
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
    </main>
  );
}
