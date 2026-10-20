import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { getProductByHandle, getProducts } from '../services/shopify';
import { useAsync } from '../hooks/useAsync';
import { buildLineAttributes, isCompatible } from '../utils/compat';
import { formatMoney } from '../utils/format';
import { useCart } from '../context/CartContext';
import ProductJsonLd from '../components/ProductJsonLd';
import { track } from '../utils/analytics';
import ProductGallery from '../components/ProductGallery';
import PhoneCompatibilitySelector from '../components/PhoneCompatibilitySelector';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Related({ currentId }: { currentId: string }) {
  const { data } = useAsync(() => getProducts({ first: 5 }), []);
  const items = data?.items.filter((p) => p.id !== currentId).slice(0, 4) ?? [];
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <h2 className="mb-8 font-display text-4xl">You may also like</h2>
      <ProductGrid products={items} />
    </section>
  );
}

export default function ProductPage() {
  const { handle = '' } = useParams();
  const { data: p, loading, error } = useAsync(() => getProductByHandle(handle), [handle]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<{ brand?: string; model?: string }>({});
  const [status, setStatus] = useState('');
  const { addLine, busy, error: cartError } = useCart();
  useEffect(() => { if (p) track('view_item', { item_id: p.id, item_name: p.title, value: Number(p.price.amount), currency: p.price.currencyCode }); }, [p?.id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!p) return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <h1 className="font-display text-5xl">Wrap not found</h1>
      <p className="mt-4 text-stone">It may have been unpublished. <Link to="/shop" className="underline">Browse all wraps</Link>.</p>
    </section>
  );

  const onSale = p.compareAtPrice && Number(p.compareAtPrice.amount) > Number(p.price.amount);

  const handleAdd = async () => {
    const next: typeof errors = {};
    if (!brand) next.brand = 'Choose your phone brand.';
    if (brand && !model) next.model = 'Choose your phone model.';
    if (brand && model && !isCompatible(p.models, brand, model)) next.model = 'That model isn’t compatible with this wrap.';
    setErrors(next);
    if (Object.keys(next).length) { setStatus(''); return; }
    const attributes = buildLineAttributes(p.models, brand, model);
    const ok = await addLine({ merchandiseId: p.variantId, quantity: qty, attributes });
    if (ok) track('add_to_cart', { item_id: p.id, item_name: p.title, quantity: qty, phone: `${brand} ${model}` });
    setStatus(ok ? 'Added to cart.' : '');
  };

  return (
    <>
      <title>{`${p.title} | Simply Wrap`}</title>
      <meta name="description" content={p.description.slice(0, 155)} />
      <ProductJsonLd p={p} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-12 md:grid-cols-2">
        <ProductGallery images={p.images} title={p.title} />
        <div className="md:sticky md:top-24 md:self-start">
          <h1 className="font-display text-5xl leading-tight">{p.title}</h1>
          <p className="mt-3 text-lg">
            {onSale && <span className="mr-3 text-stone line-through">{formatMoney(p.compareAtPrice!)}</span>}
            {formatMoney(p.price)}
          </p>
          <p className="mt-1 text-sm text-stone">{p.availableForSale ? 'In stock' : 'Sold out'}</p>
          <p className="mt-6 max-w-prose whitespace-pre-line text-stone">{p.description}</p>

          <div className="mt-8">
            <PhoneCompatibilitySelector models={p.models} brand={brand} model={model}
              onBrand={(b) => { setBrand(b); setErrors({}); setStatus(''); }}
              onModel={(m) => { setModel(m); setErrors({}); setStatus(''); }} errors={errors} />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center overflow-hidden rounded-full border border-mist" role="group" aria-label="Quantity">
              <button className="p-3" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14} /></button>
              <span className="w-8 text-center text-sm" aria-live="polite">{qty}</span>
              <button className="p-3" aria-label="Increase quantity" onClick={() => setQty(Math.min(20, qty + 1))}><Plus size={14} /></button>
            </div>
            <button onClick={handleAdd} disabled={busy || !p.availableForSale || p.models.length === 0}
              className="flex-1 rounded-full bg-ink py-3.5 text-sm text-paper transition-colors hover:bg-ink/85 disabled:bg-mist disabled:text-stone">
              {!p.availableForSale ? 'Sold out' : busy ? 'Adding…' : 'Add to cart'}
            </button>
          </div>
          {status && <p role="status" className="mt-3 text-sm text-stone">{status}</p>}
          {cartError && <p role="alert" className="mt-3 text-sm">{cartError}</p>}

          <div className="mt-10 divide-y divide-mist rounded-2xl border border-mist px-5 text-sm">
            {[
              ['Details and care', 'Premium vinyl with a matte finish. Clean the surface and apply to a dry phone. To clean, wipe with a soft damp cloth. Edit this copy in ProductPage.tsx.'],
              ['Shipping and returns', 'Shipping times and return terms are shown at checkout. Edit this copy once your policies are final.'],
            ].map(([t, body]) => (
              <details key={t} className="group py-4">
                <summary className="cursor-pointer list-none font-medium">{t}</summary>
                <p className="mt-3 text-stone">{body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Related currentId={p.id} />
    </>
  );
}
