'use client';

import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* Sibling overlay, not a wrapper — an ancestor transform would break
          this site's position:fixed page layouts (see globals.css note). */}
      <div key={pathname} className="page-curtain" aria-hidden="true" />
      {children}
    </>
  );
}
