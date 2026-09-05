import Image from 'next/image';

import { pick, type Lang } from '@/lib/i18n';
import { SocialMark, SOCIAL_LABELS, type SocialKey } from '@/lib/socials';
import { partners } from '@/data/partners';
import Reveal from './Reveal';

/**
 * Who stands with us. Logo, name, and the partner's own accounts.
 *
 * Deliberately the quietest section on the page: no tilt, no pointer drift.
 * These are other organisations' marks, so the only motion is the shared
 * Reveal entrance plus the colour change an icon link owes the pointer, and
 * cropping is out of the question — every logo is fitted with `contain`
 * (see .prt__logo).
 *
 * `fill` rather than width/height because the logos arrive at whatever size
 * their owners publish, and a fixed-height box with `contain` is what makes
 * mismatched files sit on one visual line. The logo itself is not a link, so
 * its alt text is the partner's name in the current language — the name IS the
 * content, and "X's logo" would only repeat the caption below it.
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
            const links = Object.entries(p.links ?? {}) as Array<[SocialKey, string]>;
            return (
              <article className="prt__item" key={p.id}>
                <div className="prt__logo">
                  <Image src={p.logo} alt={name} fill sizes="280px" />
                </div>
                <p className="prt__name">{name}</p>

                {/* Same 44px targets as a member card, centred under the name. */}
                {links.length > 0 && (
                  <div className="prt__links">
                    {links.map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${SOCIAL_LABELS[key]} — ${name}`}
                      >
                        <SocialMark name={key} />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
