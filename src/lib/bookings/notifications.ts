import "server-only";

import { activityHref, type ActivityCategory } from "@/lib/activities/types";
import { renderEmailTemplate } from "@/lib/email-templates/repository";
import { escapeHtml, getAdminNotificationEmail, sendResendEmail, type DeliveryResult } from "@/lib/notifications/email";
import { getSiteUrl } from "@/lib/seo/site";
import { FISHING_SOCIAL_LINKS, MTG_SOCIAL_LINKS } from "@/lib/social-links";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * MTG roadmap Task 13 §11/§12 — customer + internal notifications for a
 * newly created booking. Nothing in this project sent a notification
 * before this file existed (confirmed by audit: `booking_notifications`
 * had zero writers anywhere, and no email/Telegram integration existed at
 * all) — this is new delivery code, not a rewire of something existing.
 *
 * Design constraints from the spec, followed literally:
 *  - never fake delivery: only mark a row 'sent' if the provider actually
 *    accepted it;
 *  - never fail the booking itself over a missing/broken notification
 *    channel — the booking row is already committed by the time this runs;
 *  - never invent credentials — RESEND_API_KEY / RESEND_FROM_EMAIL /
 *    TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are read from the environment
 *    only; if unset, the attempt is recorded as 'failed' with that reason,
 *    not silently skipped and not falsely reported as sent.
 *
 * Uses the service-role admin client (src/lib/supabase/admin.ts) because
 * `booking_notifications` intentionally has no anon/authenticated insert
 * policy (see supabase/migrations/20250101001400_rls_policies.sql) — this
 * is exactly the "trusted server-side code" case that client is reserved
 * for, and it is never imported into client code.
 */
export interface BookingNotificationInput {
  bookingId: string;
  bookingReference: string;
  productTitle: string;
  source: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  nationality: string;
  requestedDate: string | null;
  adults: number;
  children: number;
  specialRequests: string | null;
  estimatedPrice: number | null;
  /** How the estimate was worked out, e.g. "2 people × USD 45 × 2 (round trip)". */
  priceBreakdown?: string | null;
  currency: string;
  /** Set only for a node inquiry whose product is tagged to more than one
   * destination (e.g. Emperor's charters) — the customer's own picked
   * destination, exactly as shown to them (see DestinationOption.label in
   * src/lib/bookings/actions.ts). */
  destinationLabel?: string | null;
}

const SITE_NAME = "Maldives Tour Guide (MTG)";

/** The customer values every booking email template can use. */
function customerTextValues(customerName: string, bookingReference: string, productTitle: string): Record<string, string> {
  return {
    customer_name: customerName,
    customer_first_name: customerName.trim().split(/\s+/)[0] || customerName,
    booking_reference: bookingReference,
    product: productTitle,
  };
}

