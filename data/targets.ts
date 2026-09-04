/**
 * Numbers.
 *
 * READ THIS BEFORE EDITING.
 *
 * Two different kinds of number live here and they must never be merged:
 *
 *   `targets`      — the figures published in the 2026/27 presidential plan,
 *                    where they appear under the heading
 *                    "الأرقام المستهدفة خلال سنة". They have NOT happened yet.
 *
 *   `achievements` — what the chapter has actually delivered since 2021.
 *
 * The section is titled "our targets" precisely so the plan's figures can be
 * shown honestly. Presenting 700+ beneficiaries under a heading like
 * "our impact" would claim an outcome the chapter has not reached — the
 * documented figure is 80+. If you want the old "الأثر بالأرقام" heading,
 * you must swap `targets` for `achievements` in the same edit.
 */

export interface Figure {
  value: string;
  labelAr: string;
  labelEn: string;
}

export const targets: Figure[] = [
  { value: '30+',  labelAr: 'برنامجًا وورشة', labelEn: 'programmes & workshops' },
  { value: '700+', labelAr: 'مستفيد',          labelEn: 'beneficiaries' },
  { value: '45+',  labelAr: 'عضوًا',            labelEn: 'members' },
  { value: '6+',   labelAr: 'زيارات صناعية',   labelEn: 'industry visits' },
  { value: '5+',   labelAr: 'شراكات',          labelEn: 'partnerships' },
];

export const achievements: Figure[] = [
  { value: '30+', labelAr: 'عضوًا',           labelEn: 'members' },
  { value: '30+', labelAr: 'ورشة ودورة',      labelEn: 'workshops & courses' },
  { value: '80+', labelAr: 'مستفيدًا',         labelEn: 'beneficiaries' },
];

/** AIChE worldwide — used in the hero and in the CONNECT gain. */
export const globalReach = {
  countries: '110+',
} as const;
