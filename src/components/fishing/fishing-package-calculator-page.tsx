import Link from "next/link";

import { FishingPackageCalculator } from "@/components/fishing/fishing-package-calculator";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getFishingCalculatorConfig } from "@/lib/fishing/package-calculator-repository";
import { FISHING_HERO_IMAGE } from "@/lib/packages/category-images";
import { breadcrumbJsonLd, safeJsonLdStringify } from "@/lib/seo/site";

export async function FishingPackageCalculatorPage() {
  const config = await getFishingCalculatorConfig();
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Fishing", href: "/maldives/fishing/" }, { label: "Package Calculator" }],
              "/maldives/fishing/calculator",
            ),
          ),
        }}
      />

      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Fishing", href: "/maldives/fishing/" },
          { label: "Package Calculator" },
        ]}
        eyebrow="Maldives fishing"
        title="Fishing Package Calculator"
        description="Choose the atoll, fishing type, number of fishing days and group size to see your fishing holiday price instantly — for the whole group and per person."
        image={FISHING_HERO_IMAGE}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <FishingPackageCalculator config={config} />

        <p className="mt-8 text-sm text-neutral-700">
          Prefer a ready-made holiday? See our{" "}
          <Link href="/maldives/packages/fishing/" className="text-maldives-600 hover:underline">
            Maldives fishing packages
          </Link>{" "}
          or browse{" "}
          <Link href="/maldives/fishing/" className="text-maldives-600 hover:underline">
            all fishing charters and trips
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
