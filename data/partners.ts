/**
 * Partner organisations. Logo and name only — no links, no blurbs, no counts.
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

export interface Partner {
  id: string;      // unique, lowercase, no spaces
  nameAr: string;
  nameEn: string;
  logo: string;    // path under /partners
}

// TODO: the names below are confirmed, the logo files are not in the repo yet.
// Both `logo` paths point at where the files are expected to land, so the
// images render broken until they are dropped into /public/partners.
export const partners: Partner[] = [
  {
    id: 'madar-alfalak',
    // The chapter's announcement post calls it "معهد", its own logo says
    // "مركز". The logo wins.
    nameAr: 'مركز مدار الفلك للتدريب',
    nameEn: 'Madar Al-Falak Training Center',
    logo: '/partners/madar-alfalak.png',
  },
  {
    id: 'bred-bakehouse',
    nameAr: 'برد بيك هاوس',
    nameEn: 'Bred Bakehouse',
    logo: '/partners/bred-bakehouse.png',
  },
];
