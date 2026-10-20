import { Link } from 'react-router-dom';
import { getCollections } from '../services/shopify';
import { useAsync } from '../hooks/useAsync';

/** Collection tiles come from your Shopify collections (and their images). Hidden until some exist. */
export default function CollectionTiles() {
  const { data } = useAsync(getCollections, []);
  const items = (data ?? []).slice(0, 8);
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <h2 className="mb-10 font-display text-4xl md:text-5xl">Shop by style and finish</h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {items.map((c) => (
          <li key={c.id}>
            <Link to={`/collections/${c.handle}`} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-sand">
              {c.image && <img src={`${c.image.url}${c.image.url.includes('?') ? '&' : '?'}width=600`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 right-4 font-display text-lg leading-tight text-paper">{c.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
