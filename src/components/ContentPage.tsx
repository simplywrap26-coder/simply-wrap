import type { ReactNode } from 'react';

export default function ContentPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <title>{`${title} | Simply Wrap`}</title>
      <h1 className="font-display text-5xl">{title}</h1>
      {intro && <p className="mt-4 text-lg text-stone">{intro}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}
