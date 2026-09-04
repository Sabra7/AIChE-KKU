'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * Section entrance.
 *
 * Every revealing element on the page shares ONE IntersectionObserver, created
 * once and stored on the module. Giving each element its own observer is the
 * usual mistake and it costs a surprising amount on a long page.
 *
 * The animation itself is a CSS transition on transform and opacity — see
 * `.reveal` in globals.css. Nothing here touches layout properties.
 */

let observer: IntersectionObserver | null = null;

function getObserver() {
  if (typeof window === 'undefined') return null;
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target); // fire once, then stop watching
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
  );
  return observer;
}

interface RevealProps {
  children: ReactNode;
  /** Stagger step, 1–5. Maps to a CSS transition-delay. */
  delay?: 1 | 2 | 3 | 4 | 5;
  as?: ElementType;
  className?: string;
}

export default function Reveal({ children, delay, as: Tag = 'div', className = '' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect the OS setting: show everything immediately, animate nothing.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('in');
      return;
    }

    const obs = getObserver();
    obs?.observe(el);
    return () => obs?.unobserve(el);
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} data-delay={delay}>
      {children}
    </Tag>
  );
}
