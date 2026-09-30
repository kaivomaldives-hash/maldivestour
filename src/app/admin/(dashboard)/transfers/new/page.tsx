import Link from "next/link";

import { TransferRouteForm } from "@/components/admin/transfer-route-form";
import { getProviderOptions } from "@/lib/admin/providers-repository";

export default async function NewTransferRoutePage() {
  const providerOptions = await getProviderOptions();

  return (
    <div>
      <Link href="/admin/transfers" className="text-sm text-maldives-600 hover:underline">
        ← All transfer routes
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">New transfer route</h1>
      <div className="mt-6">
        <TransferRouteForm providerOptions={providerOptions} />
      </div>
    </div>
  );
}
