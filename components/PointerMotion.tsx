'use client';

import { useEffect, useRef } from 'react';

/**
 * Pointer-reactive motion — the whole site's motion engine.
 *
 * Everything that follows the pointer globally lives here, in ONE
 * requestAnimationFrame loop. The alternative — a listener and a loop per
 * component — means several layout reads per frame and elements that visibly
 * drift out of sync.
 *
 * What the loop drives:
 *   - the hero chemistry field, in three depth layers ([data-depth]) so the
 *     motif has parallax rather than sliding as one flat sheet;
 *   - a soft accent glow that trails the pointer across the hero;
 *   - the gallery images ([data-pointer-drift]).
 *
 * Everything that reacts to a *local* pointer position instead — card tilt,
 * the fill origin on a button, tap ripples — is wired below the loop with
 * per-element listeners, because those need element-relative coordinates and
 * only need to run while the pointer is actually on that element.
 *
 * Nothing here runs when the visitor has asked for reduced motion.
 */

/** Global drift easing. 0.075/frame is what makes it read as drift, not twitch. */
const EASE = 0.075;

const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const finePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export default function PointerMotion() {
  useEffect(() => {
    if (reduced()) return;

    const cleanups: Array<() => void> = [];

    /* ---------------------------------------------------------------------
       1. The shared rAF loop
       --------------------------------------------------------------------- */
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    // Plural: the field is authored as two canvases, one per screen shape,
    // and CSS decides which of them is on screen.
    const fields = Array.from(
      document.querySelectorAll<HTMLElement>('[data-pointer-field]'),
    );
    const layers = Array.from(
      document.querySelectorAll<HTMLElement>('[data-pointer-field] [data-depth]'),
    );
    const galleryImages = Array.from(
      document.querySelectorAll<HTMLElement>('[data-pointer-drift]'),
    );

    if (fields.length > 0 || galleryImages.length > 0) {
      let targetX = 0;
      let targetY = 0;
      let x = 0;
      let y = 0;
      let scrolled = 0;
      let raf = 0;

      // Absolute viewport coordinates, for the hero glow.
      let pointerX = -200;
      let pointerY = -200;

      const aimAt = (clientX: number, clientY: number) => {
        targetX = (clientX / window.innerWidth - 0.5) * 2;
        targetY = (clientY / window.innerHeight - 0.5) * 2;
        pointerX = clientX;
        pointerY = clientY;
      };

      const onMouse = (e: MouseEvent) => aimAt(e.clientX, e.clientY);
      const onTouch = (e: TouchEvent) => {
        const t = e.touches[0];
        if (t) aimAt(t.clientX, t.clientY);
      };
      // Finger lifted: drift back to centre rather than freezing off-axis.
      const onTouchEnd = () => {
        targetX = 0;
        targetY = 0;
      };
      const onScroll = () => {
        scrolled = window.scrollY;
      };

      const frame = () => {
        x += (targetX - x) * EASE;
        y += (targetY - y) * EASE;

        if (fields.length > 0) {
          const depth = Math.min(scrolled, 900) * 0.14; // scroll parallax
          for (const f of fields) {
            f.style.transform = `translate3d(0, ${depth}px, 0)`;
          }
          // Each layer moves by its own factor: the near layer overshoots the
          // far one, and that difference is the only reason the motif reads
          // as having depth at all.
          for (const layer of layers) {
            const d = Number(layer.dataset.depth) || 1;
            layer.style.transform = `translate3d(${x * -22 * d}px, ${y * -16 * d}px, 0)`;
          }
        }

        if (hero) {
          // The glow is painted in the hero's own box, so the viewport
          // coordinate has to be converted into the hero's space.
          const r = hero.getBoundingClientRect();
          hero.style.setProperty('--gx', `${pointerX - r.left}px`);
          hero.style.setProperty('--gy', `${pointerY - r.top}px`);
        }

        for (const img of galleryImages) {
          // Pre-scaled 1.06 in CSS so the frame never exposes an empty edge.
          img.style.transform = `scale(1.06) translate3d(${x * 7}px, ${y * 5}px, 0)`;
        }

        raf = requestAnimationFrame(frame);
      };

      window.addEventListener('mousemove', onMouse, { passive: true });
      window.addEventListener('touchmove', onTouch, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      raf = requestAnimationFrame(frame);

      cleanups.push(() => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouse);
        window.removeEventListener('touchmove', onTouch);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('scroll', onScroll);
      });
    }

    /* ---------------------------------------------------------------------
       2. Tilt — team cards and gallery frames.
       transform only. The element keeps a slower transition on release so it
       settles back instead of snapping.
       --------------------------------------------------------------------- */
    if (finePointer()) {
      for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'))) {
        const max = Number(el.dataset.tilt) || 6;

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          el.style.transform =
            `perspective(900px) rotateX(${-dy * max}deg) rotateY(${dx * max}deg)`;
          // Feeds the specular sheen in CSS.
          el.style.setProperty('--sx', `${((e.clientX - r.left) / r.width) * 100}%`);
          el.style.setProperty('--sy', `${((e.clientY - r.top) / r.height) * 100}%`);
        };
        const enter = () => el.classList.add('tilting');
        const leave = () => {
          el.classList.remove('tilting');
          el.style.transform = '';
        };

        el.addEventListener('pointerenter', enter);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          el.removeEventListener('pointerenter', enter);
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        });
      }
    }

    /* ---------------------------------------------------------------------
       3. Buttons: fill origin + tap ripple.
       The fill itself is a CSS disc that scales up. All JS does is say WHERE
       the pointer crossed the edge, so the fill grows from that point rather
       than always from the middle.
       --------------------------------------------------------------------- */
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-ripple]'))) {
      const origin = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--bx', `${e.clientX - r.left}px`);
        el.style.setProperty('--by', `${e.clientY - r.top}px`);
      };

      const ripple = (e: PointerEvent) => {
        origin(e);
        const r = el.getBoundingClientRect();
        const dot = document.createElement('span');
        dot.className = 'btn__rip';
        // One disc big enough to reach the far corner from wherever it began.
        const size = Math.hypot(r.width, r.height) * 2;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.left = `${e.clientX - r.left}px`;
        dot.style.top = `${e.clientY - r.top}px`;
        el.appendChild(dot);
        dot.addEventListener('animationend', () => dot.remove(), { once: true });
      };

      el.addEventListener('pointerenter', origin);
      el.addEventListener('pointerdown', ripple);
      cleanups.push(() => {
        el.removeEventListener('pointerenter', origin);
        el.removeEventListener('pointerdown', ripple);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}

/**
 * Magnetic pull on a primary action. Pointer devices only: on touch the finger
 * is already on the target, so the pull just looks like lag.
 *
 * Returns a ref to put on the element. It binds to that one element rather
 * than querying `[data-magnet]` globally, because the hook is called once per
 * button instance — a global query would have every instance bind listeners to
 * every other instance's button, so two join buttons meant four sets of
 * listeners doing the same work twice.
 *
 * The offset is written to custom properties instead of `transform`, because
 * the button's own hover state also writes `transform` — two sources setting
 * the same property would overwrite each other. CSS composes both values.
 */
export function useMagnet<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) return;
    if (!finePointer()) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.setProperty('--mx', `${dx * 16}px`);
      el.style.setProperty('--my', `${dy * 11}px`);
    };
    const leave = () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  return ref;
}
