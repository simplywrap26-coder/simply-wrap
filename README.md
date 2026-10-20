# Simply Wrap (Vite + React + TypeScript + Shopify Storefront API)

## Run
1. `npm install`
2. `cp .env.example .env` and fill in your store domain and PUBLIC Storefront token
3. `npm run dev`

## Shopify setup needed for Stage 1-2
- Admin > Settings > Apps and sales channels > Develop apps > create app > enable Storefront API scopes:
  `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_read_metaobjects`
  Cart (Stage 4) also needs `unauthenticated_write_checkouts` and `unauthenticated_read_checkouts`.
- Install the app and copy the **Storefront API access token** (public) into `.env`.
- Phone brands: create a metaobject definition `phone_model` with fields `brand` (text), `name` (text),
  and enable **Storefront API access** on it. Add entries for each phone.
- Safe to expose in the browser: store domain, API version, Storefront token. Never use the Admin API token here.

## Docs
See `docs/SETUP.md`, `docs/DEPLOY.md`, `docs/TESTING.md`.

## Not built yet
Reviews, social gallery, newsletter, style/finish sections, advanced filters, customer accounts, sitemap.
