import type { Metadata } from "next";
import Link from "next/link";

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
        <div className="mb-8 rounded-2xl border border-maldives-200 bg-maldives-50 p-5">
          <p className="text-sm font-semibold text-ocean-900">Run a property, activity, package, or transfer business?</p>
          <p className="mt-1 text-sm text-neutral-700">
            Skip the wait — create your own partner account now and get straight to completing your profile.
          </p>
          <Link
            href="/partner/signup"
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-maldives-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-maldives-700"
          >
            Create Partner Account →
          </Link>
        </div>
        <PartnerRequestForm />
      </div>
    </main>
  );
}
