/**
 * Team roster.
 *
 * To add or edit a member, change this file only — no component needs
 * touching. Drop the photo in /public/team and point `photo` at it.
 *
 * Photo requirements: portrait 3:4, face in the upper third, at least
 * 600x800px. Anything smaller looks soft on a retina desktop grid.
 * Leave `photo: null` and the card falls back to the member's initials on
 * the deep-blue ground, which is a deliberate look, not a broken image.
 */

/* The glyphs and the key union live in lib/socials.tsx — the team, the
   partners and the chapter's own channels all draw from the same set. */
export type { SocialKey } from '@/lib/socials';
import type { SocialKey } from '@/lib/socials';

export interface Member {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  majorAr: string;
  majorEn: string;
  bioAr?: string;
  bioEn?: string;
  photo: string | null;
  links: Partial<Record<SocialKey, string>>;
  /** Extra line under the role, rendered in accent green. */
  flagAr?: string;
  flagEn?: string;
  /** Renders a `</>` glyph beside the name. */
  code?: boolean;
  /** Renders a dashed "coming soon" placeholder instead of a person. */
  soon?: boolean;
}

/** Academic supervision. Named first in the team section. */
export const supervisor = {
  // TODO: confirm the exact academic rank (Dr. / Associate Professor /
  // Professor).
  nameAr: 'د. حسين آل صوان',
  nameEn: 'Dr. Hussein Al Sawan',
  roleAr: 'الإشراف الأكاديمي',
  roleEn: 'Academic supervision',
  affiliationAr: 'قسم الهندسة الكيميائية — جامعة الملك خالد',
  affiliationEn: 'Chemical Engineering Department — King Khalid University',
  photo: '/team/hussein.jpg',
};

export const leadership: Member[] = [
  {
    id: 'abdullah',
    nameAr: 'عبدالله إبراهيم آل غنوم',
    nameEn: 'Abdullah Alghanom',
    roleAr: 'الرئيس',
    roleEn: 'President',
    majorAr: 'هندسة كيميائية',
    majorEn: 'Chemical Engineering',
    bioAr:
      'قيادي ومهندس كيميائي طموح، أعمل على بناء قيمة حقيقية في كل تجربة أخوضها، واضعًا التعلّم المستمر والإنجاز هدفًا راسخًا لصنع أثر دائم.',
    bioEn:
      'A leader and an aspiring chemical engineer, building real value in every experience I take on — with continuous learning and achievement as a firm goal toward lasting impact.',
    photo: '/team/abdullah_alghanom.jpg',
    // Published by Abdullah himself on his public Linktree, and added here
    // with his agreement. Personal contact details go on a member's card only
    // on that basis — see the note in SECURITY.md.
    links: {
      linkedin: 'https://www.linkedin.com/in/alghanom-ia',
      x: 'https://x.com/Ab_iW0',
      whatsapp: 'https://wa.me/966556915969',
      email: 'mailto:abdullah.alghanom1@gmail.com',
    },
  },
  {
    id: 'firas',
    nameAr: 'فراس عيسى الفيفي',
    nameEn: 'Firas Alfaifi',
    roleAr: 'نائب الرئيس — شطر الطلاب',
    roleEn: 'Vice President — Male Section',
    majorAr: 'هندسة كيميائية',
    majorEn: 'Chemical Engineering',
    bioAr:
      'طالب هندسة كيميائية في جامعة الملك خالد، ومهتم بالهندسة، القيادة، والعمل الطلابي. أؤمن بأن بناء الخبرة يبدأ من التجربة، وأن لكل فرصة تعلم أثرًا في صناعة المستقبل.',
    // TODO review: English drafted from the Arabic, not author-supplied.
    bioEn:
      'A chemical engineering student at King Khalid University, drawn to engineering, leadership and student work. I believe experience is built by doing, and that every chance to learn leaves a mark on the future.',
    photo: '/team/firas.jpg',
    links: {},
  },
  {
    id: 'tasneem',
    nameAr: 'تسنيم الشريف',
    nameEn: 'Tasneem Alsharif',
    roleAr: 'نائبة الرئيس — شطر الطالبات',
    roleEn: 'Vice President — Female Section',
    majorAr: 'هندسة صناعية',
    majorEn: 'Industrial Engineering',
    bioAr:
      'مهندسة صناعية طموحة، أسعى لصناعة قيمة حقيقية في كل تجربة، وأؤمن بأن القيادة تبدأ بالمبادرة، وأن التعلّم المستمر هو أساس التطور. قدت برامج ومعسكرات وتجارب متنوعة، طوّرت من خلالها مهاراتي القيادية والتنظيمية، وأسعى دائمًا لتحويل الأفكار إلى إنجازات ملموسة وأثر مستدام.',
    // TODO review: English drafted from the Arabic, not author-supplied.
    bioEn:
      'An ambitious industrial engineer working to create real value in every experience. I believe leadership begins with initiative and that continuous learning is the basis of growth. I have led programmes, camps and varied initiatives that sharpened my leadership and organisational skills, and I work to turn ideas into tangible results and lasting impact.',
    photo: '/team/tasneem.jpg',
    links: { linkedin: 'https://www.linkedin.com/in/tasneem-alshareef-b62132380' },
  },
  {
    id: 'sulaiman',
    nameAr: 'سليمان آل غميظة',
    nameEn: 'Sulaiman Al Ghumaidhah',
    roleAr: 'أمين الصندوق',
    roleEn: 'Treasurer',
    majorAr: 'هندسة كيميائية',
    majorEn: 'Chemical Engineering',
    bioAr:
      'مهندس كيميائي شغوف بالتطوير والإنجاز، أسعى إلى توظيف المعرفة والمهارات لصناعة قيمة حقيقية وتحقيق نتائج ملموسة. أؤمن بأن التعلّم المستمر، والعمل بروح القيادة، والسعي نحو التميز هي الركائز الأساسية لبناء مسيرة مهنية مؤثرة وصنع أثر مستدام.',
    bioEn:
      'A chemical engineer driven by growth and achievement, working to turn knowledge and skills into real value and tangible results. I believe continuous learning, leadership, and the pursuit of excellence are the foundations of a meaningful career and a lasting impact.',
    photo: '/team/sulaiman.jpg',
    links: {},
  },
];

