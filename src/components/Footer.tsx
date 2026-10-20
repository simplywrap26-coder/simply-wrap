import { Link } from 'react-router-dom';

const cols = [
  { title: 'Shop', links: [['/shop', 'All wraps'], ['/brands', 'By phone brand']] },
  { title: 'Help', links: [['/faq', 'FAQ'], ['/shipping', 'Shipping'], ['/returns', 'Returns'], ['/contact', 'Contact']] },
  { title: 'Company', links: [['/about', 'About'], ['/privacy', 'Privacy'], ['/terms', 'Terms']] },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-3xl">Simply Wrap</p>
          <p className="mt-4 max-w-xs text-sm text-paper/60">Premium vinyl wraps that let you express your style while protecting your phone.</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-sm font-medium">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/60">
              {c.links.map(([to, label]) => (<li key={to}><Link to={to} className="transition-colors hover:text-paper">{label}</Link></li>))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="border-t border-paper/10 py-6 text-center text-xs text-paper/50">© {new Date().getFullYear()} Simply Wrap. All logos and trademarks belong to their owners.</p>
    </footer>
  );
}
