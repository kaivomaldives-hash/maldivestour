import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityForm } from "@/components/admin/activity-form";
import { requireStaff } from "@/lib/admin/auth";
import { getActivityByIdAdmin } from "@/lib/admin/activities-repository";
import { getNodeMediaAdmin } from "@/lib/admin/media-repository";
import { getAllLocationsForNode, getCategoryIdsForNode, getCategoryOptionsByGroup } from "@/lib/admin/node-relations-repository";
import { getProviderOptions } from "@/lib/admin/providers-repository";

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const [activity, locations, media, providerOptions, activityTypeOptions, categoryIds] = await Promise.all([
    getActivityByIdAdmin(id),
    getAllLocationsForNode(id),
    getNodeMediaAdmin(id),
    getProviderOptions(),
    getCategoryOptionsByGroup("activity-type"),
    getCategoryIdsForNode(id),
  ]);
  if (!activity) notFound();

  const categoryIdSet = new Set(categoryIds);
  const activityTypeIds = activityTypeOptions.filter((c) => categoryIdSet.has(c.id)).map((c) => c.id);

  return (
    <div>
      <Link href="/admin/activities" className="text-sm text-maldives-600 hover:underline">
        ← All activities
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{activity.title}</h1>
      <div className="mt-6">
        <ActivityForm
          providerOptions={providerOptions}
          activityTypeOptions={activityTypeOptions}
          initial={{
            id: activity.id,
            core: {
              title: activity.title,
              slug: activity.slug,
              summary: activity.summary,
              status: activity.status,
              metaTitle: activity.metaTitle,
              metaDescription: activity.metaDescription,
            },
            fields: activity.fields,
            locations,
            media,
            activityTypeIds,
          }}
        />
      </div>
    </div>
  );
}
