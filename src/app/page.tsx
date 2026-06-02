'use client';

import { useEffect, useRef } from 'react';

const FIGMA_BASE = 1440;
const v = (px: number) => `${((px / FIGMA_BASE) * 100).toFixed(4)}vw`;

const CONTENT_LEFT   = -382;
const CONTENT_RIGHT  = 1983;
const CONTENT_TOP    =  125;
const CONTENT_BOTTOM = 1461;
const CONTENT_CX     = (CONTENT_LEFT  + CONTENT_RIGHT)  / 2;
const CONTENT_CY     = (CONTENT_TOP   + CONTENT_BOTTOM) / 2;
const EDGE_PAD       = 48;

const imgLogo = 'https://www.figma.com/api/mcp/asset/d4ccd36a-d3b6-430c-a624-60ee566661ee';
const imgGrid = 'https://www.figma.com/api/mcp/asset/b4f0f745-f634-4a80-8d0b-a55fa2554acc';

const images = [
  // row 1 — far / slow
  { src: 'https://www.figma.com/api/mcp/asset/838c7e41-02bc-4e82-924d-8a0e90541d1d', left: -316, top:  125, w: 448, h: 248, speed: 0.010 },
  { src: 'https://www.figma.com/api/mcp/asset/b3c1a7b7-680b-4f35-960f-e6d841153950', left:  251, top:  142, w: 509, h: 286, speed: 0.015 },
  { src: 'https://www.figma.com/api/mcp/asset/5f7fd133-184a-44a0-98d4-8dc11ea94fe6', left:  896, top:  155, w: 443, h: 296, speed: 0.012 },
  { src: 'https://www.figma.com/api/mcp/asset/344d0ead-3881-4f5e-8e38-5febb49258e1', left: 1474, top:  128, w: 265, h: 446, speed: 0.018 },
  // row 2 — mid
  { src: 'https://www.figma.com/api/mcp/asset/80e3ade0-4703-45d4-bac9-936175996d3a', left: -318, top:  513, w: 366, h: 285, speed: 0.028 },
  { src: 'https://www.figma.com/api/mcp/asset/bd568f9a-4885-4421-9058-0605d74b7b4d', left:  198, top:  540, w: 465, h: 262, speed: 0.022 },
  { src: 'https://www.figma.com/api/mcp/asset/16870787-6448-48a4-a05c-ff9dead422a8', left:  855, top:  574, w: 339, h: 439, speed: 0.032 },
  { src: 'https://www.figma.com/api/mcp/asset/98d8d79e-0521-49a5-9db8-c8dda616a34a', left: 1329, top:  655, w: 654, h: 308, speed: 0.025 },
  // row 3 — close / fast
  { src: 'https://www.figma.com/api/mcp/asset/aa0a5a6d-31c5-4d26-96be-c68b3c385b9b', left: -382, top:  940, w: 500, h: 281, speed: 0.042 },
  { src: 'https://www.figma.com/api/mcp/asset/633a617a-e46a-4c4e-8746-f3a0c8bec3e7', left:  216, top:  995, w: 400, h: 400, speed: 0.035 },
  { src: 'https://www.figma.com/api/mcp/asset/aa41b083-fe01-4ce9-b830-b6a29494b76c', left:  788, top: 1090, w: 442, h: 371, speed: 0.040 },
  { src: 'https://www.figma.com/api/mcp/asset/3c60c7c6-2ecb-4992-851b-753eb7326e80', left: 1368, top: 1112, w: 504, h: 283, speed: 0.030 },
];

// Split into left (even) / right (odd) columns for mobile masonry
const leftCol  = images.map((img, i) => ({ ...img, i })).filter((_, idx) => idx % 2 === 0);
const rightCol = images.map((img, i) => ({ ...img, i })).filter((_, idx) => idx % 2 !== 0);

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

function getLayout() {
  const vw    = window.innerWidth;
  const vh    = window.innerHeight;
  const scale = vw / FIGMA_BASE;
  return {
    initialX: vw / 2 - CONTENT_CX * scale,
    initialY: vh / 2 - CONTENT_CY * scale,
    rangeX: Math.max(0, (CONTENT_RIGHT - CONTENT_LEFT + EDGE_PAD * 2) * scale - vw) / 2,
    rangeY: Math.max(0, (CONTENT_BOTTOM - CONTENT_TOP  + EDGE_PAD * 2) * scale - vh) / 2,
  };
}

