import Link from "next/link";
import { notFound } from "next/navigation";

import { PackageForm } from "@/components/admin/package-form";
import { requireStaff } from "@/lib/admin/auth";
import { getNodeMediaAdmin } from "@/lib/admin/media-repository";
import { getCategoryIdsForNode, getCategoryOptionsByGroup, getPrimaryLocationForNode } from "@/lib/admin/node-relations-repository";
import { getItineraryForPackageAdmin, getPackageByIdAdmin } from "@/lib/admin/packages-repository";
import { getProviderOptions } from "@/lib/admin/providers-repository";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const [pkg, media, providerOptions, itineraryStages, primaryLocation, travelerType, style, theme, categoryIds] = await Promise.all([
    getPackageByIdAdmin(id),
    getNodeMediaAdmin(id),
    getProviderOptions(),
    getItineraryForPackageAdmin(id),
    getPrimaryLocationForNode(id),
    getCategoryOptionsByGroup("traveler-type"),
    getCategoryOptionsByGroup("package-style"),
    getCategoryOptionsByGroup("theme"),
    getCategoryIdsForNode(id),
  ]);
  if (!pkg) notFound();

  const categoryIdSet = new Set(categoryIds);

  return (
    <div>
      <Link href="/admin/packages" className="text-sm text-maldives-600 hover:underline">
        ← All packages
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{pkg.title}</h1>
      <div className="mt-6">
        <PackageForm
          providerOptions={providerOptions}
          categoryOptions={{ travelerType, style, theme }}
          initial={{
            id: pkg.id,
            core: {
              title: pkg.title,
              slug: pkg.slug,
              summary: pkg.summary,
              status: pkg.status,
              metaTitle: pkg.metaTitle,
              metaDescription: pkg.metaDescription,
            },
            fields: pkg.fields,
            media,
            itineraryStages,
            primaryLocation,
            travelerTypeIds: travelerType.filter((c) => categoryIdSet.has(c.id)).map((c) => c.id),
            styleIds: style.filter((c) => categoryIdSet.has(c.id)).map((c) => c.id),
            themeIds: theme.filter((c) => categoryIdSet.has(c.id)).map((c) => c.id),
          }}
        />
      </div>
    </div>
  );
}
