import { useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';

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
        <Link to="/" className="font-display text-2xl tracking-tight">Simply Wrap</Link>
        <nav aria-label="Main" className="hidden gap-7 text-sm md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `transition-colors hover:text-ink ${isActive ? 'text-ink' : 'text-stone'}`}>{l.label}</NavLink>
          ))}
        </nav>
        <form onSubmit={submit} role="search" className="ml-auto hidden items-center gap-2 border-b border-mist pb-0.5 md:flex">
          <Search size={16} className="text-stone" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search wraps" placeholder="Search wraps" className="w-40 bg-transparent text-sm placeholder:text-stone focus:outline-none" />
        </form>
        <button className="relative ml-auto md:ml-0" aria-label={`Open cart, ${cartCount} items`} onClick={onCartClick}>
          <ShoppingBag size={22} />
          {cartCount > 0 && <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-ink text-[10px] text-paper">{cartCount}</span>}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-mist/70 px-5 py-4 md:hidden">
          <form onSubmit={submit} role="search" className="mb-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search wraps" placeholder="Search wraps" className="w-full border-b border-mist bg-transparent pb-1 text-sm focus:outline-none" />
          </form>
          <ul className="space-y-3">
            {links.map((l) => (<li key={l.to}><Link to={l.to} onClick={() => setOpen(false)}>{l.label}</Link></li>))}
          </ul>
        </nav>
      )}
    </header>
  );
}
