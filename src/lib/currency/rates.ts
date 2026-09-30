import "server-only";

import { BASE_CURRENCY, SUPPORTED_CURRENCIES, type ExchangeRates } from "@/lib/currency/types";

/**
 * Real exchange-rate source: the Frankfurter API (api.frankfurter.dev),
 * free, no API key, backed by official European Central Bank reference
 * rates. Task 19 §21/§22 explicitly forbids hard-coding today's rates
 * into components and forbids every product independently calling a
 * live rate API — this is the single centralized fetch, cached via
 * Next's own fetch cache (`next: { revalidate }`), not
 * src/lib/cache/cached-read.ts's unstable_cache (that helper is for
 * Supabase reads specifically; this is a plain external fetch, which
 * Next's fetch cache already handles natively).
 *
 * ECB reference rates don't cover every currency in
 * SUPPORTED_CURRENCIES (AED and MVR in particular are not ECB-tracked).
 * Any symbol the API doesn't return is simply absent from the returned
 * map — callers must treat a missing rate as "conversion unavailable,
 * show the base amount" (see <Price>), never as a crash or a silently
 * wrong number.
 */
const REVALIDATE_SECONDS = 6 * 60 * 60; // 6 hours -- rates don't need to be real-time for a display conversion.

const targets = SUPPORTED_CURRENCIES.filter((c) => c !== BASE_CURRENCY);

export async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${BASE_CURRENCY}&symbols=${targets.join(",")}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return {};

    const body = (await res.json()) as { rates?: Record<string, number> };
    if (!body.rates) return {};

    const rates: ExchangeRates = {};
    for (const currency of targets) {
      const rate = body.rates[currency];
      if (typeof rate === "number" && Number.isFinite(rate) && rate > 0) rates[currency] = rate;
    }
    return rates;
  } catch {
    // Network failure, malformed response, API down -- fail soft. The
    // page must render regardless (Task 19 §21): callers fall back to
    // showing the base USD amount, never a broken page.
    return {};
  }
}
