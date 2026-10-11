/**
 * Google Calendar sync stub — the real OAuth flow needs a Google Cloud
 * project's Client ID/Secret, which only the site owner can create (in
 * Google Cloud Console) and hand over as environment variables. This tab
 * is wired and ready so the rest of the onboarding flow isn't blocked on
 * that: once the credentials exist, this becomes a real "Connect Google
 * Calendar" button in a quick follow-up, no onboarding-flow changes
 * needed.
 */
export function PartnerCalendarTab() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center">
      <p className="text-sm font-medium text-neutral-700">Google Calendar sync</p>
      <p className="mt-1 text-sm text-neutral-500">
        Coming soon — once connected, your availability will sync automatically so you never get double-booked.
      </p>
      <button
        type="button"
        disabled
        className="mt-4 inline-flex cursor-not-allowed items-center justify-center rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-400"
      >
        Connect Google Calendar
      </button>
    </div>
  );
}
