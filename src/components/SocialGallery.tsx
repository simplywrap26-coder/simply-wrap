import { getMetaobjects } from '../services/shopify';
import { useAsync } from '../hooks/useAsync';

const profile = import.meta.env.VITE_INSTAGRAM_URL as string | undefined;

/** Posts are `social_post` metaobjects (image, link, active). Hidden until you add some. */
export default function SocialGallery() {
  const { data } = useAsync(() => getMetaobjects('social_post'), []);
  const posts = (data ?? []).filter((p) => p.active !== 'false' && p.image).slice(0, 6);
  if (posts.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-4xl md:text-5xl">Follow along</h2>
        {profile && <a href={profile} rel="noopener noreferrer" className="text-sm underline underline-offset-4">Instagram</a>}
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-6">
        {posts.map((p, i) => (
          <li key={i}>
            <a href={p.link || profile || '#'} rel="noopener noreferrer" className="block aspect-square overflow-hidden rounded-2xl bg-sand">
              <img src={`${p.image}${p.image.includes('?') ? '&' : '?'}width=400`} alt={p.image_alt || 'Social post'} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
