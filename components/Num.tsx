import type { ReactNode } from 'react';

/**
 * Wraps a numeral so the bidirectional algorithm cannot reorder it.
 *
 * Without this, "30+" renders as "+30" inside Arabic text, and a date range
 * like "2026/2027" can come out reversed. `unicode-bidi: isolate` on an
 * ltr-direction inline-block is the fix; see `.num` in globals.css.
 *
 * Use it for every figure on the site, including years.
 */
export default function Num({ children }: { children: ReactNode }) {
  return <span className="num">{children}</span>;
}
