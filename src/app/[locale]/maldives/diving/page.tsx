import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { FaqSection } from "@/components/ui/faq-section";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import type { ActivitySummary } from "@/lib/activities/types";
import { getDivingActivities } from "@/lib/diving/repository";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getPageTranslation, getPublishedLocalesForPage, localizedEntityHref } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 3860;

/**
 * Mirrors the real English diving hub's section structure
 * (src/components/diving/diving-directory-page.tsx) in simplified form
 * -- same pattern as the fishing hub (src/app/[locale]/maldives/fishing/page.tsx):
 * a featured-trips query and FAQ, with only the surrounding copy
 * localized. Deliberately omits dive sites (a separate location-type
 * vertical, src/app/maldives/dive-sites/) and the full filter bar --
 * out of scope for this pass; this page links out to the English hub.
 */
const EXPLORE_MORE_LINKS = [
  { href: "/maldives/fishing/", labelKey: "fishing", translatedHub: true },
  { href: "/maldives/activities/", labelKey: "activities", translatedHub: true },
  { href: "/maldives/packages/", labelKey: "packages", translatedHub: true },
  { href: "/maldives/travel-guide/", labelKey: "travelGuide", translatedHub: true },
] as const;

async function loadOrNotFound(locale: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const translation = await getPageTranslation("diving-hub", locale);
  if (!translation) notFound();
  return { locale: locale as Locale, translation };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const translation = await getPageTranslation("diving-hub", locale);
  if (!translation) return {};

  const publishedLocales = await getPublishedLocalesForPage("diving-hub");
  const title = translation.metaTitle ?? translation.title;
  const description = translation.metaDescription ?? translation.title;
  const url = localizedCanonicalUrl(locale, "/maldives/diving/");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/diving/", publishedLocales) },
    openGraph: { title, description, url, locale },
  };
}

async function ActivityCardList({ locale, items }: { locale: Locale; items: ActivitySummary[] }) {
  const hrefs = await Promise.all(items.map((a) => localizedEntityHref(locale, a.id, a.slug, "/maldives/diving/")));
  return (
    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a, i) => (
        <li key={a.id} className={CARD_CLASS}>
          {a.heroImage && (
            <div className={CARD_IMAGE_BLEED_CLASS}>
              <MediaImage asset={a.heroImage} alt={a.title} aspectClassName="aspect-[4/3]" />
            </div>
          )}
          <Link href={hrefs[i]} className="text-lg font-medium text-ocean-900 hover:text-maldives-600">
            {a.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function LocaleDivingHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const { locale } = await loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);
  const h = ui.divingHub;

  const { items: featured } = await getDivingActivities({ pageSize: 8 });

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: ui.breadcrumbHome, href: `/${locale}/` }, { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") }, { label: ui.nav.diving }]}
        eyebrow={h.heroEyebrow}
        title={h.title}
        description={h.description}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <section className="prose-sm max-w-none text-sm text-neutral-700">
          <p>{h.introP1}</p>
          <p className="mt-3">{h.introP2}</p>
          <p className="mt-3">
            <Link href="/maldives/diving/" className="font-medium text-maldives-600 hover:underline">
              {ui.nav.diving} (English) →
            </Link>
          </p>
        </section>

        {featured.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{h.featuredTitle}</h2>
            <ActivityCardList locale={locale} items={featured} />
          </section>
        )}

        <FaqSection faqs={h.faqs} title={h.faqTitle} className="mt-12 border-t border-neutral-200 pt-10" />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{h.exploreMoreTitle}</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            {EXPLORE_MORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.translatedHub ? localizeHubPath(locale, link.href) : link.href}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {ui.nav[link.labelKey]}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
