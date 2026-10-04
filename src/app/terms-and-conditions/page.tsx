import type { Metadata } from "next";

import { termsOfServiceMetadata, TermsOfServicePage } from "@/components/legal/terms-of-service-page";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return termsOfServiceMetadata();
}

export default function Page() {
  return <TermsOfServicePage />;
}
