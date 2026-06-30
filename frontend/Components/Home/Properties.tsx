"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Minus } from "lucide-react";
import Image from "next/image";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

const destinations = [
  {
    id: 1,
    name: "Lucknow",
    category: "Heritage Hub",
    image:
      "https://images.unsplash.com/photo-1659202313780-1d8c8beea7d3?q=80&w=736&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Agra",
    category: "Wonders Track",
    image:
      "https://images.unsplash.com/photo-1724947053227-2335bf21d0ae?q=80&w=1170&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Rishikesh",
    category: "Spiritual Escape",
    image:
      "https://images.unsplash.com/photo-1650341259809-9314b0de9268?q=80&w=1170&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Jim Corbett",
    category: "Wilderness Oasis",
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Nainital",
    category: "Lakeside Luxury",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Bhimtal",
    category: "Serene Retreat",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=85&auto=format&fit=crop",
  },
];

// Gap between cards in px (16px matches gap-4)
const GAP = 16;

function useVisibleCount() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCount(1);
      else if (w < 1024) setCount(2);
      else if (w < 1280) setCount(3);
      else setCount(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

export default function Properties() {
  const [offset, setOffset] = useState(0);
  const visibleCount = useVisibleCount();
  const maxOffset = Math.max(0, destinations.length - visibleCount);

  // Clamp offset when screen resizes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOffset((o) => Math.min(o, maxOffset));
  }, [maxOffset]);

  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));

  return (
    <section className="w-full bg-white py-20 px-6 sm:px-10 lg:px-14 font-display">
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        {/* Header  */}
        <div className="mb-12 w-full">
          <Badge
            text="Explore 200+ Resorts"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-4"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
              Most Popular Resorts
            </h2>
            <CtaButton
              text="View All Resorts"
              variant="white"
              size="md"
              className="self-start sm:self-auto"
            />
          </div>
        </div>

        {/* Navigation & Track Deck */}
        <div className="w-full flex flex-col">
          {/* Micro Controller Arrows */}
          <div className="flex justify-end gap-3 mb-6">
            <button
              onClick={prev}
              disabled={offset === 0}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 bg-white text-gray-700 shadow-xs hover:bg-neutral-50 hover:text-gray-900 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={next}
              disabled={offset >= maxOffset}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 bg-white text-gray-700 shadow-xs hover:bg-neutral-50 hover:text-gray-900 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            >
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Infinite Track Strip */}
          <div className="overflow-hidden w-full">
            <motion.div
              className="flex cursor-grab active:cursor-grabbing"
              style={{ gap: GAP }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) next();
                else if (info.offset.x > 50) prev();
              }}
              animate={{
                x: `calc(${offset} * -1 * ((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount} + ${GAP}px))`,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
                mass: 0.9,
              }}
            >
              {destinations.map((dest, i) => (
                <DestCard
                  key={dest.id}
                  dest={dest}
                  index={i}
                  visibleCount={visibleCount}
                />
              ))}
            </motion.div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxOffset + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setOffset(i)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  offset === i
                    ? "w-6 bg-black"
                    : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Child card Component
function DestCard({
  dest,
  index,
  visibleCount,
}: {
  dest: (typeof destinations)[0];
  index: number;
  visibleCount: number;
}) {
  return (
    <motion.div
      className="relative shrink-0 overflow-hidden rounded-2xl bg-neutral-100 group cursor-pointer shadow-xs hover:shadow-lg transition-shadow duration-300 transform-gpu"
      style={{
        width: `calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`,
        flex: `0 0 calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`,
        aspectRatio: "3 / 4.2",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      {/* Optimized Image Component Layout */}
      <Image
        fill
        src={dest.image}
        alt={dest.name}
        sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
      />

      {/* Heavy Bottom Vignette Layer matching your layout styles */}
      <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/90 z-10 pointer-events-none" />

      {/* Top Left Pill Tag Category */}
      <span className="absolute left-5 top-5 z-20 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/10 select-none">
        {dest.category}
      </span>

      {/* Lower Typography Content Block */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col gap-1 transform-gpu">
        <h3 className="text-2xl font-bold text-white tracking-wide">
          {dest.name}
        </h3>
        <p className="text-xs font-semibold text-gray-300 tracking-wider uppercase opacity-80">
          Active Spot
        </p>
      </div>
    </motion.div>
  );
}
