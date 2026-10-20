import { useState, type FormEvent } from 'react';
import ContentPage from '../components/ContentPage';

const email = import.meta.env.VITE_CONTACT_EMAIL as string | undefined;
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function Contact() {
  const [v, setV] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [note, setNote] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!v.name.trim()) next.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(v.email)) next.email = 'Enter a valid email address.';
    if (v.message.trim().length < 10) next.message = 'Write at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    if (!email) { setNote('Contact email is not configured. Set VITE_CONTACT_EMAIL.'); return; }
    // No backend here: this opens the visitor's email app. Swap for a serverless endpoint or a form service later.
    const body = `${v.message}\n\nFrom: ${v.name} (${v.email})`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent('Simply Wrap enquiry')}&body=${encodeURIComponent(body)}`;
    setNote('Your email app should open with your message ready to send.');
  };

  const field = (k: keyof typeof v, label: string, type = 'text') => (
    <div>
      <label htmlFor={k} className="mb-1.5 block text-sm font-medium">{label}</label>
      {k === 'message'
        ? <textarea id={k} rows={6} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined} className="w-full border border-mist bg-paper px-3 py-3 text-sm" />
        : <input id={k} type={type} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined} className="w-full border border-mist bg-paper px-3 py-3 text-sm" />}
      {errors[k] && <p id={`${k}-err`} role="alert" className="mt-1.5 text-xs">{errors[k]}</p>}
    </div>
  );

  return (
    <ContentPage title="Contact" intro="Questions about fit, orders or designs? Send us a message.">
      <form onSubmit={submit} noValidate className="space-y-5">
        {field('name', 'Name')}
        {field('email', 'Email', 'email')}
        {field('message', 'Message')}
        <button type="submit" className="bg-ink px-8 py-3.5 text-sm text-paper transition-colors hover:bg-ink/85">Send message</button>
        {note && <p role="status" className="text-sm text-stone">{note}</p>}
      </form>
    </ContentPage>
  );
}
