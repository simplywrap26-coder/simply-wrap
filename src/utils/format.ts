import type { Money } from '../types';
export const formatMoney = ({ amount, currencyCode }: Money) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(Number(amount));
