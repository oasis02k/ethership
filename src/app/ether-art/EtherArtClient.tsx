'use client';

import { useState } from 'react';
import Menu from '../Menu';
import Nav from '../Nav';
import YearRow from '../YearRow';
import FooterLink from '../FooterLink';

interface CollageImage {
  src: string;
  ratio: string;
}

interface CollageColumn {
  flex: number;
  images: CollageImage[];
}

// Proportions (flex weights and image aspect ratios) taken directly from the
// Figma frame (1440x531) so the mosaic — including the bottom-cropped tiles —
// reproduces at any width instead of being pinned to absolute pixel coords.
const COLLAGE_COLUMNS: CollageColumn[] = [
  {
    flex: 313.756,
    images: [{ src: '/ether-art/lightcloud-03.jpg', ratio: '313.756/571.785' }],
  },
  {
    flex: 281.444,
    images: [
      { src: '/ether-art/alley-commonwealth-beacon.jpg', ratio: '281.444/398.049' },
      { src: '/ether-art/we-are-all-connected.jpg', ratio: '1/1' },
    ],
  },
  {
    flex: 313.756,
    images: [
      { src: '/ether-art/asia-front-village.jpg', ratio: '313.756/439.259' },
      { src: '/ether-art/websky.jpg', ratio: '1/1' },
    ],
  },
  {
    flex: 265.522,
    images: [
      { src: '/ether-art/superpattern-08.jpg', ratio: '1/1' },
      { src: '/ether-art/lightcloud-01.jpg', ratio: '1/2' },
    ],
  },
  {
    flex: 265.522,
    images: [
      { src: '/ether-art/07-o.jpg', ratio: '1/1' },
      { src: '/ether-art/4-axis-wind.jpg', ratio: '1/1' },
    ],
  },
];

const MOBILE_COLLAGE_IMAGES = COLLAGE_COLUMNS.flatMap((col) => col.images.map((img) => img.src));

interface Exhibition {
  year: string;
  title: string;
  location: string;
}

const EXHIBITIONS: Exhibition[] = [
  { year: 'ongoing', title: 'A-Gene-Da Group - Annual Exhibition', location: 'New York' },
  { year: '2008', title: 'Art / Design / Technology', location: 'MIT Museum, Cambridge' },
  { year: '2006', title: 'Architect Utopia in the Digital Age', location: "Architects' Institute of Avellino, Italy" },
  { year: '2006', title: 'Venice Biennale', location: 'Venice, Italy' },
];

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

export default function EtherArtClient() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f4ee]">
      <Nav onMenuClick={() => setMenuOpen(true)} />

      <main className="flex flex-col items-center gap-16 md:gap-24 pt-[88px] pb-16 md:pb-[88px]">
        {/* Hero collage — full-bleed, deliberately outside the content padding below */}
        <div className="hidden md:flex w-full aspect-[1440/531] overflow-hidden shrink-0">
          {COLLAGE_COLUMNS.map((col, i) => (
            <div key={i} className="flex flex-col" style={{ flex: `${col.flex} 0 0` }}>
              {col.images.map((img, j) => (
                <img
                  key={j}
                  src={img.src}
                  alt=""
                  className="w-full object-cover"
                  style={{ aspectRatio: img.ratio }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Hero collage — mobile grid */}
        <div className="md:hidden grid grid-cols-3 gap-1 w-full shrink-0">
          {MOBILE_COLLAGE_IMAGES.map((src) => (
            <img key={src} src={src} alt="" className="w-full aspect-square object-cover" />
          ))}
        </div>

        <div className="flex flex-col items-center gap-16 md:gap-24 w-full max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-8 items-start w-full">
            <p
              className="font-bold text-[#0f100e] w-full"
              style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
            >
              Every architectural project begins with an idea
              <br />
              that <span className="text-[rgba(15,16,14,0.4)]">reality cannot fully contain.</span>
              <br />
              <span className="text-[#bb9a6d]">Ether Art</span> is what survives that collision.
            </p>

            <p className="text-[18px] tracking-[-0.36px] leading-[1.5] text-[#0f100e] font-medium">
              Architecture is a paradox: its most vital work happens before construction begins. The early
              investigations - the speculative geometries,
              <br />
              the spatial intuitions, the ideas that push against the
              limits of what can be built - rarely survive the transition into physical form. Budget,
              <br />
              gravity, regulation. Each one a filter.
            </p>

            <div className="relative rounded-[4px] p-6 flex items-center justify-center overflow-hidden w-full">
              <div className="absolute inset-0 bg-[#c8c3b9]" />
              <div
                className="absolute inset-0 opacity-[0.16]"
                style={{ backgroundImage: 'url(/ether-art/quote-texture.png)', backgroundSize: '32px 32px' }}
              />
              <p
                className="relative font-bold italic text-[#0f100e] text-left w-full"
                style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '24px', letterSpacing: '0.96px', lineHeight: 1.5 }}
              >
                &ldquo;What is lost in that translation is not a failure of architecture - it is architecture&rsquo;s
                most honest material.&rdquo;
              </p>
            </div>

            <p className="text-[18px] tracking-[-0.36px] leading-[1.5] text-[#0f100e] font-medium">
              Ether Art reclaims that material. Freed from the obligations of the buildable, these works develop
              their own logic - part drawing,
              <br />
              part sculpture, part proposition. They are not illustrations of
              architecture. They are investigations that architecture made possible,
              <br />
              then could not contain.
            </p>

            <p className="text-[18px] tracking-[-0.36px] leading-[1.5] text-[#0f100e] font-medium">
              The Ether Ship carries them between the conceptual and the constructed, between what was imagined and
              what was made.
              <br />
              Each Ether Art work also seeds the next architectural project. The vessel moves in both
              directions.
            </p>
          </div>

          <div className="flex flex-col gap-2 items-start w-full">
            <p
              className="text-[14px] tracking-[-0.28px] text-[rgba(15,16,14,0.56)]"
              style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
            >
              EXHIBITION HISTORY
            </p>
            <div className="flex flex-col items-start w-full">
              {EXHIBITIONS.map((ex, i) => (
                <YearRow key={i} year={ex.year} title={ex.title} description={ex.location} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[rgba(15,16,14,0.24)] flex flex-wrap gap-4 items-center justify-between p-6 w-full">
        <div className="flex gap-6 md:gap-14 items-center flex-wrap">
          {FOOTER_LINKS.map((link) => (
            <FooterLink key={link.label} label={link.label} href={link.href} />
          ))}
        </div>
        <p className="text-[14px] tracking-[-0.28px] text-[#0f100e]">@ Ether Ship 2026. All rights reserved</p>
      </footer>

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
