import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Accessible breadcrumb nav. The last item is treated as the current page. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-neutral-900 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-neutral-900">
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
