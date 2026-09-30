/** All prices in this project's database are USD (matches every
 * `price_from`/`currency default 'USD'` column across accommodations,
 * activities, packages, transfer_services, etc.) — USD is the base
 * currency for the whole conversion system (Task 19 §20). Never
 * rewritten per visitor; only the *display* value changes. */
export const BASE_CURRENCY = "USD" as const;

export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "AUD", "CHF", "CAD", "AED", "SGD", "JPY", "CNY", "MVR"] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

export const CURRENCY_LABELS: Record<SupportedCurrency, string> = {
  USD: "US Dollar (USD)",
  EUR: "Euro (EUR)",
  GBP: "British Pound (GBP)",
  AUD: "Australian Dollar (AUD)",
  CHF: "Swiss Franc (CHF)",
  CAD: "Canadian Dollar (CAD)",
  AED: "UAE Dirham (AED)",
  SGD: "Singapore Dollar (SGD)",
  JPY: "Japanese Yen (JPY)",
  CNY: "Chinese Yuan (CNY)",
  MVR: "Maldivian Rufiyaa (MVR)",
};

export type ExchangeRates = Partial<Record<SupportedCurrency, number>>;

/** Pure, client-safe -- deliberately kept out of rates.ts (which imports
 * "server-only" for its fetch call) so CurrencyProvider, a Client
 * Component, can import this without pulling a server-only module into
 * the client bundle (that combination fails the build outright). */
export function convert(baseAmount: number, targetCurrency: SupportedCurrency, rates: ExchangeRates): number | null {
  if (targetCurrency === BASE_CURRENCY) return baseAmount;
  const rate = rates[targetCurrency];
  if (rate === undefined) return null; // Unavailable -- caller shows the base currency instead.
  return baseAmount * rate;
}
