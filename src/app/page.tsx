"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";

const slides = [
  {
    src: "https://www.figma.com/api/mcp/asset/a6d275d8-5e40-4806-8f18-0edae1dbeb5b",
    title: "Forestry Institute 2024",
  },
  {
    src: "/work/02.jpg",
    title: "Banpo Park 2024",
  },
  {
    src: "/work/03.jpg",
    title: "Seoul Library 2023",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [displayedTitle, setDisplayedTitle] = useState(slides[0].title);
  const [displayedCount, setDisplayedCount] = useState(1);

  const isAnimating = useRef(false);
  const pendingIndex = useRef<number | null>(null);
  const directionRef = useRef<"next" | "prev">("next");
  const incomingRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const heroTextRef = useRef<HTMLParagraphElement>(null);

  const total = slides.length;

  const navigate = useCallback(
    (dir: "next" | "prev") => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      directionRef.current = dir;

      const nextIndex =
        dir === "next" ? (current + 1) % total : (current - 1 + total) % total;
      pendingIndex.current = nextIndex;

      const yOut = dir === "next" ? -12 : 12;
      gsap.to(titleRef.current, {
        opacity: 0,
        y: yOut,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setDisplayedTitle(slides[nextIndex].title);
          setDisplayedCount(nextIndex + 1);
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: -yOut },
            { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }
          );
        },
      });

      setIncomingIndex(nextIndex);
    },
    [current, total]
  );

  // Image wipe animation triggered when incomingIndex is set
  useEffect(() => {
    if (incomingIndex === null || !incomingRef.current) return;

    const isNext = directionRef.current === "next";
    const fromClip = isNext ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

    gsap.fromTo(
      incomingRef.current,
      { clipPath: fromClip, scale: 1.06 },
      {
        clipPath: "inset(0 0% 0 0)",
        scale: 1,
        duration: 1.0,
        ease: "power4.inOut",
        onComplete: () => {
          setCurrent(pendingIndex.current!);
          setIncomingIndex(null);
          isAnimating.current = false;
        },
      }
    );
  }, [incomingIndex]);

  // Entrance reveal for hero text
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroTextRef.current, {
        yPercent: 110,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.3,
      });
    });
    return () => ctx.revert();
  }, []);

  // Auto-rotation: resets to 3s after every slide commit
  useEffect(() => {
    const timer = setTimeout(() => navigate("next"), 3000);
    return () => clearTimeout(timer);
  }, [current, navigate]);

  const slide = slides[current];

  return (
    <div className="bg-[#ffffff] relative overflow-hidden w-full h-screen flex flex-col">
      <nav className="absolute top-0 left-0 right-0 h-20 flex items-center px-6 z-10">
        <div className="flex-1 flex items-center justify-end">
          <span className="font-bold text-2xl tracking-[-0.02em] text-[#0f100e] whitespace-nowrap cursor-pointer">
            MENU
          </span>
        </div>
      </nav>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-stretch flex-1 min-h-0 pb-10 -mb-[clamp(30px,8.33vw,120px)] relative">
          <div className="relative w-[75%] shrink-0 overflow-hidden z-0">
            <img
              src={slide.src}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {incomingIndex !== null && (
              <img
                ref={incomingRef}
                src={slides[incomingIndex].src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            <Link href="/project" className="absolute inset-0 z-10" aria-label="View project detail" />

            <div className="absolute right-0 top-0 w-[51px] h-full bg-[#F5F0E8] flex items-center justify-center overflow-hidden z-20">
              <p
                ref={titleRef}
                className="font-bold text-2xl text-black tracking-[-0.02em] whitespace-nowrap -rotate-90"
              >
                {displayedTitle}
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-6">
            <button
              onClick={() => navigate("prev")}
              className="text-black w-6 h-6 flex items-center justify-center text-2xl leading-none"
              aria-label="Previous"
            >
              ‹
            </button>
            <span className="font-bold text-[48px] text-black tracking-[-0.02em] whitespace-nowrap leading-none">
              {displayedCount}/{total}
            </span>
            <button
              onClick={() => navigate("next")}
              className="text-black w-6 h-6 flex items-center justify-center text-2xl leading-none"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>

        <div className="overflow-hidden relative z-10 shrink-0">
          <p ref={heroTextRef} className="font-bold leading-none text-[#2e2e2b] uppercase whitespace-nowrap tracking-[-0.04em] text-[18vw]">
            Ether Ship
          </p>
        </div>
      </div>
    </div>
  );
}
