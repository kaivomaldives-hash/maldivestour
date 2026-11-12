// Customer-facing emails whose wording the site owner edits at
// /admin/email-templates (stored in the email_templates table; these
// defaults apply until a template is saved). Plain module: the admin form
// imports it for the placeholder list, defaults and preview.
//
// Body format (rendered by render.ts): blank lines separate paragraphs,
// "## " starts a heading, **bold**, [link text](https://...), and
// {{placeholder}} values. A placeholder marked `block` is a ready-made
// section (details table, buttons, icons) and goes on a line of its own.

export interface EmailPlaceholder {
  name: string;
  description: string;
  /** Inserts ready-made HTML (put it on its own line). */
  block?: boolean;
  /** Example value for the admin preview. */
  sample: string;
}

export interface EmailTemplateDefinition {
  key: EmailTemplateKey;
  group: "Bookings" | "Account (sign-up) emails";
  label: string;
  /** When it is sent and to whom. */
  description: string;
  subject: string;
  body: string;
  placeholders: EmailPlaceholder[];
}

export const EMAIL_TEMPLATE_KEYS = [
  "booking_received",
  "booking_confirmed",
  "transfer_confirmed",
  "booking_thank_you",
  "auth_signup",
  "auth_invite",
  "auth_recovery",
  "auth_magic_link",
  "auth_email_change",
] as const;
export type EmailTemplateKey = (typeof EMAIL_TEMPLATE_KEYS)[number];

const sampleButton = (label: string) =>
  `<p><a href="#" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#0e7aa4;color:#ffffff;font-weight:600;text-decoration:none">${label}</a></p>`;

const CUSTOMER: EmailPlaceholder[] = [
  { name: "customer_first_name", description: "Customer's first name", sample: "Anna" },
  { name: "customer_name", description: "Customer's full name", sample: "Anna Schmidt" },
  { name: "booking_reference", description: "Booking reference", sample: "MTG-2026-000123" },
  { name: "product", description: "What was booked", sample: "Velana International Airport to SO/ Maldives" },
];

const SAMPLE_DETAILS =
  "<p><strong>Reference:</strong> MTG-2026-000123<br/><strong>Booking:</strong> Velana International Airport to SO/ Maldives<br/><strong>Date/time:</strong> 2026-12-14 at 14:30<br/><strong>Guests:</strong> 2 adults</p>";

const USD_CASH_NOTE =
  "**Payment in USD cash:** our rates are in US dollars (USD). Please bring USD cash for payment — there is no ATM or USD cash withdrawal at Velana International Airport.";

const SIGNATURE = `Thank you, and we wish you a safe journey.
Reservation Team

+960 779 4332
contact@maldivestour.guide
[maldivestour.guide](https://maldivestour.guide/)
Andhaleebuge, GA. Maamendhoo, Maldives`;

const AUTH: EmailPlaceholder[] = [
  { name: "email", description: "The account's email address", sample: "anna@example.com" },
  { name: "action_button", description: "The button with the account link", block: true, sample: sampleButton("Confirm my email") },
  { name: "action_link", description: "The account link as plain text", sample: "https://maldivestour.guide/auth/confirm?token_hash=…" },
  { name: "code", description: "One-time code (6 digits), if the email needs one", sample: "123456" },
];

