import type { Metadata } from "next";

import {
  TransferDirectoryPage,
  transferDirectoryMetadata,
  type TransferDirectorySearchParams,
} from "@/components/transfers/transfer-directory-page";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<TransferDirectorySearchParams>;
}): Promise<Metadata> {
  return transferDirectoryMetadata(searchParams);
}

export default function TransfersPage({
  searchParams,
}: {
  searchParams: Promise<TransferDirectorySearchParams>;
}) {
  return <TransferDirectoryPage searchParams={searchParams} />;
}