async function sendTelegramMessage(text: string): Promise<DeliveryResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, error: "TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID are not configured" };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    const body = (await res.json().catch(() => null)) as { ok?: boolean; description?: string } | null;
    if (!res.ok || body?.ok === false) return { ok: false, error: body?.description ?? `Telegram responded ${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error calling Telegram" };
  }
}

/**
 * Fires the customer confirmation, the internal email alert, and (if
 * configured) the internal Telegram alert for a booking that has already
 * been created, and records the outcome of every attempt in
 * `booking_notifications` regardless of success or failure. Never throws —
 * a notification problem must never surface as a booking failure to the
 * customer, since the booking already exists by the time this is called.
 */
export async function sendBookingNotifications(input: BookingNotificationInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const adminEmail = await getAdminNotificationEmail(admin);

    const dateLine = input.requestedDate ? `Requested date: ${input.requestedDate}` : "Requested date: flexible / to be confirmed";
    const guestLine = `${input.adults} adult${input.adults === 1 ? "" : "s"}${
      input.children ? `, ${input.children} child${input.children === 1 ? "" : "ren"}` : ""
    }`;
    const priceLine =
      input.estimatedPrice != null
        ? `Estimated total: ${escapeHtml(input.currency)} ${input.estimatedPrice}${input.priceBreakdown ? ` (${escapeHtml(input.priceBreakdown)})` : ""}`
        : null;

    const customerEmail = await renderEmailTemplate("booking_received", {
      text: customerTextValues(input.customerName, input.bookingReference, input.productTitle),
      html: {
        booking_details: `
      <p><strong>Reference:</strong> ${escapeHtml(input.bookingReference)}<br/>
      <strong>Product:</strong> ${escapeHtml(input.productTitle)}<br/>
      ${dateLine}<br/>
      <strong>Guests:</strong> ${guestLine}</p>
      ${priceLine ? `<p>${priceLine}</p>` : ""}
      ${input.specialRequests ? `<p><strong>Your notes:</strong> ${escapeHtml(input.specialRequests)}</p>` : ""}`,
      },
    });

    const adminHtml = `
      <p>New booking inquiry (${escapeHtml(input.source)}).</p>
      <p><strong>Reference:</strong> ${escapeHtml(input.bookingReference)}<br/>
      <strong>Product:</strong> ${escapeHtml(input.productTitle)}<br/>
      ${dateLine}<br/>
      <strong>Guests:</strong> ${guestLine}</p>
      ${priceLine ? `<p>${priceLine}</p>` : ""}
      ${input.destinationLabel ? `<p><strong>Destination:</strong> ${escapeHtml(input.destinationLabel)}</p>` : ""}
      <p><strong>Customer:</strong> ${escapeHtml(input.customerName)} — ${escapeHtml(input.customerEmail)}${
        input.customerPhone ? ` — ${escapeHtml(input.customerPhone)}` : ""
      }<br/>
      <strong>Nationality:</strong> ${escapeHtml(input.nationality)}</p>
      ${input.specialRequests ? `<p><strong>Special requests:</strong> ${escapeHtml(input.specialRequests)}</p>` : ""}
      <p style="color:#888;font-size:12px">Booking ID: ${input.bookingId}</p>
    `;

    const telegramText = [
      `<b>New booking inquiry</b> (${escapeHtml(input.source)})`,
      `Ref: ${escapeHtml(input.bookingReference)}`,
      `Product: ${escapeHtml(input.productTitle)}`,
      dateLine,
      `Guests: ${guestLine}`,
      priceLine ?? "",
      input.destinationLabel ? `Destination: ${escapeHtml(input.destinationLabel)}` : "",
      `Customer: ${escapeHtml(input.customerName)} (${escapeHtml(input.customerEmail)}${
        input.customerPhone ? `, ${escapeHtml(input.customerPhone)}` : ""
      })`,
      `Nationality: ${escapeHtml(input.nationality)}`,
      input.specialRequests ? `Notes: ${escapeHtml(input.specialRequests)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const [customerResult, adminResult, telegramResult] = await Promise.all([
      sendResendEmail(input.customerEmail, customerEmail.subject, customerEmail.html),
      sendResendEmail(adminEmail, `New booking inquiry — ${input.bookingReference}`, adminHtml),
      sendTelegramMessage(telegramText),
    ]);

    const nowIso = new Date().toISOString();
    const notificationRows: Array<Record<string, unknown>> = [
      {
        booking_id: input.bookingId,
        notification_type: "customer_confirmation",
        recipient_email: input.customerEmail,
        status: customerResult.ok ? "sent" : "failed",
        provider_message_id: customerResult.providerMessageId ?? null,
        error_message: customerResult.ok ? null : (customerResult.error ?? null),
        sent_at: customerResult.ok ? nowIso : null,
      },
      {
        booking_id: input.bookingId,
        notification_type: "admin_alert",
        recipient_email: adminEmail,
        status: adminResult.ok ? "sent" : "failed",
        provider_message_id: adminResult.providerMessageId ?? null,
        error_message: adminResult.ok ? null : (adminResult.error ?? null),
        sent_at: adminResult.ok ? nowIso : null,
      },
    ];

    // Telegram is only attempted (and only recorded) when it's actually
    // configured — an unconfigured channel that was never enabled isn't a
    // delivery failure worth logging, unlike email (which is always
    // expected to at least attempt to run).
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      notificationRows.push({
        booking_id: input.bookingId,
        notification_type: "admin_alert",
        // booking_notifications.recipient_email is `not null` and has no
        // Telegram-specific column — recording the chat id here (prefixed,
        // never a real email) keeps this row honest about what channel it
        // actually is rather than fabricating an email address.
        recipient_email: `telegram:${process.env.TELEGRAM_CHAT_ID}`,
        status: telegramResult.ok ? "sent" : "failed",
        provider_message_id: null,
        error_message: telegramResult.ok ? null : (telegramResult.error ?? null),
        sent_at: telegramResult.ok ? nowIso : null,
      });
    }

    // src/types/database.ts is a placeholder (`Tables: Record<string,
    // never>` — see its own header comment, same reason actions.ts casts
    // its .rpc() calls). That makes insert()/update() row arguments type
    // as `never` here; the mismatch is contained to exactly these two
    // calls via a narrow unknown-cast, same convention as actions.ts.
    const { error: insertError } = await admin.from("booking_notifications").insert(notificationRows as unknown as never[]);
    if (insertError) {
      console.error("[bookings] failed to record booking_notifications rows:", insertError.message);
    }

    const { error: updateError } = await admin
      .from("bookings")
      .update({ notification_status: customerResult.ok ? "sent" : "failed" } as unknown as never)
      .eq("id", input.bookingId);
    if (updateError) {
      console.error("[bookings] failed to update bookings.notification_status:", updateError.message);
    }
  } catch (err) {
    // Belt-and-braces: whatever goes wrong here, the booking itself was
    // already created successfully before this function was called. Only
    // the message is logged (not the raw error object), consistent with
    // the other log statements in this file — a thrown error from an
    // email/Telegram provider could otherwise echo request payload data
    // (customer name/email) into server logs.
    console.error("[bookings] sendBookingNotifications threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}

export interface TransferBoatDetails {
  boatName: string | null;
  boatSize: string | null;
  boatContact: string | null;
  captainName: string | null;
  captainLicense: string | null;
  registrationNumber: string | null;
}

export interface BookingConfirmedEmailInput {
  bookingId: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  originTitle: string | null;
  destinationTitle: string | null;
  travelDate: string | null;
  travelTime: string | null;
  /**
   * Transfer bookings get a detailed boat/captain/meeting-point email
   * instead of the generic one below -- see transferConfirmationSections().
   * Used only when source === 'transfer' and the admin has filled in at
   * least the outbound boat name (src/lib/admin/bookings-actions.ts decides
   * this before calling in). Every field here is staff-entered per booking
   * (src/app/admin/(dashboard)/bookings/[id]/page.tsx) -- nothing is pulled
   * from a boats/captains registry because this project doesn't have one.
   */
  source?: string | null;
  returnDate?: string | null;
  returnTime?: string | null;
  quotedPrice?: number | null;
  currency?: string | null;
  paymentNote?: string | null;
  outboundBoat?: TransferBoatDetails | null;
  returnBoat?: TransferBoatDetails | null;
}

/** DD/MM/YY, matching the site owner's own transfer-confirmation template. */
function formatTransferDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

function boatDetailLines(boat: TransferBoatDetails): string {
  const rows: Array<[string, string | null]> = [
    ["Boat Name", boat.boatName],
    ["Boat Size", boat.boatSize],
    ["Boat contact number", boat.boatContact],
    ["Captain Name", boat.captainName],
    ["License Number", boat.captainLicense],
    ["Registration Number", boat.registrationNumber],
  ];
  return rows
    .filter(([, value]) => value)
    .map(([label, value]) => `<strong>${label}:</strong> ${escapeHtml(value as string)}<br/>`)
    .join("\n      ");
}

/** The trip and payment sections of the transfer confirmation email
 * (template "transfer_confirmed"; the rest of its wording is editable). */
function transferConfirmationSections(input: BookingConfirmedEmailInput): { trip_details: string; payment: string } {
  const routeTitle =
    input.originTitle && input.destinationTitle ? `${input.originTitle} to ${input.destinationTitle}` : input.productTitle;

  const outboundSection = `
    <p><strong>${escapeHtml(routeTitle)}</strong><br/>
    <strong>Date and Time:</strong> ${input.travelDate ? escapeHtml(formatTransferDate(input.travelDate)) : "To be confirmed"}${input.travelTime ? ` at ${escapeHtml(input.travelTime)}` : ""}<br/>
    ${input.outboundBoat ? boatDetailLines(input.outboundBoat) : ""}</p>
  `;

  const returnSection =
    input.returnDate && input.returnBoat
      ? `
    <p><strong>Departure</strong><br/>
    <strong>Date and Time:</strong> ${escapeHtml(formatTransferDate(input.returnDate))}${input.returnTime ? ` at ${escapeHtml(input.returnTime)}` : ""}<br/>
    ${boatDetailLines(input.returnBoat)}</p>
  `
      : "";

  const payment = input.paymentNote
    ? `<p>${escapeHtml(input.paymentNote).replace(/\n/g, "<br/>")}</p>`
    : input.quotedPrice != null
      ? `<p>Your total for this transfer is ${escapeHtml(input.currency ?? "USD")} ${input.quotedPrice}.</p>`
      : "";

  return { trip_details: outboundSection + returnSection, payment };
}

/**
 * Fires once, when an admin moves a booking into 'confirmed' status (see
 * updateBookingStatus() in src/lib/admin/bookings-actions.ts, the only
 * caller) — a different email from sendBookingNotifications()'s
 * "we received your request" message sent at booking-creation time.
 * Idempotency is enforced by the caller checking
 * `bookings.confirmation_email_sent_at is null` before invoking this, and
 * this function only sets that column on a confirmed-successful send —
 * never on a failed attempt — so a transient Resend failure can still be
 * retried by a later status re-save rather than being permanently
 * skipped. Uses the service-role admin client for the same reason
 * sendBookingNotifications() above does: `booking_notifications` has no
 * staff RLS insert policy (service_role only, by design), and this path
 * is already gated by requireStaff() in the calling server action.
 */
export async function sendBookingConfirmedEmail(input: BookingConfirmedEmailInput): Promise<void> {
  try {
    const admin = createAdminClient();

    const isTransferConfirmation = input.source === "transfer" && Boolean(input.outboundBoat?.boatName);

    const dateLine = input.travelDate ? `${input.travelDate}${input.travelTime ? ` at ${input.travelTime}` : ""}` : "To be confirmed with our team";
    const text = customerTextValues(input.customerName, input.bookingReference, input.productTitle);

    const email = isTransferConfirmation
      ? await renderEmailTemplate("transfer_confirmed", { text, html: transferConfirmationSections(input) })
      : await renderEmailTemplate("booking_confirmed", {
          text,
          html: {
            booking_details: `
      <p><strong>Reference:</strong> ${escapeHtml(input.bookingReference)}<br/>
      <strong>Booking:</strong> ${escapeHtml(input.productTitle)}<br/>
      ${input.originTitle ? `<strong>Pickup location:</strong> ${escapeHtml(input.originTitle)}<br/>` : ""}
      ${input.destinationTitle ? `<strong>Drop-off location:</strong> ${escapeHtml(input.destinationTitle)}<br/>` : ""}
      <strong>Date/time:</strong> ${escapeHtml(dateLine)}<br/>
      <strong>Status:</strong> Confirmed</p>`,
          },
        });

    const result = await sendResendEmail(input.customerEmail, email.subject, email.html);
    const nowIso = new Date().toISOString();

    const { error: insertError } = await admin.from("booking_notifications").insert({
      booking_id: input.bookingId,
      notification_type: "customer_confirmation",
      recipient_email: input.customerEmail,
      status: result.ok ? "sent" : "failed",
      provider_message_id: result.providerMessageId ?? null,
      error_message: result.ok ? null : (result.error ?? null),
      sent_at: result.ok ? nowIso : null,
    } as unknown as never);
    if (insertError) {
      console.error("[bookings] failed to record confirmation booking_notifications row:", insertError.message);
    }

    if (result.ok) {
      const { error: updateError } = await admin
        .from("bookings")
        .update({ confirmation_email_sent_at: nowIso } as unknown as never)
        .eq("id", input.bookingId);
      if (updateError) {
        console.error("[bookings] failed to set bookings.confirmation_email_sent_at:", updateError.message);
      }
    }
  } catch (err) {
    console.error("[bookings] sendBookingConfirmedEmail threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}

const GOOGLE_REVIEW_URL = "https://g.page/r/CXFuVWSvn2TTEAE/review";
const SOCIAL_ICON_BASE = `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "")}/storage/v1/object/public/media/email/social`;

/**
 * Public page of the booked product with a review form, so the thank-you
 * email can send the customer straight to it: the transfer route for a
 * transfer booking, the activity page for an activity. Other products have
 * no on-site reviews, so null (the email then asks for a Google review only).
 */
async function reviewPageUrl(admin: ReturnType<typeof createAdminClient>, bookingId: string): Promise<{ url: string; title: string } | null> {
  const { data: booking } = await admin
    .from("bookings")
    .select("product_type, product_node_id, transfer_service_id")
    .eq("id", bookingId)
    .maybeSingle<{ product_type: string; product_node_id: string | null; transfer_service_id: string | null }>();
  if (!booking) return null;

  let nodeId = booking.product_node_id;
  if (booking.product_type === "transfer_service" && booking.transfer_service_id) {
    const { data: service } = await admin
      .from("transfer_services")
      .select("route_id")
      .eq("id", booking.transfer_service_id)
      .maybeSingle<{ route_id: string }>();
    nodeId = service?.route_id ?? null;
  }
  if (!nodeId) return null;

  const { data: node } = await admin
    .from("nodes")
    .select("node_type, slug, title, status")
    .eq("id", nodeId)
    .maybeSingle<{ node_type: string; slug: string; title: string; status: string }>();
  if (!node || node.status !== "published") return null;

  let path: string | null = null;
  if (node.node_type === "transfer_route") path = `/maldives/transfers/${node.slug}/`;
  if (node.node_type === "activity") {
    const { data: activity } = await admin
      .from("activities")
      .select("activity_category")
      .eq("id", nodeId)
      .maybeSingle<{ activity_category: ActivityCategory }>();
    if (activity) path = activityHref({ activityCategory: activity.activity_category, slug: node.slug });
  }
  return path ? { url: `${getSiteUrl()}${path}#write-review`, title: node.title } : null;
}

export interface BookingThankYouEmailInput {
  bookingId: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  source: string | null;
}

/** The review buttons and social icons of the thank-you email (template
 * "booking_thank_you"; the rest of its wording is editable). */
function thankYouSections(isFishing: boolean, reviewPage: { url: string; title: string } | null): { review_buttons: string; social_icons: string } {
  const socials = isFishing ? FISHING_SOCIAL_LINKS : MTG_SOCIAL_LINKS;
  const button = (href: string, label: string, color: string) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;margin:4px 8px 4px 0;padding:12px 20px;border-radius:999px;background:${color};color:#ffffff;font-weight:600;text-decoration:none">${label}</a>`;

  const icons = socials
    .map(
      (s) =>
        `<a href="${escapeHtml(s.href)}" style="display:inline-block;margin:0 4px"><img src="${SOCIAL_ICON_BASE}/${s.network}.png" width="32" height="32" alt="${escapeHtml(s.label)}" style="display:block;border:0" /></a>`,
    )
    .join("");

  return {
    review_buttons: `<p>${reviewPage ? button(reviewPage.url, "Review your trip on our website", "#0e7aa4") : ""}${button(GOOGLE_REVIEW_URL, "Leave a Google review", "#1a73e8")}</p>`,
    social_icons: `<p>${icons}</p>`,
  };
}

/**
 * Fires once, when an admin moves a booking into 'completed' (see
 * updateBookingStatus() in src/lib/admin/bookings-actions.ts, the only
 * caller): a thank-you to the customer, copied to the admin inbox, asking
 * for a review on the booked product's own page and on Google, with the
 * brand's social profiles. Like sendBookingConfirmedEmail(), it only sets
 * bookings.thank_you_email_sent_at on a successful send, so a failed
 * attempt can be retried by re-saving the status. Never throws.
 */
export async function sendBookingThankYouEmail(input: BookingThankYouEmailInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const [adminEmail, reviewPage] = await Promise.all([getAdminNotificationEmail(admin), reviewPageUrl(admin, input.bookingId)]);
    const cc = adminEmail.toLowerCase() === input.customerEmail.toLowerCase() ? [] : [adminEmail];

    const isFishing = input.source === "fishing";
    const email = await renderEmailTemplate("booking_thank_you", {
      text: { ...customerTextValues(input.customerName, input.bookingReference, input.productTitle), brand: isFishing ? "Maldives Fishing" : SITE_NAME },
      html: thankYouSections(isFishing, reviewPage),
    });
    const result = await sendResendEmail(input.customerEmail, email.subject, email.html, { cc });
    const nowIso = new Date().toISOString();

    const { error: insertError } = await admin.from("booking_notifications").insert({
      booking_id: input.bookingId,
      notification_type: "customer_thank_you",
      recipient_email: input.customerEmail,
      status: result.ok ? "sent" : "failed",
      provider_message_id: result.providerMessageId ?? null,
      error_message: result.ok ? null : (result.error ?? null),
      sent_at: result.ok ? nowIso : null,
    } as unknown as never);
    if (insertError) {
      console.error("[bookings] failed to record thank-you booking_notifications row:", insertError.message);
    }

    if (result.ok) {
      const { error: updateError } = await admin
        .from("bookings")
        .update({ thank_you_email_sent_at: nowIso } as unknown as never)
        .eq("id", input.bookingId);
      if (updateError) {
        console.error("[bookings] failed to set bookings.thank_you_email_sent_at:", updateError.message);
      }
    }
  } catch (err) {
    console.error("[bookings] sendBookingThankYouEmail threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}
