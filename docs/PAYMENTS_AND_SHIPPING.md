# Payments, delivery fees, taxes and orders (all configured in Shopify Admin)

Checkout is hosted by Shopify, so none of this needs code changes. Menu names change over time; if one
is missing, use the Admin search bar. This is setup guidance, not tax or legal advice.

## 1. Payments and UPI
Admin > Settings > Payments.
1. **Check what your country supports.** Shopify Payments is not available in every country. Where it is not,
   you add a third-party gateway.
2. **UPI** is offered through payment gateways that support it. In India, merchants commonly use gateways such as
   Razorpay, Cashfree, PayU or PhonePe. Confirm UPI support and fees with the gateway.
3. Under *Supported payment methods* (or *Add payment methods*), search for your gateway and install/activate it.
   Complete the gateway's business verification (KYC), then in the **gateway's own dashboard** switch on UPI
   (and cards, netbanking, wallets as you like).
4. Once active, UPI appears automatically on Shopify Checkout. No change is needed in the React site.
5. **Cash on Delivery:** Settings > Payments > Manual payment methods > Cash on Delivery. Optionally add a COD fee
   via a dedicated shipping rate or an app, and consider limiting COD by order value.
6. **Test before launch:** use your gateway's test mode, place a test order for each method, then turn test mode off.
   Do one small real UPI payment and refund it from the order page to confirm the full loop.
7. Refunds: Orders > open order > Refund. Capture setting (automatic vs manual) is under Payments > Payment capture.

## 2. Delivery fees
Admin > Settings > Shipping and delivery.
1. **Shipping profiles:** the General profile applies to all products. Create another profile if some products
   (e.g. screen films) ship differently. Set each product's **weight** if you will price by weight.
2. **Zones:** under *Manage rates*, add zones (e.g. "India", "Rest of world"). Only zones you add can order.
3. **Rates per zone** (Add rate):
   - **Flat rate:** one fixed fee (e.g. 49).
   - **Free delivery on everything:** one rate named "Free delivery" with the price set to 0.
   - **Free above a value:** add two price-based rates. Rate A: order price 0 to (threshold minus 0.01), fee X.
     Rate B: order price threshold and above, fee 0.
   - **By weight:** weight-based rates with ranges.
   - **Rate names** can include timing, e.g. "Standard delivery (5-10 business days)".
4. **Free shipping discounts:** Discounts > Create discount > Free shipping (with or without a code).
5. Carrier-calculated live rates need a Shopify plan that supports them or a courier app.
6. The Checkout button on the site shows shipping at the Shopify checkout step; the cart drawer only says it is
   calculated at checkout. If you offer free delivery, update that line in `CartDrawer.tsx`.

## 3. Taxes
Admin > Settings > Taxes and duties. Choose your country, set whether prices include tax, and configure your
tax registration (for example GST in India). Use product tax settings for exceptions. Ask your accountant
which rates and display settings apply to you.

## 4. Discount codes
Admin > Discounts. Code or automatic, percentage, fixed amount, free shipping, buy X get Y. Codes are entered at checkout.

## 5. Emails, invoices, labels, tracking
- **Order confirmation and shipping emails:** Settings > Notifications. Edit the templates and sender.
- **Invoices (e.g. tax invoices):** install an invoice app from the Shopify App Store that suits your country's invoice rules.
- **Shipping labels and tracking:** Shopify Shipping where available; otherwise courier or shipping-aggregator apps
  that create labels and push tracking numbers to the order (customers then get tracking emails automatically).
  Check which carriers and countries each app supports before choosing.
- Fulfil: Orders > open order > Fulfil items > add tracking number > notify customer.

## 6. Customer login and previous orders
See `ACCOUNTS.md`.
