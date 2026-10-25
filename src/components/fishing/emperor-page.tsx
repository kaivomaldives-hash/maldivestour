import Link from "next/link";

import { NodeInquiryToggle } from "@/components/bookings/node-inquiry-toggle";
import { Price } from "@/components/currency/price";
import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { FaqSection } from "@/components/ui/faq-section";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { isSupportedCurrency } from "@/lib/currency/types";
import { bookingCta } from "@/lib/bookings/copy";
import { getFishingActivityBySlug } from "@/lib/fishing/repository";
import { asset } from "@/lib/packages/category-images";
import { breadcrumbJsonLd, canonicalUrl, getSiteUrl, safeJsonLdStringify } from "@/lib/seo/site";
import { whatsappUrl } from "@/lib/whatsapp";

// The 2 real, currently-verified charter SKUs — same source as the
// /maldives/fishing/ hub (see CHARTER_SLUGS there and
// data/maldives/fishing/SOURCES-mfh.md). Kept to just these 2, not
// invented per-technique products — see that file's "Known gaps" section
// for why no separate "GT Popping Charter" SKU exists.
const CHARTER_SLUGS = ["private-full-day-fishing-charter", "private-half-day-fishing-charter"];

// Real photos of Emperor from the media library (the hub's generic
// FISHING_HERO_IMAGE used to stand in here).
export const EMPEROR_HERO_IMAGE = asset(
  "e520e856-d8be-505a-1e39-bc1a61f726e0",
  "opt/uploads/assets/uploads/fishing/images/charters/emperor.webp",
  "Emperor, a 32 ft white-and-black fishing boat with twin outboards, anchored off a Maldives island",
);
const EMPEROR_GALLERY = [
  asset(
    "231eed3c-1bc0-71fb-4187-ca095c8d7630",
    "opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-boat.webp",
    "Aerial view of the Emperor fishing boat over a shallow turquoise reef",
  ),
  asset(
    "7e90fcd5-499f-8989-6783-c3ff27ee5bb1",
    "opt/uploads/assets/uploads/fishing/images/charters/maldives-fishing-boat-emperor.webp",
    "Top-down aerial view of Emperor, a white center-console fishing boat, in deep blue water",
  ),
  asset(
    "94bb6eed-690f-20c7-1169-f3c0b0a9466d",
    "opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-charter.webp",
    "The Emperor fishing boat in deep blue water off an island",
  ),
];

const INCLUDED = ["Professional captain and crew", "Fuel", "Soft drinks and snacks", "Basic fishing gear"];
const NOT_INCLUDED = [
  "Domestic flight to Gaafu Atoll (USD 365 per person) if you're coming to Emperor's home base",
  "Accommodation and meals (our lodge on Maamendhoo: USD 150 per room, full board)",
  "Professional rod and reel setup for heavier popping and jigging tackle (USD 80 per setup)",
];

function atollHref(location: { slug: string; locationType: string }): string {
  if (location.locationType === "island") return `/maldives/islands/${location.slug}/`;
  return `/maldives/atolls/${location.slug}/`;
}

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

/** Service markup for the charter itself, with the 2 real per-boat
 * offers. No ratings or reviews: none are collected for Emperor. */
function serviceJsonLd(charters: Array<{ title: string; priceFrom: number | null; currency: string | null }>) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Emperor Private Fishing Charter",
    serviceType: "Private fishing charter",
    description:
      "Private half-day and full-day fishing charters aboard Emperor, a 32-foot boat with twin 200 HP engines for up to 5 anglers, based at Maamendhoo, Gaafu Alifu Atoll.",
    url: canonicalUrl("/maldives/fishing/emperor"),
    areaServed: "Maldives",
    provider: { "@type": "Organization", name: "Maldives Tour Guide", url: getSiteUrl() },
    offers: charters
      .filter((c) => c.priceFrom !== null)
      .map((c) => ({ "@type": "Offer", name: c.title, price: c.priceFrom, priceCurrency: c.currency ?? "USD", availability: "https://schema.org/InStock" })),
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

