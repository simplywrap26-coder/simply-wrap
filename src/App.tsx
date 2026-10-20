import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
const Home = lazy(() => import('./pages/Home'));
const ShopAll = lazy(() => import('./pages/ShopAll'));
const Collection = lazy(() => import('./pages/Collection'));
const Search = lazy(() => import('./pages/Search'));
const BrandsPage = lazy(() => import('./pages/BrandsPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));

// BASE_URL comes from vite.config.ts (VITE_BASE_PATH), e.g. "/simply-wrap/" on GitHub Pages.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <ShopAll /> },
      { path: '/collections/:handle', element: <Collection /> },
      { path: '/search', element: <Search /> },
      { path: '/brands', element: <BrandsPage /> },
      { path: '/products/:handle', element: <ProductPage /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/faq', element: <FAQ /> },
      { path: '/shipping', element: <PolicyPage kind="shippingPolicy" title="Shipping policy" /> },
      { path: '/returns', element: <PolicyPage kind="refundPolicy" title="Returns and refunds" /> },
      { path: '/privacy', element: <PolicyPage kind="privacyPolicy" title="Privacy policy" /> },
      { path: '/terms', element: <PolicyPage kind="termsOfService" title="Terms of service" /> },
    ],
  },
], { basename });

export default function App() { return <RouterProvider router={router} />; }
