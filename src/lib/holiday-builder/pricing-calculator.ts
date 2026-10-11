import type { HolidaySelection, PriceBreakdown, PriceBreakdownLine, PricingConfigRow, StayType } from "@/lib/holiday-builder/types";

/**
 * Pure price calculator — no I/O, no imports of server-only code. This is
 * the ONE place the price is computed, imported by both:
 *   - the client-side wizard (src/components/holiday-builder/...), for
 *     the live-updating preview as the customer changes selections, and
 *   - the server action (src/lib/holiday-builder/actions.ts), which
 *     recomputes the price from the selection immediately before saving —
 *     the client's own computed total is never trusted or persisted
 *     as-is, only this server-side recomputation is.
 * Running the exact same function on both sides means the live preview
 * the customer sees during the wizard can never drift from what they're
 * actually charged at submission.
 */

const ROOM_CATEGORY_BY_STAY_TYPE: Record<StayType, PricingConfigRow["category"]> = {
  resort: "resort_room",
  local_island: "local_island_room",
  safari: "safari_cabin",
};

const MEAL_PLAN_CATEGORY_BY_STAY_TYPE: Partial<Record<StayType, PricingConfigRow["category"]>> = {
  resort: "meal_plan_resort",
  local_island: "meal_plan_local_island",
  // Safari has no entry — liveaboard cabin rates are full-board inclusive,
  // no separate meal-plan surcharge (see the pricing seed migration).
};

function findRate(config: PricingConfigRow[], category: PricingConfigRow["category"], stayType: StayType | null, key: string): PricingConfigRow | undefined {
  return config.find((row) => row.category === category && row.stayType === stayType && row.key === key);
}

export function calculateHolidayPrice(selection: HolidaySelection, config: PricingConfigRow[]): PriceBreakdown {
  const lines: PriceBreakdownLine[] = [];
  const totalGuests = selection.adults + selection.children;

  let accommodationTotal = 0;
  let mealPlanTotal = 0;

  for (const segment of selection.segments) {
    const roomCategory = ROOM_CATEGORY_BY_STAY_TYPE[segment.stayType];
    const roomRate = findRate(config, roomCategory, segment.stayType, segment.roomKey);
    if (roomRate) {
      const amount = roomRate.unit === "per_person_per_night" ? roomRate.priceUsd * segment.nights * totalGuests : roomRate.priceUsd * segment.nights * selection.rooms;
      accommodationTotal += amount;
      lines.push({ label: `${roomRate.label} — ${segment.nights} night${segment.nights === 1 ? "" : "s"}`, amount });
    }

    const mealCategory = MEAL_PLAN_CATEGORY_BY_STAY_TYPE[segment.stayType];
    if (mealCategory) {
      const mealRate = findRate(config, mealCategory, segment.stayType, segment.mealPlan);
      if (mealRate && mealRate.priceUsd > 0) {
        const amount = mealRate.priceUsd * segment.nights * totalGuests;
        mealPlanTotal += amount;
        lines.push({ label: `${mealRate.label} — ${segment.nights} night${segment.nights === 1 ? "" : "s"}`, amount });
      }
    }
  }

  let activitiesTotal = 0;
  for (const selected of selection.dayActivities) {
    const price = selected.activity.priceFrom ?? 0;
    const amount = price * totalGuests;
    activitiesTotal += amount;
    lines.push({ label: `Day ${selected.day}: ${selected.activity.title}`, amount });
  }

  let transferTotal = 0;
  const transferRate = findRate(config, "transfer", null, selection.transfer);
  if (transferRate) {
    const perWay = transferRate.unit === "per_boat_per_way" ? transferRate.priceUsd : transferRate.priceUsd * totalGuests;
    transferTotal = perWay * 2; // round trip
    lines.push({ label: `${transferRate.label} (round trip)`, amount: transferTotal });
  }

  const grandTotal = accommodationTotal + mealPlanTotal + activitiesTotal + transferTotal;

  return {
    currency: "USD",
    accommodationTotal: round2(accommodationTotal),
    mealPlanTotal: round2(mealPlanTotal),
    activitiesTotal: round2(activitiesTotal),
    transferTotal: round2(transferTotal),
    grandTotal: round2(grandTotal),
    lines: lines.map((l) => ({ ...l, amount: round2(l.amount) })),
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Nights across all segments must equal the holiday's total nights —
 * enforced both client-side (immediate feedback) and server-side (actions.ts
 * refuses to price/submit a mismatched selection). */
export function segmentsNightsMatch(selection: HolidaySelection): boolean {
  const total = selection.segments.reduce((sum, s) => sum + s.nights, 0);
  return total === selection.nights;
}
