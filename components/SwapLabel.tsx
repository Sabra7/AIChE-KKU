/**
 * A label that swaps on hover: the visible line slides out of the top while an
 * identical copy slides in from below.
 *
 * The copy is duplicated in the markup rather than faked with a pseudo-element
 * and `content: attr(...)`, because attr() carries no font fallback — an
 * Arabic label rendered that way loses its typeface in some browsers. The
 * second copy is aria-hidden so a screen reader still hears the label once.
 *
 * The clipping box gets vertical padding so Arabic descenders and diacritics
 * are not sheared off at rest; overflow clips the padding box, so the padding
 * is real breathing room, not a gap.
 */
export default function SwapLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="swap">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
