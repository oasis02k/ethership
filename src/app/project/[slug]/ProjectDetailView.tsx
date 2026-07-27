'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PortableText, type PortableTextBlock } from 'next-sanity';
import gsap from 'gsap';
import Nav from '../../Nav';
import Menu from '../../Menu';
import FooterLink from '../../FooterLink';
import { urlForImage } from '@/sanity/image';
import { getLenis } from '../../SmoothScroll';

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

interface ProjectImage {
  _key: string;
  alt?: string;
  asset?: {
    _id: string;
    url: string;
    metadata?: { dimensions?: { width: number; height: number } };
  };
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  year: number;
  type: 'building' | 'object' | 'ether-art';
  location?: string;
  result?: string;
  description?: PortableTextBlock[];
  siteArea?: string;
  spaceArea?: string;
  totalArea?: string;
  buildingCoverage?: string;
  far?: string;
  program?: string;
  team?: string;
  images: ProjectImage[];
}

function SmallChevron({ color = '#2e2e2b' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M10 12L6 8L10 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CarouselChevron({ direction = 'left' }: { direction?: 'left' | 'right' }) {
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 4.85355 8.70711"
      fill="none"
      aria-hidden
      style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined }}
    >
      <path d="M0.353553 8.35355L4.35355 4.35355L0.353553 0.353553" stroke="currentColor" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProjectDetailView({
  project,
  prevSlug,
  nextSlug,
}: {
  project: Project;
  prevSlug: string;
  nextSlug: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showInfos, setShowInfos] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  // Stagger the panel's content in and scroll it into view when opened — it
  // opens below the INFOS button, which can end up below the fold on
  // shorter viewports.
  // useLayoutEffect (not useEffect) so the hidden starting state is set
  // before the browser paints — otherwise the content flashes fully visible
  // for a frame first, then GSAP's "from" state snaps it back to invisible,
  // which reads as a glitch/flash rather than a fade.
  useLayoutEffect(() => {
    if (!showInfos) return;

    const el = infoRef.current;
    if (!el) return;

    const items = el.querySelectorAll('.info-stagger-item');
    gsap.fromTo(
      items,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
    );

    const lenis = getLenis();
    if (lenis) {
      // The panel just mounted and made the page taller; Lenis's cached
      // scroll limit (from a ResizeObserver) hasn't caught up to that yet,
      // so scrollTo would clamp against the old, shorter height. Force it
      // to recompute synchronously first.
      lenis.resize();
      lenis.scrollTo(el, { offset: -24, duration: 1 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showInfos]);

  // Closing needs to scroll BEFORE the panel unmounts, not after: if we
  // collapse the panel first, the page instantly shrinks and the browser
  // immediately clamps scrollY to fit — Lenis's smooth scrollTo would then
  // be animating from 0 to 0 (nothing left to travel), which is why it read
  // as an instant jump instead of a smooth scroll. So scroll first, while
  // the tall content is still there to scroll away from, and only collapse
  // once that finishes.
  //
  // Scroll to the literal page top (0), not to the button's element
  // position: the button's target position is only valid while the tall
  // panel still exists below it. The instant it unmounts, the document
  // collapses and that target no longer exists in the new, much shorter
  // page — so the browser clamps scrollY down anyway, producing a second,
  // jarring jump right as the smooth part finishes.
  const closeInfos = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1, onComplete: () => setShowInfos(false) });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setShowInfos(false), 600);
    }
  };

  const images = project.images ?? [];
  const total = images.length;
  const current = images[index];

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD_PX = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || total <= 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX > SWIPE_THRESHOLD_PX) goPrev();
    else if (deltaX < -SWIPE_THRESHOLD_PX) goNext();
  };

  const specRows: { label: string; value: string }[] = [
    { label: 'Site Area', value: project.siteArea },
    { label: 'Space Area', value: project.spaceArea },
    { label: 'Total Area', value: project.totalArea },
    { label: 'Building Coverage', value: project.buildingCoverage },
    { label: 'FAR', value: project.far },
    { label: 'Program', value: project.program },
    { label: 'Site', value: project.location },
    { label: 'Result', value: project.result },
    { label: 'Team', value: project.team },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  const hasInfos = (project.description?.length ?? 0) > 0 || specRows.length > 0;

  return (
    <>
      <Nav onMenuClick={() => setMenuOpen(true)} />

      <div className="min-h-screen bg-white flex flex-col items-center gap-6 pt-[104px] md:pt-[120px] pb-16 md:pb-20 px-4 md:px-6">
        <div className="flex items-center justify-between w-full max-w-[1024px]">
          <Link
            href={`/project/${prevSlug}`}
            className="flex items-center gap-2 text-[#2e2e2b] font-medium text-[15px] md:text-[16px] tracking-[-0.48px] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}
          >
            <SmallChevron />
            Prev Project
          </Link>
          <Link
            href={`/project/${nextSlug}`}
            className="flex items-center gap-2 text-[#2e2e2b] font-medium text-[15px] md:text-[16px] tracking-[-0.48px] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}
          >
            Next Project
            <span className="rotate-180 flex">
              <SmallChevron />
            </span>
          </Link>
        </div>

        {current?.asset && (
          <div className="flex items-center gap-3 md:gap-6 w-full max-w-[1200px] justify-center">
            <button
              onClick={goPrev}
              disabled={total <= 1}
              aria-label="Previous image"
              className="hidden md:flex items-center justify-center rounded-full bg-white ring-1 ring-[#c8c3b9] text-[#bb9a6d] hover:bg-[#bb9a6d] hover:text-white hover:ring-0 transition-colors size-12 shrink-0 disabled:opacity-30"
            >
              <CarouselChevron direction="left" />
            </button>

            <div
              className="relative w-full overflow-hidden rounded-[4px] bg-white h-[250px] sm:h-[576px]"
              style={{ maxWidth: '1024px', touchAction: 'pan-y' }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <img
                key={current._key}
                src={urlForImage(current.asset).width(1600).url()}
                alt={current.alt || project.title}
                className="absolute inset-0 w-full h-full object-contain carousel-image"
              />
            </div>

            <button
              onClick={goNext}
              disabled={total <= 1}
              aria-label="Next image"
              className="hidden md:flex items-center justify-center rounded-full bg-white ring-1 ring-[#c8c3b9] text-[#bb9a6d] hover:bg-[#bb9a6d] hover:text-white hover:ring-0 transition-colors size-12 shrink-0 disabled:opacity-30"
            >
              <CarouselChevron direction="right" />
            </button>
          </div>
        )}

        <div className="flex flex-col items-center gap-8 md:gap-10">
          <div className="flex flex-col items-center gap-1">
            {total > 0 && (
              <p
                className="text-[14px] tracking-[-0.28px] text-[#0f100e]"
                style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}
              >
                {index + 1} of {total}
              </p>
            )}
            <h1
              className="italic font-semibold text-[#0f100e] text-[36px] md:text-[56px] tracking-[-1.68px] text-center"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              {project.title} {project.year}
            </h1>
          </div>
          {hasInfos && (
            <button
              onClick={() => (showInfos ? closeInfos() : setShowInfos(true))}
              className="flex items-center gap-1.5 font-medium text-[20px] tracking-[-0.6px] text-[#0f100e] hover:text-[#bb9a6d] transition-colors cursor-pointer"
            >
              {showInfos ? 'CLOSE' : 'INFOS'}
              <span
                className="flex transition-transform duration-200"
                style={{ transform: showInfos ? 'rotate(180deg)' : undefined }}
              >
                <ChevronDown />
              </span>
            </button>
          )}
        </div>

        {hasInfos && showInfos && (
          <div ref={infoRef} className="flex flex-col items-start gap-6 w-full max-w-[1024px]">
            {project.description && project.description.length > 0 && (
              <div
                className="info-stagger-item columns-1 sm:columns-2 gap-6 text-[#0f100e] text-[14px] tracking-[-0.42px] leading-[1.5]"
                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
              >
                <PortableText
                  value={project.description}
                  components={{
                    block: {
                      normal: ({ children }) => <p className="break-inside-avoid mb-4 last:mb-0">{children}</p>,
                    },
                  }}
                />
              </div>
            )}

            {specRows.length > 0 && (
              <div className="w-full border-b border-[rgba(15,16,14,0.12)]">
                {specRows.map(({ label, value }) => (
                  <div key={label} className="info-stagger-item flex items-start border-t border-[rgba(15,16,14,0.12)]">
                    <p
                      className="flex-1 p-4 uppercase text-[14px] tracking-[-0.42px] text-[#0f100e]"
                      style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}
                    >
                      {label}
                    </p>
                    <p
                      className="flex-1 p-4 uppercase text-[14px] tracking-[-0.42px] text-[#0f100e]"
                      style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-[rgba(15,16,14,0.24)] flex flex-wrap gap-4 items-center justify-between p-6 w-full">
        <div className="flex gap-6 md:gap-14 items-center flex-wrap">
          {FOOTER_LINKS.map((link) => (
            <FooterLink key={link.label} label={link.label} href={link.href} />
          ))}
        </div>
        <p className="text-[14px] tracking-[-0.28px] text-[#0f100e]">@ Ether Ship 2026. All rights reserved</p>
      </footer>

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