export default function Home() {
  const cursorRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Desktop-only: mouse parallax + custom cursor
    if (!window.matchMedia('(min-width: 768px)').matches) return;

    let layout = getLayout();
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;
    let conCurX = layout.initialX, conTargX = layout.initialX;
    let conCurY = layout.initialY, conTargY = layout.initialY;

    const cardStates = images.map(() => ({ curX: 0, curY: 0, targX: 0, targY: 0 }));

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const ox = e.clientX / window.innerWidth  - 0.5;
      const oy = e.clientY / window.innerHeight - 0.5;
      conTargX = layout.initialX - ox * layout.rangeX * 2;
      conTargY = layout.initialY - oy * layout.rangeY * 2;
      images.forEach((img, i) => {
        cardStates[i].targX = ox * img.speed * window.innerWidth;
        cardStates[i].targY = oy * img.speed * window.innerHeight;
      });
    };

    const onResize = () => { layout = getLayout(); };

    let rafId: number;
    const animate = () => {
      cursorX = lerp(cursorX, mouseX, 0.08);
      cursorY = lerp(cursorY, mouseY, 0.08);
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate3d(${cursorX - 16}px, ${cursorY - 16}px, 0)`;
      }
      conCurX = lerp(conCurX, conTargX, 0.06);
      conCurY = lerp(conCurY, conTargY, 0.06);
      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${conCurX}px, ${conCurY}px)`;
      }
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        cardStates[i].curX = lerp(cardStates[i].curX, cardStates[i].targX, 0.06);
        cardStates[i].curY = lerp(cardStates[i].curY, cardStates[i].targY, 0.06);
        el.style.transform = `translate(${cardStates[i].curX}px, ${cardStates[i].curY}px)`;
      });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Custom cursor — pointer devices only (hidden via CSS on touch) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#0f100e] pointer-events-none will-change-transform z-[9999]"
      />

      {/* ── Shared navbar ──────────────────────────────────────────────── */}
      <nav className="fixed top-4 left-6 right-6 h-14 bg-[#2e2e2b] rounded-[4px] flex items-center px-6 z-20">
        <div className="flex flex-1 items-center justify-between">
          <div className="relative shrink-0" style={{ height: '15.984px', width: '167.537px' }}>
            <img alt="Ether Ship" className="absolute inset-0 h-full w-full object-contain object-left" src={imgLogo} />
          </div>
          <span className="font-medium text-[#f6f4ee] text-[18px] tracking-[-0.36px] whitespace-nowrap">
            MENU
          </span>
        </div>
      </nav>

      {/* ── Desktop layout (≥ 768 px) ──────────────────────────────────── */}
      <div className="hidden md:block fixed inset-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{ backgroundImage: `url("${imgGrid}")`, backgroundSize: '136px 136px', backgroundPosition: 'top left' }}
        />
        <div ref={containerRef} className="absolute top-0 left-0 will-change-transform">
          {images.map((img, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="absolute will-change-transform"
              style={{ left: v(img.left), top: v(img.top), width: v(img.w), height: v(img.h) }}
            >
              <div className="card-inner w-full h-full overflow-hidden" style={{ animationDelay: `${i * 0.2}s` }}>
                <img alt="" src={img.src} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile layout (< 768 px) ───────────────────────────────────── */}
      <div className="md:hidden min-h-screen bg-white">
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: `url("${imgGrid}")`, backgroundSize: '80px 80px' }}
        />

        {/* Two-column masonry, right col offset 40px for stagger depth */}
        <div className="relative px-4 pt-[88px] pb-[140px]">
          <div className="flex gap-2.5 items-start">

            {/* Left column */}
            <div className="flex-1 flex flex-col gap-2.5">
              {leftCol.map((img) => (
                <div
                  key={img.i}
                  className="card-inner w-full overflow-hidden rounded-[4px]"
                  style={{ aspectRatio: `${img.w}/${img.h}`, animationDelay: `${img.i * 0.2}s` }}
                >
                  <img alt="" src={img.src} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Right column — nudged down for visual stagger */}
            <div className="flex-1 flex flex-col gap-2.5 mt-10">
              {rightCol.map((img) => (
                <div
                  key={img.i}
                  className="card-inner w-full overflow-hidden rounded-[4px]"
                  style={{ aspectRatio: `${img.w}/${img.h}`, animationDelay: `${img.i * 0.2}s` }}
                >
                  <img alt="" src={img.src} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── Shared CTA button ──────────────────────────────────────────── */}
      <div className="fixed bottom-[67px] left-1/2 -translate-x-1/2 z-20">
        <button className="bg-[#bb9a6d] text-[#0f100e] font-medium text-[16px] tracking-[-0.32px] px-4 py-3 rounded-[4px] whitespace-nowrap">
          See More Projects
        </button>
      </div>
    </>
  );
}
