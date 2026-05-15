"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

const tableData = [
  { label: "Site Area",         value: "4,701㎡" },
  { label: "Space Area",        value: "2,413㎡" },
  { label: "Total Area",        value: "7,977㎡" },
  { label: "Building Coverage", value: "51.3%" },
  { label: "FAR",               value: "169.7%" },
  { label: "Program",           value: "Office, Lecture Hall, Seminar Rooms" },
  { label: "Site",              value: "Daejeon, South Korea" },
  { label: "Result",            value: "4th Prize" },
  { label: "Team",              value: "Base Structure, Yongtae Cho, Minji Kwon" },
];

export default function ProjectInfo() {
  const navRef      = useRef<HTMLElement>(null);
  const titleWrap   = useRef<HTMLDivElement>(null);
  const titleInner  = useRef<HTMLHeadingElement>(null);
  const col1Ref     = useRef<HTMLParagraphElement>(null);
  const col2Ref     = useRef<HTMLParagraphElement>(null);
  const tableRef    = useRef<HTMLDivElement>(null);
  const closeRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows     = tableRef.current ? Array.from(tableRef.current.children) : [];
      const lines    = rows.map((r) => r.querySelector(".row-line"));
      const contents = rows.map((r) => r.querySelector(".row-content"));

      // ── initial states ──────────────────────────────────────────
      gsap.set(navRef.current,   { yPercent: -100 });
      gsap.set(titleInner.current, { yPercent: 105 });
      gsap.set([col1Ref.current, col2Ref.current], { y: 28, opacity: 0 });
      gsap.set(lines,    { scaleX: 0, transformOrigin: "left" });
      gsap.set(contents, { opacity: 0, y: 10 });
      gsap.set(closeRef.current, { y: 24, opacity: 0 });

      // ── entrance timeline ────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.05 });

      tl.to(navRef.current, { yPercent: 0, duration: 0.7 })

        // title clips up from overflow-hidden wrapper
        .to(titleInner.current, { yPercent: 0, duration: 0.8, ease: "power4.out" }, "-=0.35")

        // description columns stagger in
        .to(col1Ref.current, { y: 0, opacity: 1, duration: 0.65 }, "-=0.45")
        .to(col2Ref.current, { y: 0, opacity: 1, duration: 0.65 }, "-=0.55")

        // table: border draws left→right, then content fades in per row
        .to(lines, {
          scaleX: 1,
          duration: 0.45,
          stagger: 0.055,
          ease: "power2.inOut",
        }, "-=0.3")
        .to(contents, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.055,
        }, "<0.15")

        // last border (bottom) + close
        .to(closeRef.current, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2");
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-white w-full min-h-screen relative">

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 h-20 flex items-center px-6 z-20 bg-white"
      >
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="font-bold text-2xl tracking-[-0.02em] text-[#0f100e] whitespace-nowrap">
            ETHER SHIP
          </Link>
          <span className="font-bold text-2xl tracking-[-0.02em] text-[#0f100e] whitespace-nowrap cursor-pointer">
            MENU
          </span>
        </div>
      </nav>

      {/* ── Scrollable content ───────────────────────────────── */}
      <div className="flex flex-col gap-12 items-center px-6 pt-28 pb-28">

        {/* Title — overflow-hidden clip reveal */}
        <div ref={titleWrap} className="overflow-hidden w-full text-center">
          <h1
            ref={titleInner}
            className="font-bold text-[32px] tracking-[-0.03em] text-[#0f100e]"
          >
            Forestry Institute 2024
          </h1>
        </div>

        {/* Description columns */}
        <div className="flex gap-6 w-[756px] max-w-full">
          <p
            ref={col1Ref}
            className="flex-1 text-[16px] leading-[1.6] tracking-[-0.03em] text-[#0f100e]"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at
            ex a nisl consectetur rutrum. Ut volutpat sodales risus, at
            pellentesque metus tempor nec. Donec ex libero, gravida nec erat at,
            accumsan blandit justo. Cras at facilisis tellus, sed fermentum
            ipsum. Phasellus volutpat neque pharetra nibh semper fringilla ut eu
            libero. Donec at dolor fringilla, gravida velit in, rutrum diam.
          </p>
          <p
            ref={col2Ref}
            className="flex-1 text-[16px] leading-[1.6] tracking-[-0.03em] text-[#0f100e]"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Fusce ac est turpis. Morbi tortor quam, bibendum molestie lacinia
            eget, facilisis ut mauris. Vivamus non cursus eros. Aenean lacinia
            eros at augue euismod eleifend. Donec fermentum, odio et
            sollicitudin fringilla, lorem neque scelerisque mi, ac scelerisque
            purus neque non dui. Suspendisse fermentum malesuada libero sit amet
            viverra. Curabitur sem elit, varius vitae feugiat eget, vulputate in
            mauris.
          </p>
        </div>

        {/* Table */}
        <div ref={tableRef} className="w-[756px] max-w-full">
          {tableData.map((row, i) => (
            <div key={i} className="relative">
              {/* Animated top border line */}
              <div className="row-line absolute top-0 left-0 right-0 h-px bg-[#0f100e]" />

              {/* Row content */}
              <div className="row-content flex items-center">
                <div className="flex-1 px-4 py-4">
                  <p
                    className="text-[16px] tracking-[-0.03em] text-[#0f100e] uppercase"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {row.label}
                  </p>
                </div>
                <div className="flex-1 px-4 py-4">
                  <p
                    className="text-[16px] tracking-[-0.03em] text-[#0f100e] uppercase"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {row.value}
                  </p>
                </div>
              </div>

              {/* Bottom border on last row */}
              {i === tableData.length - 1 && (
                <div className="row-line absolute bottom-0 left-0 right-0 h-px bg-[#0f100e]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Fixed bottom close bar ───────────────────────────── */}
      <div
        ref={closeRef}
        className="fixed bottom-0 left-0 right-0 h-20 flex items-center px-6 bg-white z-20"
      >
        <Link
          href="/project"
          className="font-bold text-2xl tracking-[-0.04em] text-[#0f100e] whitespace-nowrap"
        >
          CLOSE
        </Link>
      </div>
    </div>
  );
}
