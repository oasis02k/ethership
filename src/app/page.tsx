'use client';

import { useState } from 'react';
import Menu from './Menu';

const imgLogo = 'https://www.figma.com/api/mcp/asset/f551b2f1-b1cd-4bec-a9df-70254fca3479';

const col1: { src: string; ratio: string }[] = [
  { src: '/ticker/01.jpg', ratio: '2000/1125' },
  { src: '/ticker/03.jpg', ratio: '2000/1333' },
  { src: '/ticker/05.jpg', ratio: '1/1'       },
  { src: '/ticker/07.jpg', ratio: '1250/703'  },
  { src: '/ticker/09.jpg', ratio: '1160/1500' },
  { src: '/ticker/11.jpg', ratio: '1/1'       },
];

const col2: { src: string; ratio: string }[] = [
  { src: '/ticker/02.jpg', ratio: '1185/2000' },
  { src: '/ticker/04.jpg', ratio: '2000/1106' },
  { src: '/ticker/06.jpg', ratio: '2000/751'  },
  { src: '/ticker/08.jpg', ratio: '1500/708'  },
  { src: '/ticker/10.jpg', ratio: '2000/1556' },
  { src: '/ticker/12.jpg', ratio: '2000/1125' },
];

function ImageTile({ src, ratio, className = '' }: { src: string; ratio: string; className?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio.replace('/', ' / ') }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={src} className="w-full h-full object-cover" alt="" />
      <div
        className="absolute inset-0 bg-black/25 transition-opacity duration-300 pointer-events-none"
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
        Project Name
      </p>
    </div>
  );
}

function TickerPanel({ baseDur }: { baseDur: number }) {
  return (
    <div className="flex-1 bg-[#f6f4ee] overflow-hidden flex gap-4 px-8 pt-4">
      {/* Col 1 */}
      <div className="flex-1 overflow-hidden">
        <div
          className="flex flex-col gap-4 will-change-transform ticker-down"
          style={{ '--ticker-dur': `${baseDur}s` } as React.CSSProperties}
        >
          {([0, 1] as const).map((set) => (
            <div key={set} className="flex flex-col gap-4">
              {col1.map((img) => (
                <ImageTile key={`${set}-${img.src}`} src={img.src} ratio={img.ratio}
                  className="rounded-[4px] w-full shrink-0" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Col 2 */}
      <div className="flex-1 overflow-hidden">
        <div
          className="flex flex-col gap-4 will-change-transform ticker-down"
          style={{ '--ticker-dur': `${baseDur}s`, animationDelay: '-30s' } as React.CSSProperties}
        >
          {([0, 1] as const).map((set) => (
            <div key={set} className="flex flex-col gap-4">
              {col2.map((img) => (
                <ImageTile key={`${set}-${img.src}`} src={img.src} ratio={img.ratio}
                  className="rounded-[4px] w-full shrink-0" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Nav */}
      <nav className="fixed top-4 left-6 right-6 h-14 bg-[#2e2e2b] rounded-[4px] flex items-center px-6 z-20">
        <div className="flex flex-1 items-center justify-between">
          <div className="relative shrink-0" style={{ height: '15.984px', width: '167.537px' }}>
            <img alt="Ether Ship" className="absolute inset-0 h-full w-full object-contain object-left" src={imgLogo} />
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            className="font-medium text-[#f6f4ee] text-[18px] tracking-[-0.36px] whitespace-nowrap"
          >
            MENU
          </button>
        </div>
      </nav>

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
            <button className="bg-[#0f100e] text-[#f6f4ee] font-medium text-[16px] tracking-[-0.32px] h-12 px-4 rounded-[4px] whitespace-nowrap">
              See More Projects
            </button>
            <button className="bg-[#f6f4ee] border border-[#c8c3b9] text-[#0f100e] font-medium text-[16px] tracking-[-0.32px] h-12 px-4 rounded-[4px] flex items-center gap-2 whitespace-nowrap">
              Ether Art
              <ArrowRight color="#0f100e" />
            </button>
          </div>
        </div>

        <TickerPanel baseDur={90} />
      </div>

      {/* ── Mobile (< 768 px) ──────────────────────────────────────────── */}
      <div className="md:hidden min-h-screen bg-white">

        {/* Hero */}
        <div className="pt-24 pb-10 px-6 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h1
              className="font-bold leading-none text-[#0f100e] uppercase"
              style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '13vw', letterSpacing: '-0.02em' }}
            >
              ETHER SHIP
            </h1>
            <div className="flex flex-wrap text-[18px] tracking-[-0.02em]">
              <span className="text-[#898780]">Ideas that escaped&nbsp;</span>
              <span className="text-[#bb9a6d]">the building.</span>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button className="bg-[#0f100e] text-[#f6f4ee] font-medium text-[15px] tracking-[-0.3px] h-11 px-4 rounded-[4px] whitespace-nowrap">
              See More Projects
            </button>
            <button className="bg-[#f6f4ee] border border-[#c8c3b9] text-[#0f100e] font-medium text-[15px] tracking-[-0.3px] h-11 px-4 rounded-[4px] flex items-center gap-2 whitespace-nowrap">
              Ether Art
              <ArrowRight color="#0f100e" />
            </button>
          </div>
        </div>

        {/* Image grid */}
        <div className="bg-[#f6f4ee] px-4 pt-4 pb-12">
          <div className="flex gap-2.5">
            <div className="flex-1 flex flex-col gap-2.5">
              {col1.map((img) => (
                <ImageTile key={img.src} src={img.src} ratio={img.ratio} className="rounded-[4px] card-inner w-full" />
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-2.5 mt-10">
              {col2.map((img) => (
                <ImageTile key={img.src} src={img.src} ratio={img.ratio} className="rounded-[4px] card-inner w-full" />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Menu overlay */}
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
