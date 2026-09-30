import Link from "next/link";
import { notFound } from "next/navigation";

import { AccommodationForm } from "@/components/admin/accommodation-form";
import { requireStaff } from "@/lib/admin/auth";
import { getAccommodationByIdAdmin } from "@/lib/admin/accommodations-repository";
import { getNodeMediaAdmin } from "@/lib/admin/media-repository";
import { getPrimaryLocationForNode } from "@/lib/admin/node-relations-repository";
import { getProviderOptions } from "@/lib/admin/providers-repository";

export default async function EditAccommodationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const [accommodation, primaryLocation, media, providerOptions] = await Promise.all([
    getAccommodationByIdAdmin(id),
    getPrimaryLocationForNode(id),
    getNodeMediaAdmin(id),
    getProviderOptions(),
  ]);
  if (!accommodation) notFound();

  return (
    <div>
      <Link href="/admin/accommodations" className="text-sm text-maldives-600 hover:underline">
        ← All accommodations
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{accommodation.title}</h1>
      <div className="mt-6">
        <AccommodationForm
          providerOptions={providerOptions}
          initial={{
            id: accommodation.id,
            core: {
              title: accommodation.title,
              slug: accommodation.slug,
              summary: accommodation.summary,
              status: accommodation.status,
              metaTitle: accommodation.metaTitle,
              metaDescription: accommodation.metaDescription,
            },
            fields: accommodation.fields,
            primaryLocation,
            media,
          }}
        />
      </div>
    </div>
  );
}
