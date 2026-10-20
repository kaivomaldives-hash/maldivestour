import type { Metadata } from "next";

import { placeDirectoryMetadata } from "@/components/places/place-directory-metadata";
import { PlaceDirectoryPage, type PlaceDirectorySearchParams } from "@/components/places/place-directory-page";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<PlaceDirectorySearchParams>;
}): Promise<Metadata> {
  return placeDirectoryMetadata("hospital", searchParams);
}

export default function HospitalsPage({
  searchParams,
}: {
  searchParams: Promise<PlaceDirectorySearchParams>;
}) {
  return <PlaceDirectoryPage category="hospital" searchParams={searchParams} />;
}
