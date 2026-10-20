import type { ProductDetail } from '../types';

export default function ProductJsonLd({ p }: { p: ProductDetail }) {
  const data = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: p.title, description: p.description, image: p.images.map((i) => i.url),
    offers: {
      '@type': 'Offer', price: p.price.amount, priceCurrency: p.price.currencyCode,
      availability: p.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
