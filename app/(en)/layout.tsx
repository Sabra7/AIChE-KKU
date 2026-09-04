import type { Metadata } from 'next';

import Shell from '@/components/Shell';
import { site } from '@/data/site';

import '../globals.css';

/** Root layout for the English tree, served at `/en`. */
export const metadata: Metadata = {
  metadataBase: new URL('https://aiche-kku.vercel.app'), // TODO: real domain
  title: `${site.nameEn} — ${site.universityEn}`,
  description:
    'The King Khalid University student chapter of the American Institute of Chemical Engineers, Abha. Workshops, courses and events connecting students to a network across 110+ countries.',
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
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="en">{children}</Shell>;
}
