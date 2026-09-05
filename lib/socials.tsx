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
 * Two of these are generic glyphs rather than brand marks. Google Maps is a
 * plain location pin, because the real one is four colours and would be the
 * only thing on the page that ignores the palette. `email` is an envelope,
 * because a mailto has no brand to borrow. Everything else is a monochrome
 * wordless logo that takes currentColor.
 */

export type SocialKey =
  | 'linkedin'
  | 'github'
  | 'tiktok'
  | 'x'
  | 'instagram'
  | 'whatsapp'
  | 'email'
  | 'maps';

/** Used for aria-label, so it must read as a destination, not a slug. */
export const SOCIAL_LABELS: Record<SocialKey, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  tiktok: 'TikTok',
  x: 'X',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  email: 'Email',
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
  whatsapp: (
    <path d="M12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.69 1.45c6.55 0 11.89-5.34 11.89-11.89A11.82 11.82 0 0020.46 3.5 11.82 11.82 0 0012.05 0zm0 21.67a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.89 6.99c0 5.45-4.44 9.88-9.89 9.88zm5.42-7.29c-.3-.15-1.76-.87-2.03-.97-.28-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.18.2-.35.23-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35z" />
  ),
  email: (
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
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
