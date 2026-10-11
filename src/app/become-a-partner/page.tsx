import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { canonicalUrl } from "@/lib/seo/site";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  const title = "Become a Partner | MTG";
  const description =
    "List your resort, hotel, guesthouse, activity, package, or transfer service on Maldives Tour Guide and reach travellers planning real trips.";
  const url = canonicalUrl("/become-a-partner");
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

const BENEFITS = [
  {
    title: "Reach real, planning travellers",
    description: "Every visitor is already researching a Maldives trip — resorts, activities, transfers and packages, all in one place.",
  },
  {
    title: "You control your own listing",
    description: "Add and edit your own property, activity, package or transfer details from your own partner dashboard — no waiting on us for routine updates.",
  },
  {
    title: "Bookings land straight in your dashboard",
    description: "Every request for your listing shows up in your own Bookings tab, with guest details, dates and pricing — confirm or decline in one click.",
  },
  {
    title: "No listing fee to get started",
    description: "Create your account and build your profile free. We'll be in touch about commission once you're set up.",
  },
];

const STEPS = [
  { title: "Create your account", description: "Pick your business type and sign up in under a minute — you're logged into your own dashboard immediately." },
  { title: "Complete your profile", description: "Add your business details, verification documents and bank details, then submit for review." },
  { title: "Get approved", description: "Our team checks your documents and approves your account — usually within a couple of business days." },
  { title: "Add listings & take bookings", description: "Create your properties, activities, packages or transfer routes and start receiving booking requests." },
];

export default function Page() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Become a Partner" }]}
        eyebrow="Work With Us"
        title="Become a Partner"
        description="List your resort, hotel, guesthouse, activity, holiday package, or transfer service on Maldives Tour Guide and manage it yourself."
        variant="plain"
      />

      <div className={`${CONTAINER_CLASS} max-w-3xl py-10 sm:py-14`}>
        <section className="rounded-2xl border border-maldives-200 bg-maldives-50 p-6 text-center sm:p-8">
          <p className="text-lg font-semibold text-ocean-900">Ready to list your business?</p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-700">
            Create your partner account now — you&rsquo;ll be in your own dashboard right away to finish setting up your profile.
          </p>
          <Button href="/partner/signup" className="mt-5">
            Create Partner Account →
          </Button>
          <p className="mt-3 text-sm text-neutral-600">
            Already have an account?{" "}
            <Link href="/partner/login" className="font-medium text-maldives-600 hover:underline">
              Sign in
            </Link>
          </p>
        </section>

        <div className="mt-14">
          <SectionHeader eyebrow="Why Partner With Us" title="Why list with Maldives Tour Guide" />
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <li key={b.title} className="rounded-2xl border border-neutral-200 p-5">
                <p className="font-semibold text-ocean-900">{b.title}</p>
                <p className="mt-1.5 text-sm text-neutral-700">{b.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <SectionHeader eyebrow="How It Works" title="From sign-up to your first booking" />
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
            Not ready to self-manage a listing? International travel agents and businesses who&rsquo;d rather our team set things up for
            them can reach out directly on{" "}
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
