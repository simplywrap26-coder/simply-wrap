import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Banner } from '../types';
import BannerLink from './BannerLink';

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const n = banners.length;

  useEffect(() => {
    if (paused || n < 2 || reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n, reduce]);

  return (
    <section aria-roledescription="carousel" aria-label="Featured offers" className="px-3 pt-3"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="relative overflow-hidden rounded-[2rem] bg-ink">
        <div className="relative aspect-[4/3] sm:aspect-[16/7]">
          {banners.map((b, idx) => (
            <div key={idx} aria-hidden={idx !== i} className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
              <img src={`${b.image}${b.image.includes('?') ? '&' : '?'}width=1600`} alt={b.imageAlt} loading={idx === 0 ? 'eager' : 'lazy'} className="h-full w-full object-cover" />
              {(b.heading || b.buttonLabel) && (
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/70 via-ink/10 to-transparent p-6 text-paper md:p-14">
                  {b.heading && <h2 className="max-w-2xl font-display text-4xl leading-tight md:text-6xl">{b.heading}</h2>}
                  {b.subheading && <p className="mt-3 max-w-lg text-paper/80">{b.subheading}</p>}
                  {b.buttonLabel && b.link && <BannerLink to={b.link} className="btn btn-light mt-6 self-start">{b.buttonLabel}</BannerLink>}
                </div>
              )}
              {!b.buttonLabel && b.link && <BannerLink to={b.link} className="absolute inset-0"><span className="sr-only">{b.heading || b.imageAlt || 'Learn more'}</span></BannerLink>}
            </div>
          ))}
        </div>
        {n > 1 && (
          <>
            <button aria-label="Previous slide" onClick={() => setI((i - 1 + n) % n)} className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-paper/80 p-2 md:block"><ChevronLeft size={20} /></button>
            <button aria-label="Next slide" onClick={() => setI((i + 1) % n)} className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-paper/80 p-2 md:block"><ChevronRight size={20} /></button>
            <div className="absolute right-6 top-5 flex gap-2">
              {banners.map((_, idx) => (<button key={idx} aria-label={`Go to slide ${idx + 1}`} aria-current={idx === i} onClick={() => setI(idx)} className={`h-2 rounded-full transition-all ${idx === i ? 'w-6 bg-paper' : 'w-2 bg-paper/50'}`} />))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
