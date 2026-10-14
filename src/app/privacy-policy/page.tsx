import type { Metadata } from "next";

import { PrivacyPolicyPage } from "@/components/legal/privacy-policy-page";
import { privacyPolicyMetadata } from "@/components/legal/privacy-policy-metadata";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return privacyPolicyMetadata();
}

export default function Page() {
  return <PrivacyPolicyPage />;
}
