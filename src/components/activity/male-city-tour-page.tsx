import type { Metadata } from "next";

import { ActivityCard } from "@/components/activity/activity-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { MALE_CITY_TOUR_HALF_DAY_SLUGS, MALE_CITY_TOUR_SHORT_SLUGS, getMaleCityTourActivities } from "@/lib/activities/city-tour";
import type { MediaAsset } from "@/lib/media/types";
import { breadcrumbJsonLd, canonicalUrl } from "@/lib/seo/site";

const PAGE_PATH = "/maldives/male-city-tour";

// Hub page hero — a real owner-uploaded photo (see
// scripts/attach-city-tour-uploads.mjs), not tied to any one activity node,
// so it's a literal MediaAsset here rather than a repository lookup.
const HUB_HERO: MediaAsset = {
  id: "city-tour-hub-hero",
  mediaType: "image",
  storagePath: "uploads/assets/uploads/city-tour/maldives-city-tour.webp",
  youtubeId: null,
  title: null,
  altText: "Male City Tour",
  credit: null,
  width: null,
  height: null,
};

export async function maleCityTourMetadata(): Promise<Metadata> {
  const title = "Male City Tour — Walking, Bike, Car & Bus Tours | Maldives Tour Guide";
  const description =
    "Book a guided Male City Tour: walking, bike, car, mini bus, or large bus, with airport pickup and drop-off. See Stingray Point, the fish market, Friday Mosque, and more.";
  const url = canonicalUrl(PAGE_PATH);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export async function MaleCityTourPage() {
  const activities = await getMaleCityTourActivities();
  const bySlug = new Map(activities.map((a) => [a.slug, a]));

  const shortTours = MALE_CITY_TOUR_SHORT_SLUGS.map((slug) => bySlug.get(slug)).filter((a) => a !== undefined);
  const halfDayTours = MALE_CITY_TOUR_HALF_DAY_SLUGS.map((slug) => bySlug.get(slug)).filter((a) => a !== undefined);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([{ label: "Maldives", href: "/maldives/" }, { label: "Male City Tour" }], PAGE_PATH),
          ),
        }}
      />

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Male City Tour" }]}
        eyebrow="Excursion"
        title="Male City Tour"
        description="A guided tour of Malé, the Maldives' capital island — with airport pickup and drop-off, so even a short layover is enough time to see it. Choose walking, bike, car, or bus."
        image={HUB_HERO}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold text-ocean-900">Why take a Male City Tour?</h2>
          <p className="mt-2 text-neutral-700">
            Malé is one of the most densely populated cities in the world, packed into a single small island — a
            genuinely different side of the Maldives from the resort islands. It sits right next to Velana
            International Airport, so a few hours of waiting time between flights or boats is enough to see it: our
            guides pick you up at the airport, show you around, and drop you back off (or at your hotel in Malé or
            Hulhumalé) afterwards.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Short Tours (2 hours)</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Choose how you get around: on foot, by motorbike (riding behind your guide), by air-conditioned car, or by
            bus for larger groups.
          </p>
          {shortTours.length === 0 ? (
            <EmptyState title="Short tours are being updated — check back soon." />
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shortTours.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </ul>
          )}
        </section>

        {halfDayTours.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">Half-Day Tours (5–6 hours)</h2>
            <p className="mt-1 text-sm text-neutral-600">
              For guests staying in Malé, Hulhumalé, or a nearby resort — covers Malé, Hulhumalé, and Vilimalé in one
              trip, with tea and local snacks included.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {halfDayTours.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-ocean-900">Good to Know</h2>
          <dl className="mt-4 grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-neutral-900">Meeting points</dt>
              <dd className="mt-1 text-neutral-700">Malé Jetty No. 1, or the Airport Information Desk. Your guide will be waiting with a Maldives Tour Guide signboard.</dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-900">Dress code</dt>
              <dd className="mt-1 text-neutral-700">
                The Maldives is a Muslim country — modest clothing is fine for most of the tour (knee-length is okay), but entering
                a mosque requires full-length clothing and a head covering for women (a scarf is fine). Alcohol isn&rsquo;t
                permitted in Malé.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-900">Flight details</dt>
              <dd className="mt-1 text-neutral-700">
                If you&rsquo;re departing after your tour, let us know your flight details so we can get you back to the
                airport on time.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-900">Cancellation policy</dt>
              <dd className="mt-1 text-neutral-700">
                Free cancellation up to 24 hours before the tour start time. If a tour is cancelled due to poor weather,
                you&rsquo;ll be offered a different date or a full refund.
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
