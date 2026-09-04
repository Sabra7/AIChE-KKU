import { IBM_Plex_Sans_Arabic, Space_Grotesk } from 'next/font/google';

/**
 * Fonts are loaded through next/font, which self-hosts them at build time —
 * no request to Google at runtime, no layout shift, no privacy footnote.
 *
 * Only the weights actually used are requested. Adding a weight here costs
 * real bytes on every page load, so add one only when a design needs it.
 */

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
});

export const fontVars = `${spaceGrotesk.variable} ${plexArabic.variable}`;
