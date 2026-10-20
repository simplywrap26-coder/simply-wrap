import type { Banner, Collection, Filter, Page, PhoneModel, Product, ProductDetail, SortKey } from '../types';

const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined;
const version = (import.meta.env.VITE_SHOPIFY_API_VERSION as string | undefined) ?? '2025-01';
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;

export class ShopifyError extends Error {}

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!domain || !token) throw new ShopifyError('Shopify is not configured. Copy .env.example to .env and add your store details.');
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new ShopifyError(`Shopify request failed (${res.status}).`);
  const json = await res.json();
  if (json.errors?.length) throw new ShopifyError(json.errors[0].message);
  return json.data as T;
}

const PRODUCT_FIELDS = `
  id handle title description availableForSale
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  variants(first: 1) { nodes { id } }
`;

function mapProduct(n: any): Product {
  const compare = n.compareAtPriceRange?.minVariantPrice;
  return {
    id: n.id, handle: n.handle, title: n.title, description: n.description,
    availableForSale: n.availableForSale, featuredImage: n.featuredImage,
    price: n.priceRange.minVariantPrice,
    compareAtPrice: compare && Number(compare.amount) > 0 ? compare : null,
    variantId: n.variants.nodes[0]?.id ?? '',
  };
}

export interface ProductQuery { sortKey?: SortKey; reverse?: boolean; after?: string | null; first?: number; query?: string; filters?: string[] }

export async function getProducts(opts: ProductQuery = {}): Promise<Page<Product>> {
  const data = await storefront<any>(
    `query($first:Int!,$after:String,$sortKey:ProductSortKeys,$reverse:Boolean,$query:String){
      products(first:$first, after:$after, sortKey:$sortKey, reverse:$reverse, query:$query){
        nodes{ ${PRODUCT_FIELDS} } pageInfo{ hasNextPage endCursor }
      }
    }`,
    { first: opts.first ?? 12, after: opts.after ?? null, sortKey: opts.sortKey ?? 'BEST_SELLING', reverse: opts.reverse ?? false, query: opts.query ?? null },
  );
  return { items: data.products.nodes.map(mapProduct), hasNextPage: data.products.pageInfo.hasNextPage, endCursor: data.products.pageInfo.endCursor };
}

export async function getCollections(): Promise<Collection[]> {
  const data = await storefront<any>(`{ collections(first: 24){ nodes{ id handle title description image{ url altText } } } }`);
  return data.collections.nodes;
}

const FILTERS_FIELDS = `id label type values{ id label count input }`;
const mapFilters = (arr: any[] = []): Filter[] => arr.map((f) => ({ id: f.id, label: f.label, type: f.type, values: f.values }));
/** Filter inputs are JSON strings returned by Shopify; we send them back unchanged. */
const parseFilters = (f: string[] = []) => f.map((x) => JSON.parse(x));

export async function getCollectionProducts(handle: string, opts: ProductQuery = {}) {
  const sortMap: Record<SortKey, string> = { BEST_SELLING: 'BEST_SELLING', CREATED_AT: 'CREATED', PRICE: 'PRICE', TITLE: 'TITLE', RELEVANCE: 'BEST_SELLING' };
  const data = await storefront<any>(
    `query($handle:String!,$first:Int!,$after:String,$sortKey:ProductCollectionSortKeys,$reverse:Boolean,$filters:[ProductFilter!]){
      collection(handle:$handle){
        title description
        products(first:$first, after:$after, sortKey:$sortKey, reverse:$reverse, filters:$filters){
          nodes{ ${PRODUCT_FIELDS} } pageInfo{ hasNextPage endCursor } filters{ ${FILTERS_FIELDS} }
        }
      }
    }`,
    { handle, first: opts.first ?? 12, after: opts.after ?? null, sortKey: sortMap[opts.sortKey ?? 'BEST_SELLING'], reverse: opts.reverse ?? false, filters: parseFilters(opts.filters) },
  );
  if (!data.collection) return null;
  const p = data.collection.products;
  return {
    title: data.collection.title as string,
    description: data.collection.description as string,
    page: { items: p.nodes.map(mapProduct), hasNextPage: p.pageInfo.hasNextPage, endCursor: p.pageInfo.endCursor, filters: mapFilters(p.filters) } as Page<Product>,
  };
}

