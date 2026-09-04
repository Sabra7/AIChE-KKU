import type { ReactNode } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import { site } from '@/data/site';
import JoinButton from './JoinButton';
import Num from './Num';
import Reveal from './Reveal';

/**
 * Hero.
 *
 * The background is a faint field of benzene rings and gears joined by
 * hairlines — the same molecular-bond motif the logo uses, and the motif that
 * recurs at every section joint.
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

      <svg
        className="hero__field"
        data-pointer-field
        viewBox="0 0 1400 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <g id="benz">
            <polygon
              points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13"
              fill="none"
              stroke="#0D3E6B"
              strokeWidth="1.1"
              strokeOpacity=".2"
            />
            <polygon
              points="0,-17 14.7,-8.5 14.7,8.5 0,17 -14.7,8.5 -14.7,-8.5"
              fill="none"
              stroke="#0D3E6B"
              strokeWidth="1"
              strokeOpacity=".13"
            />
          </g>
          <g id="cog">
            <circle r="19" fill="none" stroke="#0D3E6B" strokeWidth="1.1" strokeOpacity=".17" />
            <circle r="9" fill="none" stroke="#0D3E6B" strokeWidth="1" strokeOpacity=".12" />
            <g stroke="#0D3E6B" strokeWidth="1.1" strokeOpacity=".17" strokeLinecap="round">
              <path d="M0,-19V-25M0,19V25M-19,0H-25M19,0H25" />
              <path d="M13.4,-13.4l4.3,-4.3M-13.4,13.4l-4.3,4.3M13.4,13.4l4.3,4.3M-13.4,-13.4l-4.3,-4.3" />
            </g>
          </g>
        </defs>

        {/* Far layer: the bonds. They barely move, so they read as the ground. */}
        <g data-depth="0.45" className="hero__bonds">
          <g stroke="#0D3E6B" strokeOpacity=".1" strokeWidth="1" fill="none">
            <path d="M150,130 L430,250 L700,90" pathLength={1} />
            <path d="M1090,360 L1210,190" pathLength={1} />
            <path d="M120,480 L330,700 L770,720 L980,640" pathLength={1} />
            <path d="M1090,360 L1310,480" pathLength={1} />
          </g>
        </g>

        {/* Mid layer: the gears, slowly turning. */}
        <g data-depth="0.8">
          <g className="hero__cogs">
            <use href="#cog" x="430" y="250" />
            <use href="#cog" x="1090" y="360" />
            <use href="#cog" x="120" y="480" />
            <use href="#cog" x="770" y="720" />
          </g>
        </g>

        {/* Near layer: the rings, drifting furthest. */}
        <g data-depth="1.3">
          <use href="#benz" x="150" y="130" />
          <use href="#benz" x="1210" y="190" />
          <use href="#benz" x="980" y="640" />
          <use href="#benz" x="330" y="700" />
          <use href="#benz" x="700" y="90" />
          <use href="#benz" x="1310" y="480" />
        </g>
      </svg>

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
              // eslint-disable-next-line react/no-array-index-key
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
