import type { Metadata } from 'next';

import Shell from '@/components/Shell';
import { site, siteUrl } from '@/data/site';
import { organizationJsonLd } from '@/lib/jsonld';

import '../globals.css';

const title = `${site.nameEn} — ${site.universityEn}`;

const description =
  'The King Khalid University student chapter of the American Institute of Chemical Engineers, Abha. Workshops, courses and events connecting students to a network across 110+ countries.';

/** Root layout for the English tree, served at `/en`. */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: '/en',
    languages: { ar: '/', en: '/en' },
  },
  openGraph: {
    title: site.nameEn,
    description: site.tagline,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    // The share image is a 1200x630 banner, not an avatar; `summary` would
    // crop it to a square thumbnail and throw away most of it.
    card: 'summary_large_image',
    title,
    description,
  },
  verification: {
    // Paste the token from Google Search Console here, from a property of type
    // "URL prefix". DNS verification is not an option while the site lives on
    // vercel.app, since we do not control that domain's records.
    // The token only — Next wraps it in the meta tag itself.
    google: 'wIE6QzaD2FwUCRpzzJuGLDeLX_jgqAm9pWwIbXHex9A',
  },
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell lang="en" jsonLd={organizationJsonLd('en')}>
      {children}
    </Shell>
  );
}
