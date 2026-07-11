"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import { locationImageUrl } from "@/lib/imageUrl";

interface SlideData {
  id: number;
  country: string;
  title: string;
  imageUrl: string;
  type: string;
}

const Destination = () => {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetch("/api/locations?limit=6&status=ACTIVE")
      .then((r) => r.json())
      .then((res) => {
        const locs = res?.data?.locations ?? [];
        setSlides(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          locs.map((l: any) => ({
            id: l.location_id,
            country: l.country,
            title: l.location_name,
            imageUrl: locationImageUrl(l.location_image),
            type: l.type === "DOMESTIC" ? "National" : "International",
          }))
        );
      })
      .catch(() => {});
  }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, slides.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, slides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (slides.length === 0) return null;

  return (
    <section className="bg-white rounded-t-[6vw] px-6 py-20 sm:px-10 lg:px-14 font-display w-full select-none">
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="mb-12 w-full">
          <Badge text="Explore" variant="black" size="lg" icon={Minus} className="mb-4" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
              Top destinations <br />
              handpicked for you.
            </h2>
            <CtaButton text="View All Destinations" variant="white" size="md" className="self-start sm:self-auto" />
          </div>
        </div>

        <div className="relative w-full h-135 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
            {slides.map((slide, index) => {
              let distance = index - currentIndex;
              if (distance < -slides.length / 2) distance += slides.length;
              if (distance > slides.length / 2) distance -= slides.length;

              const isActive = distance === 0;
              let scale = 0.7, xOffset = 0, zIndex = 10, opacity = 0.5;

              if (isActive) { scale = 1; xOffset = 0; zIndex = 50; opacity = 1; }
              else if (Math.abs(distance) === 1) { scale = 0.88; xOffset = distance > 0 ? 320 : -320; zIndex = 40; opacity = 1; }
              else if (Math.abs(distance) === 2) { scale = 0.78; xOffset = distance > 0 ? 560 : -560; zIndex = 30; opacity = 0.8; }
              else { scale = 0.6; xOffset = distance > 0 ? 800 : -800; zIndex = 10; opacity = 0; }

              return (
                <motion.div
                  key={slide.id}
                  className="absolute top-1/2 left-1/2 w-[320px] h-105 -ml-40 -mt-52.5 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 bg-neutral-100 transform-gpu"
                  style={{ zIndex }}
                  animate={{ x: xOffset, scale, opacity }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  onClick={() => {
                    if (distance === 1) nextSlide();
                    if (distance === -1) prevSlide();
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 ease-out"
                      priority={isActive}
                      unoptimized
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/90 z-10 pointer-events-none" />
                  <span className="absolute left-5 top-5 z-20 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/10 select-none">
                    {slide.type}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col gap-1.5 transform-gpu">
                    <div className={`transition-all duration-500 transform ease-out ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                      <p className="text-xs font-bold text-gray-300 tracking-wider uppercase opacity-80">{slide.country}</p>
                      <h3 className="text-2xl font-bold text-white tracking-wide leading-tight">{slide.title}</h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            <button onClick={prevSlide} aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 bg-white text-gray-700 shadow-xs hover:bg-neutral-50 hover:text-gray-900 transition active:scale-95 cursor-pointer">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextSlide} aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 bg-white text-gray-700 shadow-xs hover:bg-neutral-50 hover:text-gray-900 transition active:scale-95 cursor-pointer">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destination;
