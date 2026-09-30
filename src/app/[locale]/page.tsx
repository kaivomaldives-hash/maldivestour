import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { ActivityCard } from "@/components/activity/activity-card";
import { ArticleCard } from "@/components/articles/article-card";
import { AttractionCard } from "@/components/attractions/attraction-card";
import { PackageCard } from "@/components/packages/package-card";
import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { Button } from "@/components/ui/button";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CompassIcon, DivingIcon, FishIcon, MapPinIcon } from "@/components/ui/icons";
import { MediaImage } from "@/components/ui/media-image";
import { SectionHeader } from "@/components/ui/section-header";
import { getAccommodations } from "@/lib/accommodations/repository";
import { getActivities } from "@/lib/activities/repository";
import { getRecentArticles } from "@/lib/articles/repository";
import { getAttractions } from "@/lib/attractions/repository";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getPageTranslation, getPublishedLocalesForPage } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getAtolls } from "@/lib/locations/repository";
import { getFeaturedPackageViews } from "@/lib/packages/view-repository";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";
import { getTransferRoutes } from "@/lib/transfers/repository";

export const revalidate = 3600;

const WHATSAPP_URL = "https://wa.me/9607794332";

/**
 * Mirrors the real English homepage's section structure
 * (src/app/page.tsx) — same live queries, same card components, same
 * number of sections. Only the surrounding copy (headings, eyebrows,
 * descriptions, CTA labels) is localized via getUiStrings(); the
 * listings themselves (resort names, activity titles, etc.) render
 * their real, un-translated data, same as the English page does. This
 * keeps the German homepage at real content parity with English without
 * requiring every individual accommodation/activity/package to have its
 * own German translation row first (that's separate, larger follow-up
 * work -- see the Task 19 final report's "remaining work" section).
 */
