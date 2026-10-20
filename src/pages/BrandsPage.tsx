import { Link } from 'react-router-dom';
import { getPhoneBrands } from '../services/shopify';
import { useAsync } from '../hooks/useAsync';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function BrandsPage() {
  const { data, loading, error } = useAsync(getPhoneBrands, []);
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <title>Shop by phone brand | Simply Wrap</title>
      <h1 className="mb-10 font-display text-5xl">Find your phone</h1>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {data && data.length === 0 && <p className="text-stone">No phone brands yet. Add phone_model entries in Shopify Admin.</p>}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data?.map((b) => (
          <li key={b}>
            {/* Precise brand filtering by compatibility metafield lands in Stage 3 */}
            <Link to={`/search?q=${encodeURIComponent(b)}`} className="block border border-mist p-8 font-display text-3xl transition-colors hover:bg-sand">{b}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
