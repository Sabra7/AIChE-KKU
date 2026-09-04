'use client';

import { useEffect } from 'react';

/**
 * Pointer-reactive motion — the whole site's motion engine.
 *
 * Everything that follows the pointer globally lives here, in ONE
 * requestAnimationFrame loop. The alternative — a listener and a loop per
 * component — means several layout reads per frame and elements that visibly
 * drift out of sync.
 *
 * What the loop drives:
 *   - the hero field, in three depth layers ([data-depth]) so the motif has
 *     parallax rather than sliding as one flat sheet;
 *   - a soft accent glow that trails the pointer across the hero;
 *   - the gallery images ([data-pointer-drift]);
 *   - the trailing cursor ring (fine pointers only).
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
/** The ring must feel attached to the pointer, so it eases much faster. */
const RING_EASE = 0.2;

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
    const field = document.querySelector<HTMLElement>('[data-pointer-field]');
    const layers = Array.from(
      document.querySelectorAll<HTMLElement>('[data-pointer-field] [data-depth]'),
    );
    const galleryImages = Array.from(
      document.querySelectorAll<HTMLElement>('[data-pointer-drift]'),
    );

    // The ring is created here rather than rendered, so it never exists in the
    // markup for a visitor who will never see it (touch, or reduced motion).
    let ring: HTMLElement | null = null;
    if (finePointer() && window.innerWidth >= 900) {
      ring = document.createElement('div');
      ring.className = 'ring';
      ring.setAttribute('aria-hidden', 'true');
      document.body.appendChild(ring);
      cleanups.push(() => ring?.remove());
    }

    if (field || galleryImages.length > 0 || ring) {
      let targetX = 0;
      let targetY = 0;
      let x = 0;
      let y = 0;
      let scrolled = 0;
      let raf = 0;

      // Absolute viewport coordinates, for the ring and the hero glow.
      let ringTX = -200;
      let ringTY = -200;
      let ringX = -200;
      let ringY = -200;

      const aimAt = (clientX: number, clientY: number) => {
        targetX = (clientX / window.innerWidth - 0.5) * 2;
        targetY = (clientY / window.innerHeight - 0.5) * 2;
        ringTX = clientX;
        ringTY = clientY;
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
        ringX += (ringTX - ringX) * RING_EASE;
        ringY += (ringTY - ringY) * RING_EASE;

        if (field) {
          const depth = Math.min(scrolled, 900) * 0.14; // scroll parallax
          field.style.transform = `translate3d(0, ${depth}px, 0)`;
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
          hero.style.setProperty('--gx', `${ringTX - r.left}px`);
          hero.style.setProperty('--gy', `${ringTY - r.top}px`);
        }

        for (const img of galleryImages) {
          // Pre-scaled 1.06 in CSS so the frame never exposes an empty edge.
          img.style.transform = `scale(1.06) translate3d(${x * 7}px, ${y * 5}px, 0)`;
        }

        if (ring) ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

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
       2. Ring state — it grows over anything clickable.
       Delegated from the document, so a node that mounts later still gets it.
       --------------------------------------------------------------------- */
    if (ring) {
      const r = ring;
      const HOT = 'a, button, [data-cursor-hot]';
      const over = (e: Event) => {
        const target = e.target as Element | null;
        const hot = target && 'closest' in target ? target.closest(HOT) : null;
        r.classList.toggle('ring--hot', Boolean(hot));
        r.classList.add('ring--on');
      };
      const hide = () => r.classList.remove('ring--on');
      document.addEventListener('mouseover', over, { passive: true });
      document.addEventListener('mouseleave', hide);
      cleanups.push(() => {
        document.removeEventListener('mouseover', over);
        document.removeEventListener('mouseleave', hide);
      });
    }

    /* ---------------------------------------------------------------------
       3. Tilt — team cards and gallery frames.
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
       4. Buttons: fill origin + tap ripple.
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
 * The offset is written to custom properties instead of `transform`, because
 * the button's own hover state also writes `transform` — two sources setting
 * the same property would overwrite each other. CSS composes both values.
 */
export function useMagnet() {
  useEffect(() => {
    if (reduced()) return;
    if (!finePointer()) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-magnet]'));
    const cleanups: Array<() => void> = [];

    for (const el of els) {
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
      cleanups.push(() => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
