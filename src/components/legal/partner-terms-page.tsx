import Link from "next/link";

import { LegalProse } from "@/components/legal/legal-prose";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import {
  PARTNER_TERMS_BANK,
  PARTNER_TERMS_COMPANY,
  PARTNER_TERMS_INTRO,
  PARTNER_TERMS_LAST_UPDATED,
  PARTNER_TERMS_SECTIONS,
  PARTNER_TERMS_TITLE,
  type PartnerTermsSection,
} from "@/lib/legal/partner-terms";

function SectionBody({ section }: { section: PartnerTermsSection }) {
  return (
    <>
      {section.paragraphs?.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {section.bullets && (
        <ul>
          {section.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * General Terms and Conditions for Partners — what listing businesses
 * agree to on the partner signup and partner request forms. Text lives in
 * src/lib/legal/partner-terms.ts so the signable Word copy matches it.
 */
export function PartnerTermsPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Terms and Conditions", href: "/terms-and-conditions/" }, { label: "Partners" }]}
        eyebrow="Legal"
        title={PARTNER_TERMS_TITLE}
        variant="plain"
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <LegalProse>
          <p className="mt-0 text-sm text-neutral-500">{PARTNER_TERMS_COMPANY}</p>
          <p className="mt-1 text-sm text-neutral-500">Last updated: {PARTNER_TERMS_LAST_UPDATED}</p>

          {PARTNER_TERMS_INTRO.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>
            Travellers booking through our site are covered by our customer{" "}
            <Link href="/terms-and-conditions/">Terms and Conditions</Link>, and how we handle personal information is set
            out in our <Link href="/privacy-policy/">Privacy Policy</Link>.
          </p>

          {PARTNER_TERMS_SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <SectionBody section={section} />
              {section.subsections?.map((sub) => (
                <div key={sub.heading}>
                  <h3>{sub.heading}</h3>
                  <SectionBody section={sub} />
                </div>
              ))}
              {section.bankDetails && (
                <>
                  <h3>MTG bank account for commission payments</h3>
                  <ul>
                    {PARTNER_TERMS_BANK.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          ))}
        </LegalProse>
      </div>
    </main>
  );
}
