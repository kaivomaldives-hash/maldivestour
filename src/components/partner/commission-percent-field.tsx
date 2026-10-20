const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

/** Shared across all four partner listing forms (accommodation, activity,
 * package, transfer) — the partner sets their own commission on this
 * specific listing, with a 15% floor they can raise but never lower (see
 * submitListing's own server-side re-check, the real enforcement; this is
 * just the matching client-side min). */
export function CommissionPercentField({ defaultValue }: { defaultValue: number | null }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-neutral-700">
        Commission to MTG (%) <span aria-hidden="true">*</span>
      </span>
      <input name="commissionPercent" type="number" min={15} step="0.5" required defaultValue={defaultValue ?? 15} className={INPUT_CLASS} />
      <span className="mt-1 block text-xs text-neutral-500">Minimum 15%. You collect payment from the guest directly and pay us this share.</span>
    </label>
  );
}
