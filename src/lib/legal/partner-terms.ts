/**
 * General Terms and Conditions for Partners — the agreement between
 * Maldives Tour Guide Pvt. Ltd and the businesses that list on the site
 * (accommodation, activity, package and transfer operators). Kept as plain
 * data so the web page (src/components/legal/partner-terms-page.tsx) and
 * the signable Word copy (docs/legal/MTG-Partner-Terms-and-Conditions.docx,
 * with signature + company stamp blocks) are built from exactly the same
 * text. If you edit the wording here, regenerate the Word file too so the
 * signed copies match the website.
 *
 * Facts it states mirror how the partner portal actually works: partners
 * set their own prices and collect payment from guests directly; they set
 * a commission of at least 15% per listing (CommissionPercentField) that
 * becomes payable when a booking is marked completed; accounts are
 * reviewed against uploaded documents (PARTNER_DOCUMENT_TYPES) and can be
 * suspended by the admin.
 */

export interface PartnerTermsSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Numbered sub-headings (e.g. 4.1) rendered after the section's own text. */
  subsections?: PartnerTermsSection[];
  /** Show MTG's bank account (PARTNER_TERMS_BANK) after this section. */
  bankDetails?: boolean;
}

export const PARTNER_TERMS_TITLE = "General Terms and Conditions for Partners";
export const PARTNER_TERMS_LAST_UPDATED = "8 November 2026";
export const PARTNER_TERMS_COMPANY = "Maldives Tour Guide Pvt. Ltd — Andhaleebuge, GA. Maamendhoo, 16030, Maldives";
export const PARTNER_TERMS_EMAIL = "contact@maldivestour.guide";

export const PARTNER_TERMS_INTRO = [
  "These General Terms and Conditions for Partners (the \"Agreement\") apply between Maldives Tour Guide Pvt. Ltd (\"Maldives Tour Guide\", \"MTG\", \"we\", \"us\") and any business that registers as a partner to list accommodation, activities, holiday packages or transfer services on maldivestour.guide (the \"Partner\", \"you\").",
  "By creating a partner account, submitting a partner request, or signing a copy of this Agreement, you confirm that you are authorised to act for your business and that you accept these terms. The terms for travellers who book through our website are set out separately in our customer Terms and Conditions.",
];

