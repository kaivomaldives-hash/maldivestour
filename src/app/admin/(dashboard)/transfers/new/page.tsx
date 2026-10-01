import Link from "next/link";

import { TransferRouteForm } from "@/components/admin/transfer-route-form";
import { getCategoryOptionsByGroup } from "@/lib/admin/node-relations-repository";
import { getProviderOptions } from "@/lib/admin/providers-repository";

export default async function NewTransferRoutePage() {
  const [providerOptions, categoryOptions] = await Promise.all([getProviderOptions(), getCategoryOptionsByGroup("transfer-category")]);

  return (
    <div>
      <Link href="/admin/transfers" className="text-sm text-maldives-600 hover:underline">
        ← All transfer routes
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">New transfer route</h1>
      <div className="mt-6">
        <TransferRouteForm providerOptions={providerOptions} categoryOptions={categoryOptions} />
      </div>
    </div>
  );
}
