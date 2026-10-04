/** Matches the `partner_requests.partner_type` check constraint exactly
 * (supabase/migrations/20261001005200_partner_requests.sql). */
export type PartnerType = "international_travel_agent" | "property_owner" | "activity_provider" | "transfer_provider";

export const PARTNER_TYPES: Array<{ value: PartnerType; label: string }> = [
  { value: "international_travel_agent", label: "International Travel Agent" },
  { value: "property_owner", label: "Property Owner" },
  { value: "activity_provider", label: "Activity Provider" },
  { value: "transfer_provider", label: "Transfer Provider" },
];

export function partnerTypeLabel(value: string): string {
  return PARTNER_TYPES.find((t) => t.value === value)?.label ?? value;
}
