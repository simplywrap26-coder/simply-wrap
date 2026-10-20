import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../utils/format';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { cart, busy, error, isOpen, closeCart, setQuantity, removeLine } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;
  const empty = !cart || cart.lines.length === 0;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={closeCart} aria-hidden />
      <aside role="dialog" aria-modal="true" aria-label="Shopping cart" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-xl">
        <div className="flex items-center justify-between border-b border-mist px-5 py-4">
          <h2 className="font-display text-2xl">Your cart</h2>
          <button ref={closeRef} onClick={closeCart} aria-label="Close cart"><X size={20} /></button>
        </div>
        {empty ? (
          <p className="px-5 py-16 text-center text-stone">Your cart is empty. Pick a wrap and your phone to get started.</p>
        ) : (
          <ul className="flex-1 divide-y divide-mist overflow-auto px-5">
            {cart!.lines.map((l) => (
              <CartItem key={l.id} line={l} busy={busy} onQty={(q) => setQuantity(l.id, q)} onRemove={() => removeLine(l.id)} onNavigate={closeCart} />
            ))}
          </ul>
        )}
        {error && <p role="alert" className="border-t border-mist bg-sand/50 px-5 py-3 text-sm">{error}</p>}
        {!empty && (
          <div className="border-t border-mist px-5 py-5">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-medium">{formatMoney(cart!.subtotal)}</span></div>
            <p className="mt-1 text-xs text-stone">Shipping and taxes are calculated at checkout.</p>
            {/* Shopify hosts checkout: we only redirect to the URL it returns. */}
            <a href={cart!.checkoutUrl} className="mt-4 block rounded-full bg-ink py-4 text-center text-sm text-paper transition-colors hover:bg-ink/85">Checkout</a>
          </div>
        )}
      </aside>
    </div>
  );
}
