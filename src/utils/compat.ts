import type { LineAttribute, PhoneModel } from '../types';

export const uniqueBrands = (models: PhoneModel[]) => [...new Set(models.map((m) => m.brand))].sort();

export const isCompatible = (models: PhoneModel[], brand: string, model: string) =>
  models.some((m) => m.brand === brand && m.name === model);

/** Stage 4 passes these to the Shopify Cart API as line attributes; they carry through to the order. */
export function buildLineAttributes(models: PhoneModel[], brand: string, model: string): LineAttribute[] {
  const id = models.find((m) => m.brand === brand && m.name === model)?.id ?? '';
  return [
    { key: 'Phone Brand', value: brand },
    { key: 'Phone Model', value: model },
    { key: '_model_id', value: id }, // leading underscore = hidden from customer-facing checkout
  ];
}
