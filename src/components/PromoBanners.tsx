import type { Banner } from '../types';
import BannerLink from './BannerLink';

/** Advertisement-style banners (placement "promo" in Shopify). */
export default function PromoBanners({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;
  return (
    <section aria-label="Promotions" className="mx-auto max-w-7xl px-5 pt-24">
      <ul className={`grid gap-4 ${banners.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {banners.map((b, i) => (
          <li key={i}>
            <BannerLink to={b.link} className="group relative block aspect-[16/8] overflow-hidden rounded-3xl bg-sand">
              <img src={`${b.image}${b.image.includes('?') ? '&' : '?'}width=1200`} alt={b.imageAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {(b.heading || b.buttonLabel) && (
                <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/65 to-transparent p-6 text-paper">
                  {b.heading && <span className="font-display text-2xl md:text-3xl">{b.heading}</span>}
                  {b.subheading && <span className="mt-1 text-sm text-paper/80">{b.subheading}</span>}
                  {b.buttonLabel && <span className="mt-3 text-sm underline underline-offset-4">{b.buttonLabel}</span>}
                </span>
              )}
            </BannerLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
