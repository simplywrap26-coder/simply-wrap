import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartLine } from '../types';
import { formatMoney } from '../utils/format';

interface Props { line: CartLine; busy: boolean; onQty: (q: number) => void; onRemove: () => void; onNavigate: () => void }

export default function CartItem({ line, busy, onQty, onRemove, onNavigate }: Props) {
  const visible = line.attributes.filter((a) => !a.key.startsWith('_') && a.value); // hide internal keys
  return (
    <li className="flex gap-4 py-5">
      <div className="h-24 w-20 shrink-0 bg-sand">
        {line.image && <img src={`${line.image.url}${line.image.url.includes('?') ? '&' : '?'}width=200`} alt={line.image.altText ?? line.productTitle} className="h-full w-full object-cover" />}
      </div>
      <div className="flex-1 text-sm">
        <div className="flex justify-between gap-3">
          <Link to={`/products/${line.productHandle}`} onClick={onNavigate} className="font-medium">{line.productTitle}</Link>
          <p>{formatMoney(line.total)}</p>
        </div>
        {visible.map((a) => (<p key={a.key} className="mt-0.5 text-stone">{a.key}: {a.value}</p>))}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center border border-mist">
            <button disabled={busy} aria-label={`Decrease quantity of ${line.productTitle}`} onClick={() => onQty(line.quantity - 1)} className="p-2"><Minus size={12} /></button>
            <span className="w-7 text-center" aria-live="polite">{line.quantity}</span>
            <button disabled={busy} aria-label={`Increase quantity of ${line.productTitle}`} onClick={() => onQty(line.quantity + 1)} className="p-2"><Plus size={12} /></button>
          </div>
          <button disabled={busy} onClick={onRemove} aria-label={`Remove ${line.productTitle}`} className="p-2 text-stone hover:text-ink"><Trash2 size={16} /></button>
        </div>
      </div>
    </li>
  );
}
