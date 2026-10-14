import Link from "next/link";

/**
 * Generic "I agree to the Terms and Conditions" checkbox for forms
 * outside the booking flow (which already has its own BookingSource-aware
 * TermsCheckbox — see src/components/bookings/customer-fields.tsx). Used
 * by reviews and partner/agent/affiliate signup + the partner lead form,
 * each enforcing the same flag server-side in its own RPC.
 */
export function AgreeToTermsCheckbox({ name = "agreedToTerms" }: { name?: string }) {
  return (
    <label className="flex items-start gap-2 text-sm text-neutral-700">
      <input type="checkbox" name={name} required className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-maldives-600 focus:ring-maldives-500" />
      <span>
        I have read and agree to the{" "}
        <Link href="/terms-and-conditions/" target="_blank" rel="noopener noreferrer" className="text-maldives-600 underline">
          Terms and Conditions
        </Link>
        <span aria-hidden="true"> *</span>
      </span>
    </label>
  );
}
