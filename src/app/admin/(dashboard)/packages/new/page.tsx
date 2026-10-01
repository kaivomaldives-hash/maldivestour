import Link from "next/link";

import { PackageForm } from "@/components/admin/package-form";
import { getCategoryOptionsByGroup } from "@/lib/admin/node-relations-repository";
import { getProviderOptions } from "@/lib/admin/providers-repository";

export default async function NewPackagePage() {
  const [providerOptions, travelerType, style, theme] = await Promise.all([
    getProviderOptions(),
    getCategoryOptionsByGroup("traveler-type"),
    getCategoryOptionsByGroup("package-style"),
    getCategoryOptionsByGroup("theme"),
  ]);

  return (
    <div>
      <Link href="/admin/packages" className="text-sm text-maldives-600 hover:underline">
        ← All packages
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">New package</h1>
      <div className="mt-6">
        <PackageForm providerOptions={providerOptions} categoryOptions={{ travelerType, style, theme }} />
      </div>
    </div>
  );
}
