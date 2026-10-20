import { Link } from 'react-router-dom';
import { getPhoneBrands, getProducts } from '../services/shopify';
import { useAsync } from '../hooks/useAsync';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import NewsletterForm from '../components/NewsletterForm';

function Row({ title, sort, reverse = false }: { title: string; sort: 'BEST_SELLING' | 'CREATED_AT'; reverse?: boolean }) {
  const { data, loading, error } = useAsync(() => getProducts({ first: 4, sortKey: sort, reverse }), []);
  return (
    <section className="mx-auto max-w-7xl px-5 pt-20">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-display text-4xl">{title}</h2>
        <Link to="/shop" className="text-sm text-stone underline-offset-4 hover:text-ink hover:underline">View all</Link>
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {data && <ProductGrid products={data.items} />}
    </section>
  );
}

export default function Home() {
  const brands = useAsync(getPhoneBrands, []);
  return (
    <>
      <title>Simply Wrap | A new look for your phone</title>
      <section className="bg-sand/60">
        <div className="mx-auto max-w-7xl px-5 py-24 md:py-36">
          <h1 className="max-w-3xl font-display text-6xl leading-[0.95] tracking-tight md:text-8xl">A New Look for Your Phone.</h1>
          <p className="mt-6 text-lg text-stone">Premium wraps. Your style. Your phone.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/shop" className="bg-ink px-8 py-3.5 text-sm text-paper transition-colors hover:bg-ink/85">Shop Wraps</Link>
            <Link to="/brands" className="border border-ink px-8 py-3.5 text-sm transition-colors hover:bg-ink hover:text-paper">Find Your Phone</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pt-20">
        <h2 className="mb-8 font-display text-4xl">Shop by phone brand</h2>
        {brands.loading && <LoadingSpinner />}
        {brands.error && <ErrorMessage message={brands.error} />}
        <ul className="flex flex-wrap gap-3">
          {brands.data?.map((b) => (
            <li key={b}><Link to={`/search?q=${encodeURIComponent(b)}`} className="block border border-mist px-6 py-3 text-sm transition-colors hover:bg-sand">{b}</Link></li>
          ))}
        </ul>
      </section>
      <Row title="Best sellers" sort="BEST_SELLING" />
      <Row title="New arrivals" sort="CREATED_AT" reverse />
      <NewsletterForm />
    </>
  );
}
