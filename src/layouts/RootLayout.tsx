import { Suspense, useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { initAnalytics, track } from '../utils/analytics';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { CartProvider, useCart } from '../context/CartContext';

function Shell() {
  const { cart, openCart } = useCart();
  const { pathname } = useLocation();
  useEffect(() => { initAnalytics(); }, []);
  useEffect(() => { track('page_view', { page_path: pathname }); }, [pathname]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-paper focus:p-3">Skip to content</a>
      <AnnouncementBar />
      <Header cartCount={cart?.totalQuantity ?? 0} onCartClick={openCart} />
      <main id="main"><Suspense fallback={<LoadingSpinner />}><Outlet /></Suspense></main>
      <Footer />
      <CartDrawer />
      <ScrollRestoration />
    </>
  );
}

export default function RootLayout() {
  return <CartProvider><Shell /></CartProvider>;
}
