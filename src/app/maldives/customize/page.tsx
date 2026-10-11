import type { Metadata } from "next";

import { HolidayBuilderWizard } from "@/components/holiday-builder/holiday-builder-wizard";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getActivePricingConfig } from "@/lib/holiday-builder/pricing-repository";
import { PACKAGE_CATEGORY_FALLBACK_IMAGES } from "@/lib/packages/category-images";

// Every selection here is personal to the visitor building a quote — a
// discovery/utility page, not a canonical content page, same reasoning as
// the search page and filtered package views.
export const metadata: Metadata = {
  title: "Customize Your Holiday | MTG",
  description: "Build your own Maldives holiday — choose your stay, rooms, meal plan, activities and transfer, with a live estimated price.",
  robots: { index: false, follow: true },
};

export default async function CustomizeHolidayPage() {
  const pricing = await getActivePricingConfig();

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Packages", href: "/maldives/packages/" }, { label: "Customize Your Holiday" }]}
        eyebrow="Build your own trip"
        title="Customize Your Holiday"
        description="Choose your stay, rooms, meal plan, activities and transfer — see a live estimated price as you go, then submit your request."
        image={PACKAGE_CATEGORY_FALLBACK_IMAGES.mainHub}
      />
      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <HolidayBuilderWizard pricing={pricing} />
      </div>
    </main>
  );
}
