import type { Metadata } from "next";

import { EmperorPage } from "@/components/fishing/emperor-page";
import { emperorPageMetadata } from "@/components/fishing/emperor-page-metadata";

export function generateMetadata(): Metadata {
  return emperorPageMetadata();
}

export default function Page() {
  return <EmperorPage />;
}
