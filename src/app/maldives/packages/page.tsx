import type { Metadata } from "next";

import {
  packageDirectoryMetadata,
  type PackageDirectorySearchParams,
} from "@/components/packages/package-directory-metadata";
import { PackageDirectoryPage } from "@/components/packages/package-directory-page";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<PackageDirectorySearchParams>;
}): Promise<Metadata> {
  return packageDirectoryMetadata(searchParams);
}

export default function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<PackageDirectorySearchParams>;
}) {
  return <PackageDirectoryPage searchParams={searchParams} />;
}
