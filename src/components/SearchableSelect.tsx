import { useId, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
  disabled?: boolean; error?: string; placeholder?: string;
}

export default function SearchableSelect({ label, options, value, onChange, disabled, error, placeholder = 'Select' }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const shown = useMemo(() => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())), [options, query]);

  const pick = (v: string) => { onChange(v); setOpen(false); setQuery(''); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, shown.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && open && shown[active]) { e.preventDefault(); pick(shown[active]); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className={`flex items-center rounded-xl border bg-paper ${error ? 'border-ink' : 'border-mist'} ${disabled ? 'opacity-50' : ''}`}>
        <input
          id={id} role="combobox" aria-expanded={open} aria-controls={`${id}-list`} aria-autocomplete="list"
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
          disabled={disabled} autoComplete="off" placeholder={placeholder}
          value={open ? query : value}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)} onBlur={() => { setOpen(false); setQuery(''); }} onKeyDown={onKey}
          className="w-full bg-transparent px-3 py-3 text-sm focus:outline-none"
        />
        <ChevronDown size={16} className="mr-3 text-stone" aria-hidden />
      </div>
      {open && !disabled && (
        <ul id={`${id}-list`} role="listbox" className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-mist bg-paper shadow-lg">
          {shown.length === 0 && <li className="px-3 py-3 text-sm text-stone">No matches</li>}
          {shown.map((o, i) => (
            <li key={o} role="option" aria-selected={o === value} onMouseDown={(e) => { e.preventDefault(); pick(o); }}
              className={`cursor-pointer px-3 py-2.5 text-sm ${i === active ? 'bg-sand' : ''}`}>{o}</li>
          ))}
        </ul>
      )}
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs">{error}</p>}
    </div>
  );
}
