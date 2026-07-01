"use client";

import { useRef } from "react";
import { motion, Variants } from "motion/react";
import { Minus } from "lucide-react";
import CtaButton from "@/UI/CtaButton";
import Badge from "@/UI/Badge";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const foregroundContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 },
    },
  };

  const foregroundItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Background Video */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://pedroneves-duall.github.io/insider-videos/hero.mp4"
          type="video/mp4"
        />
      </motion.video>

      {/* Contrast overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[#02101b]/30 via-transparent to-[#01080d]/90" />

      {/* Bottom overlay */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-1/2 bg-linear-to-t from-black via-black/40 to-transparent" />

      {/* Content */}
      <motion.div
        variants={foregroundContainer}
        initial="hidden"
        animate="show"
        className="absolute inset-x-0 bottom-20 z-40 px-6 md:px-40 pb-10 flex flex-col items-start"
      >
        <motion.div variants={foregroundItem}>
          <Badge
            className="my-5"
            text="Welcome to Tourvia"
            variant="white"
            size="lg"
            icon={Minus}
          />
        </motion.div>

        <motion.h1
          variants={foregroundItem}
          className="text-4xl md:text-5xl lg:text-7xl font-medium leading-[1.1] text-white"
        >
          Explore beyond the
          <br />
          map With Tourvia
        </motion.h1>

        <motion.div variants={foregroundItem}>
          <CtaButton
            className="my-5"
            text="Book Now"
            variant="white"
            size="sm"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
