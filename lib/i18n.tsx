/**
 * Language handling.
 *
 * The site ships as two statically generated trees — Arabic at `/` and English
 * at `/en` — rather than one page that swaps strings at runtime. Each language
 * is therefore a real URL a search engine can index, `<html lang>` and
 * `<html dir>` are correct in the served HTML, and there is no flash of the
 * wrong writing direction on first paint.
 *
 * Everything here is a plain function with no React state, so both Server and
 * Client Components can import it. That is deliberate: adding `'use client'`
 * to this file would make `pick()` unusable from the server components that
 * render most of the page.
 *
 * Components receive `lang` as a prop. There is no context, because there is
 * nothing to synchronise — the language is fixed for the whole route tree.
 */

export const LANGS = ['ar', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export type Dir = 'rtl' | 'ltr';

/** Arabic is the default. */
export const DEFAULT_LANG: Lang = 'ar';

export const isLang = (value: string): value is Lang =>
  (LANGS as readonly string[]).includes(value);

export const dirOf = (lang: Lang): Dir => (lang === 'ar' ? 'rtl' : 'ltr');

export const otherLang = (lang: Lang): Lang => (lang === 'ar' ? 'en' : 'ar');

/**
 * Arabic owns the bare path; English lives under /en. Route building happens
 * here only, so no component ever hard-codes a locale path.
 */
export const homeHref = (lang: Lang) => (lang === 'ar' ? '/' : '/en');

/** Pick the right string for the current language. */
export const pick = (lang: Lang, ar: string, en: string) => (lang === 'ar' ? ar : en);

/**
 * Bound version of `pick`, for components that reach for it many times:
 *
 *   const t = translator(lang);
 *   t('من نحن', 'About')
 */
export const translator = (lang: Lang) => (ar: string, en: string) => pick(lang, ar, en);

/** Remembers the visitor's last choice so the switch feels sticky. */
export const LANG_STORAGE_KEY = 'aiche-lang';
