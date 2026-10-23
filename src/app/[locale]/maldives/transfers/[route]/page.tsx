import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { Price } from "@/components/currency/price";
import { RegisterEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { RouteGallerySection } from "@/components/transfers/route-gallery-section";
import { RouteMap } from "@/components/transfers/route-map";
import { RouteVideo } from "@/components/transfers/route-video";
import { buildRouteFaqs } from "@/components/transfers/transfer-route-detail-page";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { FaqSection } from "@/components/ui/faq-section";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { isSupportedCurrency } from "@/lib/currency/types";
import { getChromeStrings } from "@/lib/i18n/chrome-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getEntityLocalePaths, localizedEntityHref } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getLocationBySlug } from "@/lib/locations/repository";
import { getMediaForNode } from "@/lib/media/repository";
import { getPackageViewsByTransferRoute } from "@/lib/packages/view-repository";
import type { PackageView } from "@/lib/packages/view-types";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/public";
import {
  getTransferRouteBySlug,
  getTransferRoutesByAtoll,
  getTransferRoutesByDestination,
  getTransferRoutesByOrigin,
  getTranslatedTransferRouteViewBySlug,
} from "@/lib/transfers/repository";
import type { SharedOrPrivate, TransferRouteSummary, TransferService, TransferType } from "@/lib/transfers/types";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4710;

interface Params {
  locale: string;
  route: string;
}

/**
 * Localized equivalent of src/app/maldives/transfers/[route]/page.tsx
 * (and transfer-route-detail-page.tsx). `route` here is the *translated*
 * slug (translations.slug), resolved via
 * getTranslatedTransferRouteViewBySlug -- never the canonical English
 * slug.
 *
 * Deliberately simpler than the English page: only title/summary are
 * translated (the translations table has no equivalent fields for
 * per-service pickup/dropoff/cancellation text or FAQs yet), so the
 * service list and FAQs render their real English data, same convention
 * as the [locale] package route. Reverse route, related routes, and
 * packages using this route all resolve to their OWN translated URL
 * when one exists for this locale (via getEntityLocalePaths), falling
 * back to the plain English URL otherwise -- never a fabricated
 * translated link. Origin/destination locations have no translated
 * route yet, so those links always fall back to English for now.
 */
function formatDuration(minutes: number | null, locale: Locale): string | null {
  if (!minutes) return null;
  const units = getChromeStrings(locale);
  if (minutes < 60) return units.minutes.replace("{n}", String(minutes));
  const hours = minutes / 60;
  return units.hours.replace("{n}", Number.isInteger(hours) ? String(hours) : hours.toFixed(1));
}

async function getEnglishSlug(entityId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("nodes").select("slug").eq("id", entityId).maybeSingle<{ slug: string }>();
  return data?.slug ?? null;
}

async function loadOrNotFound(locale: string, slug: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const route = await getTranslatedTransferRouteViewBySlug(locale, slug);
  if (!route) notFound();
  return { locale: locale as Locale, route };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, route: slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const route = await getTranslatedTransferRouteViewBySlug(locale, slug);
  if (!route) return {};

  const title = route.title;
  const description = route.summary ?? undefined;
  const url = localizeHubPath(locale, `/maldives/transfers/${route.slug}/`);
  const englishSlug = (await getEnglishSlug(route.id)) ?? route.slug;
  const paths = await getEntityLocalePaths(route.id, englishSlug, "/maldives/transfers/");
  const languages: Record<string, string> = {};
  for (const [loc, path] of Object.entries(paths)) languages[loc] = canonicalUrl(path);
  languages["x-default"] = languages.en;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(url), languages },
    openGraph: { title, description, url: canonicalUrl(url) },
  };
}