export const EMAIL_TEMPLATES: EmailTemplateDefinition[] = [
  {
    key: "booking_received",
    group: "Bookings",
    label: "Booking request received",
    description: "Sent to the customer as soon as they submit a booking request.",
    subject: "Booking request received — {{booking_reference}}",
    body: `Hi {{customer_name}},

We've received your booking request. Our team will review availability and follow up shortly — this is a request, not a confirmed booking yet.

{{booking_details}}

Questions in the meantime? WhatsApp us on +960 779 4332.

— Maldives Tour Guide (MTG)`,
    placeholders: [
      ...CUSTOMER,
      { name: "booking_details", description: "Reference, product, date, guests, price and notes", block: true, sample: SAMPLE_DETAILS },
    ],
  },
  {
    key: "booking_confirmed",
    group: "Bookings",
    label: "Booking confirmed",
    description: "Sent to the customer when you set a booking to Confirmed (all bookings except transfers with boat details).",
    subject: "Booking confirmed — {{booking_reference}}",
    body: `Hi {{customer_name}},

Good news — your booking is now **confirmed**.

{{booking_details}}

${USD_CASH_NOTE}

Questions in the meantime? WhatsApp us on +960 779 4332 or reply to this email.

— Maldives Tour Guide (MTG)`,
    placeholders: [
      ...CUSTOMER,
      { name: "booking_details", description: "Reference, booking, pickup, drop-off, date and status", block: true, sample: SAMPLE_DETAILS },
    ],
  },
  {
    key: "transfer_confirmed",
    group: "Bookings",
    label: "Transfer confirmed (with boat details)",
    description: "Sent to the customer when you set a transfer booking to Confirmed after filling in the boat details.",
    subject: "Booking confirmed — {{booking_reference}}",
    body: `Dear {{customer_first_name}},

Your booking is confirmed as below.

{{trip_details}}

## How to find us?

**Meeting point 1:** Our guide will wait for you at the arrival gate with our signboard (Maldives Tour Guide) as on the logo. It will be a crowded area and there will be lots of signboards so if you cannot locate our guide then kindly move to meeting point 2.
**Meeting point 2:** the Airport Help desk situated on the left of the arrival exit. Here you can make a free call to us from the desk (+960 779 4332).
**Meeting point 3:** Airport Counter C8.
You can also find the Hotel staff with their signboard — they will help you contact us, or ask your hotel staff to contact us directly.

## Payment

{{payment}}

${USD_CASH_NOTE}

**Note:** We do not accept card payments on the boat. Speedboat transfers are weather-dependent trips, especially on our 24-foot boats. May through October is the rainy season, and inclement weather is frequent during this time — weather can change suddenly and forecasts aren't always accurate. Before traveling, please check the weather on the Maldives Meteorological Service's website and follow them for updates. We will not operate a scheduled transfer if the center issues a weather alert for that period.

Please read our [transfer terms and conditions](https://maldivestour.guide/terms-and-conditions/transfers/).

If you wish to change the timings or you have any questions, please do not hesitate to contact us — we wish you a safe journey.

For reservations or to change the time, please contact the reservation team by email: contact@maldivestour.guide or WhatsApp: +960 779 4332.

${SIGNATURE}`,
    placeholders: [
      ...CUSTOMER,
      {
        name: "trip_details",
        description: "Route, date and time, boat and captain details (arrival and departure)",
        block: true,
        sample:
          "<p><strong>Velana International Airport to SO/ Maldives</strong><br/><strong>Date and Time:</strong> 14/12/26 at 14:30<br/><strong>Boat Name:</strong> Emperor<br/><strong>Captain Name:</strong> Ali</p>",
      },
      { name: "payment", description: "Your payment note, or the quoted total", block: true, sample: "<p>Your total for this transfer is USD 140.</p>" },
    ],
  },
  {
    key: "booking_thank_you",
    group: "Bookings",
    label: "Thank you and review request",
    description: "Sent to the customer, copied to the admin inbox, when you set a booking to Completed.",
    subject: "Thank you for travelling with us — {{booking_reference}}",
    body: `Dear {{customer_first_name}},

Thank you for travelling with us! We hope you enjoyed your {{product}} (booking {{booking_reference}}) and that everything went smoothly.

Your feedback helps us improve and helps other travellers plan their trip. Could you spare a minute to tell us how it went?

{{review_buttons}}

Follow {{brand}} for Maldives tips, photos and special offers:

{{social_icons}}

We'd love to welcome you back. Questions or plans for your next trip? WhatsApp us on +960 779 4332 or reply to this email.

Warm regards,
{{brand}}
[maldivestour.guide](https://maldivestour.guide/)`,
    placeholders: [
      ...CUSTOMER,
      { name: "brand", description: "Maldives Tour Guide (MTG), or Maldives Fishing for fishing bookings", sample: "Maldives Tour Guide (MTG)" },
      {
        name: "review_buttons",
        description: "Buttons to review the booked page on the website and on Google",
        block: true,
        sample: sampleButton("Review your trip on our website") + sampleButton("Leave a Google review"),
      },
      { name: "social_icons", description: "Social media icons (fishing bookings get the fishing profiles)", block: true, sample: "<p>[social media icons]</p>" },
    ],
  },
  {
    key: "auth_signup",
    group: "Account (sign-up) emails",
    label: "Confirm sign-up",
    description: "Sent when someone creates an account (partners, agents, affiliates).",
    subject: "Confirm your Maldives Tour Guide account",
    body: `## Confirm your email

Thanks for signing up with Maldives Tour Guide. Please confirm your email address to finish creating your account.

{{action_button}}

If you didn't create an account, you can ignore this email.

Maldives Tour Guide · contact@maldivestour.guide`,
    placeholders: AUTH,
  },
  {
    key: "auth_invite",
    group: "Account (sign-up) emails",
    label: "Invitation",
    description: "Sent when you invite a user from Admin → Users.",
    subject: "You have been invited to Maldives Tour Guide",
    body: `## You're invited

You have been invited to create an account on Maldives Tour Guide. Click below to accept the invitation and set up your account.

{{action_button}}

If you weren't expecting this invitation, you can ignore this email.

Maldives Tour Guide · contact@maldivestour.guide`,
    placeholders: AUTH,
  },
  {
    key: "auth_recovery",
    group: "Account (sign-up) emails",
    label: "Reset password",
    description: "Sent when someone asks to reset their password.",
    subject: "Reset your Maldives Tour Guide password",
    body: `## Reset your password

We received a request to reset the password for your Maldives Tour Guide account. Click below to choose a new password.

{{action_button}}

If you didn't ask for this, you can ignore this email — your password stays the same.

Maldives Tour Guide · contact@maldivestour.guide`,
    placeholders: AUTH,
  },
  {
    key: "auth_magic_link",
    group: "Account (sign-up) emails",
    label: "Sign-in link",
    description: "Sent when someone signs in with an email link instead of a password.",
    subject: "Your Maldives Tour Guide sign-in link",
    body: `## Sign in to Maldives Tour Guide

Click below to sign in to your account.

{{action_button}}

If you didn't ask to sign in, you can ignore this email.

Maldives Tour Guide · contact@maldivestour.guide`,
    placeholders: AUTH,
  },
  {
    key: "auth_email_change",
    group: "Account (sign-up) emails",
    label: "Confirm email change",
    description: "Sent when someone changes the email address on their account.",
    subject: "Confirm your new email address",
    body: `## Confirm your new email address

Please confirm the change of email address for your Maldives Tour Guide account.

{{action_button}}

If you didn't ask for this change, please contact us at contact@maldivestour.guide.

Maldives Tour Guide · contact@maldivestour.guide`,
    placeholders: AUTH,
  },
];

export function emailTemplateDefinition(key: EmailTemplateKey): EmailTemplateDefinition {
  const definition = EMAIL_TEMPLATES.find((t) => t.key === key);
  if (!definition) throw new Error(`Unknown email template ${key}`);
  return definition;
}

export function isEmailTemplateKey(value: string): value is EmailTemplateKey {
  return (EMAIL_TEMPLATE_KEYS as readonly string[]).includes(value);
}
