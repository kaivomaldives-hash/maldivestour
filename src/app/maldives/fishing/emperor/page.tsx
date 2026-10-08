import type { Metadata } from "next";

import { EmperorPage, emperorPageMetadata } from "@/components/fishing/emperor-page";

export function generateMetadata(): Metadata {
  return emperorPageMetadata();
}

export default function Page() {
  return <EmperorPage />;
}
