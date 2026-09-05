/**
 * Chapter identity and official links.
 *
 * Everything the site says about itself lives here. Nothing in this file is
 * invented: each value was supplied by the chapter or read off an official
 * document. Where a fact is still unconfirmed it carries a TODO.
 */

/**
 * Canonical origin of the deployed site. Everything that needs an absolute
 * URL — metadataBase in both root layouts, the sitemap and robots — reads it
 * from here, so moving the site is a one-line change.
 *
 * TODO: real domain. Swapping this value is the whole migration.
 */
export const siteUrl = 'https://aiche-kku.vercel.app';

export const site = {
  nameEn: 'AIChE-KKU',
  nameAr: 'AIChE — الفرع الطلابي بجامعة الملك خالد',

  universityAr: 'جامعة الملك خالد — أبها',
  universityEn: 'King Khalid University — Abha',

  departmentAr: 'قسم الهندسة الكيميائية',
  departmentEn: 'Chemical Engineering Department',

  /** Chartered July 2021 — per the AIChE Student Chapter certificate. */
  founded: 2021,

  tagline: 'Advancing Chemical Engineering, Empowering Students',

  /**
   * Alternative tagline pulled from the 2026/27 presidential plan's closing
   * slide. Not yet approved for the hero — swap `tagline` for this to use it.
   */
  taglineAlt: 'We inspire',
} as const;

/**
 * Only list a channel here if it has a real URL. A social icon with no link
 * behind it is worse than no icon, so the components render whatever this
 * object contains and nothing else.
 *
 * There is no official chapter email yet, which is why the site has no
 * contact form and no contact section — joining is the point of contact.
 */
export const socials = {
  linkedin: 'https://www.linkedin.com/company/kku-aiche/',
  tiktok: 'https://www.tiktok.com/@aiche_aseer',
} as const;

/** The join form. Referenced in four places; defined once, here. */
export const joinUrl = 'https://forms.gle/xEQaFY3UANYquYJV8';
