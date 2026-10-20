import { Link } from 'react-router-dom';

const cols = [
  { title: 'Shop', links: [['/shop', 'All wraps'], ['/brands', 'By phone brand']] },
  { title: 'Help', links: [['/faq', 'FAQ'], ['/shipping', 'Shipping'], ['/returns', 'Returns'], ['/contact', 'Contact']] },
  { title: 'Company', links: [['/about', 'About'], ['/privacy', 'Privacy'], ['/terms', 'Terms']] },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-mist bg-sand/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl">Simply Wrap</p>
          <p className="mt-3 max-w-xs text-sm text-stone">Premium vinyl wraps for your phone.</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-sm font-medium">{c.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-stone">
              {c.links.map(([to, label]) => (<li key={to}><Link to={to} className="hover:text-ink">{label}</Link></li>))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="border-t border-mist py-5 text-center text-xs text-stone">© {new Date().getFullYear()} Simply Wrap</p>
    </footer>
  );
}
