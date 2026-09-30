"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { BASE_CURRENCY, convert, isSupportedCurrency, type ExchangeRates, type SupportedCurrency } from "@/lib/currency/types";

const COOKIE_NAME = "mtg_currency";

interface CurrencyContextValue {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  /** Converts a USD base amount to the visitor's selected display
   * currency. Returns null when a rate isn't available (API down, or
   * this currency isn't covered by the rate source) -- callers must
   * fall back to showing the base USD amount, per Task 19 §21. */
  convertFromUsd: (baseAmount: number) => number | null;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readCookieCurrency(): SupportedCurrency | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return value && isSupportedCurrency(value) ? value : null;
}

/**
 * Deliberately does NOT read the currency cookie in a Server Component —
 * doing that in the root layout (which wraps every page) would call
 * `cookies()` from `next/headers` on every single request, which forces
 * the ENTIRE route out of static rendering. That's the exact site-wide
 * performance regression this project spent significant effort fixing
 * earlier. Currency is explicitly a client-side/cookie-based preference
 * (Task 19 §25), not URL-authoritative content, so hydrating it
 * client-side after mount — with a brief default-USD flash on repeat
 * visits — is the correct tradeoff, not a shortcut.
 *
 * `rates` comes from the server (a cached, cookie-free fetch — see
 * src/lib/currency/rates.ts) via a prop, not a client-side fetch.
 */
export function CurrencyProvider({ rates, children }: { rates: ExchangeRates; children: ReactNode }) {
  const [currency, setCurrencyState] = useState<SupportedCurrency>(BASE_CURRENCY);

  useEffect(() => {
    const stored = readCookieCurrency();
    // Hydrating from an external browser-only API (the cookie) after
    // mount, not deriving state from props/state already available
    // during render -- the case the rule's own message calls out as
    // acceptable ("subscribe... calling setState when external state
    // changes"). Matches the one other precedent for a targeted disable
    // in this codebase (src/components/diving/dive-sites-map.tsx).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setCurrencyState(stored);
  }, []);

  const setCurrency = useCallback((next: SupportedCurrency) => {
    setCurrencyState(next);
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(next)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }, []);

  const convertFromUsd = useCallback((baseAmount: number) => convert(baseAmount, currency, rates), [currency, rates]);

  return <CurrencyContext.Provider value={{ currency, setCurrency, convertFromUsd }}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
