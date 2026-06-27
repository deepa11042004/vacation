"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Minus } from "lucide-react";
import Badge from "@/UI/Badge";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  avatar: string;
}

const INDIAN_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Absoluut unieke service. De gidsen kenden exact de verborgen parels in de woestijn van Dubai. De hele planning klopte tot in de puntjes.",
    name: "Aarav Sharma",
    location: "Mumbai, India",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "2",
    quote:
      "Onze reis naar Bali via Tourvia was fenomenaal. Geen stress over hotelboekingen of lokaal vervoer, alles was op een luxueus niveau geregeld.",
    name: "Ananya Iyer",
    location: "Bangalore, India",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "3",
    quote:
      "De exclusieve wellness-itinerary in Kerala overtrof al onze verwachtingen. Een absolute aanrader voor wie houdt van comfort en diepgang.",
    name: "Vikram Malhotra",
    location: "New Delhi, India",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "4",
    quote:
      "Perfecte communicatie en persoonlijke service. Ze wisten precies hoe ze rekening moesten houden met de voorkeuren van onze familie.",
    name: "Diya Patel",
    location: "Ahmedabad, India",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

const GAP = 24; // Gap spacing between sliding cards

function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setCount(1);
      else if (w < 1140) setCount(2);
      else setCount(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

export default function Testimonials() {
  const [offset, setOffset] = useState(0);
  const visibleCount = useVisibleCount();
  const maxOffset = Math.max(0, INDIAN_TESTIMONIALS.length - visibleCount);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOffset((o) => Math.min(o, maxOffset));
  }, [maxOffset]);

  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));

  return (
    <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-14 font-display">
      <div className="mx-auto max-w-7xl flex flex-col">
        {/* ─── Top Header Layout (Badge + Title + Controller Nav Set) ─── */}
        <div className="mb-12 w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <Badge
              text="Reviews"
              variant="black"
              size="lg"
              icon={Minus}
              className="mb-4"
            />
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
              What Our Travelers Say
            </h2>
          </div>

          {/* Controller Arrow Buttons */}
          <div className="flex gap-3 shrink-0">
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
        </div>

        {/* ─── Interactive Carousel Viewport Stage ─── */}
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
            {INDIAN_TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="relative shrink-0 rounded-3xl bg-[#0b0c0e] p-8 md:p-10 text-white flex flex-col justify-between overflow-hidden shadow-sm h-95 sm:h-87.5"
                style={{
                  width: `calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`,
                  flex: `0 0 calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`,
                }}
              >
                <div>
                  {/* Oversized Quote Mark Element */}
                  <span className="text-white text-6xl font-serif leading-none block tracking-tighter opacity-90 select-none">
                    “
                  </span>
                  {/* Testimonial Quote Text */}
                  <p className="text-gray-200 text-base sm:text-lg leading-relaxed font-normal tracking-wide line-clamp-4">
                    &quot;{item.quote}&quot;
                  </p>
                </div>

                <div>
                  {/* Clean Baseline Separation Rule Line */}
                  <div className="w-full h-px bg-neutral-800 my-6" />

                  {/* Profile Layout Block */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shrink-0 shadow-inner">
                      <Image
                        fill
                        src={item.avatar}
                        alt={`${item.name} profile`}
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold tracking-wide text-white">
                        {item.name}
                      </span>
                      <span className="text-xs font-semibold tracking-wider text-neutral-400 mt-0.5 uppercase">
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Optional Carousel Bottom Dot Markers */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxOffset + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setOffset(i)}
              className={`transition-all duration-300 rounded-full h-2 ${
                offset === i
                  ? "w-6 bg-black"
                  : "w-2 bg-neutral-200 hover:bg-neutral-300"
              }`}
              aria-label={`Navigate to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
