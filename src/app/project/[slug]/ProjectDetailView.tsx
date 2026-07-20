'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '../../Nav';
import Menu from '../../Menu';
import { urlForImage } from '@/sanity/image';

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
  images: ProjectImage[];
}

function SmallChevron({ color = '#2e2e2b' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M10 12L6 8L10 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CarouselChevron({ color, direction = 'left' }: { color: string; direction?: 'left' | 'right' }) {
  return (
    <svg
      width="6"
      height="10"
      viewBox="0 0 4.85355 8.70711"
      fill="none"
      aria-hidden
      style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined }}
    >
      <path d="M0.353553 8.35355L4.35355 4.35355L0.353553 0.353553" stroke={color} strokeLinejoin="round" />
    </svg>
  );
}

export default function ProjectDetailView({
  project,
  nextSlug,
}: {
  project: Project;
  nextSlug: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const images = project.images ?? [];
  const total = images.length;
  const current = images[index];

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <>
      <Nav onMenuClick={() => setMenuOpen(true)} />

      <div className="min-h-screen bg-white flex flex-col items-center gap-6 pt-[104px] md:pt-[120px] pb-16 md:pb-20 px-4 md:px-6">
        <div className="flex items-center justify-between w-full max-w-[1100px]">
          <Link
            href="/project"
            className="flex items-center gap-2 text-[#2e2e2b] font-medium text-[15px] md:text-[16px] tracking-[-0.48px] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}
          >
            <SmallChevron />
            Back to list
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
          <div className="flex items-center gap-3 md:gap-6 w-full max-w-[1100px] justify-center">
            <button
              onClick={goPrev}
              disabled={total <= 1}
              aria-label="Previous image"
              className="hidden sm:flex items-center justify-center rounded-full bg-white ring-1 ring-[#c8c3b9] size-8 shrink-0 disabled:opacity-30"
            >
              <CarouselChevron color="#bb9a6d" direction="left" />
            </button>

            <div
              className="relative w-full overflow-hidden rounded-[4px] bg-[#f6f4ee]"
              style={{
                aspectRatio: current.asset?.metadata?.dimensions
                  ? `${current.asset.metadata.dimensions.width} / ${current.asset.metadata.dimensions.height}`
                  : '16 / 9',
                maxHeight: '70vh',
              }}
            >
              <img
                src={urlForImage(current.asset).width(1600).url()}
                alt={current.alt || project.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <button
              onClick={goNext}
              disabled={total <= 1}
              aria-label="Next image"
              className="hidden sm:flex items-center justify-center rounded-full bg-[#bb9a6d] size-8 shrink-0 disabled:opacity-30"
            >
              <CarouselChevron color="#f6f4ee" direction="right" />
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
          <button className="font-medium text-[20px] tracking-[-0.6px] text-[#0f100e]">
            INFOS
          </button>
        </div>
      </div>

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
