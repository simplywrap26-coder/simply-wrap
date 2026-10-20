# Host on GitHub Pages

Site URL: https://simplywrap26-coder.github.io/simply-wrap/
Repo: https://github.com/simplywrap26-coder/simply-wrap

## One-time setup
1. Push the project (default branch `main`):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/simplywrap26-coder/simply-wrap.git
   git push -u origin main
   ```
   Run `npm install` first and commit `package-lock.json` for repeatable builds.
2. GitHub repo > Settings > Pages > **Build and deployment > Source: GitHub Actions**.
3. Settings > Secrets and variables > Actions > **Variables** tab > add (public values only):
   `VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_API_VERSION`, `VITE_SHOPIFY_STOREFRONT_TOKEN`,
   plus any optional ones listed in `.github/workflows/deploy.yml`.
   The Storefront token is public by design and will be visible in the built site. Never add an Admin token.
4. Push to `main` (or Actions tab > Deploy to GitHub Pages > Run workflow). The site goes live in a minute or two.

## How it is configured
- `VITE_BASE_PATH` sets the base path (vite.config.ts); the router reads it, so links and assets work under `/simply-wrap/`.
- GitHub Pages cannot rewrite URLs, so the build copies `index.html` to `404.html`. Refreshing a deep link works, but
  GitHub returns a 404 status for those URLs, which is slightly worse for search engines.
- Renaming the repo or adding a custom domain: change `VITE_BASE_PATH` in the workflow (custom domain: `/`).
- Test the Pages build locally: `VITE_BASE_PATH=/simply-wrap/ npm run build && npm run preview`.

## Limits on GitHub Pages
- **Newsletter:** `api/newsletter.ts` is a serverless function and cannot run on GitHub Pages (static files only).
  Deploy that function separately (e.g. on Vercel), set `ALLOWED_ORIGIN=https://simplywrap26-coder.github.io`
  there, and set the `VITE_NEWSLETTER_ENDPOINT` variable to its full URL. Until then the signup shows "unavailable".
  The function must also send CORS headers for your Pages origin; I haven't added them, so tell me if you want that.
- **SEO:** client-side rendering plus 404 fallback means weaker search and social previews. A host with real rewrites
  (Vercel, Netlify, Cloudflare Pages) is better for a store.
- **Shopify side:** nothing to change. If you add a custom domain later, nothing in Shopify needs to know the site's address.
