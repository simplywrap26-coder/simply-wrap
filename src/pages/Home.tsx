import { Link } from 'react-router-dom';
import { Lock, PackageCheck, Ruler, Sparkles } from 'lucide-react';
import { getBanners, getCollectionProducts, getPhoneBrands, getProducts } from '../services/shopify';
import { useAsync } from '../hooks/useAsync';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import NewsletterForm from '../components/NewsletterForm';
import CollectionTiles from '../components/CollectionTiles';
import Reviews from '../components/Reviews';
import SocialGallery from '../components/SocialGallery';
import BannerCarousel from '../components/BannerCarousel';
import PromoBanners from '../components/PromoBanners';
import { faqs } from './FAQ';

// Edit this copy to match what you actually offer.
const perks = [
  { icon: Ruler, title: 'Made to fit', text: 'Every wrap is matched to your exact phone model.' },
  { icon: Lock, title: 'Secure checkout', text: 'Payments are handled by Shopify Checkout.' },
  { icon: PackageCheck, title: 'Order updates', text: 'Confirmation and shipping emails after you order.' },
  { icon: Sparkles, title: 'Premium vinyl', text: 'A clean finish designed for everyday use.' },
];

function Row({ title, sort, reverse = false }: { title: string; sort: 'BEST_SELLING' | 'CREATED_AT'; reverse?: boolean }) {
  const { data, loading, error } = useAsync(() => getProducts({ first: 8, sortKey: sort, reverse }), []);
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
        <Link to="/shop" className="text-sm underline underline-offset-4">View all</Link>
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {data && <ProductGrid products={data.items} />}
    </section>
  );
}

const featuredHandle = import.meta.env.VITE_FEATURED_COLLECTION as string | undefined;

function FeaturedRow() {
  const { data } = useAsync(() => (featuredHandle ? getCollectionProducts(featuredHandle, { first: 4 }) : Promise.resolve(null)), []);
  if (!data || data.page.items.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <h2 className="mb-10 font-display text-4xl md:text-5xl">Featured wraps</h2>
      <ProductGrid products={data.page.items} />
    </section>
  );
}

function DefaultHero() {
  return (
      <section className="px-3 pt-3">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink text-paper">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,#6F6B66_0%,transparent_45%),radial-gradient(circle_at_10%_90%,#3a3835_0%,transparent_40%)]" />
          <div aria-hidden className="absolute right-10 top-1/2 hidden h-[440px] w-[210px] -translate-y-1/2 rotate-6 rounded-[2.6rem] bg-gradient-to-br from-sand to-mist shadow-2xl md:block lg:right-32">
            <div className="m-4 h-16 w-16 rounded-2xl bg-ink/80" />
          </div>
          <div className="relative px-6 py-24 md:px-14 md:py-40">
            <p className="mb-5 text-sm uppercase tracking-[0.2em] text-paper/60">Premium vinyl wraps</p>
            <h1 className="max-w-3xl font-display text-6xl leading-[0.95] md:text-8xl">A New Look for Your Phone.</h1>
            <p className="mt-6 max-w-md text-lg text-paper/70">Premium wraps. Your style. Your phone.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn-light">Shop Wraps</Link>
              <Link to="/brands" className="btn btn-ghost">Find Your Phone</Link>
            </div>
          </div>
        </div>
      </section>
  );
}

export default function Home() {
  const brands = useAsync(getPhoneBrands, []);
  const banners = useAsync(getBanners, []);
  const heroBanners = (banners.data ?? []).filter((b) => b.placement === 'hero');
  const promoBanners = (banners.data ?? []).filter((b) => b.placement === 'promo');
  return (
    <>
      <title>Simply Wrap | A new look for your phone</title>
      {heroBanners.length > 0 ? <BannerCarousel banners={heroBanners} /> : <DefaultHero />}

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <h2 className="mb-6 font-display text-3xl md:text-4xl">Shop by phone brand</h2>
        {brands.loading && <LoadingSpinner />}
        {brands.error && <ErrorMessage message={brands.error} />}
        <ul className="flex flex-wrap gap-2">
          {brands.data?.map((b) => (
            <li key={b}><Link to={`/search?q=${encodeURIComponent(b)}`} className="block rounded-full border border-mist px-6 py-3 text-sm transition-colors hover:bg-ink hover:text-paper">{b}</Link></li>
          ))}
        </ul>
      </section>

      <CollectionTiles />
      <PromoBanners banners={promoBanners} />
      <FeaturedRow />
      <Row title="Popular picks" sort="BEST_SELLING" />
      <Row title="New arrivals" sort="CREATED_AT" reverse />
      <Reviews />
      <SocialGallery />

      <section className="mx-auto max-w-7xl px-5 pt-24">
        <h2 className="mb-10 font-display text-4xl md:text-5xl">Why Simply Wrap</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-3xl bg-sand/60 p-7">
              <Icon size={24} aria-hidden />
              <h3 className="mt-5 font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm text-stone">{text}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="mx-auto max-w-3xl px-5 pt-24">
        <h2 className="mb-8 font-display text-4xl md:text-5xl">Questions</h2>
        <div className="divide-y divide-mist rounded-2xl border border-mist px-5">
          {faqs.slice(0, 3).map(([q, a]) => (<details key={q} className="py-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-3 text-stone">{a}</p></details>))}
        </div>
        <Link to="/faq" className="mt-5 inline-block text-sm underline underline-offset-4">All FAQs</Link>
      </section>
      <NewsletterForm />
    </>
  );
}
