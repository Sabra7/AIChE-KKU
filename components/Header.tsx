'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { homeHref, otherLang, pick, type Lang } from '@/lib/i18n';
import { NAV_ORDER, ui } from '@/lib/ui';
import SwapLabel from './SwapLabel';

/**
 * The language control is a real link to the other language's route, not a
 * button that swaps strings. That keeps both languages crawlable and means a
 * visitor can share a URL in the language they were reading.
 */
export default function Header({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const nav = lang === 'ar' ? ui.navAr : ui.navEn;

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Mark the section currently in view, for aria-current and the underline.
   *
   * The root margin leaves a band roughly 5% of the viewport tall across the
   * middle: a section counts as "current" only while it crosses that band, so
   * the highlight moves once per section rather than flickering between two
   * that are both partly on screen. `active` is never cleared, which is why
   * scrolling through a section that is not in the nav (targets, gallery,
   * partners) leaves the previous item marked rather than clearing the nav.
   */
  useEffect(() => {
    const sections = NAV_ORDER.map((key) => document.getElementById(key)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const swapTo = otherLang(lang);
  const swapHref = homeHref(swapTo);

  return (
    <header className={`hdr${stuck ? ' stuck' : ''}`}>
      <div className="shell hdr__in">
        <Link className="brand" href={homeHref(lang)}>
          <Image
            className="brand__mark"
            src="/logo/logo-mark.png"
            alt=""
            width={31}
            height={34}
            priority
          />
          <span className="brand__txt">
            AIChE<span className="brand__dot">·</span>KKU
          </span>
        </Link>

        <nav
          id="site-nav"
          className={`nav${open ? ' open' : ''}`}
          aria-label={pick(lang, 'التنقل الرئيسي', 'Main navigation')}
        >
          {NAV_ORDER.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              onClick={() => setOpen(false)}
              aria-current={active === key ? 'true' : undefined}
            >
              {nav[key]}
            </a>
          ))}
        </nav>

        <Link
          className="langbtn"
          href={swapHref}
          hrefLang={swapTo}
          lang={swapTo}
          aria-label={pick(lang, 'Switch to English', 'التبديل إلى العربية')}
          data-ripple
        >
          <SwapLabel>{lang === 'ar' ? 'EN' : 'ع'}</SwapLabel>
        </Link>

        <button
          className="burger"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={pick(lang, ui.menuAr, ui.menuEn)}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
