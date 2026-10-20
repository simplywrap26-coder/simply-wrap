import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE_PATH controls where the site is served from.
//   Local dev / custom domain / Vercel / Netlify: leave unset (uses "/")
//   GitHub Pages project site: "/simply-wrap/"
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let base = env.VITE_BASE_PATH || '/';
  if (!base.startsWith('/')) base = `/${base}`;
  if (!base.endsWith('/')) base = `${base}/`;
  return { base, plugins: [react()] };
});
