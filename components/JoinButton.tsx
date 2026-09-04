'use client';

import { pick, type Lang } from '@/lib/i18n';
import { ui } from '@/lib/ui';
import { joinUrl } from '@/data/site';
import { useMagnet } from './PointerMotion';
import SwapLabel from './SwapLabel';

/**
 * The one join button. Its label comes from lib/ui.ts and its URL from
 * data/site.ts, so neither is ever retyped at a call site.
 *
 * Four things happen on it, and they are deliberately layered so that a device
 * only pays for what it can actually show:
 *   - the green fill grows from wherever the pointer crossed the edge;
 *   - the label swaps for its own copy;
 *   - the arrow chip slides;
 *   - a ripple fires on tap, which is the only one of the four a touch
 *     visitor gets — the others need a hover state that does not exist there.
 */
export default function JoinButton({
  lang,
  size = 'md',
}: {
  lang: Lang;
  size?: 'md' | 'lg';
}) {
  useMagnet();

  const label = pick(lang, ui.joinCtaAr, ui.joinCtaEn);

  return (
    <a
      className={`btn${size === 'lg' ? ' btn--lg' : ''}`}
      href={joinUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-magnet
      data-ripple
    >
      <SwapLabel>{label}</SwapLabel>
      <span className="btn__ico" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 8h11M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}
