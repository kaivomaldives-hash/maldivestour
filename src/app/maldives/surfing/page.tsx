import type { Metadata } from "next";

import {
  surfingDirectoryMetadata,
  type SurfingDirectorySearchParams,
} from "@/components/surfing/surfing-directory-metadata";
import { SurfingDirectoryPage } from "@/components/surfing/surfing-directory-page";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SurfingDirectorySearchParams>;
}): Promise<Metadata> {
  return surfingDirectoryMetadata(searchParams);
}

export default function SurfingPage({
  searchParams,
}: {
  searchParams: Promise<SurfingDirectorySearchParams>;
}) {
  return <SurfingDirectoryPage searchParams={searchParams} />;
}
