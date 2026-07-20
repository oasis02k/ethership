'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const bars = barsRef.current.filter((el): el is HTMLDivElement => el !== null);
    if (bars.length === 0) return;

    const tl = gsap.timeline();
    tl.to(bars, {
      y: 0,
      duration: 0.22,
      ease: 'power2.out',
      stagger: 0.22,
    })
      .to(bars, {
        y: '100vh',
        duration: 0.32,
        ease: 'power2.in',
      }, '+=0.2');

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      {/* Sibling overlay, not a wrapper — an ancestor transform would break
          this site's position:fixed page layouts (see globals.css note). */}
      <div key={pathname} className="page-curtain" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            ref={(el) => { barsRef.current[i] = el; }}
            className="page-curtain-bar"
          />
        ))}
      </div>
      {children}
    </>
  );
}
