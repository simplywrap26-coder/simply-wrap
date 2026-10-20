# Deploy

1. `npm install && npm run build` (output in `dist/`).
2. Host on Vercel, Netlify or Cloudflare Pages. `vercel.json` and `public/_redirects` handle SPA routing.
3. Set the `VITE_*` variables from `.env.example` in the host's dashboard, then redeploy.
4. Point your domain at the host. In Shopify, set your checkout/primary domain so checkout looks like your brand.
5. Add the final domain to `public/robots.txt` and, after launch, submit a sitemap in Google Search Console.

## SEO limits of this setup
This is a client-rendered app. Google can render it, but social link previews (Open Graph) and some
crawlers will not see per-product titles or tags. If organic search or sharing matters,
add a prerendering service or move to Hydrogen later; the service layer and components carry over.
The product JSON-LD and page titles are set in the browser after load.
