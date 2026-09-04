/**
 * Curated photo selection — a shortlist, not an archive. Keep it to 8–12.
 *
 * `span` controls how wide the frame sits on the 6-column desktop grid.
 * Captions double as the alt text, so write them as a description of what is
 * actually in the frame. Never leave alt empty and never invent a caption.
 */

export interface Photo {
  src: string;
  captionAr: string;
  captionEn: string;
  span: 2 | 3 | 6;
}

export const gallery: Photo[] = [
  {
    src: '/gallery/g1.jpg',
    captionAr: 'المعرض التعريفي للطلاب المستجدين — مركز المعارض والمؤتمرات',
    captionEn: 'Freshman orientation expo — Exhibitions & Conferences Centre',
    span: 3,
  },
  {
    src: '/gallery/g2.jpg',
    captionAr: 'معرض الكيانات الهندسية الطلابية — كلية الهندسة، الفصل الأول',
    captionEn: 'Engineering student-body expo — College of Engineering, Term 1',
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
    captionAr: 'معرض الكيانات الطلابية — شطر الطلاب، الفصل الثاني',
    captionEn: 'Student-body expo — Male section, Term 2',
    span: 2,
  },
  {
    src: '/gallery/g7.jpg',
    captionAr: 'تغطية إعلامية لمشاريع تخرج طلاب كلية الهندسة — الفصل الأول',
    captionEn: 'Media coverage of engineering graduation projects — Term 1',
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
    captionAr: 'معرض الكيانات الطلابية — شطر الطلاب، الفصل الثاني',
    captionEn: 'Student-body expo — Male section, Term 2',
    span: 3,
  },
  {
    src: '/gallery/g6.jpg',
    captionAr: 'معرض الكيانات الطلابية — شطر الطلاب، الفصل الثاني',
    captionEn: 'Student-body expo — Male section, Term 2',
    span: 3,
  },
];