export async function EmperorPage() {
  const charters = (await Promise.all(CHARTER_SLUGS.map((slug) => getFishingActivityBySlug(slug)))).filter(
    (c): c is NonNullable<typeof c> => c !== null,
  );
  // Both charter products carry the same tagged destinations (see
  // supabase/migrations/20261001006600_emperor_multi_atoll_locations.sql),
  // primary first — real node_locations data, not the hardcoded prose list
  // this page used to render.
  const regions = charters[0]?.locations ?? [];
  const requireDestination = regions.length > 1;

  const waMessage =
    "Hi, I'd like to book the Emperor private fishing charter.\nMy location:\nDate:\nNumber of anglers:\nTarget species:\nHalf day or full day:";

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Fishing", href: "/maldives/fishing/" }, { label: "Emperor" }],
              "/maldives/fishing/emperor",
            ),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(serviceJsonLd(charters)) }} />

      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Fishing", href: "/maldives/fishing/" },
          { label: "Emperor" },
        ]}
        eyebrow="Private fishing charter"
        title="Emperor — Private Fishing Charter Across the Maldives"
        description="32 ft · Twin 200 HP engines · Up to 5 anglers. Home-based in Gaafu Atoll — same rate wherever we arrange your charter across the Maldives."
        image={EMPEROR_HERO_IMAGE}
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
          <h2 className="text-xl font-semibold text-ocean-900">Meet Emperor: Our Private Fishing Boat in the Maldives</h2>
          <div className="mt-3 space-y-3 text-sm text-neutral-700">
            <p>
              Emperor is a 32-foot private fishing boat with twin 200 HP outboard engines, carrying up to 5 anglers. The boat and crew are
              home-based at Maamendhoo, Gaafu Alifu Atoll — real, remote fishing ground with less pressure than the resort-cluster atolls
              most visitors think of first.
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

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {EMPEROR_GALLERY.map((image) => (
              <li key={image.id} className="overflow-hidden rounded-2xl">
                <MediaImage asset={image} alt={image.altText ?? ""} aspectClassName="aspect-[4/3]" />
              </li>
            ))}
          </ul>
        </section>

        {/* A day on Emperor — the 4 h / 8 h durations are the charter
            records' own duration_minutes; the rest describes how the crew
            plans the day, not a fixed timetable. */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">What to Expect on a Private Fishing Charter</h2>
          <div className="mt-3 space-y-3 text-sm text-neutral-700">
            <p>
              A <strong>half-day charter</strong> is about 4 hours on the water and a <strong>full-day charter</strong> about 8 hours. At
              Emperor&rsquo;s home base the boat leaves from Maamendhoo, Gaafu Alifu Atoll; if we arrange your charter elsewhere, we confirm
              the departure point with you when we confirm the date.
            </p>
            <p>
              Tell the captain what your group wants to catch and how much fishing experience everyone has, and the crew plans the day around the tide, the weather and the season: popping and jigging over the outer reef edges and
              channels for giant trevally and dogtooth tuna, trolling on the runs between spots for tuna, wahoo and mahi-mahi, or calmer
              reef fishing closer to the island. A full day leaves time to mix several of these; a half day usually focuses on one or two.
            </p>
            <p>Soft drinks, snacks and basic fishing gear are on board.</p>
          </div>
        </section>

        {/* Included / not included — from the charter rate sheet and the
            owner (domestic flight price confirmed 2026-10-24). */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">What&rsquo;s Included in a Private Fishing Charter</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 text-sm text-neutral-700 sm:grid-cols-2">
            <div>
              <h3 className="font-medium text-ocean-900">Included in every charter</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {INCLUDED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-ocean-900">Not included</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {NOT_INCLUDED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3">
                Staying several nights? A{" "}
                <Link href="/maldives/packages/fishing/" className="text-maldives-600 hover:underline">
                  fishing package
                </Link>{" "}
                bundles the charters with the lodge, meals, the domestic flight and the boat transfer.
              </p>
            </div>
          </div>
        </section>

        {/* Where Can You Fish — the site owner confirmed the charter rate
            is genuinely the same wherever we arrange it, so that's now
            stated as fact (no hedging on price). Availability itself is
            still framed as "ask us", since that genuinely does depend on
            the boat's positioning/schedule, not on the rate. */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Where Can You Hire a Fishing Boat in the Maldives?</h2>
          <p className="mt-2 text-sm text-neutral-700">
            Emperor&rsquo;s home waters are Gaafu Atoll, in the far south of the Maldives. Charters can also be arranged from other regions
            at the same rate — your exact departure location and date depend on where you&rsquo;re staying and the boat&rsquo;s positioning
            at the time.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {regions.map((region, index) => (
              <li key={region.id}>
                <Link href={atollHref(region)} className="text-maldives-600 hover:underline">
                  {region.title}
                  {index === 0 ? " — our home base" : ""}
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
          <h2 className="text-xl font-semibold text-ocean-900">Fishing Techniques on a Private Charter</h2>
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
              { label: "Trolling (tuna, wahoo)", href: "/maldives/fishing/trolling/" },
              { label: "Big Game Fishing", href: "/maldives/fishing/big-game-fishing/" },
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
          <h2 className="text-xl font-semibold text-ocean-900">Private Fishing Charter Prices in the Maldives</h2>
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
                        requireDestination={requireDestination}
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
        <FaqSection faqs={FAQS} />

        {/* Related */}
        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Explore More</h2>
          <nav aria-label="Related fishing links" className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/maldives/fishing/", label: "Maldives Fishing" },
              { href: "/maldives/fishing/gt-fishing/", label: "GT Fishing" },
              { href: "/maldives/packages/fishing/", label: "Fishing Packages" },
              { href: "/maldives/travel-guide/maldives-fishing-trip-cost/", label: "Maldives Fishing Trip Cost" },
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
