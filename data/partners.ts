/**
 * Partner organisations. Logo, name, and their official accounts — no blurbs,
 * no counts.
 *
 * These marks belong to other organisations, so the section renders them with
 * `object-fit: contain`: a logo is never cropped and never stretched to match
 * its neighbour's proportions. That is the whole reason partners are a
 * separate pattern rather than a second gallery.
 *
 * File requirements: drop the logo in /public/partners. Transparent background
 * (PNG or SVG), at least 200px tall. Trim the transparent margin yourself —
 * `contain` fits the file's bounding box, so baked-in padding reads as a
 * smaller logo beside the others.
 *
 * The mark must be legible on the light warm ground: supply the dark version.
 * A white-on-transparent logo disappears on --bg.
 */

import type { SocialKey } from '@/lib/socials';

export interface Partner {
  id: string;      // unique, lowercase, no spaces
  nameAr: string;
  nameEn: string;
  logo: string;    // path under /partners
  /**
   * The partner's own accounts, same shape as a team member's `links`. Same
   * rule too: only list a channel with a real URL behind it. Order here is the
   * order they render in.
   */
  links?: Partial<Record<SocialKey, string>>;
}

// TODO: both logo files are stand-ins traced out of the screenshots the
// chapter supplied — a photographed shop box and a low-resolution social post.
// They were reduced to a single --ink silhouette because neither source
// carries real brand colour: MAF's was a white knockout on navy, Bred's was
// ink on a lit carton. Ask each partner for their official file and replace
// them; nothing else needs changing when you do.
export const partners: Partner[] = [
  {
    id: 'madar-alfalak',
    // The chapter's announcement post calls it "معهد", its own logo says
    // "مركز". The logo wins.
    nameAr: 'مركز مدار الفلك للتدريب',
    nameEn: 'Madar Al-Falak Training Center',
    logo: '/partners/madar-alfalak.png',
    links: {
      tiktok: 'https://www.tiktok.com/@mafacadmy',
      x: 'https://x.com/mafacadmy',
      instagram: 'https://www.instagram.com/mafacadmy',
    },
  },
  {
    id: 'bred-bakehouse',
    nameAr: 'برد بيك هاوس',
    nameEn: 'Bred Bakehouse',
    logo: '/partners/bred-bakehouse.png',
    links: {
      tiktok: 'https://www.tiktok.com/@bred_ksa',
      maps: 'https://share.google/MklVbji5OaboVxBE4',
    },
  },
];
