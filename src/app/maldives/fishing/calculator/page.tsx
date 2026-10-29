import type { Metadata } from "next";

import { FishingPackageCalculatorPage } from "@/components/fishing/fishing-package-calculator-page";
import { canonicalUrl } from "@/lib/seo/site";

export function generateMetadata(): Metadata {
  const title = "Maldives Fishing Package Calculator | Maldives Fishing";
  const description =
    "Price your Maldives fishing holiday: choose the atoll, reef, tuna or fly fishing, 2 to 7 fishing days and up to 6 guests for an instant group and per-person rate.";
  const url = canonicalUrl("/maldives/fishing/calculator");
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

export default function Page() {
  return <FishingPackageCalculatorPage />;
}