export const PARTNER_TERMS_SECTIONS: PartnerTermsSection[] = [
  {
    heading: "1. Eligibility and Registration",
    bullets: [
      "You must be a registered business legally permitted to operate the tourism service you list, and hold every licence and permit required by the laws of the Maldives.",
      "The information you give us at sign-up and in your partner profile — business name, contact details, bank details and listing details — must be true, complete and kept up to date.",
      "You are responsible for keeping your partner account login details secure, and for everything done through your account.",
    ],
  },
  {
    heading: "2. Verification and Approval",
    bullets: [
      "Before your account is approved, we may ask for supporting documents such as a business or tourism licence, the owner or manager's ID, proof of bank account, and proof that you operate the property or service you plan to list.",
      "We review documents and listings at our discretion and may approve, reject or ask for changes to any account or listing. Approval does not mean we endorse or guarantee your services.",
      "We keep the documents you upload confidential and use them only to verify your business, as described in our Privacy Policy.",
    ],
  },
  {
    heading: "3. Listings",
    bullets: [
      "You are responsible for the accuracy of your listings, including descriptions, photos, inclusions, prices, availability, capacity, schedules and any conditions that apply to guests.",
      "We may edit, pause or remove any listing that is inaccurate, misleading, infringes someone else's rights, or breaches this Agreement.",
      "You must keep availability and prices current so that guests are not offered services that cannot be delivered.",
    ],
  },
  {
    heading: "4. Photos, Videos and Other Media",
    paragraphs: [
      "\"Media\" means every photo, video, drone footage, virtual tour, logo, floor plan, illustration, description and other content you upload to your partner account or send to MTG for your listings.",
    ],
    subsections: [
      {
        heading: "4.1 Your own, copyright-free media",
        bullets: [
          "You confirm that all Media you upload is either created and owned by you or your business, or that you hold written permission from its owner (for example the photographer, videographer or agency) to use it and to give MTG the rights in this section.",
          "Your Media must be free of any copyright, trademark, licence or other restriction that would stop MTG from using it as described below, and no fee, royalty or credit will be owed by MTG to anyone for that use.",
          "You must not upload Media copied from other websites, online travel agencies, social media accounts, stock photo libraries or other businesses without the owner's permission, or Media carrying someone else's watermark or logo.",
          "Media must genuinely show your own property or service as guests will experience it. Images of other properties, or edited images that misrepresent your property or service, are not allowed.",
          "If identifiable people appear in your Media (for example staff or guests), you confirm you have their consent for it to be published and used for promotion — and, for anyone under 18, the consent of their parent or guardian.",
          "You must keep proof of ownership or permission for your Media and provide it to MTG on request.",
        ],
      },
      {
        heading: "4.2 Permission for MTG to use your media",
        bullets: [
          "By uploading Media and publishing a listing on our website, you grant MTG a worldwide, non-exclusive, royalty-free licence to use, copy, publish, display, share, resize, crop, edit for format and quality, caption and translate your Media, without further approval or payment.",
          "MTG may use your Media on: (a) your own property or service listing pages; (b) other MTG listings and pages that feature your property or service, such as island and destination guides, activity and transfer pages, holiday packages, search results and travel articles; and (c) MTG's promotional materials, including our website, social media, email newsletters, online and print advertising, brochures, presentations, partner and trade materials, and travel fairs.",
          "MTG may share your Media with service providers who host, publish or advertise on our behalf (for example social media platforms and advertising networks), only for these purposes.",
          "MTG may credit you or the photographer where practical, but is not required to.",
          "You keep ownership of your Media. This licence does not transfer copyright to MTG.",
        ],
      },
      {
        heading: "4.3 Removal, claims and ending use",
        bullets: [
          "If we receive a complaint, or believe that any Media infringes someone else's rights or breaches this section, we may remove it immediately without notice.",
          "You are fully responsible for any claim that your Media infringes copyright, trademark, privacy or any other rights, and you agree to indemnify MTG against all costs, damages, fees and losses (including legal fees) arising from such a claim.",
          "If this Agreement ends, we will remove your Media from your listing pages within a reasonable time. MTG may continue to use promotional materials already published, printed or distributed before the Agreement ended, and is not required to remove past social media posts or archived content.",
        ],
      },
    ],
  },
  {
    heading: "5. Booking Requests and Confirmation",
    bullets: [
      "Booking requests for your listings appear in your partner dashboard. You must confirm or decline each request promptly, and within 24 hours wherever possible.",
      "Once you confirm a booking, you must provide the service exactly as listed and confirmed, at the agreed price, dates and times.",
      "You must update the booking status in your dashboard (for example to completed or cancelled) so that our records and commission calculations stay accurate.",
      "You must not ask guests who found you through MTG to cancel and rebook directly with you in order to avoid commission.",
    ],
  },
  {
    heading: "6. Prices and Guest Payments",
    bullets: [
      "You set the prices for your listings. Prices shown to guests must include all mandatory taxes and charges, or clearly state any that are paid separately (for example green tax or T-GST).",
      "Unless we agree otherwise in writing for a specific booking, you collect payment directly from the guest and issue them any receipt or invoice required by law.",
      "You must not charge guests more than the price shown and confirmed on MTG for the same service and dates.",
    ],
  },
  {
    heading: "7. Commission and Payment to MTG",
    bankDetails: true,
    bullets: [
      "In return for our marketing and booking services, you pay MTG a commission on each booking made through our platform. The commission rate is the percentage you set on each listing in your dashboard, and it can never be lower than 15% of the total booking value paid by the guest.",
      "Commission becomes payable once a booking is completed (the service has been provided). No commission is due on bookings that are declined, or cancelled with a full refund to the guest. If a guest is charged a cancellation fee or no-show charge, commission is due on the amount you keep.",
      "You must pay commission owed within 14 days of the booking being completed, to the MTG bank account below or by another method we agree in writing, and then report the payment using Notify Payment Sent in your dashboard.",
      "Each party is responsible for its own bank charges and taxes. Your Payments tab shows the commission owed, pending and paid; if you believe an amount is wrong, tell us in writing within 30 days.",
      "If commission remains unpaid after its due date, we may pause your listings or suspend your account until it is paid in full.",
    ],
  },
  {
    heading: "8. Cancellations, Changes and Refunds",
    bullets: [
      "You must publish your cancellation and refund policy in each listing and apply it fairly. Where a listing does not state a policy, MTG's customer Terms and Conditions apply.",
      "If you must cancel or change a confirmed booking, tell the guest and MTG in writing immediately, offer a suitable alternative where possible, and refund the guest in full for any service you do not provide.",
      "Repeated cancellations, no-shows by the partner, or failure to provide a confirmed service may lead to the suspension of your listings or account.",
    ],
  },
  {
    heading: "9. Service Standards and Safety",
    bullets: [
      "You must deliver your services safely, professionally and in line with all applicable laws, including health and safety, marine, transport, employment and environmental regulations.",
      "Vessels, vehicles and equipment must be properly licensed, insured, maintained and operated by qualified staff, with appropriate safety equipment for every guest.",
      "You must treat guests with respect and without discrimination, and respect the local community, culture and marine environment.",
    ],
  },
  {
    heading: "10. Guest Reviews",
    bullets: [
      "Guests may review your listing after their booking. You must not post fake reviews, offer incentives for positive reviews, or pressure guests to change or remove a review.",
      "We may moderate reviews, but we do not edit their content to favour or harm any partner.",
    ],
  },
  {
    heading: "11. Guest Data and Privacy",
    bullets: [
      "You may use guest information shared with you only to provide and manage the booked service, and must keep it secure and confidential.",
      "You must not use guest information for unrelated marketing, or share it with any third party, unless the guest has given their consent or the law requires it.",
    ],
  },
  {
    heading: "12. Insurance and Liability",
    bullets: [
      "You are solely responsible for the services you provide, and must hold adequate public liability and other insurance appropriate to your business.",
      "MTG acts as a marketing and booking platform only and is not the provider of your services. To the extent permitted by law, MTG is not liable for any loss, injury, damage or claim arising from your services, or for any indirect or consequential loss.",
      "You agree to indemnify and hold MTG, its directors, employees and agents harmless against any claim, loss or expense arising from your services, your listings, or your breach of this Agreement.",
    ],
  },
  {
    heading: "13. Suspension and Termination",
    bullets: [
      "Either party may end this Agreement at any time by written notice to the other.",
      "MTG may suspend or close your account, or remove listings, without notice if you breach this Agreement, provide false information, harm guests or MTG's reputation, or fail to pay commission.",
      "Ending the Agreement does not cancel confirmed bookings, which you must still honour unless agreed otherwise, or any commission already owed, which remains payable.",
    ],
  },
  {
    heading: "14. Force Majeure",
    paragraphs: [
      "Neither party is liable for failing to perform its obligations because of events beyond its reasonable control, such as severe weather, natural disasters, epidemics, government action, port or airport closures, or strikes. The affected party must notify the other promptly, and both parties will work in good faith to reschedule or refund affected guests.",
    ],
  },
  {
    heading: "15. Changes to These Terms",
    paragraphs: [
      "We may update these terms from time to time. We will publish the updated version on our website and tell you by email or through your partner dashboard. Continuing to list with MTG after the changes take effect means you accept the updated terms.",
    ],
  },
  {
    heading: "16. Governing Law and Disputes",
    paragraphs: [
      "This Agreement is governed by the laws of the Republic of Maldives. The parties will first try to resolve any dispute in good faith through discussion. Disputes that cannot be resolved this way will be referred to the courts of the Maldives.",
    ],
  },
  {
    heading: "17. Contact",
    paragraphs: [
      "Notices and questions about this Agreement should be sent in writing to contact@maldivestour.guide.",
    ],
  },
];

/** MTG's bank details for commission payments — same account as the customer terms. */
export const PARTNER_TERMS_BANK = [
  "Account name: Maldives Tour Guide Pvt. Ltd",
  "Account number: 7730000288187",
  "Swift number: MALBMVMV",
  "Bank address: BML Building, 11 Boduthakurufaanu Magu, Male, Maldives",
];
