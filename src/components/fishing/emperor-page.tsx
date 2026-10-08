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
import { FISHING_HERO_IMAGE } from "@/lib/packages/category-images";
import { breadcrumbJsonLd, canonicalUrl } from "@/lib/seo/site";
import { whatsappUrl } from "@/lib/whatsapp";

// The 2 real, currently-verified charter SKUs — same source as the
// /maldives/fishing/ hub (see CHARTER_SLUGS there and
// data/maldives/fishing/SOURCES-mfh.md). Kept to just these 2, not
// invented per-technique products — see that file's "Known gaps" section
// for why no separate "GT Popping Charter" SKU exists.
const CHARTER_SLUGS = ["private-full-day-fishing-charter", "private-half-day-fishing-charter"];

// Real regions already covered on the /maldives/fishing/ hub's "Best
// Places for Fishing" section — reused here rather than inventing a new
// list, so this page never claims coverage the rest of the site doesn't
// already stand behind.
const REGIONS = [
  { href: "/maldives/atolls/kaafu/", label: "Malé & Hulhumalé (North & South Malé Atoll)" },
  { href: "/maldives/atolls/alif-alif/", label: "Ari Atoll (North)" },
  { href: "/maldives/atolls/alif-dhaalu/", label: "Ari Atoll (South)" },
  { href: "/maldives/atolls/baa/", label: "Baa Atoll" },
  { href: "/maldives/atolls/vaavu/", label: "Vaavu Atoll" },
  { href: "/maldives/atolls/laamu/", label: "Laamu Atoll" },
  { href: "/maldives/atolls/gaafu-alifu/", label: "Gaafu Alifu Atoll — our home base" },
  { href: "/maldives/atolls/gaafu-dhaalu/", label: "Gaafu Dhaalu Atoll" },
  { href: "/maldives/atolls/seenu/", label: "Addu Atoll" },
];

