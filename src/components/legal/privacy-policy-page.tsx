import Link from "next/link";

import { LegalProse } from "@/components/legal/legal-prose";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";

/**
 * Standard privacy policy describing what this codebase actually does
 * with personal data — not boilerplate copied from elsewhere. Covers
 * every real data-collecting surface found in this repo: booking/
 * holiday-request forms, the newsletter, partner/agent/affiliate
 * signup, guest reviews/comments/photo submissions, and the real
 * third-party processors wired in (Bank of Maldives payment gateway,
 * Tawk.to live chat, Supabase hosting). Flagged in the PR/commit
 * message as something the business owner should review — retention
 * periods and anything added later (new trackers, new processors)
 * need a human decision, not an invented one.
 */
export function PrivacyPolicyPage() {
  return (
    <main>
      <PageHero breadcrumbs={[{ label: "Privacy Policy" }]} eyebrow="Legal" title="Privacy Policy" variant="plain" />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <LegalProse>
          <p className="mt-0 text-sm text-neutral-500">
            Maldives Tour Guide Pvt. Ltd — Andhaleebuge, GA. Maamendhoo, 16030, Maldives
          </p>

          <p>
            This Privacy Policy explains how Maldives Tour Guide (&ldquo;MTG&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
            collects, uses, shares, and protects personal information when you use maldivestour.guide or contact us about
            a booking, partnership, or enquiry. It applies alongside our{" "}
            <Link href="/terms-and-conditions/">Terms and Conditions</Link> and{" "}
            <Link href="/terms-and-conditions/transfers/">Terms and Conditions for Transfers</Link>.
          </p>

          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li>
              <strong>Booking and enquiry details</strong> — name, email, phone/WhatsApp number, nationality, travel
              dates, guest counts, and any special requests, when you submit a booking request, a custom holiday quote
              request, or a general enquiry.
            </li>
            <li>
              <strong>Partner, Travel Agent, and Affiliate account details</strong> — business name, contact
              information, country, and (where applicable) PayPal email, when you apply to become a partner, travel
              agent, or affiliate. Partner accounts may also include business documents you upload for verification.
            </li>
            <li>
              <strong>Reviews, comments, and photos</strong> — your name, email (not shown publicly), and any review,
              comment, or photo you choose to submit about a destination, accommodation, activity, or transfer. These
              are held for moderation and only published once approved.
            </li>
            <li>
              <strong>Newsletter sign-up</strong> — your name and email, if you subscribe to travel tips and offers.
            </li>
            <li>
              <strong>Account credentials</strong> — if you create a partner, travel agent, or affiliate account, your
              email and password are stored securely by our authentication provider; we never see or store your
              plain-text password.
            </li>
          </ul>
          <p>
            We also automatically collect limited technical information — such as your IP address, browser type, and
            pages visited — through standard web server logs and the cookies described below.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To process and respond to booking requests, holiday quote requests, and enquiries.</li>
            <li>To contact you about a submission — by email, WhatsApp, or phone — including booking confirmations.</li>
            <li>To review and moderate partner/agent/affiliate applications and user-submitted reviews, comments, and photos.</li>
            <li>To send newsletter emails, if you have subscribed (you can unsubscribe at any time).</li>
            <li>To detect and prevent spam, abuse, and fraudulent submissions.</li>
            <li>To improve our website and services.</li>
          </ul>
          <p>
            We do not sell your personal information. We never publish your email address or phone number alongside a
            review, comment, or photo submission — only your name (or the name you choose to give) is shown publicly,
            and only once staff have approved the submission.
          </p>

          <h2>Payment Information</h2>
          <p>
            Payments are processed through the Bank of Maldives (BML) payment gateway or by direct bank transfer. We
            do not collect or store your full card details — these are handled entirely by BML&rsquo;s own secure
            payment page. See <Link href="/terms-and-conditions/">Terms and Conditions</Link> for our bank transfer
            and refund details.
          </p>

          <h2>Cookies and Similar Technologies</h2>
          <p>We use cookies and similar technologies for:</p>
          <ul>
            <li>
              <strong>Essential site functionality</strong> — keeping you signed in to a partner, travel agent, or
              affiliate account, and remembering preferences such as your selected currency.
            </li>
            <li>
              <strong>Live chat</strong> — our site uses Tawk.to to offer live chat support. Tawk.to may set its own
              cookies to operate the chat widget; see{" "}
              <a href="https://www.tawk.to/privacy-policy/" target="_blank" rel="noopener noreferrer">
                Tawk.to&rsquo;s privacy policy
              </a>{" "}
              for details on how they handle this.
            </li>
          </ul>
          <p>We do not currently use third-party advertising or analytics cookies.</p>

          <h2>Who We Share Information With</h2>
          <p>We share personal information only where necessary to run our business:</p>
          <ul>
            <li>
              <strong>Bank of Maldives</strong> — to process payments.
            </li>
            <li>
              <strong>Tawk.to</strong> — to provide live chat support, if you choose to use it.
            </li>
            <li>
              <strong>Supabase</strong> — our database and hosting infrastructure provider, which stores the
              information described above on our behalf.
            </li>
            <li>
              <strong>WhatsApp / Telegram</strong> — where you choose to continue a conversation with us on WhatsApp,
              or where our own staff receive an internal notification about your submission.
            </li>
          </ul>
          <p>
            We do not share your information with any other third party for their own marketing purposes, and we
            disclose personal information to government or legal authorities only where required by law.
          </p>

          <h2>Data Retention</h2>
          <p>
            We keep booking, enquiry, and account records for as long as reasonably necessary to provide our
            services, maintain accurate business records, and meet our legal and accounting obligations. Rejected or
            unpublished reviews, comments, and photo submissions are kept for moderation records rather than deleted
            immediately, but are never made public.
          </p>

          <h2>Your Rights</h2>
          <p>You may ask us at any time to:</p>
          <ul>
            <li>Confirm what personal information we hold about you.</li>
            <li>Correct inaccurate information.</li>
            <li>Delete your personal information, subject to any legal or accounting records we are required to keep.</li>
            <li>Unsubscribe from newsletter emails (a link is included in every newsletter email).</li>
            <li>Withdraw a submitted review, comment, or photo before it has been published.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:contact@maldivestour.guide">contact@maldivestour.guide</a>.
          </p>

          <h2>Data Security</h2>
          <p>
            We take reasonable technical and organizational measures to protect your personal information, including
            restricting access to staff accounts and applying database-level access controls to every table that
            stores personal information. No method of transmission or storage is completely secure, so we cannot
            guarantee absolute security.
          </p>

          <h2>Children&rsquo;s Privacy</h2>
          <p>
            Our services are not directed at children. A parent or legal guardian must make any booking on behalf of
            a participant under 18, as set out in our{" "}
            <Link href="/terms-and-conditions/">Terms and Conditions</Link>.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other
            operational, legal, or regulatory reasons. We will post the updated policy on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your personal information, contact
            us at <a href="mailto:contact@maldivestour.guide">contact@maldivestour.guide</a>.
          </p>
        </LegalProse>
      </div>
    </main>
  );
}
