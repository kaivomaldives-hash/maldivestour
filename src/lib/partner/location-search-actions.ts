"use server";

import { requirePartner } from "@/lib/partner/auth";
import { searchLocations } from "@/lib/locations/repository";

export interface PartnerLocationOption {
  id: string;
  title: string;
  locationType: string;
}

/** Same underlying search as the staff LocationPicker's searchLocationOptions
 * (src/lib/admin/node-relations-actions.ts), just gated by requirePartner()
 * instead of requireStaff() — searchLocations() itself has no staff check,
 * it's already scoped to published locations only. */
export async function searchLocationOptionsForPartner(query: string): Promise<PartnerLocationOption[]> {
  await requirePartner();
  const results = await searchLocations(query, { limit: 15 });
  return results.map((r) => ({ id: r.id, title: r.title, locationType: r.locationType }));
}
