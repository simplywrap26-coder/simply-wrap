export default function Placeholder({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <title>{`${title} | Simply Wrap`}</title>
      <h1 className="font-display text-5xl">{title}</h1>
      <p className="mt-4 text-stone">Content for this page arrives in a later stage.</p>
    </section>
  );
}
