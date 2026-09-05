/**
 * Curated photo selection — a shortlist, not an archive. Keep it to 8–12.
 *
 * `span` controls how wide the frame sits on the 6-column desktop grid.
 * Captions double as the alt text, so write them as a description of what is
 * actually in the frame. Never leave alt empty and never invent a caption.
 *
 * `term` is separate from the caption on purpose: it carries numerals, and a
 * numeral in a caption string cannot be wrapped in <Num>. Gallery.tsx renders
 * it isolated and folds it back into a flat string for `alt`.
 */

import type { DualDate } from '@/lib/dates';

export interface Photo {
  src: string;
  captionAr: string;
  captionEn: string;
  /** Which semester the photograph is from. Omit when it is not known. */
  term?: { ar: string; en: string; date: DualDate };
  span: 2 | 3 | 6;
}

/* The 1447 academic year. Each semester sits inside a single Gregorian year —
   term 1 ran Aug–Dec 2025, term 2 Jan–May 2026 — so neither needs a range. */
const TERM_1: Photo['term'] = { ar: 'الفصل الأول', en: 'Term 1', date: { greg: '2025', hijri: '1447' } };
const TERM_2: Photo['term'] = { ar: 'الفصل الثاني', en: 'Term 2', date: { greg: '2026', hijri: '1447' } };

export const gallery: Photo[] = [
  {
    src: '/gallery/g1.jpg',
    captionAr: 'المعرض التعريفي للطلاب المستجدين — مركز المعارض والمؤتمرات',
    captionEn: 'Freshman orientation expo — Exhibitions & Conferences Centre',
    span: 3,
  },
  {
    src: '/gallery/g2.jpg',
    captionAr: 'معرض الكيانات الهندسية الطلابية — كلية الهندسة',
    captionEn: 'Engineering student-body expo — College of Engineering',
    term: TERM_1,
    span: 3,
  },
  {
    src: '/gallery/g3.jpg',
    captionAr: 'معرض الكيانات الطلابية — شطر الطالبات، كلية الهندسة',
    captionEn: 'Student-body expo — Female section, College of Engineering',
    span: 2,
  },
  {
    src: '/gallery/g4.jpg',
    captionAr: 'معرض الكيانات الطلابية — شطر الطلاب',
    captionEn: 'Student-body expo — Male section',
    term: TERM_2,
    span: 2,
  },
  {
    src: '/gallery/g7.jpg',
    captionAr: 'تغطية إعلامية لمشاريع تخرج طلاب كلية الهندسة',
    captionEn: 'Media coverage of engineering graduation projects',
    term: TERM_1,
    span: 2,
  },
  {
    src: '/gallery/g9.jpg',
    captionAr: 'تنظيم اللقاء التعريفي للهيئة السعودية للمهندسين — قاعة الندوات',
    captionEn: 'Saudi Council of Engineers orientation session — Seminar hall',
    span: 3,
  },
  {
    src: '/gallery/g8.jpg',
    captionAr: 'المشاركة في مؤتمر حلول الاستدامة — مركز المعارض والمؤتمرات',
    captionEn: 'Sustainable solutions conference — Exhibitions & Conferences Centre',
    span: 3,
  },
  {
    src: '/gallery/g5.jpg',
    captionAr: 'معرض الكيانات الطلابية — شطر الطلاب',
    captionEn: 'Student-body expo — Male section',
    term: TERM_2,
    span: 3,
  },
  {
    src: '/gallery/g6.jpg',
    captionAr: 'معرض الكيانات الطلابية — شطر الطلاب',
    captionEn: 'Student-body expo — Male section',
    term: TERM_2,
    span: 3,
  },
];
