import type { Metadata } from "next";

import { packageDetailMetadata } from "@/components/packages/package-detail-metadata";
import { PackageDetailPage } from "@/components/packages/package-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4560;

interface Params {
  package: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { package: slug } = await params;
  return packageDetailMetadata(slug);
}

export default async function PackageDetailRoute({ params }: { params: Promise<Params> }) {
  const { package: slug } = await params;
  return <PackageDetailPage slug={slug} />;
}
