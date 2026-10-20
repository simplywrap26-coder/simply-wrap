import { useCallback } from 'react';
import ProductListing from '../components/ProductListing';
import Collection from './Collection';
import { getProducts } from '../services/shopify';
import type { SortOption } from '../types';

// Set VITE_SHOP_ALL_COLLECTION to an "all wraps" collection handle to get filters here.
const allHandle = import.meta.env.VITE_SHOP_ALL_COLLECTION as string | undefined;

export default function ShopAll() {
  const fetchPage = useCallback((s: SortOption, after: string | null) => getProducts({ sortKey: s.key, reverse: s.reverse, after }), []);
  if (allHandle) return <Collection handleOverride={allHandle} fallbackTitle="Shop all wraps" />;
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <title>Shop all wraps | Simply Wrap</title>
      <h1 className="mb-10 font-display text-5xl">Shop all wraps</h1>
      <ProductListing fetchPage={fetchPage} />
    </section>
  );
}
