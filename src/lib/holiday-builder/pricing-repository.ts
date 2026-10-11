import "server-only";

import { cachedRead } from "@/lib/cache/cached-read";
import { createClient } from "@/lib/supabase/public";
import type { PricingConfigRow, PricingUnit, StayType } from "@/lib/holiday-builder/types";

/**
 * Public read of active holiday_pricing_config rows (supabase/migrations/
 * 20261001007000_holiday_builder_schema.sql) — governed by the
 * `holiday_pricing_config_public_read` RLS policy (active rows only), the
 * same trust level as any other public price on this site. Staff-only
 * fields (source_note, source_url, valid_from/to) are deliberately not
 * selected here — this function feeds the customer-facing live price
 * preview, never the admin pricing page (see src/lib/admin/
 * holiday-pricing-repository.ts for the staff view with full detail).
 */

interface PricingConfigRowDb {
  id: string;
  category: PricingConfigRow["category"];
  stay_type: StayType | null;
  key: string;
  label: string;
  price_usd: number;
  unit: PricingUnit;
  sort_order: number;
}

async function getActivePricingConfigUncached(): Promise<PricingConfigRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("holiday_pricing_config")
    .select("id, category, stay_type, key, label, price_usd, unit, sort_order")
    .eq("is_active", true)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })
    .returns<PricingConfigRowDb[]>();

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    category: row.category,
    stayType: row.stay_type,
    key: row.key,
    label: row.label,
    priceUsd: Number(row.price_usd),
    unit: row.unit,
    sortOrder: row.sort_order,
  }));
}

// Rates change rarely (staff-edited), but this is read on every
// customize-holiday page view — cached like every other filter-independent
// read in this codebase (src/lib/cache/cached-read.ts).
export const getActivePricingConfig = cachedRead(getActivePricingConfigUncached, ["holiday-pricing-config"], 300);
