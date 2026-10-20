import type { Metadata } from "next";

import { placeDirectoryMetadata } from "@/components/places/place-directory-metadata";
import { PlaceDirectoryPage, type PlaceDirectorySearchParams } from "@/components/places/place-directory-page";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<PlaceDirectorySearchParams>;
}): Promise<Metadata> {
  return placeDirectoryMetadata("gym", searchParams);
}

export default function GymsPage({
  searchParams,
}: {
  searchParams: Promise<PlaceDirectorySearchParams>;
}) {
  return <PlaceDirectoryPage category="gym" searchParams={searchParams} />;
}
