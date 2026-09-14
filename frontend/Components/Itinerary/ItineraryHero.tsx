"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ItineraryHero() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[70vh] overflow-hidden bg-black select-none flex flex-col justify-center"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/Img/bg.png"
          alt="Sky Background"
          fill
          priority
          className="object-cover object-center pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black via-black/40 to-transparent z-10" />
      </div>

      <div className="relative z-20 flex flex-col items-center px-4 text-center">
        <motion.span
          style={{ opacity: subtitleOpacity }}
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-[#E8C15B] mb-4"
        >
          Curated Journeys
        </motion.span>
        <motion.h1
          style={{ y: titleY }}
          className="text-[11vw] sm:text-7xl md:text-8xl font-medium tracking-wider text-white uppercase filter drop-shadow-sm leading-none"
        >
          Itineraries
        </motion.h1>
        <motion.p
          style={{ opacity: subtitleOpacity }}
          className="mt-6 max-w-xl text-sm sm:text-base text-white/70 font-light leading-relaxed"
        >
          Handpicked, day-by-day travel plans across India and the world — crafted for effortless, unforgettable holidays.
        </motion.p>
      </div>
    </section>
  );
}
