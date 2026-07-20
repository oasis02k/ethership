'use client';

import Link from 'next/link';

const imgLogo = '/logo.svg';

export default function Nav({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <nav className="fixed top-4 left-5 right-5 md:left-6 md:right-6 h-14 bg-[#2e2e2b] rounded-[4px] flex items-center px-6 z-20">
      <div className="flex flex-1 items-center justify-between">
        <Link href="/" className="relative shrink-0" style={{ height: '15.984px', width: '167.537px' }}>
          <img alt="Ether Ship" className="absolute inset-0 h-full w-full object-contain object-left" src={imgLogo} />
        </Link>
        <button onClick={onMenuClick} className="hidden md:block font-medium text-[#f6f4ee] text-[18px] tracking-[-0.36px] whitespace-nowrap">
          MENU
        </button>
        <button onClick={onMenuClick} className="md:hidden relative shrink-0 size-[24px]">
          <img alt="Menu" className="absolute inset-0 h-full w-full" src="/menu-icon.svg" />
        </button>
      </div>
    </nav>
  );
}