function ServiceCard({ service, d, locale }: { service: TransferService; d: ReturnType<typeof getUiStrings>["transferDetail"]; locale: Locale }) {
  const duration = formatDuration(service.durationMinutes, locale);
  const TYPE_LABEL: Record<TransferType, string> = {
    speedboat: d.typeSpeedboat,
    seaplane: d.typeSeaplane,
    domestic_flight: d.typeDomesticFlight,
    ferry: d.typeFerry,
    private_yacht: d.typePrivateYacht,
    land_transfer: d.typeLandTransfer,
  };
  const MODE_LABEL: Record<SharedOrPrivate, string> = { shared: d.modeShared, private: d.modePrivate };

  return (
    <li className={CARD_CLASS}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-lg font-medium">{service.provider ? service.provider.title : "—"}</span>
        <span className="text-lg font-semibold">
          {isSupportedCurrency(service.currency) ? <Price baseAmount={service.price} baseCurrency={service.currency} /> : `${service.currency} ${service.price}`}
        </span>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
        <span>{TYPE_LABEL[service.transferType]}</span>
        <span>{MODE_LABEL[service.sharedOrPrivate]}</span>
        {duration && <span>{duration}</span>}
      </div>
    </li>
  );
}

export default async function LocaleTransferRouteDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, route: slug } = await params;
  const { locale, route } = await loadOrNotFound(rawLocale, slug);
  const ui = getUiStrings(locale);
  const d = ui.transferDetail;

  const reverseEnglishSlug = route.origin && route.destination ? `${route.destination.slug}-to-${route.origin.slug}` : null;
  const [packages, originRoutes, destinationRoutes, atollRoutes, originDetail, destinationDetail, media, englishSlug, reverseCanonical] = await Promise.all([
    getPackageViewsByTransferRoute(route.id),
    route.origin ? getTransferRoutesByOrigin(route.origin.id) : Promise.resolve([]),
    route.destination ? getTransferRoutesByDestination(route.destination.id) : Promise.resolve([]),
    route.origin?.parentId ? getTransferRoutesByAtoll(route.origin.parentId) : Promise.resolve([]),
    route.origin ? getLocationBySlug(route.origin.slug) : Promise.resolve(null),
    route.destination ? getLocationBySlug(route.destination.slug) : Promise.resolve(null),
    getMediaForNode(route.id),
    getEnglishSlug(route.id),
    reverseEnglishSlug ? getTransferRouteBySlug(reverseEnglishSlug) : Promise.resolve(null),
  ]);
  const localePaths = await getEntityLocalePaths(route.id, englishSlug ?? route.slug, "/maldives/transfers/");
  const galleryImages = media.filter((m) => m.role === "gallery").map((m) => m.asset);

  const relatedRoutes = [...originRoutes, ...destinationRoutes, ...atollRoutes]
    .filter((r) => r.id !== route.id)
    .filter((r, index, all) => all.findIndex((x) => x.id === r.id) === index)
    .slice(0, 6);

  const [relatedHrefs, packageHrefs, reverseHref] = await Promise.all([
    Promise.all(relatedRoutes.map((r) => localizedEntityHref(locale, r.id, r.slug, "/maldives/transfers/"))),
    Promise.all(packages.map((p) => localizedEntityHref(locale, p.id, p.slug, "/maldives/packages/"))),
    reverseCanonical ? localizedEntityHref(locale, reverseCanonical.id, reverseCanonical.slug, "/maldives/transfers/") : Promise.resolve(null),
  ]);

  const duration = formatDuration(route.typicalDurationMinutes, locale);
  const hasPrivateService = route.services.some((s) => s.sharedOrPrivate === "private" && s.isBookable);

  const breadcrumb = breadcrumbJsonLd(
    [
      { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
      { label: ui.nav.transfers, href: localizeHubPath(locale, "/maldives/transfers/") },
      { label: route.title },
    ],
    localizeHubPath(locale, `/maldives/transfers/${route.slug}`),
  );

  return (
    <main>
      <RegisterEntityLocaleLinks paths={localePaths} fallbackHubPath="/maldives/transfers/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumb) }} />

      <PageHero
        breadcrumbs={[
          { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
          { label: ui.nav.transfers, href: localizeHubPath(locale, "/maldives/transfers/") },
          { label: route.title },
        ]}
        eyebrow={d.eyebrow}
        title={route.title}
        description={route.summary ?? undefined}
        image={route.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          {route.origin && (
            <div>
              <dt className="text-neutral-500">{d.fromLabel}</dt>
              <dd className="font-medium">{route.origin.title}</dd>
            </div>
          )}
          {route.destination && (
            <div>
              <dt className="text-neutral-500">{d.toLabel}</dt>
              <dd className="font-medium">{route.destination.title}</dd>
            </div>
          )}
          {duration && (
            <div>
              <dt className="text-neutral-500">{d.durationLabel}</dt>
              <dd className="font-medium">{duration}</dd>
            </div>
          )}
          {route.distanceKm !== null && (
            <div>
              <dt className="text-neutral-500">{d.distanceLabel}</dt>
              <dd className="font-medium">{route.distanceKm} km</dd>
            </div>
          )}
        </dl>

        {reverseHref && reverseCanonical && (
          <p className="mt-3 text-sm text-neutral-600">
            {d.reverseRoutePrompt}{" "}
            <Link href={reverseHref} className="underline">
              {reverseCanonical.title} →
            </Link>
          </p>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{d.servicesTitle}</h2>
          {route.services.length === 0 ? (
            <p className="mt-2 text-sm text-neutral-600">{d.noServicesNote}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {route.services.map((service) => (
                <ServiceCard key={service.id} service={service} d={d} locale={locale} />
              ))}
            </ul>
          )}
        </section>

        {!hasPrivateService && route.isBookableForPrivateInquiry && (
          <section className="mt-10 rounded-2xl border border-neutral-200 p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-ocean-900">{d.privateTransferTitle}</h2>
            <p className="mt-2 text-sm text-neutral-700">{d.privateTransferBody}</p>
            <NodeInquiryToggle
              productNodeId={route.id}
              productTitle={`${route.title} (${d.privateTransferTitle})`}
              source="transfer"
              submitLabel={d.privateTransferCta}
              toggleLabel={d.privateTransferCta}
            />
          </section>
        )}

        {packages.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.packagesUsingRouteTitle}</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {packages.map((pkg: PackageView, i) => (
                <li key={pkg.id} className={CARD_CLASS}>
                  {pkg.heroImage && (
                    <div className={CARD_IMAGE_BLEED_CLASS}>
                      <MediaImage asset={pkg.heroImage} alt={pkg.title} aspectClassName="aspect-[4/3]" />
                    </div>
                  )}
                  <Link href={packageHrefs[i]} className="font-medium text-ocean-900 hover:text-maldives-600">
                    {pkg.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <RouteGallerySection images={galleryImages} routeTitle={route.title} />

        <RouteVideo />

        <RouteMap
          originTitle={route.origin?.title ?? "Origin"}
          originLat={originDetail?.lat ?? null}
          originLng={originDetail?.lng ?? null}
          destinationTitle={route.destination?.title ?? route.title}
          destinationLat={destinationDetail?.lat ?? null}
          destinationLng={destinationDetail?.lng ?? null}
        />

        <FaqSection faqs={buildRouteFaqs(route)} title={d.faqTitle} className="mt-10" />

        {relatedRoutes.length > 0 && (
          <section className="mt-10 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.relatedTitle}</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedRoutes.map((r: TransferRouteSummary, i) => (
                <li key={r.id} className={CARD_CLASS}>
                  {r.heroImage && (
                    <div className={CARD_IMAGE_BLEED_CLASS}>
                      <MediaImage asset={r.heroImage} alt={r.title} aspectClassName="aspect-[16/10]" />
                    </div>
                  )}
                  <Link href={relatedHrefs[i]} className="text-lg font-medium text-ocean-900 hover:text-maldives-600">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav aria-label="Related transfer links" className="mt-10 flex flex-wrap gap-2 border-t border-neutral-200 pt-6">
          <Link
            href={localizeHubPath(locale, "/maldives/transfers/")}
            className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
          >
            {d.allTransfersLink}
          </Link>
          {englishSlug && (
            <Link
              href={`/maldives/transfers/${englishSlug}/`}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
            >
              {d.englishVersionLink}
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
