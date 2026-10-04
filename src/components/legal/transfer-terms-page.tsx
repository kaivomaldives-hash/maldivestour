import type { Metadata } from "next";
import Link from "next/link";

import { LegalProse } from "@/components/legal/legal-prose";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { canonicalUrl } from "@/lib/seo/site";

/**
 * Site owner's real Terms and Conditions for Transfers (speedboat/airport/
 * resort/island transfers). Content transcribed verbatim from the owner's
 * own PDF, reformatted into the site's prose styling, with the one typo'd
 * email ("conatct@") corrected to the address used everywhere else in the
 * app. See TermsOfServicePage for the general terms covering everything
 * else (accommodation, activities, packages).
 */
export function transferTermsMetadata(): Metadata {
  const title = "Terms and Conditions for Transfers | MTG";
  const description = "Maldives Tour Guide's terms and conditions for speedboat, airport, resort and island transfer bookings.";
  const url = canonicalUrl("/terms-and-conditions/transfers");
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

export function TransferTermsPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Terms and Conditions", href: "/terms-and-conditions/" }, { label: "Transfers" }]}
        eyebrow="Legal"
        title="Terms and Conditions for Transfers"
        variant="plain"
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <LegalProse>
          <p className="mt-0 text-sm text-neutral-500">
            Maldives Tour Guide Pvt. Ltd — Andhaleebuge, GA. Maamendhoo, 16030, Maldives
          </p>

          <p>
            These terms apply to speedboat, airport, resort and island transfer bookings. For accommodation, activity and
            package bookings, see our <Link href="/terms-and-conditions/">general Terms and Conditions</Link> instead.
          </p>

          <h2>Booking</h2>
          <ul>
            <li>All transfers require pre-payment and a set time for departure.</li>
            <li>Early departures can be arranged, depending on availability, with no additional charges.</li>
            <li>
              Late departure will be fined at the rate of $1 per minute, up to 30 minutes from the selected time. Later than
              30 minutes, the booking will be considered a no-show, unless prior arrangements have been made. Please choose
              a time wisely and make sure you are available at the chosen time — if you are delayed, please contact us to
              avoid such penalties, since a delay for one guest affects every transfer on our schedule.
            </li>
            <li>
              It is the traveler&rsquo;s responsibility to arrive at the boat, or contact us, on time. Location and contact
              details are provided in your confirmation email, and an airport representative will be waiting for you at the
              international terminal — however, on busy arrivals we might not be able to locate you, in which case please
              visit the airport help desk with your booking right away.
            </li>
          </ul>

          <h2>Payment</h2>
          <p>
            Maldives Tour Guide collects both internal and external online payments through the Bank of Maldives payment
            gateway. Each customer will get a unique payment link with instructions via email from contact@maldivestour.guide.
          </p>

          <h3>For bank transfers</h3>
          <ul>
            <li>Account name: Maldives Tour Guide Pvt. Ltd</li>
            <li>Account number: 7730000288187</li>
            <li>Swift number: MALBMVMV</li>
            <li>Address: BML Building, 11 Boduthakurufaanu Magu, Male, Maldives</li>
          </ul>

          <h2>Cancellation Policy</h2>
          <ul>
            <li>
              Cancellations need to be made in writing to contact@maldivestour.guide, and Maldives Tour Guide shall send a
              confirmation email within 48 hours.
            </li>
            <li>The standard no-cancellation fee for this service is 10 days prior to the departure time.</li>
            <li>Less than 10 days before departure: 50% will be charged.</li>
            <li>Less than 7 days before departure, or no-shows: 100% will be charged.</li>
            <li>
              Booking amendments by either party need to be done in writing, and the receiving party shall confirm reception
              of this email within 48 hours.
            </li>
            <li>Later than 30 minutes past the selected time, the booking will be considered a no-show, unless prior arrangements have been made.</li>
          </ul>

          <h2>Force Majeure</h2>
          <p>
            The performance of this agreement by either party is subject to acts of God, war, government regulation,
            disaster, strikes, civil disorder, curtailment of transportation facilities, or other emergency making it
            inadvisable, illegal, or impossible to perform their obligations under this agreement. Either party may cancel
            this agreement for any one or more of such reasons upon written notice to the other party, with supporting
            documents.
          </p>

          <h2>Refund Policy</h2>
          <p>
            All refunds require the customer&rsquo;s bank account details, and refunds will be processed by bank transfer
            only. Processing time will be within 30 days of the customer&rsquo;s request. Any transaction costs are to be
            borne by the buyer only.
          </p>

          <h2>Liability Release</h2>
          <p>
            <strong>Waiver and release of liability:</strong> this must be read and accepted before a participant can book
            or use any service from Maldives Tour Guide.
          </p>

          <h3>Assumption of risk</h3>
          <p>
            The buyer wishes to buy the products and use the services of Maldives Tour Guide, and recognizes and understands
            that this involves certain risks. Those risks include, but are not limited to, the risk of injury resulting from
            possible malfunction of equipment used, and injuries resulting from tripping or falling over obstacles while in
            the Maldives. In addition, the exertion of traveling to the Maldives could result in injury or death.
          </p>
          <p>
            Despite these and other risks, and fully understanding such risks, the buyer wishes to use the services of
            Maldives Tour Guide and hereby assumes the risks involved in the service. The buyer also hereby holds harmless
            the &ldquo;Sponsors&rdquo; and indemnifies them against any or all claims, actions, suits, procedures, costs,
            expenses (including legal fees and expenses), damages, and liabilities arising out of, connected with, or
            resulting from their service at Maldives Tour Guide, including, without limitation, those resulting from the
            manufacture of vehicles, service delivery, possession, use or operation of all equipment used in the hotels,
            activities and transfers. The buyer hereby releases the Sponsors from all such liability, and understands that
            this release shall be binding upon their estate, heirs, representatives and assigns. The buyer certifies to the
            Sponsors that they are in good health and do not suffer from a heart condition or any other ailment which could
            be exacerbated by the exertion involved during their stay in the Maldives, and further certifies that they are
            18 years of age or older.
          </p>

          <h3>Release of liability, waiver of claims and indemnity agreement</h3>
          <p>
            In consideration of participation in the services of Maldives Tour Guide, the buyer hereby agrees: to waive any
            and all claims that they have, or may in future have, against Maldives Tour Guide, their directors, officers,
            employees, agents and representatives (collectively, the Releasees); to release the Releasees from any and all
            liability for any loss, damage, injury or expense that they may suffer, or that their next of kin may suffer, as
            a result of their participation in any activity due to any cause whatsoever, including negligence on the part of
            the Releasees; and to hold harmless and indemnify the Releasees from all liability for damage to property of, or
            personal injury to, any third party resulting from their participation in activities. This agreement shall be
            effective and binding upon the buyer&rsquo;s heirs, next of kin, executors, administrators and assigns in the
            event of their death.
          </p>
          <p>
            By accepting this agreement at checkout, the buyer confirms they have read and understood it, and are aware
            that they are waiving certain legal rights which they or their heirs, next of kin, executors, administrators
            and assigns may have against the Releasees.
          </p>

          <h3>Participants under age 18</h3>
          <p>
            A parent or legal guardian booking on behalf of a participant under 18 certifies that they consent and agree,
            on behalf of that participant, to the release described above, and to release and indemnify the Releasees from
            any and all liabilities incident to that participant&rsquo;s involvement in these programs, for themselves,
            their heirs, assigns and next of kin.
          </p>
        </LegalProse>
      </div>
    </main>
  );
}
