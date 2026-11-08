import type { Metadata } from "next";

import { partnerTermsMetadata } from "@/components/legal/partner-terms-metadata";
import { PartnerTermsPage } from "@/components/legal/partner-terms-page";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return partnerTermsMetadata();
}

export default function Page() {
  return <PartnerTermsPage />;
}
