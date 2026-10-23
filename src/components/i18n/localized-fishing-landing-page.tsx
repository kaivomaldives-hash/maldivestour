import type { Metadata } from "next";
import Link from "next/link";

import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { Price } from "@/components/currency/price";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { FaqSection } from "@/components/ui/faq-section";
import { WhatsAppIcon } from "@/components/ui/icons";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import type { ActivityDetail } from "@/lib/activities/types";
import { bookingCta } from "@/lib/bookings/copy";
import { isSupportedCurrency } from "@/lib/currency/types";
import { getFishSpeciesBySlug } from "@/lib/fishing/fish-species";
import { getFishingActivityBySlug } from "@/lib/fishing/repository";
import { SPECIES_PAGES } from "@/lib/fishing/species-content";
import { TECHNIQUE_PAGES } from "@/lib/fishing/technique-content";
import { FISHING_PAGES_LOCALES, getFishingPagesStrings, type FishingSpeciesPageSlug, type FishingTechniquePageSlug } from "@/lib/i18n/fishing-pages";
import type { FishingPagesLocaleStrings } from "@/lib/i18n/fishing-pages/types";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getLinkLocalizer, type LinkLocalizer } from "@/lib/i18n/link-localizer";
import type { Locale } from "@/lib/i18n/locales";
import { localizeCards } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { FISHING_HERO_IMAGE } from "@/lib/packages/category-images";
import { breadcrumbJsonLd, hreflangAlternates, localizedCanonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";
import { whatsappUrl } from "@/lib/whatsapp";

const CHIP_CLASS = "rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600";

function metadataFor(locale: Locale, slug: string, title: string, description: string): Metadata {
  const englishPath = `/maldives/fishing/${slug}/`;
  const url = localizedCanonicalUrl(locale, englishPath);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates(englishPath, FISHING_PAGES_LOCALES) },
    openGraph: { title, description, url, locale },
  };
}

export function localizedFishingSpeciesMetadata(locale: Locale, slug: FishingSpeciesPageSlug): Metadata {
  const t = getFishingPagesStrings(locale)?.species[slug];
  return t ? metadataFor(locale, slug, t.metaTitle, t.metaDescription) : {};
}

export function localizedFishingTechniqueMetadata(locale: Locale, slug: FishingTechniquePageSlug): Metadata {
  const t = getFishingPagesStrings(locale)?.techniques[slug];
  return t ? metadataFor(locale, slug, t.metaTitle, t.metaDescription) : {};
}

/** The real charters named by the English page, titled/summarized/linked as their own translations. */
async function loadCharters(locale: Locale, slugs: string[]) {
  const charters = (await Promise.all(slugs.map((slug) => getFishingActivityBySlug(slug)))).filter((c): c is ActivityDetail => c !== null);
  const cards = await localizeCards(locale, charters, "/maldives/fishing/");
  return charters.map((charter) => ({ charter, card: cards.get(charter.id)! }));
}

function Chips({ items, L }: { items: Array<{ label: string; href: string | null }>; L: LinkLocalizer }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2 text-sm">
      {items.map((item) =>
        item.href ? (
          <li key={item.label}>
            <Link href={L.href(item.href)} className={CHIP_CLASS}>
              {item.label}
            </Link>
          </li>
        ) : (
          <li key={item.label} className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700">
            {item.label}
          </li>
        ),
      )}
    </ul>
  );
}

