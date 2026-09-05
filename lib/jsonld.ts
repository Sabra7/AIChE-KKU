import { homeHref, pick, type Lang } from '@/lib/i18n';
import { site, siteUrl, socials } from '@/data/site';

/**
 * Structured data for the chapter, emitted by both root layouts.
 *
 * Every value is read from data/site.ts. Nothing is asserted here that the
 * site does not already state elsewhere, because a claim in JSON-LD that the
 * page cannot back up is exactly what gets structured data ignored.
 *
 * `sameAs` is what ties this page to the chapter's LinkedIn and TikTok, and
 * is the strongest signal available that the three belong to one body.
 */
export function organizationJsonLd(lang: Lang) {
  // universityAr/En hold "<university> — <city>" as one display string; the
  // two halves are separate entities in schema.org terms.
  const [university, city] = pick(lang, site.universityAr, site.universityEn).split(' — ');

  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: pick(lang, site.nameAr, site.nameEn),
    alternateName: pick(lang, site.nameEn, site.nameAr),
    // Trailing slash stripped so this is byte-identical to the canonical the
    // page advertises; the Arabic home is the bare origin.
    url: `${siteUrl}${homeHref(lang)}`.replace(/\/$/, ''),
    logo: `${siteUrl}/logo/logo-full.png`,
    slogan: site.tagline,
    foundingDate: String(site.founded),
    department: { '@type': 'EducationalOrganization', name: pick(lang, site.departmentAr, site.departmentEn) },
    parentOrganization: { '@type': 'CollegeOrUniversity', name: university },
    address: { '@type': 'PostalAddress', addressLocality: city },
    sameAs: Object.values(socials),
  };
}
