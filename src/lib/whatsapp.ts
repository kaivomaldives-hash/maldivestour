/**
 * MTG's one real, official WhatsApp number — already live in
 * src/components/site-footer.tsx ("Chat with us on WhatsApp") and
 * src/components/bookings/node-inquiry-form.tsx (post-submission
 * continuation link). Centralized here so new pre-filled WhatsApp CTAs
 * (Task 23: fishing) don't hand-type a third copy of the same digits.
 */
export const MTG_WHATSAPP_NUMBER = "9607794332";

/** A wa.me link, optionally with a pre-filled, properly URL-encoded message. */
export function whatsappUrl(message?: string): string {
  return message ? `https://wa.me/${MTG_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` : `https://wa.me/${MTG_WHATSAPP_NUMBER}`;
}