export async function searchProducts(opts: ProductQuery = {}): Promise<Page<Product>> {
  const data = await storefront<any>(
    `query($q:String!,$first:Int!,$after:String,$sortKey:SearchSortKeys,$reverse:Boolean,$filters:[ProductFilter!]){
      search(query:$q, first:$first, after:$after, types:PRODUCT, sortKey:$sortKey, reverse:$reverse, productFilters:$filters){
        nodes{ ... on Product { ${PRODUCT_FIELDS} } } pageInfo{ hasNextPage endCursor } productFilters{ ${FILTERS_FIELDS} }
      }
    }`,
    { q: opts.query ?? '', first: opts.first ?? 12, after: opts.after ?? null, sortKey: opts.sortKey === 'PRICE' ? 'PRICE' : 'RELEVANCE', reverse: opts.reverse ?? false, filters: parseFilters(opts.filters) },
  );
  const s = data.search;
  return { items: s.nodes.map(mapProduct), hasNextPage: s.pageInfo.hasNextPage, endCursor: s.pageInfo.endCursor, filters: mapFilters(s.productFilters) };
}

/** Brands come from Shopify metaobjects (type: phone_model, field: brand), never hardcoded. */
export async function getPhoneBrands(): Promise<string[]> {
  const data = await storefront<any>(`{ metaobjects(type:"phone_model", first:250){ nodes{ fields{ key value } } } }`);
  const brands = new Set<string>();
  for (const n of data.metaobjects.nodes) {
    const b = n.fields.find((f: any) => f.key === 'brand')?.value;
    if (b) brands.add(b);
  }
  return [...brands].sort();
}

/** Product page data, including per-product compatible models managed in Shopify Admin. */
export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  const data = await storefront<any>(
    `query($handle:String!){
      product(handle:$handle){
        ${PRODUCT_FIELDS}
        images(first: 10){ nodes{ url altText width height } }
        compat: metafield(namespace:"custom", key:"compatible_models"){
          references(first: 250){ nodes{ ... on Metaobject { id fields{ key value } } } }
        }
      }
    }`,
    { handle },
  );
  const n = data.product;
  if (!n) return null;
  const models: PhoneModel[] = (n.compat?.references?.nodes ?? [])
    .map((r: any) => {
      const f = (k: string) => r.fields.find((x: any) => x.key === k)?.value;
      return { id: r.id, brand: f('brand'), name: f('name'), sortOrder: Number(f('sort_order') ?? 0) };
    })
    .filter((m: PhoneModel) => m.brand && m.name)
    .sort((a: PhoneModel, b: PhoneModel) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  return { ...mapProduct(n), images: n.images.nodes, models };
}

export type PolicyKind = 'privacyPolicy' | 'shippingPolicy' | 'refundPolicy' | 'termsOfService';

/** Legal pages are edited in Shopify Admin > Settings > Policies, so they stay in sync with checkout. */
export async function getShopPolicy(kind: PolicyKind): Promise<{ title: string; body: string } | null> {
  const data = await storefront<any>(`{ shop { ${kind} { title body } } }`);
  return data.shop[kind] ?? null;
}

/** Hosted customer accounts (login + order history) live on Shopify. Override with VITE_ACCOUNT_URL. */
export const accountUrl = (import.meta.env.VITE_ACCOUNT_URL as string | undefined) ?? (domain ? `https://${domain}/account` : '#');

/** Generic reader for admin-managed content. Returns each entry as {fieldKey: value}; image fields become URLs. */
export async function getMetaobjects(type: string): Promise<Record<string, string>[]> {
  const data = await storefront<any>(
    `query($type:String!){ metaobjects(type:$type, first:50){ nodes{ fields{ key value reference{ ... on MediaImage{ image{ url altText } } } } } } }`,
    { type },
  );
  return data.metaobjects.nodes.map((n: any) => {
    const row: Record<string, string> = {};
    for (const f of n.fields) {
      row[f.key] = f.reference?.image?.url ?? f.value ?? '';
      if (f.reference?.image) row[`${f.key}_alt`] = f.reference.image.altText ?? '';
    }
    return row;
  });
}

export async function getBanners(): Promise<Banner[]> {
  const rows = await getMetaobjects('banner');
  return rows
    .filter((r) => r.active !== 'false' && r.image)
    .map((r) => ({
      heading: r.heading ?? '', subheading: r.subheading ?? '', buttonLabel: r.button_label ?? '', link: r.link ?? '',
      image: r.image, imageAlt: r.image_alt ?? '', placement: (r.placement === 'promo' ? 'promo' : 'hero') as Banner['placement'],
      sortOrder: Number(r.sort_order ?? 0),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
