import Link from "next/link";

/** Shared by SpeciesLandingPage's "Fishing Techniques" list and
 * TechniqueLandingPage's "Target Species" list — a wrapped row of pill
 * chips, each either a cross-link (when `href` is set) or plain text. */
export function ChipLinkList({ items }: { items: Array<{ label: string; href: string | null }> }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2 text-sm">
      {items.map((item) =>
        item.href ? (
          <li key={item.label}>
            <Link
              href={item.href}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
            >
              {item.label}
            </Link>
          </li>
        ) : (
          <li key={item.label} className="rounded-full border border-neutral-300 px-3 py-1.5 text-neutral-700">
            {item.label}
          </li>
        ),
      )}
    </ul>
  );
}
