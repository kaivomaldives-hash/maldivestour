import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PackageCard } from "@/components/packages/package-card";
import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { FaqSection } from "@/components/ui/faq-section";
import { LocationMap } from "@/components/locations/location-map";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { bookingCta, FISHING_PACKAGE_CTA } from "@/lib/bookings/copy";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/locales";
import { getEntityLocalePaths } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getRelatedPackageViews, getTranslatedPackageViewBySlug } from "@/lib/packages/view-repository";
import { PACKAGE_CATEGORY_TITLE } from "@/lib/packages/view-types";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/public";
import { extractYoutubeId } from "@/lib/youtube";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4590;

interface Params {
  locale: string;
  package: string;
}

/**
 * Localized equivalent of src/app/maldives/packages/[package]/page.tsx
 * (and package-detail-page.tsx). `package` here is the *translated*
 * slug (translations.slug), resolved via getTranslatedPackageViewBySlug
 * -- never the canonical English slug.
 *
 * Deliberately simpler than the English page: only
 * title/shortDescription/description are translated (the translations
 * table has no equivalent fields for highlights/included/excluded/
 * itinerary/FAQs yet), so those sections render their real English
 * data, same convention as every other partially-translated vertical.
 * The guest-count price table (MFH_PRICE_TABLES) and contextual
 * auto-linking are both skipped here, same reasoning as the [locale]
 * article route (entity-name matching isn't reliable against
 * translated/mixed-language prose). Only real packages are ever
 * translated -- demo packages 404.
 */
async function getEnglishSlug(entityId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("nodes").select("slug").eq("id", entityId).maybeSingle<{ slug: string }>();
  return data?.slug ?? null;
}

async function loadOrNotFound(locale: string, slug: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const pkg = await getTranslatedPackageViewBySlug(locale, slug);
  if (!pkg) notFound();
  return { locale: locale as Locale, pkg };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, package: slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const pkg = await getTranslatedPackageViewBySlug(locale, slug);
  if (!pkg) return {};

  const title = `${pkg.title} | ${pkg.nights ?? "?"} ${getUiStrings(locale).packageDetail.nightsDays}`;
  const description = pkg.shortDescription ?? undefined;
  const url = localizedPath(locale, `/maldives/packages/${pkg.slug}/`);
  const englishSlug = (await getEnglishSlug(pkg.id)) ?? pkg.slug;
  const paths = await getEntityLocalePaths(pkg.id, englishSlug, "/maldives/packages/");
  const languages: Record<string, string> = {};
  for (const [loc, path] of Object.entries(paths)) languages[loc] = canonicalUrl(path);
  languages["x-default"] = languages.en;

  return {
    title,
    description,
    alternates: { canonical: `${canonicalUrl(url)}`, languages },
    openGraph: { title, description, url: canonicalUrl(url) },
  };
}

