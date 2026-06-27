"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "motion/react";
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

  // Framer Motion presets for Layer 5 stagger layout entry
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
      className="relative h-screen w-full overflow-hidden bg-[#03121d] font-display"
    >
      {/* Layer 0 — sky / clouds (Fades in smoothly) */}
      <motion.img
        src="/Img/bg.png"
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ y: skyY }}
        className="absolute inset-0 -top-10 h-[110%] w-full object-cover"
      />

      {/* Contrast overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[#02101b]/30 via-transparent to-[#01080d]/90" />

      {/* Layer 1 — giant wordmark (Sinks down slightly behind mountain) */}
      <motion.h2
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 0.75, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        style={{ y: titleY, opacity: titleOpacity }}
        aria-hidden
        className="absolute inset-x-0 top-[10%] z-10 select-none text-center text-4xl md:text-5xl lg:text-[15vw] text-cyan-300 font-semibold uppercase leading-none tracking-wider mix-blend-screen"
      >
        Tourvia
      </motion.h2>

      {/* Layer 2 — mountain cutout (Rises up elegantly into position from bottom offset) */}
      <motion.img
        src="/Img/moun.png"
        alt="Snow-capped mountain peak"
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} // Clean custom ease-out
        style={{ y: mountainY }}
        className="absolute -bottom-10 left-1/2 z-20 h-[68%] w-auto -translate-x-1/2 object-contain sm:h-[78%] transform-gpu"
      />

      {/* Layer 3 — bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-1/2 bg-linear-to-t from-black via-black/40 to-transparent" />

      {/* Layer 4 — navigation */}
      <Navbar />

      {/* Layer 5 — Content container with staggered loading animations */}
      <motion.div
        variants={foregroundContainer}
        initial="hidden"
        animate="show"
        className="absolute inset-x-0 bottom-0 z-40 px-6 md:px-40 pb-10 flex flex-col items-start"
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
            text="Explore Destination"
            variant="white"
            size="md"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
