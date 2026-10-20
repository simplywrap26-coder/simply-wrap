# Newsletter and filters

## Filters
Filters come from Shopify's **Search & Discovery** app (free). Install it, open Filters, and add the groups you want
(availability, product type, vendor, and metafields it supports). They then appear on collection and search pages.
- Shop All: create an automated collection containing all wraps, then set `VITE_SHOP_ALL_COLLECTION` to its handle.
- Phone brand filtering: if your brand is stored as a plain text metafield, you can add it as a filter in Search & Discovery.
  I haven't confirmed that metaobject-reference lists (`compatible_models`) are filterable there, so check what it offers.
- Not built: a price range control (those filter groups are hidden for now).

## Newsletter
`api/newsletter.ts` is a Vercel serverless function that creates a Shopify customer with marketing consent
(Admin API, scope `write_customers`). Create a custom app for it, then set `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_TOKEN`
and `ALLOWED_ORIGIN` in Vercel (no VITE_ prefix).
- It does not run under `npm run dev`. Use `vercel dev` or test on a deployed preview.
- On Netlify or Cloudflare the function wrapper must be rewritten (the logic is the same).
- Someone who is already a customer is treated as success, but their marketing consent is NOT updated.
- Single opt-in is used. Some regions require double opt-in or specific consent wording; check yours.
- There is no rate limiting beyond the honeypot and origin check. Add one if you see abuse.
