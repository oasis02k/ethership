'use client';

import { useState } from 'react';
import Link from 'next/link';
import SlotText from './SlotText';

export default function FooterLink({ label, href }: { label: string; href?: string }) {
  const [hovered, setHovered] = useState(false);
  const className = 'text-[14px] font-medium tracking-[-0.28px] uppercase text-[#0f100e] hover:text-[#bb9a6d] transition-colors duration-200';

  if (!href) {
    return <span className="text-[14px] font-medium tracking-[-0.28px] uppercase text-[#0f100e]">{label}</span>;
  }

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <SlotText hovered={hovered}>{label}</SlotText>
    </Link>
  );
}
