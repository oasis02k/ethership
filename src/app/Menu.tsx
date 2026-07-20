'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';

const imgLogo     = '/logo.svg';
const imgArtPhoto = '/menu-image.jpg';

const NAV_ITEMS    = ['HOME', 'ABOUT', 'PROJECT', 'ETHER ART', 'PRESS'];
const FOOTER_LINKS = ['ABOUT', 'PROJECT', 'ETHER ART', 'PRESS'];

// Only items with a real destination navigate — the rest stay inert placeholders.
const ROUTES: Partial<Record<string, string>> = {
  HOME: '/',
  PROJECT: '/project',
};

function NavLink({
  label, className, style, onNavigate,
}: {
  label: string;
  className: string;
  style?: CSSProperties;
  onNavigate: () => void;
}) {
  const href = ROUTES[label];
  if (!href) {
    return <p className={className} style={style}>{label}</p>;
  }
  return (
    <Link href={href} onClick={onNavigate} className={className} style={style}>
      {label}
    </Link>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6L6 18M6 6L18 18" stroke="#f6f4ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  const [time, setTime] = useState('');

  // Live Seoul time
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: 'Asia/Seoul',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Staggered inline style per item — delay only on open so close is instant
  const stagger = (i: number) => ({
    opacity:          isOpen ? 1 : 0,
    transform:        isOpen ? 'translateY(0)' : 'translateY(18px)',
    transition:       'opacity 0.5s ease, transform 0.5s ease',
    transitionDelay:  isOpen ? `${0.18 + i * 0.07}s` : '0s',
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2e2e2b] flex flex-col select-none"
      style={{
        opacity:       isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition:    'opacity 0.35s ease',
      }}
    >
      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-5 right-5 md:left-6 md:right-6 h-14 flex items-center justify-between px-5 md:px-6 z-10">
        <div className="relative shrink-0" style={{ height: '15.984px', width: '167.537px' }}>
          <img alt="Ether Ship" className="absolute inset-0 h-full w-full object-contain object-left" src={imgLogo} />
        </div>
        <button
          onClick={onClose}
          className="hidden md:block font-medium text-[#f6f4ee] text-[18px] tracking-[-0.36px] whitespace-nowrap"
        >
          CLOSE
        </button>
        <button onClick={onClose} aria-label="Close menu" className="md:hidden relative shrink-0 size-[24px]">
          <CloseIcon />
        </button>
      </div>

      {/* ── Desktop (≥ 768 px) ──────────────────────────────────────── */}
      <div className="hidden md:flex flex-1 items-center overflow-hidden">

        {/* Left: decorative art photo */}
        <div className="flex items-center justify-center h-full pl-12" style={{ width: '52%' }}>
          <div
            className="rounded-[4px] overflow-hidden aspect-square"
            style={{
              width:          'min(48vw, 691px)',
              maxHeight:      'calc(100vh - 140px)',
              opacity:        isOpen ? 1 : 0,
              transform:      isOpen ? 'scale(1)' : 'scale(0.96)',
              transition:     'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0.05s',
            }}
          >
            <img alt="" src={imgArtPhoto} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right: nav + contact */}
        <div className="flex flex-col gap-12 pr-16" style={{ width: '48%' }}>

          {/* Nav items */}
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-medium text-[rgba(246,244,238,0.56)] tracking-[-0.02em] mb-3">
              MENU
            </p>
            {NAV_ITEMS.map((item, i) => (
              <NavLink
                key={item}
                label={item}
                onNavigate={onClose}
                className="font-bold text-[#f6f4ee] text-[48px] leading-tight tracking-[-0.02em] cursor-pointer hover:text-[#bb9a6d] transition-colors duration-200"
                style={stagger(i)}
              />
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6" style={stagger(NAV_ITEMS.length)}>
            <div className="flex flex-col gap-2">
              <p className="text-[14px] font-medium text-[rgba(246,244,238,0.56)] tracking-[-0.02em]">
                CONTACT
              </p>
              <p className="font-bold text-[#f6f4ee] text-[40px] tracking-[-0.02em] underline leading-tight cursor-pointer hover:text-[#bb9a6d] transition-colors duration-200">
                hello@ether-ship.com
              </p>
            </div>
            <div className="flex items-center gap-2 text-[14px] font-bold tracking-[-0.02em]">
              <span className="text-[#f6f4ee]">South Korea</span>
              <span className="text-[#bb9a6d]">{time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop footer */}
      <div className="hidden md:flex absolute bottom-0 left-0 right-0 items-center justify-between px-6 py-6 border-t border-[rgba(246,244,238,0.12)]">
        <div className="flex gap-14">
          {FOOTER_LINKS.map((link, i) => (
            <NavLink
              key={link}
              label={link}
              onNavigate={onClose}
              className="text-[#f6f4ee] text-[14px] font-medium tracking-[-0.02em] uppercase cursor-pointer hover:text-[#bb9a6d] transition-colors duration-200"
              style={stagger(i)}
            />
          ))}
        </div>
        <p className="text-white text-[14px] tracking-[-0.02em]">
          @ Ether Ship 2026. All rights reserved
        </p>
      </div>

      {/* ── Mobile (< 768 px) ───────────────────────────────────────── */}
      <div className="md:hidden flex flex-col justify-between flex-1 pt-[120px]">

        {/* Content */}
        <div className="px-10 flex flex-col gap-12">

          {/* Nav items */}
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-medium text-[rgba(246,244,238,0.56)] tracking-[-0.02em] mb-3">
              MENU
            </p>
            {NAV_ITEMS.map((item, i) => (
              <NavLink
                key={item}
                label={item}
                onNavigate={onClose}
                className="font-bold text-[#f6f4ee] text-[24px] leading-snug tracking-[-0.02em] cursor-pointer hover:text-[#bb9a6d] transition-colors duration-200"
                style={stagger(i)}
              />
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6" style={stagger(NAV_ITEMS.length)}>
            <div className="flex flex-col gap-2">
              <p className="text-[14px] font-medium text-[rgba(246,244,238,0.56)] tracking-[-0.02em]">
                CONTACT
              </p>
              <p className="font-bold text-[#f6f4ee] text-[24px] tracking-[-0.02em]">
                hello@ether-ship.com
              </p>
            </div>
            <div className="flex items-center gap-2 text-[14px] font-bold tracking-[-0.02em]">
              <span className="text-[#f6f4ee]">South Korea</span>
              <span className="text-[#bb9a6d]">{time}</span>
            </div>
          </div>
        </div>

        {/* Mobile footer */}
        <div>
          <div className="px-10 py-5 flex flex-col gap-4 text-white text-[14px] uppercase tracking-[-0.02em]">
            <div className="flex gap-4">
              <span className="flex-1 cursor-pointer">ABOUT</span>
              <NavLink label="PROJECT" onNavigate={onClose} className="flex-1 cursor-pointer" />
            </div>
            <div className="flex gap-4">
              <span className="flex-1 cursor-pointer">ETHER ART</span>
              <span className="flex-1 cursor-pointer">PRESS</span>
            </div>
          </div>
          <div className="border-t border-[rgba(246,244,238,0.12)] h-12 flex items-center px-5">
            <p className="text-white text-[14px] tracking-[-0.02em]">
              @ Ether Ship 2026. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
