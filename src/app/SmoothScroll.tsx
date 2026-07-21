'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

// Module-level singleton so other components can drive scrolling (e.g.
// scrolling a newly-revealed panel into view) through the same Lenis
// instance instead of a native scroll call fighting it for control.
let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis();
    lenisInstance = lenis;

    // Drive Lenis off GSAP's ticker instead of its own rAF loop, so there's
    // one shared frame loop with the page-transition curtain rather than two
    // independent ones fighting for the same frame budget.
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenisInstance = null;
      lenis.destroy();
    };
  }, []);

  return null;
}
