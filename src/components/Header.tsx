import { useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { accountUrl, getCollections } from '../services/shopify';
import { useAsync } from '../hooks/useAsync';

const links = [
  { to: '/shop', label: 'Shop all' },
  { to: '/brands', label: 'Shop by phone' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header({ cartCount = 0, onCartClick }: { cartCount?: number; onCartClick?: () => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { data: collections } = useAsync(getCollections, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) { navigate(`/search?q=${encodeURIComponent(q.trim())}`); setOpen(false); }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-mist/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5">
        <button className="md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Link to="/" className="font-display text-2xl">Simply Wrap</Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm md:flex">
          {links.slice(0, 2).map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `transition-colors hover:text-ink ${isActive ? 'text-ink' : 'text-stone'}`}>{l.label}</NavLink>
          ))}
          {collections && collections.length > 0 && (
            <div className="group relative">
              <button className="flex items-center gap-1 text-stone transition-colors hover:text-ink" aria-haspopup="true">Collections <ChevronDown size={14} aria-hidden /></button>
              <div className="invisible absolute left-0 top-full z-40 w-72 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="rounded-2xl border border-mist bg-paper p-2 shadow-xl">
                  {collections.map((c) => (<li key={c.id}><Link to={`/collections/${c.handle}`} className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-sand">{c.title}</Link></li>))}
                </ul>
              </div>
            </div>
          )}
          {links.slice(2).map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `transition-colors hover:text-ink ${isActive ? 'text-ink' : 'text-stone'}`}>{l.label}</NavLink>
          ))}
        </nav>
        <form onSubmit={submit} role="search" className="ml-auto hidden items-center gap-2 border-b border-mist pb-0.5 md:flex">
          <Search size={16} className="text-stone" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search wraps" placeholder="Search wraps" className="w-36 bg-transparent text-sm placeholder:text-stone focus:outline-none" />
        </form>
        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <a href={accountUrl} aria-label="Account and orders"><User size={22} /></a>
          <button className="relative" aria-label={`Open cart, ${cartCount} items`} onClick={onCartClick}>
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-ink text-[10px] text-paper">{cartCount}</span>}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="max-h-[75vh] overflow-auto border-t border-mist/70 px-5 py-4 md:hidden">
          <form onSubmit={submit} role="search" className="mb-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search wraps" placeholder="Search wraps" className="w-full border-b border-mist bg-transparent pb-1 text-sm focus:outline-none" />
          </form>
          <ul className="space-y-3">
            {links.map((l) => (<li key={l.to}><Link to={l.to} onClick={() => setOpen(false)}>{l.label}</Link></li>))}
            {collections && collections.length > 0 && <li className="pt-2 text-xs uppercase tracking-wider text-stone">Collections</li>}
            {collections?.map((c) => (<li key={c.id}><Link to={`/collections/${c.handle}`} onClick={() => setOpen(false)}>{c.title}</Link></li>))}
            <li className="pt-2"><a href={accountUrl}>My account and orders</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
