import Link from "next/link";

import { ActivityForm } from "@/components/admin/activity-form";
import { getProviderOptions } from "@/lib/admin/providers-repository";

export default async function NewActivityPage() {
  const providerOptions = await getProviderOptions();

  return (
    <div>
      <Link href="/admin/activities" className="text-sm text-maldives-600 hover:underline">
        ← All activities
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">New activity</h1>
      <div className="mt-6">
        <ActivityForm providerOptions={providerOptions} />
      </div>
    </div>
  );
}
