import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityForm } from "@/components/admin/activity-form";
import { requireStaff } from "@/lib/admin/auth";
import { getActivityByIdAdmin } from "@/lib/admin/activities-repository";
import { getNodeMediaAdmin } from "@/lib/admin/media-repository";
import { getPrimaryLocationForNode } from "@/lib/admin/node-relations-repository";
import { getProviderOptions } from "@/lib/admin/providers-repository";

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const [activity, primaryLocation, media, providerOptions] = await Promise.all([
    getActivityByIdAdmin(id),
    getPrimaryLocationForNode(id),
    getNodeMediaAdmin(id),
    getProviderOptions(),
  ]);
  if (!activity) notFound();

  return (
    <div>
      <Link href="/admin/activities" className="text-sm text-maldives-600 hover:underline">
        ← All activities
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{activity.title}</h1>
      <div className="mt-6">
        <ActivityForm
          providerOptions={providerOptions}
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
            primaryLocation,
            media,
          }}
        />
      </div>
    </div>
  );
}
