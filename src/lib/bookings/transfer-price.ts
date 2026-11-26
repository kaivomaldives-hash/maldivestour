/**
 * Shared transfer prices are per adult, one way. Children (2-11 years) pay
 * half the adult price on every route, infants (under 2) travel free, and a
 * round trip is two legs. Private transfer prices are per boat, one way. Used by both the booking form (live estimate)
 * and the server action (the stored estimate and the emails), so the two
 * always agree.
 */
export const CHILD_RATE = 0.5;

export interface TransferEstimate {
  total: number;
  childPrice: number;
  legs: 1 | 2;
  breakdown: string;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * The standard payment line in the transfer confirmation email (and shown
 * in admin as a preview). `total` is the quoted price, else the estimate.
 */
export function transferPaymentText(total: number | null, currency: string, roundTrip: boolean): string {
  const lead = total != null ? `Your total amount is ${currency} ${total}, payable` : "Payable";
  return `${lead} in cash${currency === "USD" ? " (USD)" : ""} or crypto (USDT). We do not accept card payments on boats.${
    roundTrip ? " You may also pay separately for each way." : ""
  }`;
}

/** Notes that the old admin form saved automatically; the standard line replaces them. */
export function isAutoPaymentNote(note: string | null | undefined): boolean {
  return !note || /^(Your total for this transfer is|Payable in cash or by Crypto USDT)/.test(note.trim());
}

export function calculateTransferEstimate(
  adultPrice: number,
  adults: number,
  children: number,
  tripType: "one_way" | "round_trip",
  currency: string,
  perBoat = false,
): TransferEstimate {
  const legs = tripType === "round_trip" ? 2 : 1;
  // Private transfers are one price for the whole boat, whatever the group size.
  if (perBoat) {
    return {
      total: round2(adultPrice * legs),
      childPrice: 0,
      legs,
      breakdown: `private boat × ${currency} ${adultPrice}${legs === 2 ? ", × 2 (round trip)" : ""}`,
    };
  }
  const childPrice = round2(adultPrice * CHILD_RATE);
  const total = round2((adultPrice * adults + childPrice * children) * legs);

  const parts = [`${adults} adult${adults === 1 ? "" : "s"} × ${currency} ${adultPrice}`];
  if (children > 0) parts.push(`${children} child${children === 1 ? "" : "ren"} × ${currency} ${childPrice}`);
  const breakdown = `${parts.join(" + ")}${legs === 2 ? ", × 2 (round trip)" : ""}`;

  return { total, childPrice, legs, breakdown };
}
