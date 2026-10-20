import { useCallback, useEffect, useState } from 'react';
import type { Page, Product, SortOption } from '../types';
import ProductGrid from './ProductGrid';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export const SORTS: SortOption[] = [
  { label: 'Best selling', key: 'BEST_SELLING', reverse: false },
  { label: 'Newest', key: 'CREATED_AT', reverse: true },
  { label: 'Price: low to high', key: 'PRICE', reverse: false },
  { label: 'Price: high to low', key: 'PRICE', reverse: true },
  { label: 'Name', key: 'TITLE', reverse: false },
];

/** Sorting + load-more. `fetchPage` is supplied by the parent (all products, a collection, or search). */
export default function ProductListing({ fetchPage }: { fetchPage: (s: SortOption, after: string | null) => Promise<Page<Product> | null> }) {
  const [sortIdx, setSortIdx] = useState(0);
  const [items, setItems] = useState<Product[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (after: string | null, reset: boolean) => {
    setLoading(true); setError(null);
    try {
      const page = await fetchPage(SORTS[sortIdx], after);
      if (!page) throw new Error('Not found.');
      setItems((prev) => (reset ? page.items : [...prev, ...page.items]));
      setCursor(page.endCursor); setMore(page.hasNextPage);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [fetchPage, sortIdx]);

  useEffect(() => { load(null, true); }, [load]);

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <label className="text-sm text-stone">
          Sort
          <select value={sortIdx} onChange={(e) => setSortIdx(Number(e.target.value))} className="ml-2 border-b border-mist bg-transparent py-1 text-ink">
            {SORTS.map((s, i) => (<option key={s.label} value={i}>{s.label}</option>))}
          </select>
        </label>
      </div>
      {error ? <ErrorMessage message={error} /> : <ProductGrid products={items} />}
      {loading && <LoadingSpinner />}
      {!loading && more && (
        <div className="mt-12 text-center">
          <button onClick={() => load(cursor, false)} className="border border-ink px-8 py-3 text-sm transition-colors hover:bg-ink hover:text-paper">Load more</button>
        </div>
      )}
    </div>
  );
}
