'use client';

import { useState } from 'react';
import Menu from '../Menu';
import Nav from '../Nav';
import YearRow from '../YearRow';
import FooterLink from '../FooterLink';

interface Row {
  label: string;
  value: string;
}

const EDUCATION: Row[] = [
  { label: 'Harvard University GSD', value: 'M.Arch' },
  { label: 'Korea University', value: 'B.Arch' },
];

const EXPERIENCE: Row[] = [
  { label: 'Herzog & de Meuron, Basel', value: '2006' },
  { label: 'Machado & Silvetti, Boston', value: '2008~2011' },
  { label: 'Ether Ship, New York', value: '2011~Present' },
];

interface Award {
  year: string;
  title: string;
  description: string;
}

const AWARDS: Award[] = [
  { year: '2012', title: 'Second Place', description: 'Verona, Italy' },
  { year: '2011', title: 'Finalist', description: 'Malmi Station International Competition · Finland' },
  { year: '2009', title: 'Young Architects Award', description: 'Architecture League of New York' },
  { year: '2007', title: 'Merit Award - Unbuilt Architecture', description: 'Boston Society of Architects · American Institute of Architects' },
  { year: '2006', title: 'Next Generation Design Leader', description: 'Korea Government' },
  { year: '2006', title: 'Grand Prize - Celebration of Cities 2', description: 'Union of International Architects (UIA) & UNESCO' },
  { year: '2004', title: 'Second Prize', description: 'Central Glass International Competition · Tokyo, Japan' },
  { year: '2003', title: 'Grand Prize', description: 'Busan International Competition · Busan, Korea' },
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

function InfoRow({ label, value }: Row) {
  return (
    <div className="flex items-end justify-between gap-4 py-4 border-b border-[rgba(15,16,14,0.24)] w-full">
      <p className="flex-1 min-w-0 font-medium text-[#0f100e] text-[18px] tracking-[-0.36px]">{label}</p>
      <p
        className="shrink-0 text-[14px] tracking-[-0.28px] text-[rgba(15,16,14,0.56)] text-right"
        style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
      >
        {value}
      </p>
    </div>
  );
}

export default function AboutClient() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f4ee]">
      <Nav onMenuClick={() => setMenuOpen(true)} />

      <main className="flex flex-col items-center gap-16 md:gap-24 pt-[104px] md:pt-[128px] pb-16 md:pb-[88px] px-4 md:px-6">
        <div className="flex flex-col items-start gap-16 md:gap-24 w-full max-w-[1440px] mx-auto">
          {/* Bio */}
          <div className="flex flex-col md:flex-row gap-[48px] items-start w-full text-[#0f100e]">
            <p
              className="font-bold leading-none w-full md:flex-1 md:whitespace-nowrap"
              style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(40px, 7vw, 114px)', letterSpacing: '-0.02em' }}
            >
              Sung Goo Yang
            </p>
            <div className="flex flex-col gap-4 text-[18px] tracking-[-0.36px] leading-[1.5] font-medium w-full md:flex-1">
              <p>
                Sung Goo Yang is an architect whose work moves between urban scale and the intimate from city
                plans to fashion runways, from competition-winning buildings to abstract digital works. His
                practice, Ether Ship, is based in New York.
              </p>
              <p>
                Trained at Korea University and Harvard University GSD, he has worked at Herzog & de Meuron in
                Basel and Machado and Silvetti Associates in Boston. He is a founding member of A-Gene-Da Group, a
                collective of seven architects who hold annual exhibitions.
              </p>
              <p>
                His teaching spans NYIT, Parsons, RISD, Columbia University, Cooper Union, and beyond where he
                brings the same question he asks in practice: what can architecture become before it becomes a
                building?
              </p>
            </div>
          </div>

          {/* Education / experience */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start w-full">
            <div className="flex flex-col gap-2 items-start w-full md:flex-1">
              <p
                className="text-[14px] tracking-[-0.28px] text-[rgba(15,16,14,0.56)] w-full"
                style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
              >
                EDUCATION
              </p>
              <div className="flex flex-col items-start w-full">
                {EDUCATION.map((row) => (
                  <InfoRow key={row.label} {...row} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 items-start w-full md:flex-1">
              <p
                className="text-[14px] tracking-[-0.28px] text-[rgba(15,16,14,0.56)] w-full"
                style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
              >
                EXPERIENCE
              </p>
              <div className="flex flex-col items-start w-full">
                {EXPERIENCE.map((row) => (
                  <InfoRow key={row.label} {...row} />
                ))}
              </div>
            </div>
          </div>

          {/* Awards */}
          <div className="flex flex-col gap-2 items-start w-full">
            <p
              className="text-[14px] tracking-[-0.28px] text-[rgba(15,16,14,0.56)]"
              style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
            >
              AWARDS &amp; RECOGNITION
            </p>
            <div className="flex flex-col items-start w-full">
              {AWARDS.map((award, i) => (
                <YearRow key={i} {...award} />
              ))}
            </div>
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
