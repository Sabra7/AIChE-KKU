'use client';

import { useState } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import { ui } from '@/lib/ui';
import { kindLabels, workshops } from '@/data/workshops';
import Num from './Num';
import Reveal from './Reveal';
import SwapLabel from './SwapLabel';

/**
 * Featured workshops with a "show all" toggle. Which ones are featured is a
 * data decision (`featured: true` in data/workshops.ts), not a slice() here,
 * so the chapter controls the shortlist without touching this file.
 */
export default function Programme({ lang }: { lang: Lang }) {
  const [showAll, setShowAll] = useState(false);

  const featured = workshops.filter((w) => w.featured);
  const visible = showAll ? workshops : featured;
  const hasMore = workshops.length > featured.length;

  return (
    <section className="sect" id="program">
      <div className="shell">
        <Reveal className="sect__head">
          <h2>{pick(lang, 'البرنامج', 'Programme')}</h2>
          <p>
            {lang === 'ar' ? (
              <>
                أكثر من <Num>30</Num> ورشة ودورة منذ التأسيس. هذه مختارات منها.
              </>
            ) : (
              <>
                More than <Num>30</Num> workshops and courses since founding. A selection below.
              </>
            )}
          </p>
        </Reveal>

        <Reveal delay={1} className="wshops">
          {visible.map((w) => (
            <article className="wshop" key={w.id} data-tilt="3">
              <span className="wshop__kind">
                {pick(lang, kindLabels[w.kind].ar, kindLabels[w.kind].en)}
              </span>
              <h3>{pick(lang, w.titleAr, w.titleEn)}</h3>
              <p className="wshop__meta">
                {[
                  w.termAr && pick(lang, w.termAr, w.termEn ?? w.termAr),
                  w.trainerAr &&
                    `${pick(lang, 'المدرّب', 'Trainer')}: ${pick(
                      lang,
                      w.trainerAr,
                      w.trainerEn ?? w.trainerAr,
                    )}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </article>
          ))}

          {/* Visible reminder while the real titles are still coming in. */}
          {workshops.length <= 3 && (
            <article className="wshop wshop--todo">
              <p>
                {pick(
                  lang,
                  'بقية الورش تُضاف من ملف workshops.ts',
                  'Remaining workshops load from workshops.ts',
                )}
              </p>
            </article>
          )}
        </Reveal>

        {hasMore && (
          <div className="wshops__more">
            <button
              type="button"
              className="btn btn--ghost"
              aria-expanded={showAll}
              onClick={() => setShowAll((v) => !v)}
              data-ripple
            >
              {/*
                The label is keyed on `showAll` so React remounts it when the
                text changes. Without the key the swap animation would be
                mid-flight against the wrong word.
              */}
              <SwapLabel key={String(showAll)}>
                {showAll
                  ? pick(lang, ui.showLessAr, ui.showLessEn)
                  : pick(lang, ui.showAllAr, ui.showAllEn)}
              </SwapLabel>
              <span className={`btn__chev${showAll ? ' up' : ''}`} aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 6.5L8 10.5L12 6.5"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
