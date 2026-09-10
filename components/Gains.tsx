'use client';

import { useEffect, useRef, useState } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import ChemField from './ChemField';
import { Icon, type IconName } from './Icon';
import Num from './Num';

/**
 * "What you gain" — the most important section on the site.
 *
 * One presentation everywhere: six cards on a horizontal scroller.
 *
 * It used to be two. Desktop got a stage pinned with `position: sticky` whose
 * progress GSAP's ScrollTrigger read, and phones got this rail, because six
 * full-width rows stacked vertically bury the last of them. Carrying both meant
 * a lazy GSAP import, a measured track height, a breakpoint the CSS and the JS
 * each had to be told about separately, and a fallback for when any of that
 * failed. The rail does the same job at every width, so the pin is gone and so
 * is GSAP — it was the only thing on the site that used it.
 *
 * Everything about the rail is built to say "move me" before anyone has to
 * guess: the next card is cut by the container edge, a rule fills as you go, a
 * counter says how many are left, a pair of arrows steps it a card at a time,
 * and on touch a line of copy names the gesture outright and retires itself
 * once it has been used.
 *
 * Layout is CSS, so the first paint is already horizontal. The JS below only
 * reports progress.
 */

interface Gain {
  word: string;
  icon: IconName;
  descAr: string;
  descEn: string;
}

const GAINS: Gain[] = [
  {
    word: 'LEAD',
    icon: 'helmet',
    descAr: 'تقود لجنة، لا تحضر اجتماعًا.',
    descEn: 'You run a committee, not attend one.',
  },
  {
    word: 'CREATE',
    icon: 'flask',
    descAr: 'من فكرة على ورقة إلى ملصق بحثي تقف خلفه.',
    descEn: 'From an idea on paper to a research poster you stand behind.',
  },
  {
    word: 'CONNECT',
    icon: 'bond',
    descAr: 'شبكة في 110 دول، تبدأ من أبها.',
    descEn: 'A network across 110 countries, starting in Abha.',
  },
  {
    word: 'ORGANIZE',
    icon: 'gear',
    descAr: 'معرض، مؤتمر، لقاء مهني — تنفّذه بنفسك.',
    descEn: 'An expo, a conference, an industry session — you deliver it.',
  },
  {
    word: 'COMMUNICATE',
    icon: 'signal',
    descAr: 'تشرح الهيدروجين الأزرق لمن لم يسمع به قط.',
    descEn: "You explain blue hydrogen to someone who's never heard of it.",
  },
  {
    word: 'GROW',
    icon: 'sprout',
    descAr: 'شهادات السلامة، ومكتبة تقنية لا تنتهي.',
    descEn: "Process-safety certificates and a technical library that doesn't run out.",
  },
];

/**
  * A chevron, named by which edge of the box it points AT rather than by left
  * or right: the callers are direction-aware and would otherwise each have to
  * repeat the same ternary.
  */
