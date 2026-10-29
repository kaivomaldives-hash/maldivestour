"use server";

import { revalidatePath, updateTag } from "next/cache";

import { logAdminAction } from "@/lib/admin/audit-log";
import { requireStaff } from "@/lib/admin/auth";
import { FISHING_CALCULATOR_CACHE_TAG } from "@/lib/fishing/package-calculator-repository";
import { parseFishingCalculatorConfig } from "@/lib/fishing/package-calculator-rates";
import { createClient } from "@/lib/supabase/server";

/**
 * requireStaff() is defense in depth, not the primary guard — the primary
 * guard is the `fishing_calculator_settings_staff_all` RLS policy. Same
 * pattern as src/lib/admin/holiday-pricing-actions.ts.
 */
export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

export async function saveFishingCalculatorConfig(raw: unknown): Promise<AdminActionResult> {
  await requireStaff();

  const parsed = parseFishingCalculatorConfig(raw);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("fishing_calculator_settings")
    .upsert({ id: 1, config: parsed.value } as unknown as never, { onConflict: "id" });
  if (error) {
    if (error.code === "42P01" || error.code === "PGRST205") {
      return { ok: false, error: "The fishing_calculator_settings table doesn't exist yet — run the migration first." };
    }
    return { ok: false, error: error.message };
  }

  await logAdminAction("fishing_calculator.update", "fishing_calculator_settings", "1", {
    packages: parsed.value.packages.map((p) => ({ key: p.key, pricePerDay: p.pricePerDay, active: p.active })),
  });

  updateTag(FISHING_CALCULATOR_CACHE_TAG);
  revalidatePath("/admin/fishing-calculator");
  revalidatePath("/maldives/fishing");
  revalidatePath("/maldives/fishing/calculator");
  return { ok: true };
}
