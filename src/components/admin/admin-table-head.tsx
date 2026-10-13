/**
 * The `<thead>` row for an admin list page's results table — same cell
 * styling repeated verbatim across every admin list page, only the
 * column names differ. One shared head means a future style change
 * (padding, sticky positioning, sort affordances) happens once instead
 * of being hand-mirrored across every entity type's list page.
 */
export function AdminTableHead({ columns }: { columns: ReadonlyArray<string> }) {
  return (
    <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500">
      <tr>
        {columns.map((column, i) => (
          <th key={i} className="px-4 py-3">
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}
