"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Minus } from "lucide-react";
import Image from "next/image";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import { hotelImageUrl } from "@/lib/imageUrl";

interface Hotel {
  hotel_id: number;
  hotel_name: string;
  hotel_type: string;
  images?: { image_path: string; sort_order: number }[];
}

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

function typeLabel(t: string) {
  const map: Record<string, string> = {
    RESORT: "Resort",
    VILLA: "Villa",
    HOTEL: "Hotel",
    APARTMENT: "Apartment",
    HOMESTAY: "Homestay",
    GUEST_HOUSE: "Guest House",
  };
  return map[t] ?? t;
}

export default function Properties() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [offset, setOffset] = useState(0);
  const visibleCount = useVisibleCount();

  useEffect(() => {
    fetch("/api/hotels?limit=12&status=ACTIVE&hotel_type=RESORT")
      .then((r) => r.json())
      .then((res) => {
        const list: Hotel[] = res?.data?.hotels ?? [];
        // fall back to any type if resorts are scarce
        if (list.length < 4) {
          return fetch("/api/hotels?limit=12&status=ACTIVE")
            .then((r) => r.json())
            .then((r2) => setHotels(r2?.data?.hotels ?? []));
        }
        setHotels(list);
      })
      .catch(() => {});
  }, []);

  const maxOffset = Math.max(0, hotels.length - visibleCount);

  useEffect(() => {
    setOffset((o) => Math.min(o, maxOffset));
  }, [maxOffset]);

  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));

  if (hotels.length === 0) return null;

  return (
    <section className="w-full bg-white py-20 px-6 sm:px-10 lg:px-14 font-display">
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        <div className="mb-12 w-full">
          <Badge text="Explore" variant="black" size="lg" icon={Minus} className="mb-4" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
              Most Popular Resorts
            </h2>
            <CtaButton text="View All Resorts" variant="white" size="md" className="self-start sm:self-auto" />
          </div>
        </div>

        <div className="w-full flex flex-col">
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
              transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
            >
              {hotels.map((hotel, i) => {
                const sorted = [...(hotel.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
                const img = hotelImageUrl(sorted[0]?.image_path);
                return (
                  <motion.div
                    key={hotel.hotel_id}
                    className="relative shrink-0 overflow-hidden rounded-2xl bg-neutral-100 group cursor-pointer shadow-xs hover:shadow-lg transition-shadow duration-300 transform-gpu"
                    style={{
                      width: `calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`,
                      flex: `0 0 calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`,
                      aspectRatio: "3 / 4.2",
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                  >
                    <Image
                      fill
                      src={img}
                      alt={hotel.hotel_name}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/90 z-10 pointer-events-none" />
                    <span className="absolute left-5 top-5 z-20 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/10 select-none">
                      {typeLabel(hotel.hotel_type)}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col gap-1 transform-gpu">
                      <h3 className="text-2xl font-bold text-white tracking-wide line-clamp-2">
                        {hotel.hotel_name}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxOffset + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setOffset(i)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  offset === i ? "w-6 bg-black" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
