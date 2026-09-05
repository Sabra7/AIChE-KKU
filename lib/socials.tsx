import type { ReactNode } from 'react';

/**
 * Social marks, defined once.
 *
 * Three sections render these — the chapter's own channels in the join
 * section, each team member's links, and each partner's accounts — so the
 * glyphs live here rather than being pasted into all three.
 *
 * Only the path data is stored. The caller owns the <svg> box, because the
 * sections want different sizes: 21px beside the join CTA, 19px in a card.
 *
 * Google Maps is drawn as a plain location pin rather than its multicolour
 * brand mark. Every other glyph here is a monochrome wordless logo that takes
 * currentColor; the real Maps pin is four colours and would be the only thing
 * on the page that ignores the palette.
 */

export type SocialKey = 'linkedin' | 'github' | 'tiktok' | 'x' | 'instagram' | 'maps';

/** Used for aria-label, so it must read as a destination, not a slug. */
export const SOCIAL_LABELS: Record<SocialKey, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  tiktok: 'TikTok',
  x: 'X',
  instagram: 'Instagram',
  maps: 'Google Maps',
};

const MARKS: Record<SocialKey, ReactNode> = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM2.9 21h4.2V9.4H2.9V21zM9.6 9.4V21h4.2v-6.2c0-1.7.9-2.6 2.2-2.6 1.2 0 2 .8 2 2.6V21h4.2v-6.9c0-3.5-1.9-5.1-4.4-5.1-2 0-2.9 1.1-3.4 1.9h-.1V9.4H9.6z" />
  ),
  github: (
    <path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0012 2z" />
  ),
  tiktok: (
    <path d="M16.5 2h-3v13.1a2.6 2.6 0 11-2.2-2.6V9.4a5.7 5.7 0 105.2 5.7V9.3a6.6 6.6 0 003.8 1.2V7.4a3.7 3.7 0 01-3.8-3.6V2z" />
  ),
  x: (
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
  ),
  instagram: (
    <>
      <path d="M7.8 2h8.4A5.8 5.8 0 0122 7.8v8.4A5.8 5.8 0 0116.2 22H7.8A5.8 5.8 0 012 16.2V7.8A5.8 5.8 0 017.8 2zm0 2A3.8 3.8 0 004 7.8v8.4A3.8 3.8 0 007.8 20h8.4a3.8 3.8 0 003.8-3.8V7.8A3.8 3.8 0 0016.2 4H7.8z" />
      <path d="M12 6.9a5.1 5.1 0 110 10.2 5.1 5.1 0 010-10.2zm0 2a3.1 3.1 0 100 6.2 3.1 3.1 0 000-6.2z" />
      <circle cx="17.5" cy="6.5" r="1.2" />
    </>
  ),
  maps: (
    <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1114.5 9 2.5 2.5 0 0112 11.5z" />
  ),
};

/** One glyph. `aria-hidden` — the accessible name belongs on the link. */
export function SocialMark({ name, size = 19 }: { name: SocialKey; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {MARKS[name]}
    </svg>
  );
}
