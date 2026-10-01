import Link from "next/link";

import { ActivityForm } from "@/components/admin/activity-form";
import { getCategoryOptionsByGroup } from "@/lib/admin/node-relations-repository";
import { getProviderOptions } from "@/lib/admin/providers-repository";

export default async function NewActivityPage() {
  const [providerOptions, activityTypeOptions] = await Promise.all([getProviderOptions(), getCategoryOptionsByGroup("activity-type")]);

  return (
    <div>
      <Link href="/admin/activities" className="text-sm text-maldives-600 hover:underline">
        ← All activities
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">New activity</h1>
      <div className="mt-6">
        <ActivityForm providerOptions={providerOptions} activityTypeOptions={activityTypeOptions} />
      </div>
    </div>
  );
}
