/**
 * Every email whose wording staff can edit in Admin -> Email Templates.
 * The text here is the built-in default; a saved version in the
 * `email_templates` table replaces it. Pure data, safe for client code.
 */

import { buttonHtml, type TemplateValues } from "@/lib/email-templates/render";

export type EmailTemplateKey =
  | "booking_request"
  | "booking_confirmed"
  | "transfer_confirmed"
  | "booking_thank_you"
  | "holiday_confirmed"
  | "auth_confirmation"
  | "auth_recovery"
  | "auth_invite";

export interface PlaceholderDef {
  name: string;
  description: string;
  /** Ready-made HTML (details table, buttons): put it on its own line. */
  block?: boolean;
}

export interface EmailTemplateDef {
  key: EmailTemplateKey;
  name: string;
  description: string;
  group: "Bookings" | "Accounts";
  /** Null when the subject is fixed on the server (sign-in emails). */
  defaultSubject: string | null;
  fixedSubject?: string;
  defaultBody: string;
  placeholders: PlaceholderDef[];
  /** Example values for the preview and test emails. */
  sample: TemplateValues;
  sampleBlocks: Record<string, string>;
}

const CONTACT = `For reservations or changes, contact our reservation team: contact@maldivestour.guide or WhatsApp +960 779 4332.`;

const SAMPLE_DETAILS = `<p><strong>Reference:</strong> MTG-2026-000123<br/><strong>Product:</strong> Velana International Airport to Club Med Kani Maldives<br/>Requested date: 2026-12-20<br/><strong>Guests:</strong> 2 adults</p><p>Estimated total: USD 220 (2 people × USD 110)</p>`;

