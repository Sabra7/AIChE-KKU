'use client';

import { useEffect, useRef, useState } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import ChemField from './ChemField';
import { Icon, type IconName } from './Icon';
import Num from './Num';

/**
 * "What you gain" — the most important section on the site.
 *
 * It has two completely different presentations, and both are deliberate.
 *
 * DESKTOP — a pinned stage. Pinning is done by `position: sticky`, NOT by
 * GSAP. GSAP's own pin injects measured heights into the layout, and any
 * viewport resize while pinned makes the section slip. Sticky lets the browser
 * recompute for itself, and ScrollTrigger is used only to read progress, which
 * cannot desync anything.
 *
 * GSAP is loaded on demand because this is the only section that needs it.
 * If the import fails, or the viewport is narrow, or the visitor asked for
 * reduced motion, the section falls back to `flat` — never a blank panel.
 *
 * PHONE — a horizontal rail. Below 768px the pin is disabled outright: mobile
 * browser chrome grows and shrinks during scroll, and anything pinned visibly
 * jumps as it does. Six full-width rows stacked vertically also bury the last
 * of them, so the rows become swipeable cards instead. Everything about that
 * rail is built to say "move me" before the visitor has to guess: the next
 * card is cut in half by the screen edge, a line of copy names the gesture, a
 * rule fills as you go and a counter says how many are left.
 *
 * The two are kept honest by sharing one breakpoint. CSS owns the rail layout
 * (so the first paint on a phone is already horizontal, with no flash of the
 * stacked list), and the matchMedia below only decides whether the progress
 * JS should run at all.
 */

const RAIL_MQ = '(max-width: 767px)';

interface Gain {
  word: string;
  icon: IconName;
  descAr: string;
  descEn: string;
}

type GsapMods = {
  gsap: (typeof import('gsap'))['gsap'];
  ScrollTrigger: (typeof import('gsap/ScrollTrigger'))['ScrollTrigger'];
};

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

/** Two digits, so the counter never changes width as it counts. */
const pad = (n: number) => String(n).padStart(2, '0');

export default function Gains({ lang }: { lang: Lang }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const gsapRef = useRef<GsapMods | null>(null);
  const [flat, setFlat] = useState(true); // safe default: readable list
  const [narrow, setNarrow] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  /** The rail is the phone presentation: narrow AND unpinned. */
  const rail = flat && narrow;

  // Decide whether this visitor gets the pin at all, and load GSAP if so.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || window.innerWidth < 768) return;

    let cancelled = false;

    (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);
        gsapRef.current = { gsap, ScrollTrigger };
        setFlat(false);
      } catch {
        // Offline, blocked CDN, whatever — the flat list stays.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Same breakpoint the rail CSS uses, so the two can never disagree.
  useEffect(() => {
    const mq = window.matchMedia(RAIL_MQ);
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /**
   * Measuring lives in its own effect, keyed on `flat`, and that key is the
   * whole point: while the section is still flat, `.gains--flat .gains__track`
   * forces `height:auto !important`, which outranks any inline height. Measure
   * before React has committed `flat === false` and ScrollTrigger caches a
   * track roughly as tall as the viewport — progress then runs out in the first
   * screen, the highlight jumps to the last row and freezes, and sticky carries
   * on holding the section for the real distance. An effect on [flat] runs
   * after that commit, so what it measures is what the visitor scrolls through.
   */
  useEffect(() => {
    if (flat) return;

    const mods = gsapRef.current;
    const track = trackRef.current;
    if (!mods || !track) return;

    // Track height is what decides how long the pin lasts.
    track.style.height = `${GAINS.length * 58}vh`;

    const ctx = mods.gsap.context(() => {
      mods.ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress;
          if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
          setActiveIndex(Math.min(GAINS.length - 1, Math.floor(p * GAINS.length)));
        },
      });
    }, sectionRef.current ?? undefined);

    return () => ctx.revert();
  }, [flat]);

  /**
   * The rail's own progress. It drives exactly the same rule and the same
   * active row as the pin does — the visitor gets one vocabulary on both
   * presentations, just moved by a different gesture.
   */
  useEffect(() => {
    if (!rail) return;

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
      // One real swipe is enough: the prompt has done its job, so retire it.
      if (travelled > 8) setSwiped(true);
    };

    onScroll();
    list.addEventListener('scroll', onScroll, { passive: true });
    return () => list.removeEventListener('scroll', onScroll);
  }, [rail]);

  return (
    <section
      ref={sectionRef}
      className={`gains${flat ? ' gains--flat' : ''}`}
      id="gains"
    >
      <div className="gains__track" ref={trackRef}>
        <div className="gains__pin">
          {/* Behind the type for the whole length of the pin, and behind the
              rail on a phone: the same molecular field the hero opens with. */}
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

            {/* Phone only, and hidden by CSS everywhere else. It ships in the
                server-rendered HTML rather than waiting on `rail`, so the
                prompt is on screen from the first paint instead of appearing a
                beat after the cards it describes. */}
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
                  className={`gain${(!flat || rail) && i === activeIndex ? ' on' : ''}`}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
