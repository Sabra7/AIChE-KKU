import type { Lang } from './i18n';

/**
 * Dates on this site carry both calendars — Hijri and Gregorian.
 *
 * Both fields hold the numeral and nothing else. The suffix (هـ / م / AH) is
 * added at render time by `components/DualDate.tsx`, because `.num` forces the
 * Latin font face: wrapping "1442هـ" whole would draw the Arabic letter in a
 * Latin face. Keep the numeral and the suffix apart and each gets the face it
 * needs.
 *
 * A range is fine in either field — '2026/2027', '1446/1447'. `<Num>` isolates
 * it so the bidirectional algorithm cannot reverse it.
 */
export interface DualDate {
  /** Gregorian numeral, no suffix. */
  greg: string;
  /** Hijri numeral, no suffix. */
  hijri: string;
}

/**
 * Flat-string form, for the places JSX cannot reach — `alt` attributes above
 * all. Prefer `<DualDate>` anywhere markup is allowed; this loses the `<Num>`
 * isolation and the font split.
 */
export const dualText = (lang: Lang, d: DualDate) =>
  lang === 'ar' ? `${d.greg}م (${d.hijri}هـ)` : `${d.greg} (${d.hijri} AH)`;
