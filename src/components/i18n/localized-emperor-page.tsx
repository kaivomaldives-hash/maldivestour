import type { Metadata } from "next";
import Link from "next/link";

import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { Price } from "@/components/currency/price";
import { EMPEROR_GALLERY, EMPEROR_HERO_IMAGE } from "@/components/fishing/emperor-page";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { FaqSection } from "@/components/ui/faq-section";
import { WhatsAppIcon } from "@/components/ui/icons";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import type { ActivityDetail } from "@/lib/activities/types";
import { bookingCta } from "@/lib/bookings/copy";
import { isSupportedCurrency } from "@/lib/currency/types";
import { getFishingActivityBySlug } from "@/lib/fishing/repository";
import { EMPEROR_LOCALES, getEmperorStrings } from "@/lib/i18n/fishing-pages/emperor";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getLinkLocalizer } from "@/lib/i18n/link-localizer";
import type { Locale } from "@/lib/i18n/locales";
import { localizeCards } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { breadcrumbJsonLd, hreflangAlternates, localizedCanonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";
import { whatsappUrl } from "@/lib/whatsapp";

/** Same 2 real charter SKUs as the English page (emperor-page.tsx). */
const CHARTER_SLUGS = ["private-full-day-fishing-charter", "private-half-day-fishing-charter"];
const TECHNIQUE_HREFS = ["/maldives/fishing/popping/", "/maldives/fishing/jigging/", "/maldives/fishing/big-game-fishing/", null];
const RELATED_HREFS = ["/maldives/fishing/", "/maldives/packages/fishing/", "/maldives/islands/maamendhoo-gaafu-alifu/"];
const CHIP_CLASS = "rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600";

export function localizedEmperorMetadata(locale: Locale): Metadata {
  const t = getEmperorStrings(locale);
  if (!t) return {};
  const url = localizedCanonicalUrl(locale, "/maldives/fishing/emperor/");
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/fishing/emperor/", EMPEROR_LOCALES) },
    openGraph: { title: t.metaTitle, description: t.metaDescription, url, locale },
  };
}

