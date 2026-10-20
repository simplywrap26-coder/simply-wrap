// Add REAL customer reviews here (with permission). The Reviews section stays hidden while this list is empty.
// Later you can replace this with a reviews app (Judge.me, Okendo, Shopify Product Reviews).
export interface Review { name: string; location?: string; text: string; rating: 1 | 2 | 3 | 4 | 5 }
export const reviews: Review[] = [];
