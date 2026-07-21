'use client';

import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
// cubic-bezier(0.7, 0, 0.3, 1) expressed as the SVG path CustomEase expects.
CustomEase.create('curtainEase', 'M0,0 C0.7,0 0.3,1 1,1');

// Disabled while we rework the transition design — flip back to true to
// re-enable the curtain. Left in place (not deleted) so it's easy to resume.
const TRANSITION_ENABLED = false;

const MIN_REVEAL_DELAY_MS = 550;
// Safety net so a page that never reports readiness can't wedge the curtain shut.
const MAX_REVEAL_WAIT_MS = 2500;

const TransitionReadyContext = createContext<((ready: boolean) => void) | null>(null);

/** Lets a page hold the curtain closed until its own content (e.g. staggered
 * image fade-ins) has actually finished, instead of the curtain lifting on a
 * fixed timer while content is still popping in underneath. */
export function useTransitionReady(ready: boolean) {
  const setReady = useContext(TransitionReadyContext);
  useEffect(() => {
    setReady?.(ready);
    return () => setReady?.(true);
  }, [setReady, ready]);
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const readyRef = useRef(true);
  const onReadyChangeRef = useRef<(() => void) | null>(null);

  const setReady = useCallback((value: boolean) => {
    readyRef.current = value;
    if (value) onReadyChangeRef.current?.();
  }, []);

  useEffect(() => {
    if (!TRANSITION_ENABLED) return;

    const bars = barsRef.current.filter((el): el is HTMLDivElement => el !== null);
    if (bars.length === 0) return;

    let cancelled = false;
    let minDelayElapsed = false;
    let maxWaitElapsed = false;

    // Bars are now 4 equal-width vertical columns (not stacked rows), so
    // every bar is the same height and a single self-relative -100% clears
    // any of them the same amount — no per-index distance needed anymore.
    const HIDDEN_OFFSET = '-100%';

    gsap.set(bars, { y: HIDDEN_OFFSET });

    const runExit = () => {
      if (cancelled) return;
      cancelled = true;
      onReadyChangeRef.current = null;
      gsap.to(bars, {
        y: HIDDEN_OFFSET,
        duration: 0.3,
        ease: 'curtainEase',
        // Reverse of the entrance: columns drop left-to-right on exit.
        stagger: { each: 0.3, from: 'start' },
        force3D: true,
      });
    };

    const tryExit = () => {
      if (cancelled) return;
      if (maxWaitElapsed || (minDelayElapsed && readyRef.current)) runExit();
    };

    const tl = gsap.timeline();
    tl.to(bars, {
      y: 0,
      duration: 0.4,
      ease: 'curtainEase',
      // Columns are left(0)-to-right(3) in DOM order; entrance sequences
      // right-to-left, so the rightmost column (index 3) goes first.
      stagger: { each: 0.4, from: 'end' },
      force3D: true,
    });

    tl.eventCallback('onComplete', () => {
      onReadyChangeRef.current = tryExit;
      setTimeout(() => { minDelayElapsed = true; tryExit(); }, MIN_REVEAL_DELAY_MS);
      setTimeout(() => { maxWaitElapsed = true; tryExit(); }, MAX_REVEAL_WAIT_MS);
    });

    return () => {
      cancelled = true;
      onReadyChangeRef.current = null;
      tl.kill();
      gsap.killTweensOf(bars);
    };
  }, [pathname]);

  return (
    <TransitionReadyContext.Provider value={setReady}>
      {/* Sibling overlay, not a wrapper — an ancestor transform would break
          this site's position:fixed page layouts (see globals.css note). */}
      {TRANSITION_ENABLED && (
        <div key={pathname} className="page-curtain" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              ref={(el) => { barsRef.current[i] = el; }}
              className="page-curtain-bar"
            />
          ))}
        </div>
      )}
      {children}
    </TransitionReadyContext.Provider>
  );
}
