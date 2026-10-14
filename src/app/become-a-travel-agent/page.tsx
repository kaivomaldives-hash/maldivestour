import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { canonicalUrl } from "@/lib/seo/site";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  const title = "Become a Travel Agent | MTG";
  const description = "Apply for a Travel Agent account with Maldives Tour Guide and get a 10% discount on eligible rates once approved.";
  const url = canonicalUrl("/become-a-travel-agent");
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

const STEPS = [
  { title: "Apply", description: "Create your agent account in under a minute with your business details." },
  { title: "Get approved", description: "Our team reviews your application — usually within a couple of business days." },
  { title: "Book at a discount", description: "Sign in and book eligible rates — the original price, your discount, and the final price are always shown clearly." },
];

export default function Page() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Become a Travel Agent" }]}
        eyebrow="Work With Us"
        title="Become a Travel Agent"
        description="Apply for a Travel Agent account and get a 10% discount on eligible rates once your application is approved."
        variant="plain"
      />

      <div className={`${CONTAINER_CLASS} max-w-3xl py-10 sm:py-14`}>
        <section className="rounded-2xl border border-maldives-200 bg-maldives-50 p-6 text-center sm:p-8">
          <p className="text-lg font-semibold text-ocean-900">Ready to apply?</p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-700">
            Create your Travel Agent account now — your application goes to our team for review right away.
          </p>
          <Button href="/agent/signup" className="mt-5">
            Apply as a Travel Agent →
          </Button>
          <p className="mt-3 text-sm text-neutral-600">
            Already have an account?{" "}
            <Link href="/agent/login" className="font-medium text-maldives-600 hover:underline">
              Sign in
            </Link>
          </p>
        </section>

        <div className="mt-14">
          <SectionHeader eyebrow="How It Works" title="From application to your first discounted booking" />
          <ol className="mt-6 space-y-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maldives-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-ocean-900">{step.title}</p>
                  <p className="mt-0.5 text-sm text-neutral-700">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 rounded-2xl border border-neutral-200 bg-sand-50 p-6 text-center">
          <p className="text-sm text-neutral-700">
            Prefer our team to set things up for you instead, or representing a larger agency? Reach out directly on{" "}
            <a href="https://wa.me/9607794332" target="_blank" rel="noopener noreferrer" className="font-medium text-maldives-600 hover:underline">
              WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
