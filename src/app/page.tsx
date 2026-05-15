"use client";

import { useState } from "react";

const heroImage =
  "https://www.figma.com/api/mcp/asset/a6d275d8-5e40-4806-8f18-0edae1dbeb5b";

export default function Home() {
  const [current, setCurrent] = useState(1);
  const total = 8;

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
        <div className="flex items-stretch flex-1 min-h-0 -mb-[120px]">
          <div className="relative w-[88%] shrink-0">
            <img
              src={heroImage}
              alt="Forestry Institute 2024"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute right-0 top-0 w-[51px] h-full bg-[#F5F0E8] flex items-center justify-center overflow-hidden">
              <p className="font-bold text-2xl text-black tracking-[-0.02em] whitespace-nowrap -rotate-90">
                Forestry Institute 2024
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-6">
            <button
              onClick={() => setCurrent((c) => Math.max(1, c - 1))}
              className="text-black w-6 h-6 flex items-center justify-center text-2xl leading-none"
              aria-label="Previous"
            >
              ‹
            </button>
            <span className="font-bold text-[48px] text-black tracking-[-0.02em] whitespace-nowrap leading-none">
              {current}/{total}
            </span>
            <button
              onClick={() => setCurrent((c) => Math.min(total, c + 1))}
              className="text-black w-6 h-6 flex items-center justify-center text-2xl leading-none"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>

        <div className="overflow-hidden relative z-10 shrink-0">
          <p className="font-bold leading-none text-[#2e2e2b] uppercase whitespace-nowrap tracking-[-0.04em] text-[18vw]">
            Ether Ship
          </p>
        </div>
      </div>
    </div>
  );
}
