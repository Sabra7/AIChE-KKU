/**
 * Every piece of interface copy that appears more than once.
 *
 * The join CTA in particular is defined here and nowhere else — it renders in
 * four places (header on mobile, hero, join section, and the nav), so a
 * wording change must never mean hunting through components.
 */

export const ui = {
  joinCtaAr: 'انضم إلينا',
  joinCtaEn: 'Join us',

  navAr: {
    about: 'من نحن',
    gains: 'ماذا تكسب',
    program: 'البرنامج',
    journey: 'مسيرتنا',
    team: 'الفريق',
    join: 'انضم إلينا',
  },
  navEn: {
    about: 'About',
    gains: 'What you gain',
    program: 'Programme',
    journey: 'Journey',
    team: 'Team',
    join: 'Join us',
  },

  soonAr: 'قريبًا',
  soonEn: 'Coming soon',

  readBioAr: 'النبذة',
  readBioEn: 'Read bio',

  showAllAr: 'عرض الكل',
  showAllEn: 'Show all',

  showLessAr: 'عرض أقل',
  showLessEn: 'Show less',

  skipAr: 'تخطَّ إلى المحتوى',
  skipEn: 'Skip to content',

  menuAr: 'القائمة',
  menuEn: 'Menu',

  creditPrefix: 'Designed & developed by',
  creditName: 'Mohammed Sabrah',
  creditUrl: 'https://github.com/Sabra7',
} as const;

export type NavKey = keyof typeof ui.navAr;

export const NAV_ORDER: NavKey[] = ['about', 'gains', 'program', 'journey', 'team', 'join'];
