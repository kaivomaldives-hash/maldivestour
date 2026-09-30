import Link from "next/link";
import { notFound } from "next/navigation";

import { TransferRouteForm } from "@/components/admin/transfer-route-form";
import { requireStaff } from "@/lib/admin/auth";
import { getNodeMediaAdmin } from "@/lib/admin/media-repository";
import { getLocationOptionsByIds } from "@/lib/admin/node-relations-repository";
import { getProviderOptions } from "@/lib/admin/providers-repository";
import { getTransferRouteByIdAdmin, getTransferServicesForRouteAdmin } from "@/lib/admin/transfers-repository";

export default async function EditTransferRoutePage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const route = await getTransferRouteByIdAdmin(id);
  if (!route) notFound();

  const [locationOptions, media, providerOptions, services] = await Promise.all([
    getLocationOptionsByIds([route.fields.originLocationId, route.fields.destinationLocationId]),
    getNodeMediaAdmin(id),
    getProviderOptions(),
    getTransferServicesForRouteAdmin(id),
  ]);

  return (
    <div>
      <Link href="/admin/transfers" className="text-sm text-maldives-600 hover:underline">
        ← All transfer routes
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{route.title}</h1>
      <div className="mt-6">
        <TransferRouteForm
          providerOptions={providerOptions}
          initial={{
            id: route.id,
            core: {
              title: route.title,
              slug: route.slug,
              summary: route.summary,
              status: route.status,
              metaTitle: route.metaTitle,
              metaDescription: route.metaDescription,
            },
            fields: route.fields,
            originLocation: locationOptions.get(route.fields.originLocationId) ?? null,
            destinationLocation: locationOptions.get(route.fields.destinationLocationId) ?? null,
            media,
            services,
          }}
        />
      </div>
    </div>
  );
}