function ChartersSection({ s, charters, L, footer }: { s: FishingPagesLocaleStrings; charters: Awaited<ReturnType<typeof loadCharters>>; L: LinkLocalizer; footer?: React.ReactNode }) {
  if (charters.length === 0) return null;
  return (
    <section className="mt-12 border-t border-neutral-200 pt-10">
      <h2 className="text-xl font-semibold text-ocean-900">{s.chartersTitle}</h2>
      <p className="mt-2 text-sm text-neutral-700">
        {s.chartersIntroBefore}
        <Link href={L.href("/maldives/fishing/emperor/")} className="text-maldives-600 hover:underline">
          Emperor
        </Link>
        {s.chartersIntroAfter}
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {charters.map(({ charter, card }) => {
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
                  {s.from}{" "}
                  {isSupportedCurrency(currency) ? <Price baseAmount={charter.priceFrom} baseCurrency={currency} /> : `${currency} ${charter.priceFrom}`}
                  <span className="ml-2 text-sm font-normal text-neutral-500">{s.perBoat}</span>
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
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {footer}
    </section>
  );
}

function Shell({
  locale,
  slug,
  h1,
  eyebrow,
  description,
  image,
  waMessage,
  faqs,
  related,
  L,
  s,
  children,
}: {
  locale: Locale;
  slug: string;
  h1: string;
  eyebrow: string;
  description: string;
  image: React.ComponentProps<typeof PageHero>["image"];
  waMessage: string;
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ href: string; label: string }>;
  L: LinkLocalizer;
  s: FishingPagesLocaleStrings;
  children: React.ReactNode;
}) {
  const ui = getUiStrings(locale);
  const breadcrumbs = [
    { label: ui.breadcrumbHome, href: `/${locale}/` },
    { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
    { label: ui.nav.fishing, href: localizeHubPath(locale, "/maldives/fishing/") },
    { label: h1 },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, localizeHubPath(locale, `/maldives/fishing/${slug}/`))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd) }} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={eyebrow}
        title={h1}
        description={description}
        image={image}
        action={
          <a
            href={whatsappUrl(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-maldives-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-ocean-800"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {s.whatsappCta}
          </a>
        }
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {children}

        <FaqSection faqs={faqs} title={ui.packagesHub.faqTitle} />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{s.exploreMoreTitle}</h2>
          <nav aria-label={s.exploreMoreTitle} className="mt-4 flex flex-wrap gap-2">
            {related.map((link) => (
              <Link key={link.href} href={L.href(link.href)} className={CHIP_CLASS}>
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}

/**
 * The translated form of a fishing species page (src/components/fishing/
 * species-landing-page.tsx): same species facts, charters and links, with
 * copy from src/lib/i18n/fishing-pages/.
 */
export async function LocalizedFishingSpeciesPage({ locale, slug }: { locale: Locale; slug: FishingSpeciesPageSlug }) {
  const s = getFishingPagesStrings(locale)!;
  const t = s.species[slug];
  const content = SPECIES_PAGES[slug];
  const species = content.speciesSlug ? getFishSpeciesBySlug(content.speciesSlug) : null;

  const [charters, L] = await Promise.all([loadCharters(locale, content.charterSlugs), getLinkLocalizer(locale)]);

  return (
    <Shell
      locale={locale}
      slug={slug}
      h1={t.h1}
      eyebrow={s.speciesEyebrow}
      description={t.description}
      image={species?.image ?? content.fallbackImage ?? null}
      waMessage={s.waSpecies.replace("{name}", t.displayName)}
      faqs={t.faqs}
      related={[
        { href: "/maldives/fishing/", label: s.related.fishing },
        { href: "/maldives/fishing/emperor/", label: s.related.emperor },
        { href: "/maldives/fishing/#fish-species", label: s.related.allFishes },
        { href: "/maldives/packages/fishing/", label: s.related.fishingPackages },
      ]}
      L={L}
      s={s}
    >
      {species && t.bio && (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_2fr]">
          <div className="overflow-hidden rounded-2xl">
            <MediaImage asset={species.image} alt={t.displayName} aspectClassName="aspect-[4/3]" />
          </div>
          <div>
            <p className="text-sm italic text-neutral-500">{species.scientificName}</p>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-neutral-500">{s.size}</dt>
                <dd className="font-medium text-ocean-900">{t.bio.size}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">{s.habitat}</dt>
                <dd className="font-medium text-ocean-900">{t.bio.habitat}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">{s.bestSeason}</dt>
                <dd className="font-medium text-ocean-900">{t.bio.season}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-neutral-700">{t.description}</p>
          </div>
        </section>
      )}

      <section className={species ? "mt-12 border-t border-neutral-200 pt-10" : ""}>
        <h2 className="text-xl font-semibold text-ocean-900">{s.whyMaldivesTitle.replace("{name}", t.displayName)}</h2>
        <div className="mt-3 space-y-3 text-sm text-neutral-700">
          {t.whyMaldives.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      {species && t.bio && (
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{s.seasonTitle}</h2>
          <p className="mt-2 text-sm text-neutral-700">
            {s.seasonText.replace("{name}", t.displayName).replace("{season}", t.bio.season)}
            <Link href={L.href("/maldives/travel-guide/maldives-fishing-seasons-month-by-month-guide/")} className="text-maldives-600 hover:underline">
              {s.seasonGuideLink}
            </Link>
            {s.seasonTextAfter}
          </p>
        </section>
      )}

      <section className="mt-12 border-t border-neutral-200 pt-10">
        <h2 className="text-xl font-semibold text-ocean-900">{s.techniquesTitle}</h2>
        <Chips items={content.techniques.map((tech, i) => ({ href: tech.href, label: t.techniqueLabels[i] ?? tech.label }))} L={L} />
      </section>

      <ChartersSection s={s} charters={charters} L={L} />
    </Shell>
  );
}

/**
 * The translated form of a fishing technique page (src/components/fishing/
 * technique-landing-page.tsx).
 */
export async function LocalizedFishingTechniquePage({ locale, slug }: { locale: Locale; slug: FishingTechniquePageSlug }) {
  const s = getFishingPagesStrings(locale)!;
  const t = s.techniques[slug];
  const content = TECHNIQUE_PAGES[slug];

  const [charters, L] = await Promise.all([loadCharters(locale, content.charterSlugs), getLinkLocalizer(locale)]);

  return (
    <Shell
      locale={locale}
      slug={slug}
      h1={t.h1}
      eyebrow={s.techniqueEyebrow}
      description={t.heroDescription}
      image={FISHING_HERO_IMAGE}
      waMessage={s.waTechnique.replace("{name}", t.h1)}
      faqs={t.faqs}
      related={[
        { href: "/maldives/fishing/", label: s.related.fishing },
        { href: "/maldives/fishing/emperor/", label: s.related.emperor },
        { href: "/maldives/fishing/gt-fishing/", label: s.related.gtFishing },
        { href: "/maldives/fishing/tuna-fishing/", label: s.related.tunaFishing },
        { href: "/maldives/packages/fishing/", label: s.related.fishingPackages },
      ]}
      L={L}
      s={s}
    >
      <section>
        <h2 className="text-xl font-semibold text-ocean-900">{s.howItWorksTitle}</h2>
        <div className="mt-3 space-y-3 text-sm text-neutral-700">
          {t.howItWorks.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-neutral-200 pt-10">
        <h2 className="text-xl font-semibold text-ocean-900">{s.targetSpeciesTitle}</h2>
        <Chips items={content.targetSpecies.map((sp, i) => ({ href: sp.href, label: t.targetSpeciesLabels[i] ?? sp.label }))} L={L} />
      </section>

      <ChartersSection
        s={s}
        charters={charters}
        L={L}
        footer={
          content.packageSlug && (
            <p className="mt-6 text-sm text-neutral-700">
              {s.packagePrompt}{" "}
              <Link href={L.href(`/maldives/packages/${content.packageSlug}/`)} className="text-maldives-600 hover:underline">
                {s.packageLink}
              </Link>
            </p>
          )
        }
      />
    </Shell>
  );
}