export const committees: Member[] = [
  {
    id: 'sabrah',
    nameAr: 'محمد سعيد سبرة',
    nameEn: 'Mohammed Sabrah',
    roleAr: 'لجنة البحث والتطوير التقني',
    roleEn: 'Research & Technical Development',
    majorAr: 'هندسة برمجيات',
    majorEn: 'Software Engineering',
    flagAr: 'مصمم الموقع ومطوّره',
    flagEn: 'Website designer & developer',
    code: true,
    bioAr:
      'بين البرمجة في وقت متأخر من الليل، ورسم الأفكار، والانغماس في الموسيقى — أبحث دائمًا عن التقدّم، وعن شيء من الهدوء في الطريق.',
    bioEn:
      "Whether I'm coding late at night, sketching ideas, or getting lost in music, I'm always searching for progress — and a little bit of calm along the way.",
    photo: '/team/mohammed_sabrah.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/mohamedsabra57',
      github: 'https://github.com/Sabra7',
    },
  },
  {
    id: 'ayman',
    nameAr: 'أيمن عسيري',
    nameEn: 'Ayman Asiri',
    roleAr: 'اللجنة العلمية والإبداعية',
    roleEn: 'Scientific & Creative',
    majorAr: 'هندسة كيميائية',
    majorEn: 'Chemical Engineering',
    bioAr:
      'طالب هندسة كيميائية بجامعة الملك خالد، مهتم بالابتكار والتطوير العلمي وتطبيقات الهندسة الكيميائية، وأسعى إلى تطوير المعرفة والمهارات والمساهمة في المبادرات العلمية وتشجيع التعلم التطبيقي والابتكار.',
    bioEn:
      'A chemical engineering student at King Khalid University, interested in innovation, scientific development, and the applications of chemical engineering. I work to grow my knowledge and skills, contribute to scientific initiatives, and encourage applied learning and innovation.',
    // TODO: the supplied original is 513x488 — below the 600x800 minimum and
    // visibly soft on desktop. Replace with a higher-resolution photo.
    photo: '/team/ayman.jpg',
    links: {},
  },
  {
    id: 'media',
    soon: true,
    nameAr: 'لجنة الإعلام والمحتوى',
    nameEn: 'Media & Content',
    roleAr: 'قريبًا',
    roleEn: 'Coming soon',
    majorAr: '',
    majorEn: '',
    photo: null,
    links: {},
  },
  {
    id: 'yazan',
    nameAr: 'يزن بن ناجد',
    nameEn: 'Yazan bin Najd',
    roleAr: 'لجنة إدارة الفعاليات',
    roleEn: 'Events Management',
    majorAr: 'هندسة كيميائية',
    majorEn: 'Chemical Engineering',
    bioAr:
      'مهندس كيميائي مهتم بالهندسة وتطوير المهارات القيادية والعمل الجماعي. أشارك في أنشطة الجمعية وفعالياتها، وأسعى من خلال عملي إلى المساهمة في تطوير أعضائها وتعزيز حضورها، مع الحرص على اكتساب الخبرات وبناء علاقات مهنية تسهم في تحقيق أهداف الجمعية.',
    bioEn:
      "A chemical engineer interested in engineering and in developing leadership and teamwork skills. I take part in the chapter's activities and events, working to help its members grow and strengthen its presence, while gaining experience and building professional relationships that serve the chapter's goals.",
    photo: '/team/yazan.jpg',
    links: { linkedin: 'https://www.linkedin.com/in/yazan-bin-najd-b9594833b' },
  },
  {
    id: 'anas',
    nameAr: 'أنس سعد الشهري',
    nameEn: 'Anas Saad Alshahrani',
    roleAr: 'لجنة الشراكات والعلاقات',
    roleEn: 'Partnerships & Relations',
    majorAr: 'هندسة كيميائية',
    majorEn: 'Chemical Engineering',
    bioAr:
      'شغوف بمجال الهندسة الكيميائية وتطبيقاته، ويهتم بالابتكار وتطوير المشاريع والعمل المجتمعي وصناعة المحتوى العلمي. أسهم في تأسيس وإدارة أحد المجتمعات المختصة بالهندسة الكيميائية، بهدف إثراء المحتوى الهندسي وتعزيز التواصل بين الطلاب والمهتمين بالمجال.',
    // TODO review: English drafted from the Arabic, not author-supplied.
    bioEn:
      'Passionate about chemical engineering and its applications, with an interest in innovation, project development, community work and scientific content. I helped found and run a community dedicated to chemical engineering, to enrich engineering content and strengthen the link between students and others drawn to the field.',
    photo: '/team/anas.jpg',
    // The slug is Arabic, so it must stay percent-encoded or some browsers
    // mangle it. Do not "tidy" this back into raw Arabic characters.
    links: {
      linkedin:
        'https://www.linkedin.com/in/%D8%A3%D9%86%D8%B3-%D8%A7%D9%84%D9%85%D8%B4%D9%87%D9%88%D8%B1%D9%8A-63241735a',
      x: 'https://x.com/anasbinsaad21',
    },
  },
  {
    id: 'abdulmalik',
    nameAr: 'عبدالملك عسيري',
    nameEn: 'Abdulmalik Asiri',
    roleAr: 'لجنة الجودة والمتابعة',
    roleEn: 'Quality & Follow-up',
    majorAr: 'هندسة كيميائية',
    majorEn: 'Chemical Engineering',
    bioAr:
      'طالب هندسة كيميائية مهتم بالعمليات الصناعية، ومشارك في عدة مجالات للبحث العلمي، ومشرف بحثي في البرامج الوطنية.',
    // TODO review: English drafted from the Arabic, not author-supplied.
    bioEn:
      'A chemical engineering student focused on industrial processes, active across several areas of scientific research, and a research supervisor within national programmes.',
    photo: '/team/abdulmalik.jpg',
    links: { linkedin: 'https://www.linkedin.com/in/abdulmalik-asiri-499a12321' },
  },
];
