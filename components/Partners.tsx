import Image from 'next/image';

import { pick, type Lang } from '@/lib/i18n';
import { partners } from '@/data/partners';
import Reveal from './Reveal';

/**
 * Who stands with us. Logo and name, nothing else.
 *
 * Deliberately the quietest section on the page: no tilt, no pointer drift, no
 * hover state. These are other organisations' marks, so the only motion is the
 * shared Reveal entrance, and cropping is out of the question — every logo is
 * fitted with `contain` (see .prt__logo).
 *
 * `fill` rather than width/height because the logos arrive at whatever size
 * their owners publish, and a fixed-height box with `contain` is what makes
 * mismatched files sit on one visual line. Nothing is a link, so the alt text
 * is the partner's name in the current language — the name IS the content, and
 * "X's logo" would only repeat what the neighbouring caption already says.
 */
export default function Partners({ lang }: { lang: Lang }) {
  return (
    <section className="sect" id="partners">
      <div className="shell">
        <Reveal className="sect__head">
          <h2>{pick(lang, 'شركاء النجاح', 'Our partners')}</h2>
        </Reveal>

        <Reveal delay={1} className="prt">
          {partners.map((p) => {
            const name = pick(lang, p.nameAr, p.nameEn);
            return (
              <article className="prt__item" key={p.id}>
                <div className="prt__logo">
                  <Image src={p.logo} alt={name} fill sizes="(max-width:700px) 45vw, 220px" />
                </div>
                <p className="prt__name">{name}</p>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
