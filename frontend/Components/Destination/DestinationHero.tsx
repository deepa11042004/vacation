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
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const roomY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-black select-none flex flex-col justify-between"
    >
      {/* bg image */}
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

      {/* Background Text */}
      <div className="absolute inset-x-0 top-[20%] flex justify-center z-10 pointer-events-none px-4">
        <motion.h1
          style={{ y: titleY }}
          className="text-[12vw] font-medium tracking-tight text-white uppercase filter drop-shadow-sm"
        >
          Destination
        </motion.h1>
      </div>

      {/* 4. Room image */}
      <motion.div
        style={{ y: roomY }}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{
          duration: 1.3,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.05,
        }}
        className="relative w-full max-w-360 mx-auto z-30 px-4 md:px-12 flex justify-center origin-bottom mt-auto"
      >
        <div className="relative w-full aspect-16/7 md:aspect-20/7">
          <Image
            src="/Img/room.png"
            alt="Luxury Architecture Layer"
            fill
            priority
            className="object-contain object-bottom pointer-events-none drop-shadow-[0_-25px_60px_rgba(15,23,42,0.45)]"
          />
        </div>
      </motion.div>

      {/* 5. Fluid Shadow Baseline Mask (Replaced pure black with dynamic gradient background) */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-black via-black/80 to-transparent z-40 pointer-events-none" />
    </section>
  );
}
