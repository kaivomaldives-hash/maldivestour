"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * requireStaff() is defense in depth, not the primary guard — the primary
 * guard is `holiday_pricing_config_staff_all` RLS (supabase/migrations/
 * 20261001007000_holiday_builder_schema.sql). Same pattern as
 * src/lib/admin/partners-actions.ts.
 */
export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

export interface UpdatePricingConfigInput {
  priceUsd: number;
  sourceNote: string;
  sourceUrl: string | null;
  isActive: boolean;
}

export async function updateHolidayPricingConfig(id: string, input: UpdatePricingConfigInput): Promise<AdminActionResult> {
  await requireStaff();

  if (!Number.isFinite(input.priceUsd) || input.priceUsd < 0) return { ok: false, error: "Enter a valid, non-negative price." };
  if (!input.sourceNote.trim()) return { ok: false, error: "A source note is required — never leave a rate unexplained." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("holiday_pricing_config")
    .update({
      price_usd: input.priceUsd,
      source_note: input.sourceNote.trim(),
      source_url: input.sourceUrl?.trim() || null,
      is_active: input.isActive,
    } as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/holiday-pricing");
  return { ok: true };
}
