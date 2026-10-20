import { getMetaobjects } from '../services/shopify';
import { useAsync } from '../hooks/useAsync';

// Shown until you add `announcement` metaobjects (text, active) in Shopify Admin.
const fallback = ['Premium vinyl wraps', 'Made for your exact phone model', 'Pick your brand and model'];

export default function AnnouncementBar() {
  const { data } = useAsync(() => getMetaobjects('announcement'), []);
  const live = (data ?? []).filter((a) => a.active !== 'false' && a.text).map((a) => a.text);
  const messages = live.length ? live : fallback;
  const row = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {messages.map((m) => (<span key={m} className="mx-8 whitespace-nowrap">{m} <span className="ml-8 opacity-40">✦</span></span>))}
    </div>
  );
  return (
    <div className="overflow-hidden bg-ink py-2 text-xs text-paper">
      <p className="sr-only">{messages.join('. ')}</p>
      <div className="flex w-max animate-marquee">{row}{row}{row}{row}</div>
    </div>
  );
}
