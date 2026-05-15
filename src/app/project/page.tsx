"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";

const images = [
  "https://www.figma.com/api/mcp/asset/e44f2a69-145f-4fb0-bff3-e4407e31f59a",
  "https://www.figma.com/api/mcp/asset/dac370e9-bd37-493f-81d5-344fd3538071",
  "https://www.figma.com/api/mcp/asset/de307f34-9a46-404f-8a28-cc744f25fbb3",
  "https://www.figma.com/api/mcp/asset/0dcb0d92-73d9-4a86-8418-9739d1ac7b7f",
  "https://www.figma.com/api/mcp/asset/83d8fd48-901c-4c89-a810-34c45f7a4af9",
  "https://www.figma.com/api/mcp/asset/4207942c-144b-479a-8660-09ad9390ec02",
];

export default function ProjectDetail() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const isAnimating = useRef(false);
  const pendingIndex = useRef<number | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const mainWrapRef = useRef<HTMLDivElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const infosRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLImageElement>(null);

  // Entrance: curtain sweeps off + image zooms out from 1.1 → 1
  useEffect(() => {
    const ctx = gsap.context(() => {
      const thumbEls = thumbsRef.current
        ? Array.from(thumbsRef.current.children)
        : [];

      gsap.set(navRef.current, { yPercent: -100 });
      gsap.set(curtainRef.current, { xPercent: 0 });
      gsap.set(mainImgRef.current, { scale: 1.12 });
      gsap.set(thumbEls, { y: 20, opacity: 0 });
      gsap.set(infosRef.current, { y: 20, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(navRef.current, {
          yPercent: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        // curtain sweeps out to the right
        .to(
          curtainRef.current,
          { xPercent: 105, duration: 1.05, ease: "power4.inOut" },
          "-=0.35"
        )
        // image zooms out simultaneously
        .to(
          mainImgRef.current,
          { scale: 1, duration: 1.5, ease: "power3.out" },
          "<"
        )
        // thumbnails stagger up
        .to(
          thumbEls,
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: "power3.out" },
          "-=0.85"
        )
        .to(
          infosRef.current,
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          "-=0.45"
        );
    });

    return () => ctx.revert();
  }, []);

  // Thumbnail switch: wipe in with scale settle
  useEffect(() => {
    if (incomingIndex === null || !incomingRef.current) return;

    gsap.fromTo(
      incomingRef.current,
      { clipPath: "inset(0 100% 0 0)", scale: 1.08 },
      {
        clipPath: "inset(0 0% 0 0)",
        scale: 1,
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
          setActiveIndex(pendingIndex.current!);
          setIncomingIndex(null);
          isAnimating.current = false;
        },
      }
    );
  }, [incomingIndex]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      if (index === activeIndex || isAnimating.current) return;
      isAnimating.current = true;
      pendingIndex.current = index;
      setIncomingIndex(index);
    },
    [activeIndex]
  );

  // Thumbnail hover — subtle zoom on the inner image
  const handleThumbEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector("img"), {
      scale: 1.07,
      duration: 0.4,
      ease: "power2.out",
    });
  };
  const handleThumbLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector("img"), {
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <div className="bg-white w-full h-screen overflow-hidden relative flex flex-col">
      <nav
        ref={navRef}
        className="absolute top-0 left-0 right-0 h-20 flex items-center px-6 z-20 bg-white"
      >
        <div className="flex flex-1 items-center justify-between">
          <Link
            href="/"
            className="font-bold text-2xl tracking-[-0.02em] text-[#0f100e] whitespace-nowrap"
          >
            ETHER SHIP
          </Link>
          <span className="font-bold text-2xl tracking-[-0.02em] text-[#0f100e] whitespace-nowrap cursor-pointer">
            MENU
          </span>
        </div>
      </nav>

      <div className="flex flex-1 min-h-0 gap-4 px-6 pt-20 pb-20">
        {/* Main image */}
        <div ref={mainWrapRef} className="flex-1 relative min-w-0 overflow-hidden">
          <img
            ref={mainImgRef}
            src={images[activeIndex]}
            alt="Project image"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Incoming image wipe layer */}
          {incomingIndex !== null && (
            <img
              ref={incomingRef}
              src={images[incomingIndex]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Entrance curtain */}
          <div
            ref={curtainRef}
            className="absolute inset-0 bg-[#2e2e2b] z-10 pointer-events-none"
          />
        </div>

        {/* Thumbnails */}
        <div ref={thumbsRef} className="flex flex-col gap-4 shrink-0 w-[118px]">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => handleThumbnailClick(i)}
              onMouseEnter={handleThumbEnter}
              onMouseLeave={handleThumbLeave}
              className={`relative w-full aspect-[80/45] shrink-0 overflow-hidden ${
                activeIndex === i
                  ? "ring-2 ring-[#0f100e] opacity-100"
                  : "opacity-50 hover:opacity-100 transition-opacity duration-300"
              }`}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={infosRef}
        className="absolute bottom-0 left-0 right-0 h-20 flex items-center px-6"
      >
        <Link
          href="/project/info"
          className="font-bold text-2xl tracking-[-0.04em] text-[#0f100e] whitespace-nowrap"
        >
          INFOS
        </Link>
      </div>
    </div>
  );
}
