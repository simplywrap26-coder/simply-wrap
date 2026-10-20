import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductListing from '../components/ProductListing';
import { getCollectionProducts } from '../services/shopify';
import type { SortOption } from '../types';

export default function Collection({ handleOverride, fallbackTitle }: { handleOverride?: string; fallbackTitle?: string }) {
  const params = useParams();
  const handle = handleOverride ?? params.handle ?? '';
  const [meta, setMeta] = useState<{ title: string; description: string } | null>(null);
  const fetchPage = useCallback(async (s: SortOption, after: string | null, filters: string[]) => {
    const res = await getCollectionProducts(handle, { sortKey: s.key, reverse: s.reverse, after, filters });
    if (res) setMeta({ title: res.title, description: res.description });
    return res?.page ?? null;
  }, [handle]);
  const title = fallbackTitle ?? meta?.title ?? 'Collection';
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <title>{`${title} | Simply Wrap`}</title>
      <h1 className="font-display text-5xl">{title}</h1>
      {!fallbackTitle && meta?.description && <p className="mt-3 max-w-xl text-stone">{meta.description}</p>}
      <div className="mt-10"><ProductListing key={handle} fetchPage={fetchPage} /></div>
    </section>
  );
}
