'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts a figure up once, the first time it scrolls into view.
 *
 * It takes the finished string ("700+", "30+") and pulls the digits out of it
 * rather than taking a number and a suffix, so data/targets.ts stays a plain
 * list of display values and nobody has to remember to split them.
 *
 * The element reserves its final width up front (`ch` sizing on the parent's
 * .num rule is not enough on its own, so the finished string is rendered
 * invisibly behind the counter). Without that the whole five-column row
 * re-lays-out on every frame of the count, which is both ugly and expensive.
 */

/** ~1.1s feels like the number arriving; longer feels like waiting for it. */
const DURATION = 1100;
/** Standard ease-out. The last digits should land slowly. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CountUp({
  value,
  className = '',
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const digits = Number(value.replace(/\D/g, ''));
  const suffix = value.replace(/[\d,]/g, '');
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(digits) || digits === 0) return;

    // Reduced motion, or no observer: show the final figure and stop.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          obs.disconnect(); // count once, never again

          const start = performance.now();
          const step = (now: number) => {
            const t = Math.min((now - start) / DURATION, 1);
            setShown(Math.round(easeOut(t) * digits));
            if (t < 1) raf = requestAnimationFrame(step);
            else setShown(null); // hand the final string back to the DOM
          };
          raf = requestAnimationFrame(step);
        }
      },
      { threshold: 0.55 },
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [digits]);

  return (
    <span ref={ref} className={`cnt ${className}`}>
      {/* Invisible, but it is what holds the column's width steady. */}
      <span className="cnt__ghost" aria-hidden="true">
        {value}
      </span>
      <span className="cnt__v">{shown === null ? value : `${shown}${suffix}`}</span>
    </span>
  );
}
