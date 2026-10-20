# Customer login and order history

The site's account icon opens Shopify's hosted **customer accounts** (login, order history, tracking links).
- Enable it: Admin > Settings > Customer accounts > choose **New customer accounts** (sign in with an email code).
- The link defaults to `https://<your-store-domain>/account`. If that does not open your account page, set
  `VITE_ACCOUNT_URL` to the link shown in Customer accounts settings.
- Customers can also check out as guests. Orders placed with the same email appear in their account.
- Why hosted: building login inside React needs Shopify's Customer Account API (OAuth with PKCE, callback URLs,
  token storage). It is possible, but it is a separate project with more security surface. Hosted accounts are the
  safer first launch. Tell me if you want the in-site version later.
