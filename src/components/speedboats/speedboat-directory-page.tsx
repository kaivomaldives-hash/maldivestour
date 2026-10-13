import Link from "next/link";

import { SpeedboatCard } from "@/components/speedboats/speedboat-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqSection } from "@/components/ui/faq-section";
import { PageHero } from "@/components/ui/page-hero";
import { breadcrumbJsonLd, safeJsonLdStringify } from "@/lib/seo/site";
import { getSpeedboats } from "@/lib/speedboats/repository";
import { TRANSFER_CATEGORY_IMAGES } from "@/lib/transfers/category-images";

const FAQS = [
  {
    question: "Do you publish prices for private speedboat charter?",
    answer:
      "No — charter pricing depends on duration, destination, and group size, so we don't list a fixed public price. Send us your plans and we'll quote you directly.",
  },
  {
    question: "What charter options are available?",
    answer: "Hourly hire, a destination-based charter, or a fully custom trip — tell us what you have in mind when you enquire.",
  },
  {
    question: "How is this different from a scheduled airport transfer?",
    answer:
      "A scheduled transfer runs a fixed route at a fixed (or shared) price. A private charter is your own boat, on your own schedule — see our scheduled routes on the main Transfers page if that's what you need instead.",
  },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

export async function SpeedboatDirectoryPage() {
  const boats = await getSpeedboats();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            breadcrumbJsonLd([{ label: "Maldives", href: "/maldives/" }, { label: "Private Speedboat Charter" }], "/maldives-speedboats-charter"),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd()) }} />

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Private Speedboat Charter" }]}
        eyebrow="Private hire"
        title="Maldives Private Speedboat Charter"
        description="Our own fleet, available for private hire — hourly, destination-based, or a fully custom trip. No fixed public price; request a charter and we'll quote you directly."
        image={TRANSFER_CATEGORY_IMAGES.speedboatCharterHub}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {boats.length === 0 ? (
          <EmptyState title="No boats published yet — check back soon." />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {boats.map((boat) => (
              <SpeedboatCard key={boat.id} boat={boat} />
            ))}
          </ul>
        )}

        <FaqSection faqs={FAQS} title="Common questions" className="mt-14 border-t border-neutral-200 pt-10" />

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <Link href="/maldives/transfers/" className="text-sm font-medium text-maldives-600 hover:underline">
            ← All Maldives transfers
          </Link>
        </div>
      </div>
    </main>
  );
}
