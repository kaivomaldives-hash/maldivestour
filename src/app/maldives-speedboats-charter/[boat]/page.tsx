import type { Metadata } from "next";

import { speedboatDetailMetadata } from "@/components/speedboats/speedboat-detail-metadata";
import { SpeedboatDetailPage } from "@/components/speedboats/speedboat-detail-page";

export async function generateMetadata({ params }: { params: Promise<{ boat: string }> }): Promise<Metadata> {
  const { boat } = await params;
  return speedboatDetailMetadata(boat);
}

export default async function Page({ params }: { params: Promise<{ boat: string }> }) {
  const { boat } = await params;
  return <SpeedboatDetailPage slug={boat} />;
}
