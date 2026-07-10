"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function DestinationHero() {
  const containerRef = useRef<HTMLElement>(null);

  // Track the scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const mountainY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-black select-none flex flex-col justify-end"
    >
      {/* Sky Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Img/bg.png"
          alt="Sky Background"
          fill
          priority
          className="object-cover object-center pointer-events-none"
        />
        {/* Sky-to-dark gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-slate-950/80 via-slate-900/40 to-transparent z-10" />
      </div>

      {/* Middle Layer */}
      <div className="absolute inset-x-0 top-[50%] md:top-[12%] flex justify-center z-10 pointer-events-none px-4">
        <motion.h1
          style={{ y: titleY }}
          className="text-[12vw] font-medium tracking-tight text-white uppercase filter drop-shadow-sm"
        >
          Destinations
        </motion.h1>
      </div>

      {/* 3. Foreground Layer: Mountain/Room Graphic Cutout */}
      <motion.div
        style={{ y: mountainY }}
        initial={{ y: "40%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1], // Fluid cubic-bezier response curve
          delay: 0.05,
        }}
        className="relative w-full max-w-8xl mx-auto z-30 px-4 md:px-12 flex justify-center origin-bottom"
      >
        <div className="relative w-full aspect-16/8 md:aspect-18/7">
          <Image
            src="/Img/mountain.png"
            alt="Foreground Mountain Layer"
            fill
            priority
            className="object-contain object-bottom pointer-events-none drop-shadow-[0_-20px_50px_rgba(15,23,42,0.4)]"
          />
        </div>
      </motion.div>

      {/* 4. Fluid Shadow Baseline Mask */}
      <div className="absolute bottom-0 inset-x-0 h-80 bg-linear-to-t from-black via-black/80 to-transparent z-40 pointer-events-none" />
    </section>
  );
}
