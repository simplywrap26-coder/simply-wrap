# Connect your Shopify store

## 1. Create the Storefront token
Shopify Admin > Settings > Apps and sales channels > Develop apps > Create an app.
Configure **Storefront API** scopes:
`unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`,
`unauthenticated_read_metaobjects`, `unauthenticated_read_content`,
`unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
Install the app, copy the **Storefront API access token** into `.env` (`VITE_SHOPIFY_STOREFRONT_TOKEN`).
Safe to expose: store domain, API version, Storefront token, analytics ID, contact email.
Never put an Admin API token in this project.

## 2. Phone compatibility data
Settings > Custom data > Metaobjects > Add definition `phone_model`:
- `brand` (single line text), `name` (single line text), `sort_order` (integer)
- Enable **Storefront API access**.
Settings > Custom data > Products > Add definition:
- Namespace and key `custom.compatible_models`, type **List of metaobject references** > `phone_model`
- Enable **Storefront API access**.
Add one `phone_model` entry per phone (e.g. brand "Samsung", name "Galaxy S24").

## 3. Add a new wrap (no code changes)
Products > Add product: title, description, images, price (and compare-at price for sales).
Set the **Compatible models** metafield to the phones this wrap fits. Make sure the product is
published to the sales channel your app uses. Save; it appears on the site immediately.
Add it to a collection to show it at `/collections/<collection-handle>`.

## 4. Policies and store operations (all inside Shopify)
- Policies: Settings > Policies (shown on the Shipping, Returns, Privacy and Terms pages).
- Payments, taxes, shipping rates, notification emails: Settings in Admin.
- Invoices and shipping labels: use a Shopify App Store invoice app and Shopify Shipping or a courier app.
  Availability depends on your country, so check what is offered for your region before launch.
