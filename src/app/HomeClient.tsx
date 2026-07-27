'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import Menu from './Menu';
import Nav from './Nav';
import { useTransitionReady } from './PageTransition';
import CustomCursor from './CustomCursor';

export interface TickerImage {
  slug: string;
  title: string;
  src: string;
  ratio: string;
}

const FADE_STEP_MS = 80;
const FADE_DURATION_MS = 600;

function ImageTile({
  slug, title, src, ratio, className = '',
  show = true, fadeDelay = 0,
  onLoaded,
}: {
  slug: string;
  title: string;
  src: string;
  ratio: string;
  className?: string;
  show?: boolean;
  fadeDelay?: number;
  onLoaded?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const firedRef = useRef(false);
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  const notifyLoaded = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    onLoadedRef.current?.();
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) notifyLoaded();
  }, [notifyLoaded]);

  return (
    <Link
      href={`/project/${slug}`}
      className={`relative overflow-hidden block cursor-none ${className}`}
      data-cursor-target
      style={{
        aspectRatio: ratio.replace('/', ' / '),
        opacity: show ? 1 : 0,
        transition: `opacity ${FADE_DURATION_MS}ms ease`,
        transitionDelay: show ? `${fadeDelay}ms` : '0ms',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        ref={imgRef}
        src={src}
        className="w-full h-full object-cover"
        alt=""
        onLoad={notifyLoaded}
      />
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 pointer-events-none"
        style={{ opacity: hovered ? 1 : 0 }}
      />
      <p
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center transition-opacity duration-300 pointer-events-none whitespace-nowrap"
        style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontSize: '24px',
          lineHeight: '1.3',
          opacity: hovered ? 1 : 0,
        }}
      >
        {title}
      </p>
    </Link>
  );
}

