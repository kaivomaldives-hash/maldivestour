import type { ActivityItineraryStep } from "@/lib/activities/types";

export function ActivityItinerarySection({ steps }: { steps: ActivityItineraryStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ocean-900">Itinerary</h2>
      <ol className="mt-4 space-y-4 border-l-2 border-maldives-200 pl-4">
        {steps.map((step, i) => (
          <li key={i}>
            {step.time && <p className="text-sm font-semibold text-maldives-700">{step.time}</p>}
            <p className="font-medium text-ocean-900">{step.title}</p>
            {step.description && <p className="mt-1 text-sm text-neutral-600">{step.description}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
