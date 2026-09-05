import type { ReactNode } from 'react';

import { dirOf, pick, type Lang } from '@/lib/i18n';
import { fontVars } from '@/lib/fonts';
import { ui } from '@/lib/ui';
import { ChemDefs } from './ChemField';
import Footer from './Footer';
import Header from './Header';
import { IconSprite } from './Icon';
import PointerMotion from './PointerMotion';

/**
 * Serialises structured data for an inline <script>.
 *
 * `<` is escaped even though every value comes from data/ and never from a
 * visitor: an HTML parser ends a script block at the first literal `</script>`
 * regardless of JSON quoting, so a chapter name or a partner URL containing
 * that sequence would break out of the block and inject markup. The escape is
 * valid JSON and parses back to the same string, so nothing is lost.
 */
function serialiseJsonLd(data: object) {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

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
            dangerouslySetInnerHTML={{ __html: serialiseJsonLd(jsonLd) }}
          />
        )}

        <a className="skip" href="#main">
          {pick(lang, ui.skipAr, ui.skipEn)}
        </a>

        <IconSprite />
        <ChemDefs />
        <Header lang={lang} />

        {/* tabIndex makes the skip link move FOCUS and not just the scroll
            position — without it the next Tab returns to the header. */}
        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <Footer lang={lang} />

        {/* Headless: starts the single rAF loop for pointer-reactive motion. */}
        <PointerMotion />
      </body>
    </html>
  );
}
