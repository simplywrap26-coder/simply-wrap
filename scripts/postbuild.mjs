// GitHub Pages has no server rewrites. Serving index.html as 404.html makes deep links
// (e.g. /simply-wrap/products/x or a page refresh) load the app, which then routes client-side.
import { copyFileSync, existsSync } from 'node:fs';
if (existsSync('dist/index.html')) {
  copyFileSync('dist/index.html', 'dist/404.html');
  console.log('Created dist/404.html for SPA routing');
}