function Chevron({ points }: { points: 'start' | 'end' }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <path
        d={points === 'start' ? 'M10 2.5 4.5 8 10 13.5' : 'M6 2.5 11.5 8 6 13.5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Two digits, so the counter never changes width as it counts. */
const pad = (n: number) => String(n).padStart(2, '0');

export default function Gains({ lang }: { lang: Lang }) {
  const listRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const [swiped, setSwiped] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const rtl = lang === 'ar';

  /** Progress along the rail, for the fill and the counter. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const onScroll = () => {
      const max = list.scrollWidth - list.clientWidth;
      // RTL browsers report scrollLeft as zero or negative, LTR as positive.
      // The distance travelled is the magnitude either way.
      const travelled = Math.abs(list.scrollLeft);
      const p = max > 0 ? Math.min(1, travelled / max) : 0;

      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      setActiveIndex(Math.round(p * (GAINS.length - 1)));
      // A pixel of slack: browsers land a snap a hair short of the extreme, and
      // an arrow that stays lit at the end of the row reads as broken.
      setAtStart(travelled <= 1);
      setAtEnd(max <= 0 || travelled >= max - 1);
      // One real move is enough: the prompt has done its job, so retire it.
      if (travelled > 8) setSwiped(true);
    };

    onScroll();
    list.addEventListener('scroll', onScroll, { passive: true });
    return () => list.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Step one card. `dir` is logical -- 1 is the next card in reading order --
   * and only the sign handed to scrollBy flips, because scrollLeft still runs
   * physically: an RTL list moves toward negative as it advances.
   *
   * The distance is one card plus the gap, read off the live element rather
   * than hard-coded, so the card's own responsive width stays the only place
   * that number is written. Landing near a snap point lets scroll-snap finish
   * the job exactly.
   */
  const step = (dir: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;

    const card = list.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const amount = card ? card.getBoundingClientRect().width + gap : list.clientWidth * 0.8;

    list.scrollBy({
      left: (rtl ? -dir : dir) * amount,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  };

  return (
    <section className="gains" id="gains">
      {/* The positioned box the chemistry field resolves against and is
          clipped by -- without it the field escapes the section. */}
      <div className="gains__body">
        <ChemField variant="gains" />

          <div className="shell gains__stage">
            <div className="sect__head">
              {/* Both the text and the face follow the page language. The face is
                  inherited from <body>, which already switches on html[lang], so
                  pinning font-family here would force Latin onto Arabic. */}
              <h2>
                {pick(lang, 'أكثر من مجرّد فرع طلابي.', 'More than a student organization.')}
              </h2>
              <p>
                {pick(
                  lang,
                  'هنا يبني الطلاب ما يأتي بعد التخرج.',
                  "It's where students build what comes next.",
                )}
              </p>
            </div>

            {/* Touch only -- "swipe" means nothing to a mouse, so CSS hides it
                under (hover:hover). It ships in the server-rendered HTML so the
                prompt is on screen from the first paint rather than a beat after
                the cards it describes. */}
            <p className={`gains__swipe${swiped ? ' is-done' : ''}`} aria-hidden="true">
              <i className="gains__swipe-arrow">
                <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                  <path
                    d={lang === 'ar' ? 'M10 2.5 4.5 8 10 13.5' : 'M6 2.5 11.5 8 6 13.5'}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </i>
              <span>
                {pick(
                  lang,
                  'اسحب أفقيًا لاستعراض المكاسب الستة',
                  'Swipe sideways — all six of them',
                )}
              </span>
            </p>

            <ul className="gainlist" ref={listRef}>
              {GAINS.map((g, i) => (
                <li
                  className={`gain${i === activeIndex ? ' on' : ''}`}
                  key={g.word}
                >
                  <span className="gain__n" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <Icon name={g.icon} className="gain__i" />
                  <span className="gain__w">{g.word}</span>
                  <span className="gain__d">
                    {g.word === 'CONNECT' && lang === 'ar' ? (
                      <>
                        شبكة في <Num>110</Num> دول، تبدأ من أبها.
                      </>
                    ) : (
                      pick(lang, g.descAr, g.descEn)
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="gains__foot">
              <div className="gains__rule">
                <i ref={barRef} />
              </div>
              {/* Phone only: says how far along the rail you are, and — more to
                  the point — that there is a sixth card to reach. */}
              <span className="gains__count" aria-hidden="true">
                <Num>{pad(activeIndex + 1)}</Num>
                <i>/</i>
                <Num>{pad(GAINS.length)}</Num>
              </span>

              {/*
                DOM order is always [back, forward]. Flex mirrors it under RTL
                on its own, and the glyphs below point in reading order, so
                "forward" is the right-hand arrow in English and the left-hand
                one in Arabic without either being special-cased here.
              */}
              <div className="gains__nav">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  disabled={atStart}
                  aria-label={pick(lang, 'البطاقة السابقة', 'Previous card')}
                >
                  <Chevron points={rtl ? 'end' : 'start'} />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  disabled={atEnd}
                  aria-label={pick(lang, 'البطاقة التالية', 'Next card')}
                >
                  <Chevron points={rtl ? 'start' : 'end'} />
                </button>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
