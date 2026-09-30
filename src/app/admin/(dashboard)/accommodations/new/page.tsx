import Link from "next/link";

import { AccommodationForm } from "@/components/admin/accommodation-form";
import { getProviderOptions } from "@/lib/admin/providers-repository";

export default async function NewAccommodationPage() {
  const providerOptions = await getProviderOptions();

  return (
    <div>
      <Link href="/admin/accommodations" className="text-sm text-maldives-600 hover:underline">
        ← All accommodations
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">New accommodation</h1>
      <div className="mt-6">
        <AccommodationForm providerOptions={providerOptions} />
      </div>
    </div>
  );
}