/** The translated form of the Emperor charter page (src/components/fishing/emperor-page.tsx). */
export async function LocalizedEmperorPage({ locale }: { locale: Locale }) {
  const t = getEmperorStrings(locale)!;
  const ui = getUiStrings(locale);

  const [charters, L] = await Promise.all([
    Promise.all(CHARTER_SLUGS.map((slug) => getFishingActivityBySlug(slug))).then((list) => list.filter((c): c is ActivityDetail => c !== null)),
    getLinkLocalizer(locale),
  ]);
  const cards = await localizeCards(locale, charters, "/maldives/fishing/");
  const regions = charters[0]?.locations ?? [];
  const requireDestination = regions.length > 1;
  const wa = whatsappUrl(t.waMessage);

  const breadcrumbs = [
    { label: ui.breadcrumbHome, href: `/${locale}/` },
    { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
    { label: ui.nav.fishing, href: localizeHubPath(locale, "/maldives/fishing/") },
    { label: "Emperor" },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: t.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, localizeHubPath(locale, "/maldives/fishing/emperor/"))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd) }} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.heroDescription}
        image={EMPEROR_HERO_IMAGE}
        action={
          <div className="flex flex-wrap gap-3">
            <a href="#emperor-charters" className="rounded-full bg-maldives-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-ocean-800">
              {t.requestAvailability}
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t.whatsappUs}
            </a>
          </div>
        }
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <section>
          <h2 className="text-xl font-semibold text-ocean-900">{t.meetTitle}</h2>
          <div className="mt-3 space-y-3 text-sm text-neutral-700">
            <p>{t.meetP1}</p>
            <p>
              <strong>{t.meetP2Strong}</strong> {t.meetP2}
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-neutral-700 sm:grid-cols-2">
            {t.features.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true">🎣</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {EMPEROR_GALLERY.map((image) => (
              <li key={image.id} className="overflow-hidden rounded-2xl">
                <MediaImage asset={image} alt={t.title} aspectClassName="aspect-[4/3]" />
              </li>
            ))}
          </ul>
        </section>

        {t.dayTitle && t.dayParagraphs && (
          <section className="mt-12 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{t.dayTitle}</h2>
            <div className="mt-3 space-y-3 text-sm text-neutral-700">
              {t.dayParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {t.includedTitle && t.included && t.notIncluded && (
          <section className="mt-12 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{t.includedTitle}</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 text-sm text-neutral-700 sm:grid-cols-2">
              <div>
                <h3 className="font-medium text-ocean-900">{t.includedHeading}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {t.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-ocean-900">{t.notIncludedHeading}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {t.notIncluded.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {t.packageLink && (
                  <p className="mt-3">
                    {t.packageBefore}
                    <Link href={L.href("/maldives/packages/fishing/")} className="text-maldives-600 hover:underline">
                      {t.packageLink}
                    </Link>
                    {t.packageAfter}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{t.whereTitle}</h2>
          <p className="mt-2 text-sm text-neutral-700">{t.whereText}</p>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {regions.map((region, index) => {
              const href = region.locationType === "island" ? `/maldives/islands/${region.slug}/` : `/maldives/atolls/${region.slug}/`;
              return (
                <li key={region.id}>
                  <Link href={L.href(href)} className="text-maldives-600 hover:underline">
                    {L.title(href, region.title)}
                    {index === 0 ? t.homeBaseSuffix : ""}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm text-neutral-700">
            {t.elsewhereBefore}{" "}
            <a href={wa} target="_blank" rel="noopener noreferrer" className="text-maldives-600 hover:underline">
              {t.elsewhereLink}
            </a>
            {t.elsewhereAfter}
          </p>
        </section>

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{t.techniquesTitle}</h2>
          <p className="mt-2 text-sm text-neutral-700">
            {t.techniquesBefore}
            <Link href={L.href("/maldives/fishing/")} className="text-maldives-600 hover:underline">
              {t.seasonsLink}
            </Link>
            {t.techniquesAfter}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {t.techniqueLabels.map((label, i) => {
              const href = TECHNIQUE_HREFS[i];
              return href ? (
                <li key={label}>
                  <Link href={L.href(href)} className={CHIP_CLASS}>
                    {label}
                  </Link>
                </li>
              ) : (
                <li key={label} className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700">
                  {label}
                </li>
              );
            })}
          </ul>
        </section>

        <section id="emperor-charters" className="mt-12 scroll-mt-20 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{t.ratesTitle}</h2>
          <p className="mt-2 text-sm text-neutral-700">{t.ratesIntro}</p>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {charters.map((charter) => {
              const card = cards.get(charter.id)!;
              const currency = charter.currency ?? "USD";
              return (
                <li key={charter.id} className={CARD_CLASS}>
                  {charter.heroImage && (
                    <div className={CARD_IMAGE_BLEED_CLASS}>
                      <MediaImage asset={charter.heroImage} alt={card.title} aspectClassName="aspect-[4/3]" />
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-ocean-900">
                    <Link href={card.href} className="hover:text-maldives-600">
                      {card.title}
                    </Link>
                  </h3>
                  {card.summary && <p className="mt-1 text-sm text-neutral-600">{card.summary}</p>}
                  {charter.priceFrom !== null && (
                    <p className="mt-2 text-lg font-semibold text-ocean-900">
                      {t.from}{" "}
                      {isSupportedCurrency(currency) ? <Price baseAmount={charter.priceFrom} baseCurrency={currency} /> : `${currency} ${charter.priceFrom}`}
                      <span className="ml-2 text-sm font-normal text-neutral-500">{t.perBoat}</span>
                    </p>
                  )}
                  {charter.isBookable && (
                    <div className="mt-4">
                      <NodeInquiryToggle
                        productNodeId={charter.id}
                        productTitle={card.title}
                        source="fishing"
                        toggleLabel={bookingCta("fishing").toggleLabel}
                        submitLabel={bookingCta("fishing").submitLabel}
                        showNumberOfDays
                        requireDestination={requireDestination}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-6 text-sm text-neutral-700">
            {t.preferWhatsappBefore}{" "}
            <a href={wa} target="_blank" rel="noopener noreferrer" className="text-maldives-600 hover:underline">
              {t.preferWhatsappLink}
            </a>
          </p>
        </section>

        <FaqSection faqs={t.faqs} title={ui.packagesHub.faqTitle} />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{t.exploreMoreTitle}</h2>
          <nav aria-label={t.exploreMoreTitle} className="mt-4 flex flex-wrap gap-2">
            {RELATED_HREFS.map((href, i) => (
              <Link key={href} href={L.href(href)} className={CHIP_CLASS}>
                {t.relatedLabels[i]}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
