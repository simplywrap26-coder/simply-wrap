import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

const endpoint = (import.meta.env.VITE_NEWSLETTER_ENDPOINT as string | undefined) ?? '/api/newsletter';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [trap, setTrap] = useState(''); // honeypot: real visitors never fill this
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setState('error'); setMsg('Enter a valid email address.'); return; }
    setState('sending'); setMsg('');
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, company: trap }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong. Please try again.');
      setState('done'); setMsg('Thanks for subscribing.'); setEmail('');
    } catch (err) {
      setState('error'); setMsg(err instanceof TypeError ? 'Signup is unavailable right now.' : (err as Error).message);
    }
  };

  return (
    <section className="mx-auto mt-24 max-w-3xl px-5 text-center">
      <h2 className="font-display text-4xl">New designs, first</h2>
      <p className="mt-3 text-stone">Join our list for new wraps and offers.</p>
      <form onSubmit={submit} noValidate className="mx-auto mt-6 flex max-w-md gap-2">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" autoComplete="email"
          aria-invalid={state === 'error'} aria-describedby="nl-msg" className="min-w-0 flex-1 border border-mist bg-paper px-3 py-3 text-sm" />
        <input name="company" tabIndex={-1} autoComplete="off" aria-hidden value={trap} onChange={(e) => setTrap(e.target.value)} className="absolute -left-[9999px]" />
        <button disabled={state === 'sending'} className="bg-ink px-6 text-sm text-paper transition-colors hover:bg-ink/85 disabled:opacity-60">{state === 'sending' ? 'Joining…' : 'Subscribe'}</button>
      </form>
      <p id="nl-msg" role={state === 'error' ? 'alert' : 'status'} className="mt-3 min-h-5 text-sm text-stone">{msg}</p>
      <p className="mt-1 text-xs text-stone">By subscribing you agree to receive marketing emails. See our <Link to="/privacy" className="underline">privacy policy</Link>.</p>
    </section>
  );
}
