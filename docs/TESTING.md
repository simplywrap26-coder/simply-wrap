# Testing checklist (do all of these before launch; nothing is verified until you test it)

## Compatibility selector
- [ ] Model dropdown is disabled until a brand is chosen
- [ ] Changing brand clears the model
- [ ] Only that wrap's models appear; searching filters the list
- [ ] Add to cart with no brand, or brand but no model, shows the right message
- [ ] A wrap with no compatible models cannot be added

## Cart data
- [ ] Same wrap for two different phones creates two cart lines
- [ ] Brand and model show on each line; quantity and remove work
- [ ] Cart survives a refresh; a completed order starts a fresh cart
- [ ] Subtotal matches Shopify

## Checkout and orders
- [ ] Checkout button opens Shopify Checkout with the right items
- [ ] Place a test order (Bogus Gateway or test mode); phone brand and model appear on the order in Admin
- [ ] Check whether `_model_id` appears on the order and whether you want it visible
- [ ] Discount code works; taxes and shipping rates appear for your regions

## Payments, invoices, shipping
- [ ] Each payment method you plan to offer completes a real small-value order
- [ ] Order confirmation and shipping emails arrive and look right
- [ ] Invoice document generates (via your chosen app)
- [ ] Shipping label and tracking number flow to the customer

## Site quality
- [ ] Mobile and desktop layouts; keyboard-only navigation; screen-reader labels on forms
- [ ] Policy pages show your text; Contact form opens your email app
- [ ] Page titles update per page; product page JSON-LD passes Google's Rich Results Test
- [ ] Analytics events (page_view, view_item, add_to_cart) appear in GA4 if enabled
- [ ] Lighthouse performance check on home and a product page
