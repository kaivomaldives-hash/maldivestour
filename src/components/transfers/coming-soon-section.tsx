/** Task 20 §23/§24: seaplane and domestic flight transfers, "Coming
 * Soon" — no invented operators, prices, schedules, or availability. */
export function ComingSoonSection({ title, description }: { title: string; description: string }) {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold text-ocean-900">{title}</h2>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Coming Soon</span>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600">{description}</p>
    </section>
  );
}
