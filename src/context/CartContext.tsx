import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Cart } from '../types';
import * as api from '../services/cart';

const KEY = 'simplywrap.cartId';
const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v: string | null) => { try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch { /* private mode */ } };

interface CartCtx {
  cart: Cart | null; busy: boolean; error: string | null; isOpen: boolean;
  openCart: () => void; closeCart: () => void;
  addLine: (l: api.NewLine) => Promise<boolean>;
  setQuantity: (lineId: string, q: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
}
const Ctx = createContext<CartCtx | null>(null);
export const useCart = () => { const c = useContext(Ctx); if (!c) throw new Error('useCart must be inside CartProvider'); return c; };

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const id = read();
    if (!id) return;
    api.getCart(id).then((c) => { if (c) setCart(c); else write(null); }).catch(() => {});
  }, []);

  const run = useCallback(async (fn: () => Promise<Cart>) => {
    setBusy(true); setError(null);
    try { const c = await fn(); setCart(c); write(c.id); return true; }
    catch (e) { setError((e as Error).message); return false; }
    finally { setBusy(false); }
  }, []);

  const addLine = async (l: api.NewLine) => {
    const ok = await run(() => (cart ? api.addLines(cart.id, l) : api.createCart(l)));
    if (ok) setOpen(true);
    return ok;
  };
  const setQuantity = async (lineId: string, q: number) => {
    if (!cart) return;
    await run(() => (q < 1 ? api.removeLine(cart.id, lineId) : api.updateLine(cart.id, lineId, q)));
  };
  const removeLine = async (lineId: string) => { if (cart) await run(() => api.removeLine(cart.id, lineId)); };

  return (
    <Ctx.Provider value={{ cart, busy, error, isOpen, openCart: () => setOpen(true), closeCart: () => setOpen(false), addLine, setQuantity, removeLine }}>
      {children}
    </Ctx.Provider>
  );
}
