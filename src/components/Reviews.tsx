import { Star } from 'lucide-react';
import { getMetaobjects } from '../services/shopify';
import { useAsync } from '../hooks/useAsync';

/** Reviews are `review` metaobjects in Shopify Admin (name, location, text, rating, active). Hidden until you add some. */
export default function Reviews() {
  const { data } = useAsync(() => getMetaobjects('review'), []);
  const items = (data ?? []).filter((r) => r.active !== 'false' && r.text);
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <h2 className="mb-10 font-display text-4xl md:text-5xl">What customers say</h2>
      <ul className="flex snap-x gap-4 overflow-x-auto pb-4">
        {items.map((r, i) => {
          const rating = Math.min(5, Math.max(1, Number(r.rating) || 5));
          return (
            <li key={i} className="w-80 shrink-0 snap-start rounded-3xl bg-sand/60 p-7">
              <p className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>{Array.from({ length: rating }).map((_, k) => (<Star key={k} size={16} className="fill-ink" aria-hidden />))}</p>
              <p className="mt-4 text-sm leading-relaxed">{r.text}</p>
              <p className="mt-5 text-sm font-medium">{r.name}{r.location && <span className="font-normal text-stone"> / {r.location}</span>}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
