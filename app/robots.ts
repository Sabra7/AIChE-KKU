import type { MetadataRoute } from 'next';

import { siteUrl } from '@/data/site';

/**
 * Lives at the `app/` root, outside both route groups: robots.txt describes
 * the whole origin, not one language tree, and may only exist once.
 *
 * Nothing here is private — the site is two public pages — so the rule is a
 * blanket allow. The sitemap pointer is the part that earns its keep: it is
 * how a crawler that arrived at `/` learns that `/en` exists at all.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
