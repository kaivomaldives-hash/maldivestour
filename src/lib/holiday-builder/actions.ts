"use server";

import { getActivities, getNearbyActivities } from "@/lib/activities/repository";
import type { ActivitySummary } from "@/lib/activities/types";
import { calculateHolidayPrice, segmentsNightsMatch } from "@/lib/holiday-builder/pricing-calculator";
import { sendHolidayRequestNotification } from "@/lib/holiday-builder/notifications";
import { getActivePricingConfig } from "@/lib/holiday-builder/pricing-repository";
import { ACTIVITY_CATEGORIES_FOR_BUILDER } from "@/lib/holiday-builder/types";
import type { HolidayActivityOption, HolidaySelection, PriceBreakdown } from "@/lib/holiday-builder/types";
import { getLocationSummaryById, searchLocations } from "@/lib/locations/repository";
import { createClient } from "@/lib/supabase/server";

/**
 * Custom Holiday Builder server actions. The wizard (src/components/
 * holiday-builder/holiday-builder-wizard.tsx) calls these for data it
 * can't safely compute/fetch itself — the price is always recomputed
 * here from holiday_pricing_config immediately before saving, never
 * trusted from the client (see pricing-calculator.ts's own header).
 */

export async function getHolidayBuilderPricing() {
  return getActivePricingConfig();
}

export async function searchHolidayDestinations(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  const results = await searchLocations(trimmed, { limit: 10 });
  return results
    .filter((l) => l.locationType === "atoll" || l.locationType === "island")
    .map((l) => ({ id: l.id, title: l.title, locationType: l.locationType }));
}

/** Real bookable activities (diving/fishing/surfing/watersports/excursion
 * only — see ACTIVITY_CATEGORIES_FOR_BUILDER), optionally narrowed to a
 * destination. With no destination, every activity is in play. With one,
 * this reuses the same island-then-atoll tiered resolver as
 * getNearbyActivities() (accommodation/attraction pages) rather than a
 * strict single-location match — a destination like Himmafushi should
 * surface its own activities plus the rest of Kaafu Atoll's, matching
 * how "nearby" is defined everywhere else on the site. Reuses the
 * existing activities repository directly; no duplicate activity
 * records are created for this feature. */
export async function getHolidayBuilderActivities(destinationLocationId: string | null): Promise<HolidayActivityOption[]> {
  const allowed = new Set<string>(ACTIVITY_CATEGORIES_FOR_BUILDER);

  let items: ActivitySummary[];
  if (destinationLocationId) {
    const destination = await getLocationSummaryById(destinationLocationId);
    const isAtoll = destination?.locationType === "atoll";
    const nearby = await getNearbyActivities(
      { islandId: isAtoll ? null : destinationLocationId, atollId: isAtoll ? destinationLocationId : destination?.parentId ?? null },
      50,
    );
    items = [...nearby.islandActivities, ...nearby.atollActivities];
  } else {
    items = (await getActivities({ pageSize: 100 })).items;
  }

  return items
    .filter((a) => allowed.has(a.activityCategory))
    .map((a) => ({
      nodeId: a.id,
      slug: a.slug,
      title: a.title,
      category: a.activityCategory,
      priceFrom: a.priceFrom,
      currency: a.currency,
      durationMinutes: a.durationMinutes,
    }));
}

export interface LivePriceResult {
  ok: boolean;
  breakdown: PriceBreakdown | null;
  error?: string;
}

/** Server-computed price for the wizard's live preview — the wizard could
 * run calculateHolidayPrice() entirely client-side (the pricing config is
 * public data), but routing it through this action means the exact same
 * server code path is exercised on every keystroke as at final submission,
 * so there is never a gap between "what the preview showed" and "what the
 * server would compute." */
export async function getLiveHolidayPrice(selection: HolidaySelection): Promise<LivePriceResult> {
  if (!segmentsNightsMatch(selection)) {
    return { ok: false, breakdown: null, error: "Stay segment nights must add up to the total number of nights." };
  }
  const config = await getActivePricingConfig();
  const breakdown = calculateHolidayPrice(selection, config);
  return { ok: true, breakdown };
}

function isSpam(honeypot: string | undefined): boolean {
  return Boolean(honeypot && honeypot.trim().length > 0);
}

const GENERIC_ERROR = "Something went wrong. Please try again.";

export interface SubmitHolidayRequestInput {
  selection: HolidaySelection;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  additionalRequests: string;
  honeypot?: string;
}

export interface SubmitHolidayRequestResult {
  ok: boolean;
  reference?: string;
  error?: string;
}

export async function submitHolidayRequest(input: SubmitHolidayRequestInput): Promise<SubmitHolidayRequestResult> {
  if (isSpam(input.honeypot)) return { ok: false, error: GENERIC_ERROR };

  const name = input.customerName.trim();
  const email = input.customerEmail.trim();
  const whatsapp = input.customerWhatsapp.trim();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!whatsapp) return { ok: false, error: "Please enter your WhatsApp number." };
  if (!segmentsNightsMatch(input.selection)) return { ok: false, error: "Stay segment nights must add up to the total number of nights." };

  // Authoritative server-side recompute — the ONLY price ever persisted,
  // regardless of what total the client displayed.
  const config = await getActivePricingConfig();
  const breakdown = calculateHolidayPrice(input.selection, config);

  const supabase = await createClient();
  // src/types/database.ts is a placeholder (see src/lib/bookings/actions.ts's
  // own comment on this same cast convention).
  const { data, error } = await supabase
    .rpc("submit_holiday_quote_request" as unknown as never, {
      p_customer_name: name,
      p_customer_email: email,
      p_customer_whatsapp: whatsapp,
      p_additional_requests: input.additionalRequests.trim() || null,
      p_arrival_date: input.selection.arrivalDate,
      p_nights: input.selection.nights,
      p_adults: input.selection.adults,
      p_children: input.selection.children,
      p_rooms: input.selection.rooms,
      p_itinerary: input.selection,
      p_price_breakdown: breakdown,
      p_currency: "USD",
      p_estimated_total: breakdown.grandTotal,
    } as unknown as undefined)
    .single<{ id: string; reference: string }>();

  if (error || !data) {
    return { ok: false, error: GENERIC_ERROR };
  }

  await sendHolidayRequestNotification({
    reference: data.reference,
    customerName: name,
    customerEmail: email,
    customerWhatsapp: whatsapp,
    arrivalDate: input.selection.arrivalDate,
    nights: input.selection.nights,
    adults: input.selection.adults,
    children: input.selection.children,
    breakdown,
  });

  return { ok: true, reference: data.reference };
}