export const EMAIL_TEMPLATES: EmailTemplateDef[] = [
  {
    key: "booking_request",
    name: "Booking request received",
    description: "Sent to the customer as soon as they send a booking request (transfers, activities, stays and other inquiries).",
    group: "Bookings",
    defaultSubject: "Booking request received — {{reference}}",
    defaultBody: `Hi {{customer_name}},

We've received your booking request. Our team will review availability and follow up shortly. This is a request, not a confirmed booking yet.

{{booking_details}}

Questions in the meantime? WhatsApp us on +960 779 4332.

— Maldives Tour Guide (MTG)`,
    placeholders: [
      { name: "customer_name", description: "Customer's full name" },
      { name: "first_name", description: "Customer's first name" },
      { name: "reference", description: "Booking reference, e.g. MTG-2026-000123" },
      { name: "product", description: "What they asked for" },
      { name: "booking_details", description: "Reference, product, date, guests, estimated price and their notes", block: true },
    ],
    sample: { customer_name: "Anna Smith", first_name: "Anna", reference: "MTG-2026-000123", product: "Velana International Airport to Club Med Kani Maldives" },
    sampleBlocks: { booking_details: SAMPLE_DETAILS },
  },
  {
    key: "booking_confirmed",
    name: "Booking confirmed",
    description: "Sent to the customer when you set a booking to Confirmed (all bookings except transfers that have boat details).",
    group: "Bookings",
    defaultSubject: "Booking confirmed — {{reference}}",
    defaultBody: `Hi {{customer_name}},

Good news — your booking is now **confirmed**.

{{booking_details}}

Questions in the meantime? WhatsApp us on +960 779 4332 or reply to this email.

— Maldives Tour Guide (MTG)`,
    placeholders: [
      { name: "customer_name", description: "Customer's full name" },
      { name: "first_name", description: "Customer's first name" },
      { name: "reference", description: "Booking reference" },
      { name: "product", description: "What was booked" },
      { name: "booking_details", description: "Reference, booking, pickup and drop-off, date and status", block: true },
    ],
    sample: { customer_name: "Anna Smith", first_name: "Anna", reference: "MTG-2026-000123", product: "Sunset Fishing Trip" },
    sampleBlocks: {
      booking_details: `<p><strong>Reference:</strong> MTG-2026-000123<br/><strong>Booking:</strong> Sunset Fishing Trip<br/><strong>Date/time:</strong> 2026-12-20 at 17:00<br/><strong>Status:</strong> Confirmed</p>`,
    },
  },
  {
    key: "transfer_confirmed",
    name: "Transfer confirmed (with boat details)",
    description: "Sent to the customer when you confirm a transfer booking and have filled in the boat details.",
    group: "Bookings",
    defaultSubject: "Booking confirmed — {{reference}}",
    defaultBody: `Dear {{first_name}},

Your booking is confirmed as below.

{{trip_details}}

## How to find us?
**Meeting point 1:** Our guide will wait for you at the arrival gate with our signboard (Maldives Tour Guide) as on the logo. It will be a crowded area and there will be lots of signboards, so if you cannot find our guide, please go to meeting point 2.
**Meeting point 2:** The Airport Help desk on the left of the arrival exit. You can make a free call to us from the desk (+960 779 4332).
**Meeting point 3:** Airport Counter C8.
You can also find the hotel staff with their signboard. They will help you contact us, or ask your hotel staff to contact us directly.

## Payment
{{payment}}

**Please bring US dollars in cash.** Our rates are in US dollars (USD). There is no ATM and no US dollar cash withdrawal at Velana International Airport, so please bring enough USD cash with you.

> **Note:** We do not accept card payments on the boat. Speedboat transfers depend on the weather, especially on our 24-foot boats. May to October is the rainy season and the weather can change suddenly. Before travelling, please check the Maldives Meteorological Service website for updates. We will not run a scheduled transfer if a weather alert is issued for that time.

> Please read our transfer terms and conditions: https://maldivestour.guide/terms-and-conditions/transfers/

If you wish to change the timings or have any questions, please do not hesitate to contact us.

${CONTACT}

Thank you, and we wish you a safe journey.
Reservation Team

> +960 779 4332
contact@maldivestour.guide
https://maldivestour.guide/
Andhaleebuge, GA. Maamendhoo, Maldives`,
    placeholders: [
      { name: "first_name", description: "Customer's first name" },
      { name: "customer_name", description: "Customer's full name" },
      { name: "reference", description: "Booking reference" },
      { name: "route", description: "e.g. Velana International Airport to Club Med Kani Maldives" },
      { name: "trip_details", description: "Route, date and time, boat and captain for arrival (and departure if booked)", block: true },
      { name: "payment", description: "The payment note you write on the booking, or the total price", block: true },
    ],
    sample: { first_name: "Anna", customer_name: "Anna Smith", reference: "MTG-2026-000123", route: "Velana International Airport to Club Med Kani Maldives" },
    sampleBlocks: {
      trip_details: `<p><strong>Velana International Airport to Club Med Kani Maldives</strong><br/><strong>Date and Time:</strong> 20/12/26 at 14:30<br/><strong>Boat Name:</strong> Blue Marlin<br/><strong>Boat Size:</strong> 32 ft<br/><strong>Captain Name:</strong> Ahmed</p>`,
      payment: `<p>Your total for this transfer is USD 220, payable in cash or by Crypto USDT on arrival. We do not accept card payments on the boat.</p>`,
    },
  },
  {
    key: "booking_thank_you",
    name: "Thank you and review request",
    description: "Sent to the customer (copy to you) when you set a booking to Completed. Asks for a review on the website and Google.",
    group: "Bookings",
    defaultSubject: "Thank you for travelling with us — {{reference}}",
    defaultBody: `Dear {{first_name}},

Thank you for travelling with us! We hope you enjoyed your {{product}} (booking {{reference}}) and that everything went smoothly.

Your feedback helps us improve and helps other travellers plan their trip. Could you spare a minute to tell us how it went?

{{review_buttons}}

Follow {{brand}} for Maldives tips, photos and special offers:

{{social_icons}}

We'd love to welcome you back. Questions or plans for your next trip? WhatsApp us on +960 779 4332 or reply to this email.

Warm regards,
{{brand}}
https://maldivestour.guide/`,
    placeholders: [
      { name: "first_name", description: "Customer's first name" },
      { name: "customer_name", description: "Customer's full name" },
      { name: "product", description: "What they booked" },
      { name: "reference", description: "Booking reference" },
      { name: "brand", description: "Maldives Tour Guide (MTG), or Maldives Fishing for fishing bookings" },
      { name: "review_buttons", description: "Buttons: review on our website (when the product has reviews) and on Google", block: true },
      { name: "social_icons", description: "Social media icons", block: true },
    ],
    sample: { first_name: "Anna", customer_name: "Anna Smith", product: "Velana International Airport to Club Med Kani Maldives", reference: "MTG-2026-000123", brand: "Maldives Tour Guide (MTG)" },
    sampleBlocks: {
      review_buttons: `<p>${buttonHtml("https://maldivestour.guide/", "Review your trip on our website")}${buttonHtml("https://g.page/r/CXFuVWSvn2TTEAE/review", "Leave a Google review", "#1a73e8")}</p>`,
      social_icons: `<p>(social media icons)</p>`,
    },
  },
  {
    key: "holiday_confirmed",
    name: "Custom holiday confirmed",
    description: "Sent to the customer when you confirm a custom holiday (offer) request.",
    group: "Bookings",
    defaultSubject: "Your custom holiday is confirmed — {{reference}}",
    defaultBody: `Hi {{customer_name}},

Good news — we've confirmed availability for your custom holiday request.

{{holiday_details}}

This confirms availability at this price. Our team will follow up with the final booking and payment details.

Questions in the meantime? WhatsApp us on +960 779 4332 or reply to this email.

— Maldives Tour Guide (MTG)`,
    placeholders: [
      { name: "customer_name", description: "Customer's full name" },
      { name: "first_name", description: "Customer's first name" },
      { name: "reference", description: "Request reference" },
      { name: "total", description: "Confirmed estimated total, e.g. USD 2,450.00" },
      { name: "holiday_details", description: "Arrival, nights, guests, itinerary and total", block: true },
    ],
    sample: { customer_name: "Anna Smith", first_name: "Anna", reference: "HB-2026-0042", total: "USD 2450.00" },
    sampleBlocks: {
      holiday_details: `<p><strong>Reference:</strong> HB-2026-0042<br/><strong>Arrival:</strong> 2026-12-20<br/><strong>Nights:</strong> 7<br/><strong>Guests:</strong> 2 adults</p><p><strong>Confirmed estimated total: USD 2450.00</strong></p>`,
    },
  },
  {
    key: "auth_confirmation",
    name: "Sign-up: confirm email",
    description: "Sent when someone creates an account (partners, agents, affiliates, customers). The button confirms their email.",
    group: "Accounts",
    defaultSubject: null,
    fixedSubject: "Confirm your Maldives Tour Guide account",
    defaultBody: `## Confirm your email

Thanks for signing up with Maldives Tour Guide. Please confirm your email address to finish creating your account.

{{confirm_button}}

> If you didn't create an account, you can ignore this email.

> Maldives Tour Guide · contact@maldivestour.guide`,
    placeholders: [{ name: "confirm_button", description: "The 'Confirm my email' button (required)", block: true }],
    sample: {},
    sampleBlocks: { confirm_button: `<p style="margin:28px 0">${buttonHtml("https://maldivestour.guide/", "Confirm my email", "#0284c7")}</p>` },
  },
  {
    key: "auth_recovery",
    name: "Reset password",
    description: "Sent when someone asks to reset their password.",
    group: "Accounts",
    defaultSubject: null,
    fixedSubject: "Reset your Maldives Tour Guide password",
    defaultBody: `## Reset your password

We received a request to reset the password for your Maldives Tour Guide account.

{{reset_button}}

> If you didn't ask for this, you can ignore this email.

> Maldives Tour Guide · contact@maldivestour.guide`,
    placeholders: [{ name: "reset_button", description: "The 'Reset my password' button (required)", block: true }],
    sample: {},
    sampleBlocks: { reset_button: `<p style="margin:28px 0">${buttonHtml("https://maldivestour.guide/", "Reset my password", "#0284c7")}</p>` },
  },
  {
    key: "auth_invite",
    name: "Team invitation",
    description: "Sent when you invite a staff member from Admin -> Users.",
    group: "Accounts",
    defaultSubject: null,
    fixedSubject: "You have been invited to Maldives Tour Guide",
    defaultBody: `## You've been invited

You've been invited to join the Maldives Tour Guide team. Click below to accept the invitation and set up your account.

{{accept_button}}

> Maldives Tour Guide · contact@maldivestour.guide`,
    placeholders: [{ name: "accept_button", description: "The 'Accept invitation' button (required)", block: true }],
    sample: {},
    sampleBlocks: { accept_button: `<p style="margin:28px 0">${buttonHtml("https://maldivestour.guide/", "Accept invitation", "#0284c7")}</p>` },
  },
];

export function getTemplateDef(key: string): EmailTemplateDef | undefined {
  return EMAIL_TEMPLATES.find((t) => t.key === key);
}

/** Sign-in emails sent by the auth service, by its template file name. */
export const AUTH_TEMPLATE_FILES: Record<string, { key: EmailTemplateKey; button: string; label: string; href: string }> = {
  // The site confirms signups at /auth/confirm with a token_hash
  // (src/app/auth/confirm/route.ts); RedirectTo already carries ?next=...
  "confirmation.html": { key: "auth_confirmation", button: "confirm_button", label: "Confirm my email", href: "{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email" },
  "recovery.html": { key: "auth_recovery", button: "reset_button", label: "Reset my password", href: "{{ .ConfirmationURL }}" },
  "invite.html": { key: "auth_invite", button: "accept_button", label: "Accept invitation", href: "{{ .ConfirmationURL }}" },
};
