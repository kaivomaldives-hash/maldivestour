import type { Metadata } from "next";

import { speedboatDirectoryMetadata } from "@/components/speedboats/speedboat-directory-metadata";
import { SpeedboatDirectoryPage } from "@/components/speedboats/speedboat-directory-page";

export function generateMetadata(): Metadata {
  return speedboatDirectoryMetadata();
}

export default function Page() {
  return <SpeedboatDirectoryPage />;
}
