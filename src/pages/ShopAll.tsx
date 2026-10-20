import { useCallback } from 'react';
import ProductListing from '../components/ProductListing';
import { getProducts } from '../services/shopify';
import type { SortOption } from '../types';

export default function ShopAll() {
  const fetchPage = useCallback((s: SortOption, after: string | null) => getProducts({ sortKey: s.key, reverse: s.reverse, after }), []);
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <title>Shop all wraps | Simply Wrap</title>
      <h1 className="mb-10 font-display text-5xl">Shop all wraps</h1>
      <ProductListing fetchPage={fetchPage} />
    </section>
  );
}
