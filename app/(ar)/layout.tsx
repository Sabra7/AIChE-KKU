import type { Metadata } from 'next';

import Shell from '@/components/Shell';
import { site, siteUrl } from '@/data/site';
import { organizationJsonLd } from '@/lib/jsonld';

import '../globals.css';

const description =
  'الفرع الطلابي للمعهد الأمريكي للمهندسين الكيميائيين بجامعة الملك خالد — أبها. ورش ودورات وفعاليات تربط الطلاب بشبكة عالمية في أكثر من 110 دول.';

/**
 * Root layout for the Arabic tree, served at `/`.
 * Arabic is the default language, so it owns the bare path.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.nameAr,
  description,
  alternates: {
    canonical: '/',
    languages: { ar: '/', en: '/en' },
  },
  openGraph: {
    title: site.nameAr,
    description: site.tagline,
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    // The share image is a 1200x630 banner, not an avatar; `summary` would
    // crop it to a square thumbnail and throw away most of it.
    card: 'summary_large_image',
    title: site.nameAr,
    description,
  },
  verification: {
    // Paste the token from Google Search Console here, from a property of type
    // "URL prefix". DNS verification is not an option while the site lives on
    // vercel.app, since we do not control that domain's records.
    google: '',
  },
};

export default function ArabicRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell lang="ar" jsonLd={organizationJsonLd('ar')}>
      {children}
    </Shell>
  );
}
