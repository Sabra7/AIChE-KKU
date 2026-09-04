/**
 * Milestones. Every entry must be backed by something real — a certificate,
 * a dated banner, a published plan. This section replaces the "achievements"
 * section the chapter does not yet have material for.
 */

export interface Milestone {
  id: string;
  labelAr: string;
  labelEn: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  /** Renders in accent green — reserved for the forward-looking entry. */
  next?: boolean;
}

export const timeline: Milestone[] = [
  {
    id: 'chartered',
    labelAr: '2021',
    labelEn: '2021',
    titleAr: 'الاعتماد الرسمي',
    titleEn: 'Officially chartered',
    bodyAr: 'اعتماد الجامعة فرعًا طلابيًا لـ AIChE في يوليو 2021.',
    bodyEn: 'The university achieved AIChE Student Chapter status in July 2021.',
  },
  {
    id: 'seesc',
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
    labelAr: '1447',
    labelEn: '1447 AH',
    titleAr: 'شكر من عمادة الكلية',
    titleEn: 'Recognised by the College',
    bodyAr: 'شهادات شكر وتقدير من عميد كلية الهندسة عن الجهود في تنظيم الفعاليات.',
    bodyEn:
      'Certificates of appreciation from the Dean of the College of Engineering for event organisation.',
  },
  {
    id: 'next',
    labelAr: 'الفصل القادم',
    labelEn: 'The next chapter',
    titleAr: 'خطة 2026/2027',
    titleEn: 'The 2026/27 plan',
    bodyAr: 'تطوير الهيكلة، رفع التفاعل الطلابي، وبناء شراكات مع القطاع الصناعي.',
    bodyEn:
      'Restructuring, raising student engagement, and building partnerships with industry.',
    next: true,
  },
];
