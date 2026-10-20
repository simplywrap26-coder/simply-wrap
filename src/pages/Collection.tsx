import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductListing from '../components/ProductListing';
import { getCollectionProducts } from '../services/shopify';
import type { SortOption } from '../types';

export default function Collection() {
  const { handle = '' } = useParams();
  const [meta, setMeta] = useState<{ title: string; description: string } | null>(null);
  const fetchPage = useCallback(async (s: SortOption, after: string | null) => {
    const res = await getCollectionProducts(handle, { sortKey: s.key, reverse: s.reverse, after });
    if (res) setMeta({ title: res.title, description: res.description });
    return res?.page ?? null;
  }, [handle]);
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <title>{`${meta?.title ?? 'Collection'} | Simply Wrap`}</title>
      <h1 className="font-display text-5xl">{meta?.title ?? ''}</h1>
      {meta?.description && <p className="mt-3 max-w-xl text-stone">{meta.description}</p>}
      <div className="mt-10"><ProductListing key={handle} fetchPage={fetchPage} /></div>
    </section>
  );
}
