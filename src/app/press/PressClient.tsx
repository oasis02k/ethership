'use client';

import { useState } from 'react';
import Menu from '../Menu';
import Nav from '../Nav';
import type { NewsItem } from '@/sanity/types';
import FooterLink from '../FooterLink';

function formatDate(date: string) {
  const [year, month] = date.split('-');
  return `${year} ${month}`;
}

interface FooterLinkData {
  label: string;
  href?: string;
}

const FOOTER_LINKS: FooterLinkData[] = [
  { label: 'ABOUT', href: '/about' },
  { label: 'PROJECT', href: '/project' },
  { label: 'ETHER ART', href: '/ether-art' },
  { label: 'NEWS', href: '/press' },
];

function SortArrowIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 9.5 5.5" fill="none" aria-hidden>
      <path d="M8.75 4.75L4.75 0.75L0.75 4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PressRow({ date, title, location, link }: NewsItem) {
  const titleEl = link ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 min-w-0 font-medium text-[#0f100e] hover:text-[#bb9a6d] transition-colors duration-200 hover:underline"
    >
      {title}
    </a>
  ) : (
    <p className="flex-1 min-w-0 font-medium text-[#0f100e]">{title}</p>
  );

  return (
    <div className="flex flex-col md:flex-row gap-1 md:gap-4 md:items-center py-4 md:h-[96px] border-b border-[rgba(15,16,14,0.24)] w-full text-[18px] tracking-[-0.36px] leading-[1.5]">
      <p className="font-bold text-[#bb9a6d] md:w-[70px] shrink-0">{formatDate(date)}</p>
      <div className="flex flex-col md:flex-row md:flex-1 md:items-center gap-1 md:gap-6 min-w-0">
        {titleEl}
        <p className="md:w-[160px] shrink-0 font-normal text-[rgba(15,16,14,0.56)]">{location}</p>
      </div>
    </div>
  );
}

export default function PressClient({ items }: { items: NewsItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateAscending, setDateAscending] = useState(false);

  const sortedItems = [...items].sort((a, b) =>
    dateAscending ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f4ee]">
      <Nav onMenuClick={() => setMenuOpen(true)} />

      <main className="flex-1 flex flex-col items-center pt-[104px] md:pt-[128px] pb-16 md:pb-[88px] px-4 md:px-6">
        <div className="flex flex-col gap-6 items-start w-full max-w-[1440px] mx-auto">
          <p
            className="font-bold leading-none text-[#0f100e]"
            style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(40px, 7vw, 114px)', letterSpacing: '-0.02em' }}
          >
            News
          </p>

          <div className="flex flex-col items-start w-full">
            <div
              className="hidden md:flex gap-4 items-center h-8 border-b border-[rgba(15,16,14,0.24)] w-full text-[14px] tracking-[-0.28px] text-[#0f100e]"
              style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
            >
              <button
                type="button"
                onClick={() => setDateAscending((v) => !v)}
                className="flex gap-2 items-center w-[70px] shrink-0 cursor-pointer hover:text-[#bb9a6d] transition-colors duration-200"
                aria-label={`Sort by year, currently ${dateAscending ? 'ascending' : 'descending'}`}
              >
                <p>YEAR</p>
                <span className={dateAscending ? 'rotate-180' : ''}>
                  <SortArrowIcon />
                </span>
              </button>
              <div className="flex flex-1 items-center gap-6">
                <p className="flex-1">TITLE</p>
                <p className="w-[160px] shrink-0">LOCATION</p>
              </div>
            </div>

            {sortedItems.map((item) => (
              <PressRow key={item._id} {...item} />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-[rgba(15,16,14,0.24)] flex flex-col md:flex-row gap-4 items-center md:justify-between p-6 w-full">
        <div className="flex justify-between md:justify-start w-full md:w-auto gap-4 md:gap-14 items-center">
          {FOOTER_LINKS.map((link) => (
            <FooterLink key={link.label} label={link.label} href={link.href} />
          ))}
        </div>
        <p className="text-[14px] tracking-[-0.28px] text-[#0f100e] text-center md:text-left w-full md:w-auto">@ Ether Ship 2026. All rights reserved</p>
      </footer>

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
