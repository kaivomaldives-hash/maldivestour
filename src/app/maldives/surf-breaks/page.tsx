import type { Metadata } from "next";

import {
  surfBreakDirectoryMetadata,
  type SurfBreakDirectorySearchParams,
} from "@/components/surfing/surf-break-directory-metadata";
import { SurfBreakDirectoryPage } from "@/components/surfing/surf-break-directory-page";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SurfBreakDirectorySearchParams>;
}): Promise<Metadata> {
  return surfBreakDirectoryMetadata(searchParams);
}

export default function SurfBreaksPage({
  searchParams,
}: {
  searchParams: Promise<SurfBreakDirectorySearchParams>;
}) {
  return <SurfBreakDirectoryPage searchParams={searchParams} />;
}
