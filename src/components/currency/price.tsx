"use client";

import { useCurrency } from "@/components/currency/currency-context";
import { BASE_CURRENCY, type SupportedCurrency } from "@/lib/currency/types";

function formatAmount(amount: number, currency: SupportedCurrency): string {
  // JPY has no minor unit in real-world display; every other supported
  // currency here uses 0-decimal display too, matching how MTG's existing
  // USD prices are already shown elsewhere on the site (whole dollars).
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Reusable price display (Task 19 §24). `baseAmount`/`baseCurrency` are
 * whatever the database actually stores for this product — never
 * rewritten. This component only ever changes what's *displayed*; the
 * booking/inquiry flow always uses baseAmount/baseCurrency server-side,
 * never a value read back from this component (Task 19 §23).
 */
export function Price({ baseAmount, baseCurrency = BASE_CURRENCY, className }: { baseAmount: number; baseCurrency?: SupportedCurrency; className?: string }) {
  const { currency, convertFromUsd } = useCurrency();

  if (currency === baseCurrency) {
    return <span className={className}>{formatAmount(baseAmount, baseCurrency)}</span>;
  }

  const converted = baseCurrency === BASE_CURRENCY ? convertFromUsd(baseAmount) : null;
  if (converted === null) {
    // Rate unavailable -- show the real base-currency price rather than
    // a fabricated or stale-looking converted number (Task 19 §21/§22).
    return <span className={className}>{formatAmount(baseAmount, baseCurrency)}</span>;
  }

  return (
    <span className={className}>
      <span aria-hidden="true">≈ </span>
      {formatAmount(converted, currency)}
      <span className="sr-only"> (converted from {formatAmount(baseAmount, baseCurrency)})</span>
    </span>
  );
}
