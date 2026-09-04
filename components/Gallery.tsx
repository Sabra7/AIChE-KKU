import Image from 'next/image';

import { pick, type Lang } from '@/lib/i18n';
import { gallery } from '@/data/gallery';
import Reveal from './Reveal';

/**
 * Curated selection, not an archive. Each frame's photo drifts slightly with
 * the pointer (see PointerMotion); the image is pre-scaled 1.06 in CSS so the
 * frame never exposes an empty edge while it moves.
 *
 * Alt text is the caption from data/gallery.ts — a real description of the
 * photograph, never generated here.
 */
export default function Gallery({ lang }: { lang: Lang }) {
  return (
    <section className="sect" id="gallery">
      <div className="shell">
        <Reveal className="sect__head">
          <h2>{pick(lang, 'الصور', 'In pictures')}</h2>
        </Reveal>

        <Reveal delay={1} className="gal">
          {gallery.map((p) => {
            const caption = pick(lang, p.captionAr, p.captionEn);
            return (
              <figure className={`s${p.span}`} key={p.src + p.captionEn} data-tilt="3.5">
                <Image
                  src={p.src}
                  alt={caption}
                  fill
                  sizes="(max-width: 820px) 50vw, 33vw"
                  data-pointer-drift
                  style={{ objectFit: 'cover' }}
                />
                <figcaption>{caption}</figcaption>
              </figure>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
