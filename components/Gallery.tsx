import Image from 'next/image';

import { dualText } from '@/lib/dates';
import { pick, type Lang } from '@/lib/i18n';
import { gallery } from '@/data/gallery';
import DualDate from './DualDate';
import Reveal from './Reveal';

/**
 * Curated selection, not an archive. Each frame's photo drifts slightly with
 * the pointer (see PointerMotion); the image is pre-scaled 1.06 in CSS so the
 * frame never exposes an empty edge while it moves.
 *
 * Alt text is the caption from data/gallery.ts — a real description of the
 * photograph, never generated here. The semester rides alongside it rather
 * than inside it: the visible caption renders it through <DualDate> so the
 * years cannot be reordered, while `alt` must stay a flat string and gets the
 * same text through `dualText`.
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
            const term = p.term
              ? `${pick(lang, p.term.ar, p.term.en)} ${dualText(lang, p.term.date)}`
              : null;
            return (
              <figure className={`s${p.span}`} key={p.src} data-tilt="3.5">
                <Image
                  src={p.src}
                  alt={term ? `${caption} — ${term}` : caption}
                  fill
                  sizes="(max-width: 820px) 50vw, 33vw"
                  data-pointer-drift
                  style={{ objectFit: 'cover' }}
                />
                <figcaption>
                  {caption}
                  {p.term && (
                    <>
                      {' — '}
                      {pick(lang, p.term.ar, p.term.en)}{' '}
                      <DualDate lang={lang} date={p.term.date} inline />
                    </>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
