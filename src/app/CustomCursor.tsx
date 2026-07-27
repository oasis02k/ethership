'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/** Follows the mouse with a lagged ease and only shows itself while hovering
 * an element marked [data-cursor-target] — swaps the default pointer for a
 * custom icon over project thumbnails, on both the project list and home
 * page. Delegated at the document level so cards don't each need their own
 * listeners. */
export default function CustomCursor() {
  // Position (GSAP-driven) and scale/opacity (CSS-driven) live on separate
  // elements — mixing GSAP's own transform tracking with a plain CSS `scale`
  // on the same node made GSAP re-bake the already-applied scale into its
  // internal transform, compounding the two (0.6 x 0.6 = 0.36 size).
  const outerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    // Touch devices have no mouse to follow and no hover state to react to —
    // skip attaching listeners so nothing is left running or briefly flashed
    // in from a stray synthetic mouse event after a tap.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const moveX = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const moveY = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMouseMove = (e: MouseEvent) => {
      moveX(e.clientX);
      moveY(e.clientY);
    };
    window.addEventListener('mousemove', onMouseMove);

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-cursor-target]')) setActive(true);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-cursor-target]')) setActive(false);
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <div ref={outerRef} className="fixed top-0 left-0 z-[100] pointer-events-none -translate-x-1/2 -translate-y-1/2" aria-hidden>
      <div
        className="transition-[opacity,scale] duration-200 ease-out"
        style={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
      >
        <img src="/cursor-arrow.svg" alt="" width={96} height={96} />
      </div>
    </div>
  );
}
