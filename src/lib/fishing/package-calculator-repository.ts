import "server-only";

import { cachedRead } from "@/lib/cache/cached-read";
import {
  DEFAULT_FISHING_CALCULATOR_CONFIG,
  parseFishingCalculatorConfig,
  type FishingCalculatorConfig,
} from "@/lib/fishing/package-calculator-rates";
import { createClient } from "@/lib/supabase/public";

export const FISHING_CALCULATOR_CACHE_TAG = "fishing-calculator-config";

/**
 * Public read of the single fishing_calculator_settings row (supabase/
 * migrations/20261115002000_fishing_calculator_settings.sql). Falls back
 * to the built-in defaults when there is no row yet (before the first
 * admin save), the table doesn't exist yet, or the stored JSON doesn't
 * validate — the calculator always renders.
 */
async function getFishingCalculatorConfigUncached(): Promise<FishingCalculatorConfig> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fishing_calculator_settings")
    .select("config")
    .eq("id", 1)
    .maybeSingle<{ config: unknown }>();
  if (error || !data) return DEFAULT_FISHING_CALCULATOR_CONFIG;

  const parsed = parseFishingCalculatorConfig(data.config);
  if (!parsed.ok) {
    console.error("[fishing-calculator] stored config is invalid, using defaults:", parsed.error);
    return DEFAULT_FISHING_CALCULATOR_CONFIG;
  }
  return parsed.value;
}

export const getFishingCalculatorConfig = cachedRead(getFishingCalculatorConfigUncached, [FISHING_CALCULATOR_CACHE_TAG], 300);