async function loadOrNotFound(locale: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const translation = await getPageTranslation("homepage", locale);
  if (!translation) notFound(); // Not published yet -- never serve an English-content page under a locale URL.
  return { locale: locale as Locale, translation };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const translation = await getPageTranslation("homepage", locale);
  if (!translation) return {};

  const publishedLocales = await getPublishedLocalesForPage("homepage");
  const ui = getUiStrings(locale as Locale);
  const title = translation.metaTitle ?? translation.title;
  const description = translation.metaDescription ?? ui.home.heroDescription;
  const url = localizedCanonicalUrl(locale, "/");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/", publishedLocales) },
    openGraph: { title, description, url, locale },
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const { locale } = await loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);
  const h = ui.home;

  const [atolls, accommodations, activities, attractions, transferRoutes, packages, articles] = await Promise.all([
    getAtolls(),
    getAccommodations({ type: "resort", pageSize: 6 }),
    getActivities({ pageSize: 6 }),
    getAttractions({ pageSize: 6 }),
    getTransferRoutes({ pageSize: 4 }),
    getFeaturedPackageViews(6),
    getRecentArticles(3),
  ]);

  const islandCount = atolls.reduce((sum, atoll) => sum + atoll.islandCount, 0);
  const featuredAtolls = atolls.slice(0, 6);

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-ocean-950 via-ocean-800 to-maldives-600 text-white">
        <Container className="py-16 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-lagoon-200">{h.heroEyebrow}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">{h.heroTitle}</h1>
          <p className="mt-4 max-w-xl text-lg text-lagoon-100">{h.heroDescription}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={`/${locale}/maldives/`} variant="inverted" size="md">
              {h.ctaExplore}
            </Button>
            <Button href="/maldives/packages/" variant="secondary" size="md" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              {h.ctaPackages}
            </Button>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-lagoon-100">
            <div>
              <dd>
                <span className="text-lg font-semibold text-white">{atolls.length}</span> {h.statsAtolls}
              </dd>
            </div>
            <div>
              <dd>
                <span className="text-lg font-semibold text-white">{islandCount}</span> {h.statsIslands}
              </dd>
            </div>
            <div>
              <dd>
                <span className="text-lg font-semibold text-white">{accommodations.total}+</span> {h.statsStays}
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      {featuredAtolls.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeader eyebrow={h.destinationsEyebrow} title={h.destinationsTitle} description={h.destinationsDescription} action={{ label: h.destinationsCta, href: "/maldives/atolls/" }} />
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {featuredAtolls.map((atoll) => (
                <li key={atoll.id} className={CARD_CLASS}>
                  <Link href={`/maldives/atolls/${atoll.slug}/`} className="group flex h-full flex-col justify-between">
                    {atoll.heroImage ? (
                      <div className={CARD_IMAGE_BLEED_CLASS}>
                        <MediaImage asset={atoll.heroImage} alt={atoll.title} aspectClassName="aspect-square" />
                      </div>
                    ) : (
                      <MapPinIcon className="h-5 w-5 text-maldives-600" />
                    )}
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

      {accommodations.items.length > 0 && (
        <section className="bg-sand-50 py-14 sm:py-20">
          <Container>
            <SectionHeader eyebrow={h.staysEyebrow} title={h.staysTitle} description={h.staysDescription} action={{ label: h.staysCta, href: "/maldives/resorts/" }} />
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {accommodations.items.map((accommodation) => (
                <AccommodationCard key={accommodation.id} accommodation={accommodation} />
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link href="/maldives/hotels/" className="font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                {h.staysHotelsLink} →
              </Link>
              <Link href="/maldives/guesthouses/" className="font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                {h.staysGuesthousesLink} →
              </Link>
            </div>
          </Container>
        </section>
      )}

      {activities.items.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeader eyebrow={h.activitiesEyebrow} title={h.activitiesTitle} description={h.activitiesDescription} action={{ label: h.activitiesCta, href: "/maldives/activities/" }} />
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activities.items.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href="/maldives/diving/" className="inline-flex items-center gap-1.5 font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                <DivingIcon className="h-4 w-4" /> {h.divingLink}
              </Link>
              <Link href="/maldives/fishing/" className="inline-flex items-center gap-1.5 font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                <FishIcon className="h-4 w-4" /> {h.fishingLink}
              </Link>
              <Link href="/maldives/surfing/" className="inline-flex items-center gap-1.5 font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                <CompassIcon className="h-4 w-4" /> {h.surfingLink}
              </Link>
            </div>
          </Container>
        </section>
      )}

      {attractions.items.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeader eyebrow={h.attractionsEyebrow} title={h.attractionsTitle} description={h.attractionsDescription} action={{ label: h.attractionsCta, href: "/maldives/attractions/" }} />
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {attractions.items.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </ul>
          </Container>
        </section>
      )}

      {transferRoutes.items.length > 0 && (
        <section className="bg-sand-50 py-14 sm:py-20">
          <Container>
            <SectionHeader eyebrow={h.transfersEyebrow} title={h.transfersTitle} description={h.transfersDescription} action={{ label: h.transfersCta, href: "/maldives/transfers/" }} />
            <nav aria-label="Transfer categories" className="mt-4 flex flex-wrap gap-2">
              {[
                { href: "/maldives/airport-transfers/", label: h.transferCategoryAirport },
                { href: "/maldives-speedboats-charter/", label: h.transferCategorySpeedboat },
                { href: "/maldives/island-transfers/", label: h.transferCategoryIsland },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                  {link.label}
                </Link>
              ))}
            </nav>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {transferRoutes.items.map((route) => (
                <TransferRouteCard key={route.id} route={route} />
              ))}
            </ul>
          </Container>
        </section>
      )}

      {packages.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeader eyebrow={h.packagesEyebrow} title={h.packagesTitle} description={h.packagesDescription} action={{ label: h.packagesCta, href: "/maldives/packages/" }} />
            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </ul>
          </Container>
        </section>
      )}

      {articles.length > 0 && (
        <section className="bg-sand-50 py-14 sm:py-20">
          <Container>
            <SectionHeader eyebrow={h.guideEyebrow} title={h.guideTitle} description={h.guideDescription} action={{ label: h.guideCta, href: "/maldives/travel-guide/" }} />
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="bg-gradient-to-br from-ocean-900 to-maldives-600 py-14 text-white sm:py-20">
        <Container className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">{h.finalCtaTitle}</h2>
            <p className="mt-2 max-w-xl text-lagoon-100">{h.finalCtaDescription}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href={`/${locale}/maldives/`} variant="inverted">
              {h.finalCtaExplore}
            </Button>
            <Button href={WHATSAPP_URL} variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/20" target="_blank" rel="noopener noreferrer">
              {h.finalCtaWhatsapp}
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
