import { HolidayPricingRowForm } from "@/components/admin/holiday-pricing-row-form";
import { getAllPricingConfigAdmin } from "@/lib/admin/holiday-pricing-repository";

const CATEGORY_LABELS: Record<string, string> = {
  resort_room: "Resort — Room Types",
  local_island_room: "Local Island — Room Types",
  safari_cabin: "Safari — Cabin Types",
  meal_plan_resort: "Resort — Meal Plans",
  meal_plan_local_island: "Local Island — Meal Plans",
  transfer: "Transfers",
};

const CATEGORY_ORDER = ["local_island_room", "meal_plan_local_island", "resort_room", "meal_plan_resort", "safari_cabin", "transfer"];

export default async function AdminHolidayPricingPage() {
  const rows = await getAllPricingConfigAdmin();
  const byCategory = new Map<string, typeof rows>();
  for (const row of rows) {
    const list = byCategory.get(row.category) ?? [];
    list.push(row);
    byCategory.set(row.category, list);
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-ocean-900">Custom Holiday — Pricing Config</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Every rate the Custom Holiday Builder uses. Rows marked as a benchmark/estimate (see each source note) came from public research, not an
        official rate card — confirm with the real supplier before relying on these for a live quote. Changes apply immediately to the public
        price calculator.
      </p>

      <div className="mt-6 space-y-8">
        {CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((category) => (
          <section key={category}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{CATEGORY_LABELS[category] ?? category}</h2>
            <div className="mt-3 space-y-3">
              {(byCategory.get(category) ?? []).map((row) => (
                <HolidayPricingRowForm key={row.id} row={row} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
