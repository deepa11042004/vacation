"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, Variants } from "motion/react";
import { Minus } from "lucide-react";
import CtaButton from "@/UI/CtaButton";
import Badge from "@/UI/Badge";

// To use your own photos, drop them in `public/Img/` and swap each `src`
// for e.g. "/Img/hero-1.jpg".
const slides = [
  {
    src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=2400&q=80",
    alt: "Overwater villas above a turquoise lagoon",
  },
  {
    src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=2400&q=80",
    alt: "Grand resort with a reflecting pool",
  },
  {
    src: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=2400&q=80",
    alt: "Infinity pool overlooking the sea at sunset",
  },
];

const SLIDE_DURATION = 5000;

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

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
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.4, ease: "easeInOut" },
              scale: { duration: SLIDE_DURATION / 1000 + 1.4, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={slides[active].src}
              alt={slides[active].alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Contrast overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[#02101b]/40 via-[#02101b]/10 to-[#01080d]/90" />

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
            text="MANDARIN WORLDWIDE"
            variant="white"
            size="lg"
            icon={Minus}
          />
        </motion.div>

        <motion.h1
          variants={foregroundItem}
          className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] text-white"
        >
          Explore beyond the
          <br />
          map With Us
        </motion.h1>

        <motion.div variants={foregroundItem}>
          <CtaButton
            className="my-5"
            text="Book Now"
            variant="white"
            size="sm"
            href="/travel-desk"
          />
        </motion.div>
      </motion.div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-6 md:right-40 z-40 flex items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show slide ${index + 1}`}
            className="group relative h-1 w-10 overflow-hidden rounded-full bg-white/25"
          >
            <span
              className={`absolute inset-y-0 left-0 bg-white transition-all duration-300 ${
                index === active ? "w-full" : "w-0 group-hover:w-1/3"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
