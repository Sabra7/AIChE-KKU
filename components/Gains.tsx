'use client';

import { useEffect, useRef, useState } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import { Icon, type IconName } from './Icon';
import Num from './Num';

/**
 * "What you gain" — the most important section on the site.
 *
 * Pinning is done by `position: sticky`, NOT by GSAP. GSAP's own pin injects
 * measured heights into the layout, and any viewport resize while pinned makes
 * the section slip. Sticky lets the browser recompute for itself, and
 * ScrollTrigger is used only to read progress, which cannot desync anything.
 *
 * GSAP is loaded on demand because this is the only section that needs it.
 * If the import fails, or the viewport is narrow, or the visitor asked for
 * reduced motion, the section renders as a plain vertical list with the same
 * content — never a blank panel.
 *
 * Below 768px the pin is deliberately disabled: mobile browser chrome grows
 * and shrinks during scroll, and anything pinned visibly jumps as it does.
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

export default function Gains({ lang }: { lang: Lang }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const [flat, setFlat] = useState(true); // safe default: readable list
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || window.innerWidth < 768) {
      setFlat(true);
      return;
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);
        setFlat(false);

        const track = trackRef.current;
        if (!track) return;
        track.style.height = `${GAINS.length * 58}vh`;

        ctx = gsap.context(() => {
          ScrollTrigger.create({
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
      } catch {
        // Offline, blocked CDN, whatever — fall back to the list.
        if (!cancelled) setFlat(true);
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`gains${flat ? ' gains--flat' : ''}`}
      id="gains"
    >
      <div className="gains__track" ref={trackRef}>
        <div className="gains__pin">
          <div className="shell gains__stage">
            <div className="sect__head" style={{ marginBottom: '2.2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-en)', fontSize: 'clamp(1.4rem,3.4vw,2.2rem)' }}>
                More than a student organization.
              </h2>
              <p>
                {pick(
                  lang,
                  'هنا يبني الطلاب ما يأتي بعد التخرج.',
                  "It's where students build what comes next.",
                )}
              </p>
            </div>

            <ul className="gainlist">
              {GAINS.map((g, i) => (
                <li className={`gain${!flat && i === activeIndex ? ' on' : ''}`} key={g.word}>
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

            <div className="gains__rule">
              <i ref={barRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
