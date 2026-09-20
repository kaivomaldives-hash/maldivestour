import type { Metadata } from "next";
import Link from "next/link";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { ActivityCard } from "@/components/activity/activity-card";
import { PackageCard } from "@/components/packages/package-card";
import { SearchBox } from "@/components/search/search-box";
import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { BookIcon, CompassIcon, DivingIcon, FishIcon, MapPinIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/section-header";
import { getAccommodations } from "@/lib/accommodations/repository";
import { getActivities } from "@/lib/activities/repository";
import { getAtolls } from "@/lib/locations/repository";
import { getPackages } from "@/lib/packages/repository";
import { canonicalUrl } from "@/lib/seo/site";
import { getTransferRoutes } from "@/lib/transfers/repository";

export const revalidate = 3600;

const WHATSAPP_URL = "https://wa.me/9607794332";

export function generateMetadata(): Metadata {
  const title = "Maldives Tour Guide (MTG)";
  const description =
    "A real, source-verified travel guide to the Maldives — atolls, islands, resorts, hotels, guesthouses, activities, diving, fishing, surfing, transfers and packages.";
  const url = canonicalUrl("/");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function Home() {
  const [atolls, accommodations, activities, transferRoutes, packages] = await Promise.all([
    getAtolls(),
    getAccommodations({ type: "resort", pageSize: 6 }),
    getActivities({ pageSize: 6 }),
    getTransferRoutes({ pageSize: 4 }),
    getPackages({ pageSize: 6 }),
  ]);

  const islandCount = atolls.reduce((sum, atoll) => sum + atoll.islandCount, 0);
  const featuredAtolls = atolls.slice(0, 6);

  return (
    <main className="flex-1">
      {/* Hero — no stock imagery is used (none is available in this
          dataset yet); the ocean gradient + real counts carry the section
          instead of a placeholder photo. */}
      <section className="bg-gradient-to-br from-ocean-950 via-ocean-800 to-maldives-600 text-white">
        <Container className="py-16 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-lagoon-200">Maldives Tour Guide</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            A real, source-verified guide to the Maldives
          </h1>
          <p className="mt-4 max-w-xl text-lg text-lagoon-100">
            Atolls, islands, resorts, hotels and guesthouses, activities, diving, fishing, surfing, transfers and
            travel packages — researched and kept up to date, not generated.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBox variant="inline" placeholder="Search islands, resorts, activities…" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/maldives/" variant="inverted" size="md">
              Explore the Maldives
            </Button>
            <Button href="/maldives/packages/" variant="secondary" size="md" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              See travel packages
            </Button>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-lagoon-100">
            <div>
              <dt className="sr-only">Administrative atolls</dt>
              <dd>
                <span className="text-lg font-semibold text-white">{atolls.length}</span> atolls
              </dd>
            </div>
            <div>
              <dt className="sr-only">Inhabited islands</dt>
              <dd>
                <span className="text-lg font-semibold text-white">{islandCount}</span> inhabited islands
              </dd>
            </div>
            <div>
              <dt className="sr-only">Places to stay</dt>
              <dd>
                <span className="text-lg font-semibold text-white">{accommodations.total}+</span> resorts listed
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* Explore Maldives */}
      {featuredAtolls.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeader
              eyebrow="Destinations"
              title="Explore the Maldives"
              description="26 natural atolls, grouped into administrative atolls — each with its own inhabited islands."
              action={{ label: "View all atolls", href: "/maldives/atolls/" }}
            />
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {featuredAtolls.map((atoll) => (
                <li key={atoll.id}>
                  <Link
                    href={`/maldives/atolls/${atoll.slug}/`}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <MapPinIcon className="h-5 w-5 text-maldives-600" />
                    <div className="mt-3">
                      <p className="font-medium text-ocean-900 group-hover:text-maldives-600">{atoll.title}</p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {atoll.islandCount} island{atoll.islandCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Places to Stay */}
      {accommodations.items.length > 0 && (
        <section className="bg-sand-50 py-14 sm:py-20">
          <Container>
            <SectionHeader
              eyebrow="Places to stay"
              title="Resorts, hotels and guesthouses"
              description="Real, individually verified accommodation across the Maldives."
              action={{ label: "Browse all resorts", href: "/maldives/resorts/" }}
            />
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {accommodations.items.map((accommodation) => (
                <AccommodationCard key={accommodation.id} accommodation={accommodation} />
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link href="/maldives/hotels/" className="font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                Hotels →
              </Link>
              <Link href="/maldives/guesthouses/" className="font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                Guesthouses →
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Things to Do */}
      {activities.items.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeader
              eyebrow="Things to do"
              title="Activities, diving, fishing and surfing"
              description="Real operators and activities, sourced island by island."
              action={{ label: "View all activities", href: "/maldives/activities/" }}
            />
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activities.items.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href="/maldives/diving/" className="inline-flex items-center gap-1.5 font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                <DivingIcon className="h-4 w-4" /> Diving
              </Link>
              <Link href="/maldives/fishing/" className="inline-flex items-center gap-1.5 font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                <FishIcon className="h-4 w-4" /> Fishing
              </Link>
              <Link href="/maldives/surfing/" className="inline-flex items-center gap-1.5 font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                <CompassIcon className="h-4 w-4" /> Surfing
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Getting Around */}
      {transferRoutes.items.length > 0 && (
        <section className="bg-sand-50 py-14 sm:py-20">
          <Container>
            <SectionHeader
              eyebrow="Getting around"
              title="Transfers between islands"
              description="Speedboats, ferries, seaplanes and domestic flights — with real operators and prices where available."
              action={{ label: "View all transfers", href: "/maldives/transfers/" }}
            />
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {transferRoutes.items.map((route) => (
                <TransferRouteCard key={route.id} route={route} />
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Packages — deliberately not padded out with invented entries; the
          section is designed to look complete with a small, real dataset. */}
      {packages.items.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeader
              eyebrow="Packages"
              title="Ready-made Maldives itineraries"
              description="Multi-day itineraries built entirely from real, verified accommodation, activities and transfers."
              action={{ label: "View all packages", href: "/maldives/packages/" }}
            />
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {packages.items.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Travel Guide — no article content exists yet; an honest teaser
          rather than a link to a page (or fabricated posts) that don't
          exist. */}
      <section className="bg-sand-50 py-14 sm:py-20">
        <Container>
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lagoon-100 text-maldives-600">
                <BookIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-maldives-600">Travel Guide</p>
                <h2 className="mt-1 text-xl font-semibold text-ocean-900">In-depth Maldives travel guides — coming soon</h2>
                <p className="mt-1 max-w-xl text-sm text-neutral-600">
                  We&rsquo;re building out detailed guides to plan your trip. Until then, every destination, resort,
                  and activity page on MTG already carries real, up-to-date travel information.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-ocean-900 to-maldives-600 py-14 text-white sm:py-20">
        <Container className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Planning a trip to the Maldives?</h2>
            <p className="mt-2 max-w-xl text-lagoon-100">
              Browse real atolls, islands, resorts and activities, or message us directly on WhatsApp for help
              planning your trip.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href="/maldives/" variant="inverted">
              Start exploring
            </Button>
            <Button href={WHATSAPP_URL} variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/20" target="_blank" rel="noopener noreferrer">
              WhatsApp us
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
