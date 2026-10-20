export interface Money { amount: string; currencyCode: string }
export interface Image { url: string; altText: string | null; width?: number; height?: number }
export interface Product {
  id: string; handle: string; title: string; description: string; availableForSale: boolean;
  featuredImage: Image | null; price: Money; compareAtPrice: Money | null; variantId: string;
}
export interface FilterValue { id: string; label: string; count: number; input: string }
export interface Filter { id: string; label: string; type: string; values: FilterValue[] }
export interface Page<T> { items: T[]; hasNextPage: boolean; endCursor: string | null; filters?: Filter[] }
export interface Collection { id: string; handle: string; title: string; description: string; image: Image | null }
export type SortKey = 'BEST_SELLING' | 'CREATED_AT' | 'PRICE' | 'TITLE' | 'RELEVANCE';
export interface SortOption { label: string; key: SortKey; reverse: boolean }

export interface PhoneModel { id: string; brand: string; name: string; sortOrder: number }
export interface ProductDetail extends Product {
  images: Image[];
  models: PhoneModel[]; // from metafield custom.compatible_models (metaobject references)
}
export interface LineAttribute { key: string; value: string }

export interface CartLine {
  id: string; quantity: number; attributes: LineAttribute[];
  total: Money; unitPrice: Money; productTitle: string; productHandle: string; image: Image | null;
}
export interface Cart { id: string; checkoutUrl: string; totalQuantity: number; subtotal: Money; lines: CartLine[] }

export interface Banner {
  heading: string; subheading: string; buttonLabel: string; link: string;
  image: string; imageAlt: string; placement: 'hero' | 'promo'; sortOrder: number;
}
