import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { Price } from "@/components/currency/price";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { isSupportedCurrency } from "@/lib/currency/types";
import { bookingCta } from "@/lib/bookings/copy";
import { getFishSpeciesBySlug } from "@/lib/fishing/fish-species";
import { getFishingActivityBySlug } from "@/lib/fishing/repository";
import type { SpeciesPageContent } from "@/lib/fishing/species-content";
import { breadcrumbJsonLd, canonicalUrl } from "@/lib/seo/site";
import { whatsappUrl } from "@/lib/whatsapp";

function faqJsonLd(faqs: SpeciesPageContent["faqs"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

export function speciesPageMetadata(content: SpeciesPageContent): Metadata {
  const url = canonicalUrl(`/maldives/fishing/${content.pageSlug}`);
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: content.metaTitle, description: content.metaDescription, url },
  };
}

export async function SpeciesLandingPage({ content }: { content: SpeciesPageContent }) {
  const species = content.speciesSlug ? getFishSpeciesBySlug(content.speciesSlug) : null;
  if (content.speciesSlug && !species) notFound();

  const heroImage = species?.image ?? content.fallbackImage ?? null;
  const heroDescription = species?.description ?? content.fallbackDescription ?? "";

  const charters = (await Promise.all(content.charterSlugs.map((slug) => getFishingActivityBySlug(slug)))).filter(
    (c): c is NonNullable<typeof c> => c !== null,
  );

  const waMessage = `Hi, I'd like to plan a fishing trip targeting ${content.displayName} in the Maldives.\nMy location:\nDate:\nNumber of anglers:\nHalf day or full day:`;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Fishing", href: "/maldives/fishing/" }, { label: content.h1 }],
              `/maldives/fishing/${content.pageSlug}`,
            ),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(content.faqs)) }} />

      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Fishing", href: "/maldives/fishing/" },
          { label: content.h1 },
        ]}
        eyebrow="Target species"
        title={content.h1}
        description={heroDescription}
        image={heroImage}
        action={
          <a
            href={whatsappUrl(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-maldives-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-ocean-800"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp a Fishing Expert
          </a>
        }
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {/* Species facts — the real, legacy-sourced bio data, same fields
            FishSpeciesSection already renders on the hub. Skipped entirely
            when no such entry exists (e.g. marlin, sailfish) rather than
            inventing size/habitat/season figures. */}
        {species && (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_2fr]">
            <div className="overflow-hidden rounded-2xl">
              <MediaImage asset={species.image} alt={species.name} aspectClassName="aspect-[4/3]" />
            </div>
            <div>
              <p className="text-sm italic text-neutral-500">{species.scientificName}</p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-neutral-500">Size</dt>
                  <dd className="font-medium text-ocean-900">{species.size}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Habitat</dt>
                  <dd className="font-medium text-ocean-900">{species.habitat}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">{species.dietOrSeasonLabel}</dt>
                  <dd className="font-medium text-ocean-900">{species.dietOrSeason}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-neutral-700">{species.description}</p>
            </div>
          </section>
        )}

        {/* Why the Maldives */}
        <section className={species ? "mt-12 border-t border-neutral-200 pt-10" : ""}>
          <h2 className="text-xl font-semibold text-ocean-900">Why the Maldives for {content.displayName}</h2>
          <div className="mt-3 space-y-3 text-sm text-neutral-700">
            {content.whyMaldives.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {/* Season — a real pointer to the existing month-by-month guide
            article rather than repeating or guessing at seasonal claims
            here. Only shown when real season data exists (species truthy)
            — marlin/sailfish have none, so no claim is made either way. */}
        {species && (
          <section className="mt-12 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{species.dietOrSeasonLabel === "Best Season" ? "Season" : "When to Go"}</h2>
            <p className="mt-2 text-sm text-neutral-700">
              {content.displayName} activity is commonly reported around <strong>{species.dietOrSeason}</strong>, though this varies by
              atoll, tide and year — see our{" "}
              <Link href="/maldives/travel-guide/maldives-fishing-seasons-month-by-month-guide/" className="text-maldives-600 hover:underline">
                Maldives fishing seasons month-by-month guide
              </Link>{" "}
              for the full picture.
            </p>
          </section>
        )}

        {/* Techniques */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Fishing Techniques</h2>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {content.techniques.map((t) =>
              t.href ? (
                <li key={t.label}>
                  <Link href={t.href} className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                    {t.label}
                  </Link>
                </li>
              ) : (
                <li key={t.label} className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700">
                  {t.label}
                </li>
              ),
            )}
          </ul>
        </section>

        {/* Real charters — same booking pipeline as everywhere else. */}
        {charters.length > 0 && (
          <section className="mt-12 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">Available Charters</h2>
            <p className="mt-2 text-sm text-neutral-700">
              Our own private charter, <Link href="/maldives/fishing/emperor/" className="text-maldives-600 hover:underline">Emperor</Link>,
              home-based in Gaafu Atoll and arranged from other locations on request.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {charters.map((charter) => {
                const currency = charter.currency ?? "USD";
                return (
                  <li key={charter.id} className={CARD_CLASS}>
                    {charter.heroImage && (
                      <div className={CARD_IMAGE_BLEED_CLASS}>
                        <MediaImage asset={charter.heroImage} alt={charter.title} aspectClassName="aspect-[4/3]" />
                      </div>
                    )}
                    <h3 className="text-lg font-medium text-ocean-900">{charter.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{charter.summary}</p>
                    {charter.priceFrom !== null && (
                      <p className="mt-2 text-lg font-semibold text-ocean-900">
                        From{" "}
                        {isSupportedCurrency(currency) ? (
                          <Price baseAmount={charter.priceFrom} baseCurrency={currency} />
                        ) : (
                          `${currency} ${charter.priceFrom}`
                        )}
                        <span className="ml-2 text-sm font-normal text-neutral-500">per boat</span>
                      </p>
                    )}
                    {charter.isBookable && (
                      <div className="mt-4">
                        <NodeInquiryToggle
                          productNodeId={charter.id}
                          productTitle={charter.title}
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
          </section>
        )}

        {/* FAQs */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Frequently Asked Questions</h2>
          <dl className="mt-4 space-y-6">
            {content.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium text-ocean-900">{faq.question}</dt>
                <dd className="mt-1 text-sm text-neutral-700">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Related */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Explore More</h2>
          <nav aria-label="Related fishing links" className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/maldives/fishing/", label: "Maldives Fishing" },
              { href: "/maldives/fishing/emperor/", label: "Emperor Private Fishing Charter" },
              { href: "/maldives/fishing/#fish-species", label: "All Maldives Fishes" },
              { href: "/maldives/packages/fishing/", label: "Fishing Packages" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
