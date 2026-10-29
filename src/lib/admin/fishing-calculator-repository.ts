import "server-only";

import {
  DEFAULT_FISHING_CALCULATOR_CONFIG,
  parseFishingCalculatorConfig,
  type FishingCalculatorConfig,
} from "@/lib/fishing/package-calculator-rates";
import { createClient } from "@/lib/supabase/server";

export interface AdminFishingCalculatorSettings {
  config: FishingCalculatorConfig;
  /** "stored" = the saved row; "defaults" = nothing saved yet;
   * "missing-table" = the migration hasn't been applied. */
  source: "stored" | "defaults" | "missing-table";
  updatedAt: string | null;
  error?: string;
}

/** Uncached staff read for /admin/fishing-calculator. */
export async function getFishingCalculatorSettingsAdmin(): Promise<AdminFishingCalculatorSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fishing_calculator_settings")
    .select("config, updated_at")
    .eq("id", 1)
    .maybeSingle<{ config: unknown; updated_at: string }>();

  if (error) {
    const missing = error.code === "42P01" || error.code === "PGRST205";
    return { config: DEFAULT_FISHING_CALCULATOR_CONFIG, source: missing ? "missing-table" : "defaults", updatedAt: null, error: missing ? undefined : error.message };
  }
  if (!data) return { config: DEFAULT_FISHING_CALCULATOR_CONFIG, source: "defaults", updatedAt: null };

  const parsed = parseFishingCalculatorConfig(data.config);
  if (!parsed.ok) return { config: DEFAULT_FISHING_CALCULATOR_CONFIG, source: "defaults", updatedAt: data.updated_at, error: `Stored settings are invalid (${parsed.error}); showing defaults.` };
  return { config: parsed.value, source: "stored", updatedAt: data.updated_at };
}