const FAQS = [
  {
    question: "Does Emperor only fish out of Maamendhoo?",
    answer:
      "Maamendhoo, Gaafu Alifu Atoll is Emperor's home base, where the boat and crew are normally based. Charters can also be arranged from other locations across the Maldives at the same rate, depending on your dates, the boat's positioning and sea conditions — tell us where you're staying and we'll confirm what's possible.",
  },
  {
    question: "What does an Emperor charter cost?",
    answer:
      "USD 1,380 for a full day or USD 980 for a half day, per boat (up to 5 anglers) — the same rate wherever we arrange your charter across the Maldives, see the rates below.",
  },
  {
    question: "What's included?",
    answer: "Professional captain and crew, fuel, soft drinks and snacks, and basic fishing gear are included on every Emperor charter.",
  },
  {
    question: "What can I target with Emperor?",
    answer:
      "Popping and jigging over outer reef and channel edges for giant trevally and dogtooth tuna, trolling further out for yellowfin tuna, wahoo and other pelagics, and calmer reef fishing closer to shore — the right mix depends on where you fish and the season.",
  },
  {
    question: "Do I need my own fishing gear?",
    answer: "No — basic fishing gear is included. If you have your own preferred rod, reel or flies, you're welcome to bring them.",
  },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

export function emperorPageMetadata(): Metadata {
  const title = "Emperor Private Fishing Charter Maldives | Maldives Fishing";
  const description =
    "Fish the Maldives aboard Emperor, a private 32-foot fishing charter with twin 200 HP engines for up to 5 anglers. GT, tuna, wahoo and more — home-based in Gaafu Atoll, arranged from other locations across the Maldives on request.";
  const url = canonicalUrl("/maldives/fishing/emperor");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export async function EmperorPage() {
  const charters = (await Promise.all(CHARTER_SLUGS.map((slug) => getFishingActivityBySlug(slug)))).filter(
    (c): c is NonNullable<typeof c> => c !== null,
  );

  const waMessage =
    "Hi, I'd like to book the Emperor private fishing charter.\nMy location:\nDate:\nNumber of anglers:\nTarget species:\nHalf day or full day:";

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Fishing", href: "/maldives/fishing/" }, { label: "Emperor" }],
              "/maldives/fishing/emperor",
            ),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />

      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Fishing", href: "/maldives/fishing/" },
          { label: "Emperor" },
        ]}
        eyebrow="Private fishing charter"
        title="Emperor — Private Fishing Charter Across the Maldives"
        description="32 ft · Twin 200 HP engines · Up to 5 anglers. Home-based in Gaafu Atoll — same rate wherever we arrange your charter across the Maldives."
        image={FISHING_HERO_IMAGE}
        action={
          <div className="flex flex-wrap gap-3">
            <a href="#emperor-charters" className="rounded-full bg-maldives-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-ocean-800">
              Request Availability
            </a>
            <a
              href={whatsappUrl(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>
        }
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {/* Meet Emperor — only real, sourced specifications (see
            data/maldives/fishing/SOURCES-mfh.md); nothing here is invented. */}
        <section>
          <h2 className="text-xl font-semibold text-ocean-900">Meet Emperor</h2>
          <div className="mt-3 space-y-3 text-sm text-neutral-700">
            <p>
              Emperor is a 32-foot private fishing boat with twin 200 HP outboard engines, carrying up to 5 anglers. The boat and crew are
              home-based at Maamendhoo, Gaafu Alifu Atoll — real, remote fishing ground with less pressure than the resort-cluster atolls
              most visitors think of first — operated by{" "}
              <Link href="/maldives/providers/maldives-fishing-and-holiday/" className="text-maldives-600 hover:underline">
                Maldives Fishing and Holiday Pvt Ltd
              </Link>
              .
            </p>
            <p>
              <strong>You choose the location. We help arrange the fishing.</strong> Tell us where you&rsquo;re staying, your travel dates,
              number of anglers and what you&rsquo;d like to catch, and our team will confirm the most suitable departure arrangement —
              whether that&rsquo;s Emperor&rsquo;s own Gaafu Atoll grounds or another region. The rate is the same wherever we arrange
              your charter — the only thing that varies by location is availability, which depends on the boat&rsquo;s positioning,
              weather, sea conditions and crew schedule, so we confirm your date with you before booking.
            </p>
          </div>

          <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-neutral-700 sm:grid-cols-2">
            {[
              "Private boat for your group — not shared with other anglers",
              "Up to 5 anglers",
              "32-foot fishing boat, twin 200 HP outboard engines",
              "Professional captain and crew",
              "Basic fishing gear included",
              "Half-day and full-day charters",
              "Same rate wherever we arrange your charter across the Maldives",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true">🎣</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Where Can You Fish — the site owner confirmed the charter rate
            is genuinely the same wherever we arrange it, so that's now
            stated as fact (no hedging on price). Availability itself is
            still framed as "ask us", since that genuinely does depend on
            the boat's positioning/schedule, not on the rate. */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Where Can You Fish?</h2>
          <p className="mt-2 text-sm text-neutral-700">
            Emperor&rsquo;s home waters are Gaafu Atoll, in the far south of the Maldives. Charters can also be arranged from other regions
            at the same rate — your exact departure location and date depend on where you&rsquo;re staying and the boat&rsquo;s positioning
            at the time.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {REGIONS.map((region) => (
              <li key={region.href}>
                <Link href={region.href} className="text-maldives-600 hover:underline">
                  {region.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-neutral-700">
            Staying somewhere else?{" "}
            <a href={whatsappUrl(waMessage)} target="_blank" rel="noopener noreferrer" className="text-maldives-600 hover:underline">
              Ask us on WhatsApp
            </a>{" "}
            — we&rsquo;ll tell you honestly whether Emperor can reach you.
          </p>
        </section>

        {/* Techniques — only what the real source material documents for
            this specific operation, no invented species-specific SKUs. */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Fishing Techniques</h2>
          <p className="mt-2 text-sm text-neutral-700">
            What&rsquo;s productive depends on where you fish and the season — see{" "}
            <Link href="/maldives/fishing/#fishing-seasons" className="text-maldives-600 hover:underline">
              Maldives fishing seasons
            </Link>{" "}
            for general guidance.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {[
              { label: "Popping (GT)", href: "/maldives/fishing/popping/" },
              { label: "Jigging (GT, dogtooth tuna)", href: "/maldives/fishing/jigging/" },
              { label: "Trolling / Big Game Fishing (tuna, wahoo)", href: "/maldives/fishing/big-game-fishing/" },
              { label: "Reef fishing", href: null },
            ].map((technique) =>
              technique.href ? (
                <li key={technique.label}>
                  <Link
                    href={technique.href}
                    className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
                  >
                    {technique.label}
                  </Link>
                </li>
              ) : (
                <li key={technique.label} className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700">
                  {technique.label}
                </li>
              ),
            )}
          </ul>
        </section>

        {/* Charters — the 2 real, bookable SKUs, same data/booking flow as
            the main fishing hub. No separate/parallel booking system. */}
        <section id="emperor-charters" className="mt-12 scroll-mt-20 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Emperor Charter Rates</h2>
          <p className="mt-2 text-sm text-neutral-700">
            One rate, per boat, wherever we arrange your charter across the Maldives — no extra transfer or positioning surcharge.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                      {isSupportedCurrency(currency) ? <Price baseAmount={charter.priceFrom} baseCurrency={currency} /> : `${currency} ${charter.priceFrom}`}
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
          <p className="mt-6 text-sm text-neutral-700">
            Prefer WhatsApp?{" "}
            <a href={whatsappUrl(waMessage)} target="_blank" rel="noopener noreferrer" className="text-maldives-600 hover:underline">
              Message a fishing expert directly
            </a>
            .
          </p>
        </section>

        {/* FAQs */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Frequently Asked Questions</h2>
          <dl className="mt-4 space-y-6">
            {FAQS.map((faq) => (
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
              { href: "/maldives/packages/fishing/", label: "Fishing Packages" },
              { href: "/maldives/providers/maldives-fishing-and-holiday/", label: "Maldives Fishing and Holiday Pvt Ltd" },
              { href: "/maldives/islands/maamendhoo-gaafu-alifu/", label: "Maamendhoo, Gaafu Alifu" },
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
