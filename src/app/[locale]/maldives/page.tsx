import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { IslandCard } from "@/components/locations/island-card";
import { CARD_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MapPinIcon } from "@/components/ui/icons";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getPageTranslation, getPublishedLocalesForPage } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getAtolls, getIslandBySlug } from "@/lib/locations/repository";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

export const revalidate = 3600;

/**
 * Mirrors the real English Maldives hub's section structure
 * (src/app/maldives/page.tsx) — same live atoll/island queries, same
 * card components, same explainer sections. Only the surrounding copy
 * is localized (getUiStrings().maldivesHub); atoll/island titles
 * themselves stay as their real, un-translated location data, same as
 * every other card on this page. The "Explore More Maldives" links
 * below still point at plain English URLs (those sections don't have
 * their own /{locale}/... translation yet) — never a fabricated German
 * URL for content that doesn't exist (Task 19 §16/§29).
 */
const EXPLORE_MORE_LINKS = [
  { href: "/maldives/activities/", labelKey: "activities" },
  { href: "/maldives/diving/", labelKey: "diving" },
  { href: "/maldives/fishing/", labelKey: "fishing" },
  { href: "/maldives/resorts/", labelKey: "stays" },
  { href: "/maldives/transfers/", labelKey: "transfers" },
  { href: "/maldives/packages/", labelKey: "packages" },
  { href: "/maldives/travel-guide/", labelKey: "travelGuide" },
] as const;

const FEATURED_ISLAND_SLUGS = ["thulusdhoo", "maafushi", "dhigurah", "ukulhas", "fuvahmulah", "gan"];

async function loadOrNotFound(locale: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const translation = await getPageTranslation("maldives-hub", locale);
  if (!translation) notFound();
  return { locale: locale as Locale, translation };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const translation = await getPageTranslation("maldives-hub", locale);
  if (!translation) return {};

  const publishedLocales = await getPublishedLocalesForPage("maldives-hub");
  const title = translation.metaTitle ?? translation.title;
  const description = translation.metaDescription ?? translation.title;
  const url = localizedCanonicalUrl(locale, "/maldives/");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/", publishedLocales) },
    openGraph: { title, description, url, locale },
  };
}

export default async function LocaleMaldivesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const { locale } = await loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);
  const h = ui.maldivesHub;

  const [atolls, featuredIslandResults] = await Promise.all([
    getAtolls(),
    Promise.all(FEATURED_ISLAND_SLUGS.map((slug) => getIslandBySlug(slug))),
  ]);
  const totalIslands = atolls.reduce((sum, atoll) => sum + atoll.islandCount, 0);
  const featuredIslands = featuredIslandResults.filter((i): i is NonNullable<typeof i> => i !== null);

  return (
    <main>
      <PageHero
        variant="ocean"
        eyebrow={h.heroEyebrow}
        title={ui.nav.maldives}
        breadcrumbs={[{ label: ui.breadcrumbHome, href: `/${locale}/` }, { label: ui.nav.maldives }]}
        meta={
          <>
            <span>
              <strong className="font-semibold text-white">{atolls.length}</strong> {h.statsAtolls}
            </span>
            <span>
              <strong className="font-semibold text-white">{totalIslands}</strong> {h.statsIslands}
            </span>
          </>
        }
      />

      <div className={`${CONTAINER_CLASS} py-12 sm:py-16`}>
        <section className="prose-sm max-w-none text-sm text-neutral-700">
          <p>
            {h.introPrefix}
            {totalIslands}
            {h.introMiddle}
            {atolls.length}
            {h.introSuffix}
          </p>
        </section>

        <div className="mt-10">
          <SectionHeader eyebrow={h.atollsEyebrow} title={h.atollsTitle} description={h.atollsDescription} action={{ label: h.atollsCta, href: "/maldives/atolls/" }} />
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {atolls.map((atoll) => (
              <li key={atoll.id} className={CARD_CLASS}>
                <Link href={`/maldives/atolls/${atoll.slug}/`} className="flex items-center gap-3">
                  {atoll.heroImage ? (
                    <div className="w-14 shrink-0 overflow-hidden rounded-lg">
                      <MediaImage asset={atoll.heroImage} alt={atoll.title} aspectClassName="aspect-square" />
                    </div>
                  ) : (
                    <MapPinIcon className="h-5 w-5 shrink-0 text-maldives-600" />
                  )}
                  <span>
                    <span className="block font-medium text-ocean-900">{atoll.title}</span>
                    <span className="text-xs text-neutral-500">
                      {atoll.islandCount} island{atoll.islandCount === 1 ? "" : "s"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {featuredIslands.length > 0 && (
          <div className="mt-12">
            <SectionHeader title={h.islandsTitle} description={h.islandsDescription} action={{ label: h.islandsCta, href: "/maldives/islands/" }} />
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredIslands.map((island) => (
                <IslandCard key={island.id} island={island} />
              ))}
            </ul>
          </div>
        )}

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{h.localIslandsTitle}</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 text-sm text-neutral-700 sm:grid-cols-2">
            <p>{h.localIslandsP1}</p>
            <p>{h.localIslandsP2}</p>
          </div>
          <p className="mt-4 text-sm text-neutral-600">
            <Link href="/maldives/islands/" className="font-medium text-maldives-600 hover:underline">
              {h.localIslandsCtaIslands}
            </Link>{" "}
            {h.localIslandsCtaOr}{" "}
            <Link href="/maldives/guesthouses/" className="font-medium text-maldives-600 hover:underline">
              {h.localIslandsCtaGuesthouses}
            </Link>
            .
          </p>
        </section>

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{h.exploreMoreTitle}</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            {EXPLORE_MORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {ui.nav[link.labelKey]}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-sm text-neutral-500">
            {/* Honest about the current rollout stage rather than silently mixing languages without explanation. */}
            {locale === "de" ? "Diese Bereiche sind derzeit nur auf Englisch verfügbar — weitere Übersetzungen folgen." : null}
          </p>
        </section>
      </div>
    </main>
  );
}
