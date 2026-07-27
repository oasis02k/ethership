'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/** Slot-machine style text reel: on hover the current label spins out upward
 * while a duplicate spins in from below. Driven by GSAP (rather than CSS
 * transitions) so it matches the rest of the site's animation stack. */
export default function SlotText({ children, hovered }: { children: string; hovered: boolean }) {
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);

  // Set the reel's resting position through GSAP (not a plain CSS transform
  // in JSX) — GSAP tracks yPercent in its own cache, and a React-owned
  // transform string on the same element fights it, producing a stacked
  // offset that threw both copies of the text out of view.
  useLayoutEffect(() => {
    gsap.set(bottomRef.current, { yPercent: 100 });
  }, []);

  useEffect(() => {
    gsap.to(topRef.current, { yPercent: hovered ? -100 : 0, duration: 0.3, ease: 'power2.out' });
    gsap.to(bottomRef.current, { yPercent: hovered ? 0 : 100, duration: 0.3, ease: 'power2.out' });
  }, [hovered]);

  return (
    <span
      className="relative inline-block overflow-hidden align-middle"
      style={{ height: '1.3em', lineHeight: '1.3em' }}
    >
      <span ref={topRef} className="block">{children}</span>
      <span ref={bottomRef} className="absolute left-0 top-0 block">{children}</span>
    </span>
  );
}
