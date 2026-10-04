import type { Metadata } from "next";

import { PartnerRequestForm } from "@/components/partners/partner-request-form";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { canonicalUrl } from "@/lib/seo/site";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  const title = "Become a Partner | MTG";
  const description =
    "Partner with Maldives Tour Guide as an international travel agent, property owner, activity provider, or transfer provider.";
  const url = canonicalUrl("/become-a-partner");
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

export default function Page() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Become a Partner" }]}
        eyebrow="Work With Us"
        title="Become a Partner"
        description="Property owner, activity or transfer provider, or international travel agent — tell us about your business and our team will follow up."
        variant="plain"
      />

      <div className={`${CONTAINER_CLASS} max-w-2xl py-10 sm:py-14`}>
        <PartnerRequestForm />
      </div>
    </main>
  );
}
