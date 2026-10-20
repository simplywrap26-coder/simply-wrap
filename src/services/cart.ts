import { storefront } from './shopify';
import type { Cart, LineAttribute } from '../types';

const FRAGMENT = `
fragment CartFields on Cart {
  id checkoutUrl totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 100) { nodes {
    id quantity attributes { key value }
    cost { totalAmount { amount currencyCode } }
    merchandise { ... on ProductVariant {
      price { amount currencyCode } image { url altText } product { title handle }
    } }
  } }
}`;

function mapCart(c: any): Cart {
  return {
    id: c.id, checkoutUrl: c.checkoutUrl, totalQuantity: c.totalQuantity, subtotal: c.cost.subtotalAmount,
    lines: c.lines.nodes.map((l: any) => ({
      id: l.id, quantity: l.quantity, attributes: l.attributes, total: l.cost.totalAmount,
      unitPrice: l.merchandise.price, image: l.merchandise.image,
      productTitle: l.merchandise.product.title, productHandle: l.merchandise.product.handle,
    })),
  };
}

function unwrap(payload: any): Cart {
  const err = payload.userErrors?.[0];
  if (err) throw new Error(err.message);
  if (!payload.cart) throw new Error('Cart unavailable.');
  return mapCart(payload.cart);
}

export interface NewLine { merchandiseId: string; quantity: number; attributes: LineAttribute[] }

export async function getCart(id: string): Promise<Cart | null> {
  const d = await storefront<any>(`query($id:ID!){ cart(id:$id){ ...CartFields } } ${FRAGMENT}`, { id });
  return d.cart ? mapCart(d.cart) : null;
}
export async function createCart(line: NewLine): Promise<Cart> {
  const d = await storefront<any>(
    `mutation($lines:[CartLineInput!]){ cartCreate(input:{ lines:$lines }){ cart{ ...CartFields } userErrors{ message } } } ${FRAGMENT}`,
    { lines: [line] });
  return unwrap(d.cartCreate);
}
export async function addLines(cartId: string, line: NewLine): Promise<Cart> {
  const d = await storefront<any>(
    `mutation($id:ID!,$lines:[CartLineInput!]!){ cartLinesAdd(cartId:$id, lines:$lines){ cart{ ...CartFields } userErrors{ message } } } ${FRAGMENT}`,
    { id: cartId, lines: [line] });
  return unwrap(d.cartLinesAdd);
}
export async function updateLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const d = await storefront<any>(
    `mutation($id:ID!,$lines:[CartLineUpdateInput!]!){ cartLinesUpdate(cartId:$id, lines:$lines){ cart{ ...CartFields } userErrors{ message } } } ${FRAGMENT}`,
    { id: cartId, lines: [{ id: lineId, quantity }] });
  return unwrap(d.cartLinesUpdate);
}
export async function removeLine(cartId: string, lineId: string): Promise<Cart> {
  const d = await storefront<any>(
    `mutation($id:ID!,$ids:[ID!]!){ cartLinesRemove(cartId:$id, lineIds:$ids){ cart{ ...CartFields } userErrors{ message } } } ${FRAGMENT}`,
    { id: cartId, ids: [lineId] });
  return unwrap(d.cartLinesRemove);
}
