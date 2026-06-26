"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Minus } from "lucide-react";
import Navbar from "@/Components/Navbar";
import CtaButton from "@/UI/CtaButton";
import Badge from "@/UI/Badge";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progression relative to the hero section itself
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Sky drifts slightly slower than scroll speed
  const skyY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // Text shifts DOWN by a moderate amount as you scroll
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [0.75, 0.1]);

  // Mountain shifts UP smoothly without over-exaggerated pinning values
  const mountainY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Layer 0 — sky / clouds */}
      <motion.img
        src="/Img/bg.png"
        alt=""
        style={{ y: skyY }}
        className="absolute inset-0 -top-10 h-[110%] w-full object-cover"
      />

      {/* Contrast overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[#02101b]/30 via-transparent to-[#01080d]/90" />

      {/* Layer 1 — giant wordmark (Sinks down slightly behind mountain) */}
      <motion.h2
        style={{ y: titleY, opacity: titleOpacity }}
        aria-hidden
        className="absolute inset-x-0 top-[10%] z-10 select-none text-center text-4xl md:text-5xl lg:text-[15vw] text-cyan-300 font-semibold uppercase leading-none tracking-wider mix-blend-screen"
      >
        Tourvia
      </motion.h2>

      {/* Layer 2 — mountain cutout (Starts at -bottom-10, glides up cleanly) */}
      <motion.img
        src="/Img/moun.png"
        alt="Snow-capped mountain peak"
        style={{ y: mountainY }}
        className="absolute -bottom-10 left-1/2 z-20 h-[68%] w-auto -translate-x-1/2 object-contain sm:h-[78%] transform-gpu"
      />

      {/* Layer 3 — bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-1/2 bg-linear-to-t from-black via-black/40 to-transparent" />

      {/* Layer 4 — navigation */}
      <Navbar />

      {/* Layer 5 */}
      <div className="absolute inset-x-0 bottom-0 z-40 px-6 md:px-40 pb-10">
        <Badge
          className="my-5"
          text="Welcome to Tourvia"
          variant="white"
          size="lg"
          icon={Minus}
        />

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium leading-[1.1] text-white">
          Explore beyond the
          <br />
          map With Tourvia
        </h1>

        <CtaButton
          className="my-5"
          text="Explore Destination"
          variant="white"
          size="md"
        />
      </div>
    </section>
  );
}
