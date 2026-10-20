import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatMoney } from '../utils/format';

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.compareAtPrice && Number(product.compareAtPrice.amount) > Number(product.price.amount);
  return (
    <Link to={`/products/${product.handle}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-sand">
        {product.featuredImage && (
          <img
            src={`${product.featuredImage.url}${product.featuredImage.url.includes('?') ? '&' : '?'}width=600`}
            alt={product.featuredImage.altText ?? product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium">{product.title}</h3>
        <p className="shrink-0 text-sm">
          {onSale && <span className="mr-2 text-stone line-through">{formatMoney(product.compareAtPrice!)}</span>}
          {formatMoney(product.price)}
        </p>
      </div>
      {!product.availableForSale && <p className="mt-1 text-xs text-stone">Sold out</p>}
    </Link>
  );
}
