import type { DualDate as Dual } from '@/lib/dates';
import type { Lang } from '@/lib/i18n';
import Num from './Num';

/**
 * A date in both calendars.
 *
 * Two shapes, and the choice is about the surrounding text, not about taste:
 *
 *   stacked (default) — Gregorian at the inherited size, Hijri beneath it,
 *     smaller and quieter. For a date that stands alone as its own element:
 *     a timeline card's year label, a section heading's year.
 *
 *   inline — "2021م (1442هـ)" on one line. For a date sitting inside a running
 *     sentence, where a second line would break the paragraph.
 *
 * Only the numerals go through `<Num>`. The suffix stays outside it so the
 * Arabic هـ / م render in the Arabic face — see the note in lib/dates.ts.
 */
export default function DualDate({
  lang,
  date,
  inline = false,
}: {
  lang: Lang;
  date: Dual;
  inline?: boolean;
}) {
  const greg = (
    <>
      <Num>{date.greg}</Num>
      {lang === 'ar' ? 'م' : ''}
    </>
  );
  const hijri = (
    <>
      <Num>{date.hijri}</Num>
      {lang === 'ar' ? 'هـ' : ' AH'}
    </>
  );

  if (inline) {
    return (
      <span className="dual dual--inline">
        {greg} ({hijri})
      </span>
    );
  }

  // Each line needs its own wrapper: .dual is a column flex container, and a
  // bare suffix beside <Num> would become a flex item of its own — stacking
  // the م under the numeral instead of sitting beside it.
  return (
    <span className="dual">
      <span className="dual__g">{greg}</span>
      <span className="dual__h">{hijri}</span>
    </span>
  );
}
