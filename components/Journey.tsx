import { pick, type Lang } from '@/lib/i18n';
import { timeline } from '@/data/timeline';
import DualDate from './DualDate';
import Reveal from './Reveal';

/**
 * Milestones, ending on "the next chapter" rather than an empty awards shelf.
 * The forward-looking entry is the only one that carries the accent rule.
 */
export default function Journey({ lang }: { lang: Lang }) {
  return (
    <section className="sect sect--tint" id="journey">
      <div className="shell">
        <Reveal className="sect__head">
          <h2>{pick(lang, 'مسيرتنا', 'Our journey')}</h2>
        </Reveal>

        <div className="tl">
          {timeline.map((m, i) => (
            <Reveal
              key={m.id}
              delay={(Math.min(i, 4) || undefined) as 1 | 2 | 3 | 4 | undefined}
              className={`tl__i${m.next ? ' tl__i--next' : ''}`}
            >
              <span className="tl__y">
                {m.date ? (
                  <DualDate lang={lang} date={m.date} />
                ) : (
                  pick(lang, m.labelAr, m.labelEn)
                )}
              </span>
              <h3>
                {pick(lang, m.titleAr, m.titleEn)}
                {m.titleDate && (
                  <>
                    {' '}
                    <DualDate lang={lang} date={m.titleDate} inline />
                  </>
                )}
              </h3>
              <p>{pick(lang, m.bodyAr, m.bodyEn)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
