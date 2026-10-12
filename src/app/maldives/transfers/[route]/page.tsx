import type { Metadata } from "next";

import { TransferRouteDetailPage, transferRouteDetailMetadata } from "@/components/transfers/transfer-route-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4980;

interface Params {
  route: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { route } = await params;
  return transferRouteDetailMetadata(route);
}

export default async function TransferRouteDetailRoute({ params }: { params: Promise<Params> }) {
  const { route } = await params;
  return <TransferRouteDetailPage slug={route} />;
}
