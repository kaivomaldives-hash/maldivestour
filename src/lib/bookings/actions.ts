"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Connects to the booking system Task 2/3 already built
 * (supabase/migrations/20250101001000_booking.sql /
 * 20250101001300_functions_triggers.sql's create_booking_inquiry RPC) —
 * never a second, disconnected booking implementation. That RPC already
 * handles guest checkout (user_id is auth.uid(), nullable), server-side
 * validation (customer_name/email required, valid email format), and
 * auto-generates the booking_reference (MTG-<year>-<sequence>) via its
 * own trigger. This action is a thin, typed wrapper around it — the ONLY
 * new thing here is a UI ever calling it, which nothing in the codebase
 * did before Task 18.
 */

export interface TransferBookingInquiryInput {
  transferServiceId: string;
  originLocationId: string | null;
  destinationLocationId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp: string;
  travelDate: string; // YYYY-MM-DD
  travelTime: string | null; // HH:MM
  returnDate: string | null;
  returnTime: string | null;
  tripType: "one_way" | "round_trip";
  adults: number;
  children: number;
  infants: number;
  flightNumber: string | null;
  specialRequests: string | null;
  estimatedPrice: number | null;
  currency: string;
}

export interface TransferBookingInquiryResult {
  ok: boolean;
  bookingReference?: string;
  error?: string;
}

export async function createTransferBookingInquiry(
  input: TransferBookingInquiryInput,
): Promise<TransferBookingInquiryResult> {
  const name = input.customerName.trim();
  const email = input.customerEmail.trim();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!input.travelDate) return { ok: false, error: "Please choose a travel date." };
  if (input.tripType === "round_trip" && !input.returnDate) {
    return { ok: false, error: "Please choose a return date for a round trip." };
  }

  // src/types/database.ts is a placeholder (`Functions: Record<string,
  // never>`, see its own header comment — this Supabase project's types
  // haven't been generated from a live/local DB yet). Rather than widen
  // the shared client's own type, the mismatch is contained to exactly
  // this one call via an explicit, narrow unknown-cast — the RPC's real
  // parameter/return shape is documented and enforced by the hand-written
  // types on this function's own signature instead.
  const supabase = await createClient();
  const rpcArgs = {
    p_product_type: "transfer_service",
    p_product_node_id: null,
    p_transfer_service_id: input.transferServiceId,
    p_customer_name: name,
    p_customer_email: email,
    p_customer_phone: input.customerPhone.trim() || null,
    p_customer_whatsapp: input.customerWhatsapp.trim() || null,
    p_origin_location_id: input.originLocationId,
    p_destination_location_id: input.destinationLocationId,
    p_travel_date: input.travelDate,
    p_travel_time: input.travelTime || null,
    p_return_date: input.returnDate || null,
    p_return_time: input.returnTime || null,
    p_trip_type: input.tripType,
    p_adults: input.adults,
    p_children: input.children,
    p_infants: input.infants,
    p_flight_number: input.flightNumber?.trim() || null,
    p_special_requests: input.specialRequests?.trim() || null,
    p_estimated_price: input.estimatedPrice,
    p_currency: input.currency,
  };
  const { data, error } = await supabase
    .rpc("create_booking_inquiry" as unknown as never, rpcArgs as unknown as undefined)
    .single<{ id: string; booking_reference: string }>();

  if (error || !data) {
    return { ok: false, error: "We couldn't submit your request right now. Please try again or contact us on WhatsApp." };
  }

  return { ok: true, bookingReference: data.booking_reference };
}
