import { useCallback, useEffect, useState } from 'react';
import type { Filter, Page, Product, SortOption } from '../types';
import ProductGrid from './ProductGrid';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import CollectionFilters from './CollectionFilters';

export const SORTS: SortOption[] = [
  { label: 'Best selling', key: 'BEST_SELLING', reverse: false },
  { label: 'Newest', key: 'CREATED_AT', reverse: true },
  { label: 'Price: low to high', key: 'PRICE', reverse: false },
  { label: 'Price: high to low', key: 'PRICE', reverse: true },
  { label: 'Name', key: 'TITLE', reverse: false },
];
export const SEARCH_SORTS: SortOption[] = [
  { label: 'Relevance', key: 'RELEVANCE', reverse: false },
  { label: 'Price: low to high', key: 'PRICE', reverse: false },
  { label: 'Price: high to low', key: 'PRICE', reverse: true },
];

interface Props {
  fetchPage: (s: SortOption, after: string | null, filters: string[]) => Promise<Page<Product> | null>;
  sorts?: SortOption[];
}

/** Sorting, filters and load-more. `fetchPage` is supplied by the parent (all products, a collection, or search). */
export default function ProductListing({ fetchPage, sorts = SORTS }: Props) {
  const [sortIdx, setSortIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (after: string | null, reset: boolean) => {
    setLoading(true); setError(null);
    try {
      const page = await fetchPage(sorts[sortIdx], after, selected);
      if (!page) throw new Error('Not found.');
      setItems((prev) => (reset ? page.items : [...prev, ...page.items]));
      if (reset && page.filters) setFilters(page.filters);
      setCursor(page.endCursor); setMore(page.hasNextPage);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [fetchPage, sorts, sortIdx, selected]);

  useEffect(() => { load(null, true); }, [load]);

  const toggle = (input: string) => setSelected((s) => (s.includes(input) ? s.filter((x) => x !== input) : [...s, input]));
  const hasFilters = filters.some((f) => f.type !== 'PRICE_RANGE' && f.values.length > 0);

  return (
    <div className={hasFilters ? 'md:grid md:grid-cols-[220px_1fr] md:gap-12' : ''}>
      {hasFilters && <aside><CollectionFilters filters={filters} selected={selected} onToggle={toggle} onClear={() => setSelected([])} /></aside>}
      <div>
        <div className="mb-8 flex justify-end">
          <label className="text-sm text-stone">
            Sort
            <select value={sortIdx} onChange={(e) => setSortIdx(Number(e.target.value))} className="ml-2 border-b border-mist bg-transparent py-1 text-ink">
              {sorts.map((s, i) => (<option key={s.label} value={i}>{s.label}</option>))}
            </select>
          </label>
        </div>
        {error ? <ErrorMessage message={error} /> : <ProductGrid products={items} />}
        {loading && <LoadingSpinner />}
        {!loading && more && (
          <div className="mt-12 text-center">
            <button onClick={() => load(cursor, false)} className="rounded-full border border-ink px-8 py-3 text-sm transition-colors hover:bg-ink hover:text-paper">Load more</button>
          </div>
        )}
      </div>
    </div>
  );
}
