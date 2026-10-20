import type { Filter } from '../types';

interface Props { filters: Filter[]; selected: string[]; onToggle: (input: string) => void; onClear: () => void }

/** Shows the filter groups you configure in Shopify's Search & Discovery app. */
export default function CollectionFilters({ filters, selected, onToggle, onClear }: Props) {
  // Price range filters need a custom control; skipped for now.
  const groups = filters.filter((f) => f.type !== 'PRICE_RANGE' && f.values.length > 0);
  if (groups.length === 0) return null;
  return (
    <details open className="mb-8 md:mb-0">
      <summary className="cursor-pointer text-sm font-medium md:cursor-default">Filter</summary>
      <div className="mt-4 space-y-6">
        {groups.map((g) => (
          <fieldset key={g.id}>
            <legend className="mb-2 text-sm font-medium">{g.label}</legend>
            <ul className="space-y-1.5">
              {g.values.map((v) => (
                <li key={v.id}>
                  <label className={`flex items-center gap-2 text-sm ${v.count === 0 && !selected.includes(v.input) ? 'opacity-40' : ''}`}>
                    <input type="checkbox" checked={selected.includes(v.input)} disabled={v.count === 0 && !selected.includes(v.input)} onChange={() => onToggle(v.input)} className="accent-ink" />
                    <span>{v.label}</span><span className="text-stone">({v.count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
        {selected.length > 0 && <button onClick={onClear} className="text-sm underline underline-offset-4">Clear all filters</button>}
      </div>
    </details>
  );
}
