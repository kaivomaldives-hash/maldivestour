import type { Metadata } from "next";
import Link from "next/link";

import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { Price } from "@/components/currency/price";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { isSupportedCurrency } from "@/lib/currency/types";
import { bookingCta } from "@/lib/bookings/copy";
import { getFishingActivityBySlug } from "@/lib/fishing/repository";
import type { TechniquePageContent } from "@/lib/fishing/technique-content";
import { FISHING_HERO_IMAGE } from "@/lib/packages/category-images";
import { breadcrumbJsonLd, canonicalUrl } from "@/lib/seo/site";
import { whatsappUrl } from "@/lib/whatsapp";

function faqJsonLd(faqs: TechniquePageContent["faqs"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

export function techniquePageMetadata(content: TechniquePageContent): Metadata {
  const url = canonicalUrl(`/maldives/fishing/${content.pageSlug}`);
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: content.metaTitle, description: content.metaDescription, url },
  };
}

export async function TechniqueLandingPage({ content }: { content: TechniquePageContent }) {
  const charters = (await Promise.all(content.charterSlugs.map((slug) => getFishingActivityBySlug(slug)))).filter(
    (c): c is NonNullable<typeof c> => c !== null,
  );

  const waMessage = `Hi, I'd like to plan a ${content.h1.toLowerCase()} trip.\nMy location:\nDate:\nNumber of anglers:\nHalf day or full day:`;

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
        eyebrow="Fishing technique"
        title={content.h1}
        description={content.heroDescription}
        image={FISHING_HERO_IMAGE}
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
        {/* How it works */}
        <section>
          <h2 className="text-xl font-semibold text-ocean-900">How It Works</h2>
          <div className="mt-3 space-y-3 text-sm text-neutral-700">
            {content.howItWorks.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {/* Target species */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Target Species</h2>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {content.targetSpecies.map((s) =>
              s.href ? (
                <li key={s.label}>
                  <Link href={s.href} className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                    {s.label}
                  </Link>
                </li>
              ) : (
                <li key={s.label} className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700">
                  {s.label}
                </li>
              ),
            )}
          </ul>
        </section>

        {/* Real charters */}
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
            {content.packageSlug && (
              <p className="mt-6 text-sm text-neutral-700">
                Prefer a complete holiday?{" "}
                <Link href={`/maldives/packages/${content.packageSlug}/`} className="text-maldives-600 hover:underline">
                  See our fly fishing holiday package
                </Link>
                .
              </p>
            )}
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
              { href: "/maldives/fishing/gt-fishing/", label: "GT Fishing" },
              { href: "/maldives/fishing/tuna-fishing/", label: "Tuna Fishing" },
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