function TickerPanel({
  col1,
  col2,
  pxPerSec = 40,
  started = false,
  show = false,
  delays = [] as number[],
  onImageLoaded,
  mobile = false,
}: {
  col1: TickerImage[];
  col2: TickerImage[];
  pxPerSec?: number;
  started?: boolean;
  show?: boolean;
  delays?: number[];
  onImageLoaded?: (src: string) => void;
  mobile?: boolean;
}) {
  const strip1Ref = useRef<HTMLDivElement>(null);
  const strip2Ref = useRef<HTMLDivElement>(null);
  const a = useRef({ y1: 0, y2: 0, vel: 0, h1: 0, h2: 0, prev: 0, raf: 0 });

  useEffect(() => {
    if (!started) return;

    const s1 = strip1Ref.current;
    const s2 = strip2Ref.current;
    if (!s1 || !s2) return;

    // Each column loops on its own content height — col1 and col2 can differ
    // (different image counts/aspect ratios), so a shared threshold made the
    // shorter column scroll past its duplicated set into empty space before
    // wrapping.
    a.current.h1 = s1.scrollHeight / 2;
    a.current.h2 = s2.scrollHeight / 2;
    a.current.y2 = -(a.current.h2 / 3);
    a.current.prev = 0;

    const tick = (ts: number) => {
      const dt = a.current.prev === 0 ? 0 : Math.min((ts - a.current.prev) / 1000, 0.05);
      a.current.prev = ts;

      a.current.vel *= Math.pow(0.985, dt * 60);
      if (Math.abs(a.current.vel) < 0.3) a.current.vel = 0;

      const move = (pxPerSec + a.current.vel) * dt;
      a.current.y1 -= move;
      a.current.y2 -= move;

      const h1 = a.current.h1;
      const h2 = a.current.h2;
      if (h1 > 0) {
        if (a.current.y1 < -h1) a.current.y1 += h1;
        if (a.current.y1 > 0)   a.current.y1 -= h1;
      }
      if (h2 > 0) {
        if (a.current.y2 < -h2) a.current.y2 += h2;
        if (a.current.y2 > 0)   a.current.y2 -= h2;
      }

      s1.style.transform = `translateY(${a.current.y1}px)`;
      s2.style.transform = `translateY(${a.current.y2}px)`;
      a.current.raf = requestAnimationFrame(tick);
    };

    a.current.raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(a.current.raf); };
  }, [started, pxPerSec]);

  const onWheel = (e: React.WheelEvent) => {
    a.current.vel += e.deltaY * 0.8;
  };

  return (
    <div
      className={`flex-1 bg-[#f6f4ee] overflow-hidden flex ${mobile ? 'gap-2' : 'gap-4 px-8'}`}
      onWheel={onWheel}
    >
      <div className="flex-1 overflow-hidden">
        <div ref={strip1Ref} className={`flex flex-col will-change-transform ${mobile ? 'gap-2' : 'gap-4'}`}>
          {([0, 1] as const).map((set) => (
            <div key={set} className={`flex flex-col ${mobile ? 'gap-2' : 'gap-4'}`}>
              {col1.map((img, i) => (
                <ImageTile
                  key={`${set}-${img.slug}`}
                  slug={img.slug}
                  title={img.title}
                  src={img.src}
                  ratio={img.ratio}
                  className="rounded-[4px] w-full shrink-0"
                  show={show}
                  fadeDelay={delays[i] ?? 0}
                  onLoaded={set === 0 ? () => onImageLoaded?.(img.slug) : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div ref={strip2Ref} className={`flex flex-col will-change-transform ${mobile ? 'gap-2' : 'gap-4'}`}>
          {([0, 1] as const).map((set) => (
            <div key={set} className={`flex flex-col ${mobile ? 'gap-2' : 'gap-4'}`}>
              {col2.map((img, i) => (
                <ImageTile
                  key={`${set}-${img.slug}`}
                  slug={img.slug}
                  title={img.title}
                  src={img.src}
                  ratio={img.ratio}
                  className="rounded-[4px] w-full shrink-0"
                  show={show}
                  fadeDelay={delays[col1.length + i] ?? 0}
                  onLoaded={set === 0 ? () => onImageLoaded?.(img.slug) : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Slot-machine style text reel: on hover the current label spins out upward
// while a duplicate spins in from below. Driven by GSAP (rather than CSS
// transitions) so it matches the rest of the site's animation stack.
function SlotText({ children, hovered }: { children: string; hovered: boolean }) {
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

function ArrowRight({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroButton({
  href,
  variant,
  showArrow = false,
  children,
}: {
  href: string;
  variant: 'primary' | 'secondary';
  showArrow?: boolean;
  children: string;
}) {
  const [hovered, setHovered] = useState(false);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!arrowRef.current) return;
    gsap.to(arrowRef.current, { x: hovered ? 4 : 0, duration: 0.3, ease: 'power2.out' });
  }, [hovered]);

  const variantClass = variant === 'primary'
    ? 'bg-[#0f100e] text-[#f6f4ee]'
    : 'bg-[#f6f4ee] border border-[#c8c3b9] text-[#0f100e] transition-colors duration-300 hover:border-[#bb9a6d]';

  return (
    <Link
      href={href}
      className={`relative overflow-hidden font-medium text-[16px] tracking-[-0.32px] h-12 px-4 rounded-[4px] flex items-center gap-2 whitespace-nowrap ${variantClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <SlotText hovered={hovered}>{children}</SlotText>
      {showArrow && (
        <span ref={arrowRef} className="relative inline-flex">
          <ArrowRight />
        </span>
      )}
    </Link>
  );
}

export default function HomeClient({ col1, col2 }: { col1: TickerImage[]; col2: TickerImage[] }) {
  const totalImages = col1.length + col2.length;
  const [menuOpen, setMenuOpen] = useState(false);
  const loadedSrcs = useRef(new Set<string>());
  const triggeredRef = useRef(false);
  const [show, setShow] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [tickerStarted, setTickerStarted] = useState(false);

  // Hold the curtain closed until every tile has faded in, so the reveal
  // never uncovers a page that's still popping images in underneath it.
  useTransitionReady(tickerStarted);

  const handleImageLoaded = useCallback((src: string) => {
    loadedSrcs.current.add(src);
    if (loadedSrcs.current.size >= totalImages && !triggeredRef.current) {
      triggeredRef.current = true;
      const order = [...Array(totalImages).keys()].sort(() => Math.random() - 0.5);
      const d = new Array(totalImages).fill(0);
      order.forEach((tileIdx, rank) => { d[tileIdx] = rank * FADE_STEP_MS; });
      setDelays(d);
      setShow(true);
      setTimeout(
        () => setTickerStarted(true),
        (totalImages - 1) * FADE_STEP_MS + FADE_DURATION_MS,
      );
    }
  }, [totalImages]);

  return (
    <>
      <CustomCursor />
      <Nav onMenuClick={() => setMenuOpen(true)} />

      {/* ── Desktop (≥ 768 px) ─────────────────────────────────────────── */}
      <div className="hidden md:flex fixed inset-0 overflow-hidden">

        {/* Left hero panel */}
        <div
          className="shrink-0 flex flex-col justify-center items-end gap-14 px-8 pt-[72px] pb-8 bg-white"
          style={{ width: '46.6%' }}
        >
          <div className="flex flex-col gap-0 items-end">
            <h1
              className="font-bold leading-none text-[#0f100e] uppercase whitespace-nowrap"
              style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(56px, 7.22vw, 120px)', letterSpacing: '-0.02em', marginBottom: 'calc(16px - 0.2em)' }}
            >
              ETHER SHIP
            </h1>
            <div
              className="flex items-center font-normal"
              style={{ fontSize: 'clamp(15px, 1.67vw, 26px)', letterSpacing: '-0.02em' }}
            >
              <span className="text-[#898780]">Ideas that escaped&nbsp;</span>
              <span className="text-[#bb9a6d]">the building.</span>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <HeroButton href="/project" variant="primary" showArrow>See More Projects</HeroButton>
            <HeroButton href="/ether-art" variant="secondary" showArrow>Ether Art</HeroButton>
          </div>
        </div>

        <TickerPanel
          col1={col1}
          col2={col2}
          pxPerSec={40}
          started={tickerStarted}
          show={show}
          delays={delays}
          onImageLoaded={handleImageLoaded}
        />
      </div>

      {/* ── Mobile (< 768 px) ──────────────────────────────────────────── */}
      <div className="md:hidden fixed inset-0 overflow-hidden bg-white flex flex-col">

        <TickerPanel
          col1={col1}
          col2={col2}
          mobile
          pxPerSec={40}
          started={tickerStarted}
          show={show}
          delays={delays}
          onImageLoaded={handleImageLoaded}
        />

        {/* Hero */}
        <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-8 flex flex-col gap-6 items-center">
          <div className="flex flex-col gap-2 items-center w-full">
            <h1
              className="font-bold leading-none text-[#0f100e] uppercase text-center"
              style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '13vw', letterSpacing: '-0.02em' }}
            >
              ETHER SHIP
            </h1>
            <div className="flex flex-wrap justify-center text-[18px] tracking-[-0.36px]">
              <span className="text-[#898780]">Ideas that escaped&nbsp;</span>
              <span className="text-[#bb9a6d]">the building.</span>
            </div>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <HeroButton href="/project" variant="primary" showArrow>See More Projects</HeroButton>
            <HeroButton href="/ether-art" variant="secondary" showArrow>Ether Art</HeroButton>
          </div>
        </div>

      </div>

      {/* Menu overlay */}
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
