"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

// --- Types ---
interface SlideData {
  id: number;
  country: string;
  title: string;
  imageUrl: string;
  type: string;
}

// --- Mock Data ---
const slides: SlideData[] = [
  {
    id: 1,
    country: "Japan",
    title: "In het hart van Honshu",
    imageUrl: "https://plus.unsplash.com/premium_photo-1661964177687-57387c2cbd14?q=80&w=1170&auto=format&fit=crop",
    type: "Heritage Hub",
  },
  {
    id: 2,
    country: "Tibet & China",
    title: "Het dak van de wereld met de Hemeltrein",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    type: "Wonders Track",
  },
  {
    id: 3,
    country: "Costa Rica",
    title: "Het wilde zuiden van Costa Rica",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    type: "Spiritual Escape",
  },
  {
    id: 4,
    country: "Mexico",
    title: "Tesoros de México",
    imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=1170&auto=format&fit=crop",
    type: "Wilderness Oasis",
  },
  {
    id: 5,
    country: "Egypte",
    title: "Eeuwigheid langs de Nijl",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80",
    type: "Lakeside Luxury",
  },
  {
    id: 6,
    country: "Marokko",
    title: "Van Atlas tot Sahara",
    imageUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80",
    type: "Serene Retreat",
  },
];

const Destination = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section className="bg-white px-6 py-20 sm:px-10 lg:px-14 font-display w-full select-none">
      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* Header */}
        <div className="mb-12 w-full">
          <Badge
            text="Explore 200+ Destinations"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-4"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
              Popular Destinations
            </h2>
            <CtaButton
              text="View All Destinations"
              variant="white"
              size="md"
              className="self-start sm:self-auto"
            />
          </div>
        </div>

        {/* 3D Visual Stage Viewport */}
        <div className="relative w-full h-135 bg-white overflow-hidden flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
            {slides.map((slide, index) => {
              let distance = index - currentIndex;
              if (distance < -slides.length / 2) distance += slides.length;
              if (distance > slides.length / 2) distance -= slides.length;

              const isActive = distance === 0;

              let scale = 0.7;
              let xOffset = 0;
              let zIndex = 10;
              let opacity = 0.5;

              if (isActive) {
                scale = 1;
                xOffset = 0;
                zIndex = 50;
                opacity = 1;
              } else if (Math.abs(distance) === 1) {
                scale = 0.88;
                xOffset = distance > 0 ? 320 : -320;
                zIndex = 40;
                opacity = 1;
              } else if (Math.abs(distance) === 2) {
                scale = 0.78;
                xOffset = distance > 0 ? 560 : -560;
                zIndex = 30;
                opacity = 0.8;
              } else {
                scale = 0.6;
                xOffset = distance > 0 ? 800 : -800;
                zIndex = 10;
                opacity = 0;
              }

              return (
                <motion.div
                  key={slide.id}
                  className=" absolute top-1/2 left-1/2 w-[320px] h-105 -ml-40 -mt-52.5 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 bg-neutral-100 transform-gpu"
                  style={{ zIndex }}
                  animate={{ x: xOffset, scale, opacity }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  onClick={() => {
                    if (distance === 1) nextSlide();
                    if (distance === -1) prevSlide();
                  }}
                >
                  {/* Visual Media Layer via next/image */}
                  <div className="relative w-full h-full">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      sizes="(max-w-768px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 ease-out"
                      priority={isActive}
                    />
                  </div>

                  {/* Dark Contrast Vignette Layer */}
                  <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/90 z-10 pointer-events-none" />

                  {/* Top Left Pill Tag Category */}
                  <span className="absolute left-5 top-5 z-20 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/10 select-none">
                    {slide.type}
                  </span>

                  {/* Context Overlay — Animates cleanly on the active focus deck */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col gap-1.5 transform-gpu">
                    <div className={`transition-all duration-500 transform ease-out ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                      <p className="text-xs font-semibold text-gray-300 tracking-wider uppercase opacity-80">
                        {slide.country}
                      </p>
                      <h3 className="text-2xl font-bold text-white tracking-wide leading-tight">
                        {slide.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ─── Micro Controller Navigation Arrows ─── */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 bg-white text-gray-700 shadow-xs hover:bg-neutral-50 hover:text-gray-900 transition active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 bg-white text-gray-700 shadow-xs hover:bg-neutral-50 hover:text-gray-900 transition active:scale-95 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Destination;