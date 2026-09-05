import type { ReactNode } from 'react';

import { dirOf, pick, type Lang } from '@/lib/i18n';
import { fontVars } from '@/lib/fonts';
import { ui } from '@/lib/ui';
import Footer from './Footer';
import Header from './Header';
import { IconSprite } from './Icon';
import PointerMotion from './PointerMotion';

/**
 * The document shell.
 *
 * The site ships as two separate static trees — Arabic at `/` and English at
 * `/en` — each with its own root layout. That is what lets `<html lang>` and
 * `<html dir>` be correct in the served HTML instead of being patched by
 * script after paint: no flash of the wrong writing direction, and each
 * language is a real URL a search engine can index.
 *
 * Both root layouts render this component, so there is one shell, not two.
 */
export default function Shell({
  lang,
  jsonLd,
  children,
}: {
  lang: Lang;
  /** Structured data for this tree; serialised into a ld+json script. */
  jsonLd?: object;
  children: ReactNode;
}) {
  return (
    <html lang={lang} dir={dirOf(lang)} className={fontVars}>
      <body>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}

        <a className="skip" href="#main">
          {pick(lang, ui.skipAr, ui.skipEn)}
        </a>

        <IconSprite />
        <Header lang={lang} />

        <main id="main">{children}</main>

        <Footer lang={lang} />

        {/* Headless: starts the single rAF loop for pointer-reactive motion. */}
        <PointerMotion />
      </body>
    </html>
  );
}
