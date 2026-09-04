import type { Metadata } from 'next';

import Shell from '@/components/Shell';
import { site } from '@/data/site';

import '../globals.css';

/**
 * Root layout for the Arabic tree, served at `/`.
 * Arabic is the default language, so it owns the bare path.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://aiche-kku.vercel.app'), // TODO: real domain
  title: site.nameAr,
  description:
    'الفرع الطلابي للمعهد الأمريكي للمهندسين الكيميائيين بجامعة الملك خالد — أبها. ورش ودورات وفعاليات تربط الطلاب بشبكة عالمية في أكثر من 110 دول.',
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
};

export default function ArabicRootLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="ar">{children}</Shell>;
}
