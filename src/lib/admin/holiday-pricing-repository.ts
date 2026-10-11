import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only reads of holiday_pricing_config, including the staff-only
 * disclosure fields (source_note, source_url, valid_from/to) that the
 * public-facing src/lib/holiday-builder/pricing-repository.ts deliberately
 * omits. Governed by the `holiday_pricing_config_staff_all` RLS policy.
 */

export interface AdminPricingConfigRow {
  id: string;
  category: string;
  stayType: string | null;
  key: string;
  label: string;
  priceUsd: number;
  unit: string;
  sourceNote: string;
  sourceUrl: string | null;
  validFrom: string | null;
  validTo: string | null;
  isActive: boolean;
  sortOrder: number;
  updatedAt: string;
}

interface PricingConfigRowDb {
  id: string;
  category: string;
  stay_type: string | null;
  key: string;
  label: string;
  price_usd: number;
  unit: string;
  source_note: string;
  source_url: string | null;
  valid_from: string | null;
  valid_to: string | null;
  is_active: boolean;
  sort_order: number;
  updated_at: string;
}

function toRow(row: PricingConfigRowDb): AdminPricingConfigRow {
  return {
    id: row.id,
    category: row.category,
    stayType: row.stay_type,
    key: row.key,
    label: row.label,
    priceUsd: Number(row.price_usd),
    unit: row.unit,
    sourceNote: row.source_note,
    sourceUrl: row.source_url,
    validFrom: row.valid_from,
    validTo: row.valid_to,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

export async function getAllPricingConfigAdmin(): Promise<AdminPricingConfigRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("holiday_pricing_config")
    .select("id, category, stay_type, key, label, price_usd, unit, source_note, source_url, valid_from, valid_to, is_active, sort_order, updated_at")
    .order("category", { ascending: true })
    .order("stay_type", { ascending: true })
    .order("sort_order", { ascending: true })
    .returns<PricingConfigRowDb[]>();

  if (error || !data) return [];
  return data.map(toRow);
}
