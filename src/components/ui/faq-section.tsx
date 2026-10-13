export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * The "Frequently Asked Questions" / "Common questions" block repeated,
 * byte-for-byte identical, across every directory/detail/landing page in
 * the catalogue (fishing, diving, transfers, packages, activities,
 * speedboats, ferries, islands). Pulling it out here means a future
 * change to how FAQs render (styling, schema, accordion behavior) happens
 * once instead of being hand-mirrored across a dozen files. className and
 * dlClassName default to the most common spacing used across those pages;
 * pass overrides only where a page's surrounding rhythm genuinely differs
 * (e.g. the tighter spacing on a route detail page).
 */
export function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
  className = "mt-12 border-t border-neutral-200 pt-10",
  dlClassName = "mt-4 space-y-6",
}: {
  faqs: ReadonlyArray<FaqItem>;
  title?: string;
  className?: string;
  dlClassName?: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="text-xl font-semibold text-ocean-900">{title}</h2>
      <dl className={dlClassName}>
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="font-medium text-ocean-900">{faq.question}</dt>
            <dd className="mt-1 text-sm text-neutral-700">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
