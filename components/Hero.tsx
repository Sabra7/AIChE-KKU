import type { ReactNode } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import { site } from '@/data/site';
import ChemField from './ChemField';
import JoinButton from './JoinButton';
import Num from './Num';
import Reveal from './Reveal';

/**
 * Hero.
 *
 * The background is ChemField — benzene rings, gears, bonds carrying a charge
 * and atoms with orbiting electrons, the same molecular motif the logo uses
 * and the one that recurs at every section joint.
 *
 * It is split into three [data-depth] layers that the pointer moves at
 * different rates (see PointerMotion). One flat sheet sliding under the
 * headline reads as a background image being dragged; three layers moving at
 * 0.45 / 0.8 / 1.3 read as space behind the type, which is the whole point.
 * A soft accent glow trails the pointer over it, and everything here is hidden
 * under reduced motion.
 */

/**
 * The headline is authored as tokens rather than a string, because each word
 * is masked and lifted on its own delay — and because one of the tokens is a
 * number that has to stay inside <Num> so RTL cannot reorder it.
 */
const headline: Record<Lang, ReactNode[]> = {
  ar: ['فرع', 'طلابي', 'في', 'عسير،', 'وشبكة', 'في', <Num key="n">110</Num>, 'دول.'],
  en: [
    'A',
    'student',
    'chapter',
    'in',
    'Aseer.',
    'A',
    'network',
    'in',
    <Num key="n">110</Num>,
    'countries.',
  ],
};

export default function Hero({ lang }: { lang: Lang }) {
  return (
    <section className="hero" id="top" data-hero>
      {/* Painted under the type, centred on the pointer. Pure paint, no layout. */}
      <span className="hero__glow" aria-hidden="true" />

      <ChemField variant="hero" pointer />

      <div className="shell hero__in">
        <Reveal as="p" className="hero__eyebrow">
          <svg className="dotline" width="46" height="8" viewBox="0 0 46 8" aria-hidden="true">
            <line x1="6" y1="4" x2="40" y2="4" stroke="#8BCB32" strokeWidth="1.4" />
            <circle cx="3" cy="4" r="3" fill="#8BCB32" />
            <circle cx="43" cy="4" r="3" fill="#8BCB32" />
          </svg>
          <span>
            {pick(lang, site.universityAr, site.universityEn)} ·{' '}
            {pick(lang, site.departmentAr, site.departmentEn)}
          </span>
        </Reveal>

        {/*
          Each word sits in its own clipping box and rises into place on a
          staggered delay. The stagger is a CSS custom property, so the whole
          effect is still one transition per word — no per-frame work.
        */}
        <Reveal delay={1} className="hero__title">
          <h1>
            {headline[lang].map((word, i) => (
              // The index is a safe key here: the headline is a fixed literal
              // above, never reordered, filtered or appended to at runtime.
              <span className="w" key={i} style={{ ['--i' as string]: i }}>
                <i>{word}</i>
              </span>
            ))}
          </h1>
        </Reveal>

        <Reveal as="p" delay={2} className="hero__tag">
          {site.tagline}
        </Reveal>

        <Reveal delay={3} className="hero__cta">
          <JoinButton lang={lang} />
          <span className="hero__meta">
            {pick(
              lang,
              'التسجيل مفتوح لجميع طلاب جامعة الملك خالد',
              'Open to all King Khalid University students',
            )}
          </span>
        </Reveal>
      </div>

      {/* Scroll cue: a hairline that fills, over and over, at the fold. */}
      <span className="hero__cue" aria-hidden="true">
        <i />
      </span>
    </section>
  );
}
