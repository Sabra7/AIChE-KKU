/**
 * Milestones. Every entry must be backed by something real — a certificate,
 * a dated banner, a published plan. This section replaces the "achievements"
 * section the chapter does not yet have material for.
 */

import type { DualDate } from '@/lib/dates';

export interface Milestone {
  id: string;
  /**
   * The big label, in both calendars. Omit it on an entry whose label is not a
   * date, and `labelAr`/`labelEn` carry the text instead.
   */
  date?: DualDate;
  labelAr: string;
  labelEn: string;
  titleAr: string;
  titleEn: string;
  /**
   * A date appended to the title. For the entry whose label is text but whose
   * title still names a year — keeping the range inside <Num> rather than
   * loose in an Arabic heading, where the bidi algorithm can reverse it.
   */
  titleDate?: DualDate;
  bodyAr: string;
  bodyEn: string;
  /** Renders in accent green — reserved for the forward-looking entry. */
  next?: boolean;
}

export const timeline: Milestone[] = [
  {
    id: 'chartered',
    // July 2021 fell in Dhu al-Qi'dah / Dhu al-Hijjah 1442.
    date: { greg: '2021', hijri: '1442' },
    labelAr: '2021',
    labelEn: '2021',
    titleAr: 'الاعتماد الرسمي',
    titleEn: 'Officially chartered',
    bodyAr: 'اعتماد الجامعة فرعًا طلابيًا لـ AIChE في يوليو 2021م الموافق 1442هـ.',
    bodyEn:
      'The university achieved AIChE Student Chapter status in July 2021 (1442 AH).',
  },
  {
    id: 'seesc',
    // TODO pin the Hijri year. 1446 ran to 25 June 2025 and 1447 began the
    // next day, so the conference month decides which one this is. Until the
    // date is confirmed the label carries both rather than guessing.
    date: { greg: '2025', hijri: '1446/1447' },
    labelAr: '2025',
    labelEn: '2025',
    titleAr: 'مؤتمر الحلول المستدامة',
    titleEn: 'Sustainable solutions conference',
    bodyAr: 'المشاركة في مؤتمر الحلول المستدامة في الطاقة والبيئة SEESC 2025.',
    bodyEn:
      'Participation in the Sustainable Energy and Environmental Solutions Conference, SEESC 2025.',
  },
  {
    // TODO confirm wording. Taken from a certificate of appreciation visible
    // in the supplied event photographs.
    id: 'recognition',
    // 1447 AH ran from 26 June 2025 to 15 June 2026.
    date: { greg: '2025/2026', hijri: '1447' },
    labelAr: '1447',
    labelEn: '1447 AH',
    titleAr: 'شكر من عمادة الكلية',
    titleEn: 'Recognised by the College',
    bodyAr: 'شهادات شكر وتقدير من عميد كلية الهندسة عن الجهود في تنظيم الفعاليات.',
    bodyEn:
      'Certificates of appreciation from the Dean of the College of Engineering for event organisation.',
  },
  {
    // The one entry with no date for a label — it looks forward, so it says so
    // in words. The year it plans for rides on the title instead.
    id: 'next',
    labelAr: 'الفصل القادم',
    labelEn: 'The next chapter',
    titleAr: 'خطة',
    titleEn: 'The plan for',
    // The 2026/2027 academic year is 1448 AH.
    titleDate: { greg: '2026/2027', hijri: '1448' },
    bodyAr: 'تطوير الهيكلة، رفع التفاعل الطلابي، وبناء شراكات مع القطاع الصناعي.',
    bodyEn:
      'Restructuring, raising student engagement, and building partnerships with industry.',
    next: true,
  },
];
