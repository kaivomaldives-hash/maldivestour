"use server";

import { sendBookingConfirmedEmail } from "@/lib/bookings/notifications";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/**
 * Confirm or cancel one of the partner's own bookings. Ownership and the
 * confirmed/cancelled-only restriction are both enforced again inside the
 * `partner_update_booking_status` RPC (supabase/migrations/20261011000200_
 * partner_listings_and_bookings.sql) — this function is the friendly-
 * error layer plus, on a genuine transition into 'confirmed', sending the
 * same customer confirmation email the admin path sends
 * (src/lib/admin/bookings-actions.ts's updateBookingStatus), gated the
 * same way: only once, only if not already sent.
 */
export async function updateMyBookingStatus(bookingId: string, status: "confirmed" | "cancelled"): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: before } = await supabase
    .from("bookings")
    .select("status, confirmation_email_sent_at")
    .eq("id", bookingId)
    .maybeSingle<{ status: string; confirmation_email_sent_at: string | null }>();

  const { error } = await supabase.rpc("partner_update_booking_status" as unknown as never, { p_booking_id: bookingId, p_status: status } as unknown as never);
  if (error) return { ok: false, error: error.message };

  const shouldSendConfirmation = status === "confirmed" && before?.status !== "confirmed" && !before?.confirmation_email_sent_at;
  if (shouldSendConfirmation) {
    const { data: booking } = await supabase
      .from("bookings")
      .select(
        "id, booking_reference, product_type, product_node_id, transfer_service_id, customer_name, customer_email, travel_date, travel_time, origin_location_id, destination_location_id, quoted_price, estimated_price, currency",
      )
      .eq("id", bookingId)
      .maybeSingle<{
        id: string;
        booking_reference: string;
        product_type: "node" | "transfer_service";
        product_node_id: string | null;
        transfer_service_id: string | null;
        customer_name: string;
        customer_email: string;
        travel_date: string | null;
        travel_time: string | null;
        origin_location_id: string | null;
        destination_location_id: string | null;
        quoted_price: number | null;
        estimated_price: number | null;
        currency: string;
      }>();

    if (booking) {
      let productTitle = "(product)";
      if (booking.product_type === "node" && booking.product_node_id) {
        const { data: node } = await supabase.from("nodes").select("title").eq("id", booking.product_node_id).maybeSingle<{ title: string }>();
        productTitle = node?.title ?? productTitle;
      } else if (booking.transfer_service_id) {
        const { data: service } = await supabase.from("transfer_services").select("route_id").eq("id", booking.transfer_service_id).maybeSingle<{ route_id: string }>();
        if (service) {
          const { data: route } = await supabase.from("nodes").select("title").eq("id", service.route_id).maybeSingle<{ title: string }>();
          productTitle = route?.title ?? productTitle;
        }
      }

      let originTitle: string | null = null;
      let destinationTitle: string | null = null;
      if (booking.origin_location_id) {
        const { data } = await supabase.from("nodes").select("title").eq("id", booking.origin_location_id).maybeSingle<{ title: string }>();
        originTitle = data?.title ?? null;
      }
      if (booking.destination_location_id) {
        const { data } = await supabase.from("nodes").select("title").eq("id", booking.destination_location_id).maybeSingle<{ title: string }>();
        destinationTitle = data?.title ?? null;
      }

      await sendBookingConfirmedEmail({
        bookingId: booking.id,
        bookingReference: booking.booking_reference,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        productTitle,
        originTitle,
        destinationTitle,
        travelDate: booking.travel_date,
        travelTime: booking.travel_time,
        quotedPrice: booking.quoted_price ?? booking.estimated_price,
        currency: booking.currency,
      });
    }
  }

  return { ok: true };
}
