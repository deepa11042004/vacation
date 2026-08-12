"use client";

import Image from "next/image";

export default function MemberHero() {
  return (
    <section className="relative w-full bg-black text-white py-20 px-6 md:px-12 overflow-hidden shadow-2xl mb-14">
      {/* Fine Wavy Line Background Pattern */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <Image
          src="/Img/pattern.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Top Tagline */}
        <span className="text-xs uppercase font-medium tracking-[0.35em] text-neutral-400 mb-3">
          LAUNCHING
        </span>

        {/* Main Header */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.25em] uppercase text-white font-serif leading-tight">
          MEMBERSHIP OWNERSHIP TIERS
        </h2>

        {/* Subtitle */}
        <span className="text-xs sm:text-sm uppercase font-semibold tracking-[0.3em] text-neutral-300 mt-3 mb-10">
          PRIVILEGED ACCESS
        </span>

        {/* 3 Tier Cards Graphic Showcase */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 my-6 w-full max-w-5xl px-4">
          {/* EBONY Card */}
          <div className="relative w-full sm:w-1/3 h-52 sm:h-56 rounded-2xl bg-gradient-to-br from-[#2a2a2a] via-[#141414] to-[#050505] p-6 text-white shadow-2xl border border-neutral-700 flex flex-col justify-center overflow-hidden group hover:scale-105 transition-transform duration-300">
            {/* Texture Image Layer */}
            <div className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none">
              <Image
                src="/Img/pattern.png"
                alt=""
                fill
                className="object-cover scale-125"
              />
            </div>
            {/* Additional Metallic Sheen */}
            <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-500 via-transparent to-transparent" />
            
            <div className="flex flex-col items-center justify-center h-full z-10 gap-2">
              <div className="w-44 h-32 relative opacity-95">
                <Image src="/Img/fanlogo.png" alt="" fill className="object-contain brightness-200" />
              </div>
              <h3 className="text-[11px] font-bold tracking-[0.35em] font-serif uppercase text-white">EBONY</h3>
            </div>
          </div>

          {/* IVORY Card (Center & Prominent) */}
          <div className="relative w-full sm:w-1/3 h-56 sm:h-60 rounded-2xl bg-gradient-to-br from-[#ECE0CD] via-[#D8C7B0] to-[#BEAD95] p-6 text-neutral-900 shadow-2xl border border-amber-200/50 flex flex-col justify-center overflow-hidden z-10 sm:-translate-y-3 group hover:scale-105 transition-transform duration-300">
            {/* Texture Image Layer */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
              <Image
                src="/Img/pattern.png"
                alt=""
                fill
                className="object-cover scale-125"
              />
            </div>
            {/* Additional Sheen */}
            <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            
            <div className="flex flex-col items-center justify-center h-full z-10 gap-2">
              <div className="w-48 h-36 relative">
                <Image src="/Img/fanlogo.png" alt="" fill className="object-contain" />
              </div>
              <h3 className="text-[12px] font-bold tracking-[0.35em] font-serif uppercase text-neutral-900">IVORY</h3>
            </div>
          </div>

          {/* JADE Card */}
          <div className="relative w-full sm:w-1/3 h-52 sm:h-56 rounded-2xl bg-gradient-to-br from-[#14574E] via-[#0B3D37] to-[#042420] p-6 text-white shadow-2xl border border-emerald-500/40 flex flex-col justify-center overflow-hidden group hover:scale-105 transition-transform duration-300">
            {/* Texture Image Layer */}
            <div className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none">
              <Image
                src="/Img/pattern.png"
                alt=""
                fill
                className="object-cover scale-125"
              />
            </div>
            {/* Additional Emerald Glow Sheen */}
            <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-300 via-transparent to-transparent" />
            
            <div className="flex flex-col items-center justify-center h-full z-10 gap-2">
              <div className="w-44 h-32 relative opacity-95">
                <Image src="/Img/fanlogo.png" alt="" fill className="object-contain brightness-200" />
              </div>
              <h3 className="text-[11px] font-bold tracking-[0.35em] font-serif uppercase text-emerald-100">JADE</h3>
            </div>
          </div>
        </div>

        {/* Bottom Lifespan Text */}
        <span className="text-xs uppercase font-medium tracking-[0.3em] text-neutral-400 mt-8">
          FIVE, TEN, FIFTEEN &amp; TWENTY YEAR MEMBERSHIPS
        </span>
      </div>
    </section>
  );
}

