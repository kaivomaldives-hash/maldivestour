import type { Metadata } from "next";

import { transferTermsMetadata } from "@/components/legal/transfer-terms-metadata";
import { TransferTermsPage } from "@/components/legal/transfer-terms-page";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return transferTermsMetadata();
}

export default function Page() {
  return <TransferTermsPage />;
}
