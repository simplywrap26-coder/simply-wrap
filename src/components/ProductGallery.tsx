import { useState } from 'react';
import type { Image } from '../types';

export default function ProductGallery({ images, title }: { images: Image[]; title: string }) {
  const [i, setI] = useState(0);
  if (images.length === 0) return <div className="aspect-[4/5] bg-sand" />;
  const src = (u: string, w: number) => `${u}${u.includes('?') ? '&' : '?'}width=${w}`;
  return (
    <div>
      <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-sand">
        <img src={src(images[i].url, 1000)} alt={images[i].altText ?? title} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <li key={img.url}>
              <button onClick={() => setI(idx)} aria-label={`Show image ${idx + 1}`} aria-current={idx === i}
                className={`aspect-square w-full overflow-hidden bg-sand ${idx === i ? 'ring-2 ring-ink' : 'opacity-70 hover:opacity-100'}`}>
                <img src={src(img.url, 160)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
