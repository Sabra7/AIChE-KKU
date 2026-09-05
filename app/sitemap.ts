import type { MetadataRoute } from 'next';

import { siteUrl } from '@/data/site';

/**
 * Deliberately hand-written rather than crawled: the site is two pages, and a
 * list of two is cheaper to read than a generator that could silently emit
 * the wrong set.
 *
 * Bump when the page content meaningfully changes. It is not `new Date()` on
 * purpose — that would move on every rebuild, including rebuilds that changed
 * nothing, and a lastModified that always says "just now" is one a crawler
 * learns to ignore.
 */
const LAST_MODIFIED = new Date('2026-09-05');

/**
 * The two URLs are translations of one another, not separate documents. Each
 * entry therefore advertises both languages plus an x-default, which is what
 * stops Google from treating them as duplicates, picking one and dropping the
 * other from the index.
 *
 * Arabic is the site's default language and owns the bare path, so it is also
 * the x-default target.
 */
const languages = {
  ar: siteUrl,
  en: `${siteUrl}/en`,
  'x-default': siteUrl,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${siteUrl}/en`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages },
    },
  ];
}
