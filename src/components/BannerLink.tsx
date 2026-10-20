import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/** Internal paths use the router; full URLs open normally. */
export default function BannerLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  if (!to) return <div className={className}>{children}</div>;
  return /^https?:\/\//.test(to)
    ? <a href={to} className={className} rel="noopener noreferrer">{children}</a>
    : <Link to={to} className={className}>{children}</Link>;
}
