import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductListing from '../components/ProductListing';
import { getProducts } from '../services/shopify';
import type { SortOption } from '../types';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const fetchPage = useCallback((s: SortOption, after: string | null) => getProducts({ query: q, sortKey: s.key, reverse: s.reverse, after }), [q]);
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <title>{`Search: ${q} | Simply Wrap`}</title>
      <h1 className="mb-10 font-display text-5xl">Results for “{q}”</h1>
      <ProductListing key={q} fetchPage={fetchPage} />
    </section>
  );
}
