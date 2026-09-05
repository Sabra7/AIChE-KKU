/**
 * Workshops and courses.
 *
 * The chapter has run more than 30 since 2021. Only the ones marked
 * `featured: true` appear on the home page (aim for 6–8); the rest are
 * reachable through the "show all" toggle.
 *
 * The three entries below are placeholders so the layout can be reviewed.
 * Delete them as the real titles arrive — they are marked SAMPLE and the
 * component will not treat them specially.
 */

export type WorkshopKind = 'workshop' | 'course' | 'session' | 'visit' | 'competition';

export interface Workshop {
  id: string;
  titleAr: string;
  titleEn: string;
  kind: WorkshopKind;
  /** Free text: a term, a month, or a year. Kept loose on purpose. */
  termAr?: string;
  termEn?: string;
  trainerAr?: string;
  trainerEn?: string;
  featured?: boolean;
}

export const kindLabels: Record<WorkshopKind, { ar: string; en: string }> = {
  workshop:    { ar: 'ورشة تقنية',      en: 'Technical workshop' },
  course:      { ar: 'دورة هندسية',     en: 'Engineering course' },
  session:     { ar: 'جلسة علمية',      en: 'Scientific session' },
  visit:       { ar: 'زيارة صناعية',    en: 'Industry visit' },
  competition: { ar: 'مسابقة تخصصية',   en: 'Competition' },
};

export const workshops: Workshop[] = [
  // SAMPLE — replace
  {
    id: 'sample-1',
    titleAr: 'عنوان الورشة الأولى',
    titleEn: 'First workshop title',
    kind: 'workshop',
    termAr: 'الفصل الأول',
    termEn: 'Term 1',
    featured: true,
  },
  // SAMPLE — replace
  {
    id: 'sample-2',
    titleAr: 'عنوان الورشة الثانية',
    titleEn: 'Second workshop title',
    kind: 'course',
    termAr: 'الفصل الثاني',
    termEn: 'Term 2',
    featured: true,
  },
  // SAMPLE — replace
  {
    id: 'sample-3',
    titleAr: 'عنوان الورشة الثالثة',
    titleEn: 'Third workshop title',
    kind: 'session',
    termAr: 'الفصل الثاني',
    termEn: 'Term 2',
    featured: true,
  },
];
