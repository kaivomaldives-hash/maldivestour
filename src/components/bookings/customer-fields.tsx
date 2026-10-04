import { COUNTRIES, DEFAULT_DIAL_CODE } from "@/lib/bookings/countries";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

/**
 * Shared by NodeInquiryForm and RequestBookingForm: a country-code select
 * plus a number input. The select always has a real default (never a
 * blank "choose one" placeholder), so any number a guest types is combined
 * with a dial code before it's ever sent to the server — see each form's
 * submit handler, which reads `${name}Code`/`${name}Number` from the
 * FormData and joins them into one `+<code><digits>` string. That's what
 * lands in bookings.customer_phone/customer_whatsapp and, from there,
 * customers.phone/whatsapp.
 */
export function PhoneField({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <div className="block text-sm">
      <span className="mb-1 block font-medium text-neutral-700">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>
      <div className="flex gap-2">
        {/* A fixed width (not w-full) — combining both on one element is
            unreliable in Tailwind, since the generated stylesheet's class
            order (not the order written here) decides which wins. */}
        <select
          name={`${name}Code`}
          defaultValue={DEFAULT_DIAL_CODE}
          aria-label={`${label} country code`}
          className="min-touch-target w-28 shrink-0 rounded-xl border border-neutral-300 px-2 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
        >
          {COUNTRIES.map((c) => (
            <option key={c.iso2} value={c.dialCode}>
              {c.name} ({c.dialCode})
            </option>
          ))}
        </select>
        <input name={`${name}Number`} type="tel" required={required} autoComplete="tel-national" className={`${INPUT_CLASS} min-w-0 flex-1`} />
      </div>
    </div>
  );
}

/** Combines a PhoneField's two FormData entries into one country-code-
 * prefixed string, or "" if no number was entered (so an optional phone
 * field stays genuinely optional rather than becoming "+960" alone). */
export function combinePhone(data: FormData, name: string): string {
  const code = String(data.get(`${name}Code`) ?? DEFAULT_DIAL_CODE);
  const number = String(data.get(`${name}Number`) ?? "").trim().replace(/[^\d]/g, "");
  return number ? `${code}${number}` : "";
}

export function NationalityField({ name = "nationality" }: { name?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-neutral-700">
        Nationality
        <span aria-hidden="true"> *</span>
      </span>
      <select name={name} required defaultValue="" className={INPUT_CLASS}>
        <option value="" disabled>
          Select your nationality
        </option>
        {COUNTRIES.map((c) => (
          <option key={c.iso2} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
