import { pick, type Lang } from '@/lib/i18n';
import { achievements, targets } from '@/data/targets';
import CountUp from './CountUp';
import DualDate from './DualDate';
import Reveal from './Reveal';

/** The plan's academic year, 2026/2027, is 1448 AH. */
const PLAN_YEAR = { greg: '2026/2027', hijri: '1448' };

/** Chartered July 2021 — Dhu al-Qi'dah / Dhu al-Hijjah 1442. */
const CHARTER_YEAR = { greg: '2021', hijri: '1442' };

/**
 * The numbers section.
 *
 * The heading says "our targets", not "our impact", because these five figures
 * come from the 2026/27 presidential plan where they are labelled
 * "الأرقام المستهدفة خلال سنة" — a plan, not a result. The line underneath
 * carries what the chapter has actually delivered, so the ambition is visible
 * without the claim being false. See the note at the top of data/targets.ts.
 */
export default function Targets({ lang }: { lang: Lang }) {
  return (
    <section className="sect" id="targets">
      <div className="shell">
        <Reveal className="sect__head">
          <h2>
            {lang === 'ar' ? (
              <>
                مستهدفاتنا <DualDate lang={lang} date={PLAN_YEAR} />
              </>
            ) : (
              <>
                Our <DualDate lang={lang} date={PLAN_YEAR} /> targets
              </>
            )}
          </h2>
          <p>
            {pick(
              lang,
              'أرقام معلنة في الخطة الرئاسية للعام، نُقاس عليها.',
              "Figures published in this year's presidential plan. We hold ourselves to them.",
            )}
          </p>
        </Reveal>

        <Reveal delay={1} className="figs">
          {targets.map((f) => (
            <div className="fig" key={f.labelEn + f.value}>
              <CountUp className="fig__n num" value={f.value} />
              <span className="fig__l">{pick(lang, f.labelAr, f.labelEn)}</span>
            </div>
          ))}
        </Reveal>

        <Reveal as="p" delay={2} className="figs__foot">
          {pick(lang, 'الفرع منذ ', 'The chapter since ')}
          <DualDate lang={lang} date={CHARTER_YEAR} inline />
          {': '}
          {achievements
            .map((a) => `${a.value} ${pick(lang, a.labelAr, a.labelEn)}`)
            .join(' · ')}
        </Reveal>
      </div>
    </section>
  );
}