export default async function LocalePackageDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, package: slug } = await params;
  const { locale, pkg } = await loadOrNotFound(rawLocale, slug);
  const ui = getUiStrings(locale);
  const d = ui.packageDetail;

  const [related, englishSlug] = await Promise.all([getRelatedPackageViews(pkg, 6), getEnglishSlug(pkg.id)]);
  const youtubeId = pkg.youtubeId ? extractYoutubeId(pkg.youtubeId) : null;
  const priceTypeLabel = pkg.priceType === "per-person" ? d.perPerson : pkg.priceType === "per-couple" ? d.perCouple : pkg.priceType === "per-package" ? d.perPackage : null;

  const breadcrumb = breadcrumbJsonLd(
    [
      { label: ui.nav.maldives, href: `/${locale}/maldives/` },
      { label: ui.nav.packages, href: `/${locale}/maldives/packages/` },
      { label: pkg.title },
    ],
    localizedPath(locale, `/maldives/packages/${pkg.slug}`),
  );

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumb) }} />

      <PageHero
        breadcrumbs={[
          { label: ui.nav.maldives, href: `/${locale}/maldives/` },
          { label: ui.nav.packages, href: `/${locale}/maldives/packages/` },
          { label: pkg.title },
        ]}
        eyebrow={d.eyebrow}
        title={pkg.title}
        description={pkg.shortDescription ?? undefined}
        image={pkg.heroImage}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            {pkg.categories.map((c) => (
              <Link key={c} href={`/maldives/packages/${c}/`} className="rounded-full border border-white/40 px-2.5 py-1 text-xs text-white hover:bg-white/10">
                {PACKAGE_CATEGORY_TITLE[c]}
              </Link>
            ))}
          </div>
        }
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-neutral-200 p-5">
          <div>
            {pkg.nights !== null && (
              <p className="text-xl font-semibold text-ocean-900">
                {pkg.nights} {d.nightsDays}
              </p>
            )}
            <p className="mt-1 text-lg text-neutral-800">
              {pkg.price !== null ? (
                <>
                  {d.fromPrice} <span className="font-semibold text-ocean-900">{pkg.currency ?? "USD"} {pkg.price.toLocaleString()}</span>{" "}
                  {priceTypeLabel && <span className="text-sm text-neutral-500">{priceTypeLabel}</span>}
                </>
              ) : (
                d.quoteOnRequest
              )}
            </p>
          </div>
          <NodeInquiryToggle
            productNodeId={pkg.id}
            productTitle={pkg.title}
            source={pkg.categories.includes("fishing") ? "fishing" : "package"}
            {...(pkg.categories.includes("fishing") ? FISHING_PACKAGE_CTA : bookingCta("package"))}
          />
        </div>

        {pkg.description && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.overviewTitle}</h2>
            <p className="mt-2 text-sm text-neutral-700">{pkg.description}</p>
          </section>
        )}

        {pkg.images.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-ocean-900">{d.galleryTitle}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {pkg.images.map((image) => (
                <MediaImage key={image.id} asset={image} alt={pkg.title} aspectClassName="aspect-[4/3]" />
              ))}
            </div>
          </section>
        )}

        {youtubeId && (
          <section className="mt-8">
            <div className="mt-3 aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={pkg.title}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {pkg.highlights.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-ocean-900">{d.highlightsTitle}</h2>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {pkg.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span aria-hidden="true" className="mt-0.5 text-maldives-600">
                    &#10003;
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {pkg.bestFor.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-ocean-900">{d.bestForTitle}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {pkg.bestFor.map((b) => (
                <span key={b} className="rounded-full bg-lagoon-50 px-3 py-1 text-sm text-ocean-800">
                  {b}
                </span>
              ))}
            </div>
          </section>
        )}

        {pkg.itinerary.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.itineraryTitle}</h2>
            <ol className="mt-4 space-y-4">
              {pkg.itinerary.map((day) => (
                <li key={day.dayLabel} className={CARD_CLASS}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-medium text-ocean-900">{day.title}</h3>
                    <span className="text-sm text-neutral-500">{day.dayLabel}</span>
                  </div>
                  {day.description && <p className="mt-2 text-sm text-neutral-700">{day.description}</p>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {pkg.accommodations.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.accommodationTitle}</h2>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pkg.accommodations.map((a) => (
                <li key={a.accommodation.id} className={CARD_CLASS}>
                  {a.accommodation.heroImage && (
                    <div className={CARD_IMAGE_BLEED_CLASS}>
                      <MediaImage asset={a.accommodation.heroImage} alt={a.accommodation.title} aspectClassName="aspect-[16/10]" />
                    </div>
                  )}
                  <Link href={a.href} className="font-medium text-ocean-900 hover:text-maldives-600">
                    {a.accommodation.title}
                  </Link>
                  {a.accommodation.primaryLocation && <p className="mt-1 text-sm text-neutral-600">{a.accommodation.primaryLocation.title}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {pkg.included.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-ocean-900">{d.includedTitle}</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-neutral-700">
                {pkg.included.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-0.5 text-maldives-600">
                      &#10003;
                    </span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {pkg.excluded.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-ocean-900">{d.excludedTitle}</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-neutral-700">
                {pkg.excluded.map((e) => (
                  <li key={e} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-0.5 text-neutral-400">
                      &#10005;
                    </span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {pkg.activities.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.activitiesTitle}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {pkg.activities.map((a) => (
                <li key={a.activity.id}>
                  <Link href={a.href} className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                    {a.activity.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {pkg.destinations.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-ocean-900">{d.destinationTitle}</h2>
            <p className="mt-2 flex flex-wrap gap-x-1 text-sm text-neutral-700">
              {pkg.destinations.map((loc, i) => (
                <span key={loc.id}>
                  {i > 0 && ", "}
                  <Link href={loc.locationType === "atoll" ? `/maldives/atolls/${loc.slug}/` : `/maldives/islands/${loc.slug}/`} className="text-maldives-600 hover:underline">
                    {loc.title}
                  </Link>
                </span>
              ))}
            </p>
            {pkg.destinations[0]?.lat !== null && pkg.destinations[0]?.lng !== null && (
              <LocationMap title={pkg.destinations[0].title} lat={pkg.destinations[0].lat} lng={pkg.destinations[0].lng} />
            )}
          </section>
        )}

        <FaqSection faqs={pkg.faqs} title={d.faqTitle} />

        {related.length > 0 && (
          <section className="mt-12 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.relatedTitle}</h2>
            <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <PackageCard key={r.slug} pkg={r} />
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{d.exploreMoreTitle}</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            <Link href="/maldives/packages/" className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
              {d.allPackagesLink}
            </Link>
            {pkg.categories.map((c) => (
              <Link key={c} href={`/maldives/packages/${c}/`} className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                {PACKAGE_CATEGORY_TITLE[c]}
              </Link>
            ))}
            {englishSlug && (
              <Link
                href={`/maldives/packages/${englishSlug}/`}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {d.englishVersionLink}
              </Link>
            )}
          </nav>
        </section>
      </div>
    </main>
  );
}
