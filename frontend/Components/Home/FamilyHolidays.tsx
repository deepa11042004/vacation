"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const TABS = ["DESTINATIONS", "INTERNATIONAL", "FAMILY-FIRST"];

const CARDS = [
  {
    id: 1,
    title: "Peaceful escapes with vibrant views",
    tab: "DESTINATIONS",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    title: "Access to 5000+ resorts worldwide",
    tab: "INTERNATIONAL",
    image:
      "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Spacious, premium stays for families",
    tab: "FAMILY-FIRST",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80",
  },
];

const FamilyHolidays = ({ hideBackground = false }: { hideBackground?: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const activeTab = CARDS[currentIndex].tab;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % CARDS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length);
  }, []);

  const selectTab = (tab: string) => {
    const index = CARDS.findIndex((c) => c.tab === tab);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className={`relative w-full py-20 px-6 sm:px-10 lg:px-14 select-none font-display ${hideBackground ? '' : 'overflow-hidden bg-white'}`}>
      {/* Subtle Background Texture */}
      {!hideBackground && (
        <div className="absolute top-0 right-0 w-full h-full z-0 opacity-40 pointer-events-none">
          <Image
            src="/Img/white-texture.png"
            alt="Wavy texture"
            fill
            className="object-cover object-right-top"
          />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-950 text-center leading-tight max-w-4xl">
          Welcome to a new era of family-first holidays
        </h2>
        <p className="text-base sm:text-lg text-gray-500 text-center max-w-3xl mt-6 leading-relaxed">
          Step into India's largest premium leisure resort chain, where nature,
          comfort, and togetherness come alive! With over 5,000 partner resorts
          worldwide, we invite you and your family to experience unforgettable
          holidays crafted with care.
        </p>

        {/* Tabs Section */}
        <div className="w-full flex items-center justify-center mt-12 mb-10">
          <div className="flex-1 h-px bg-gray-200 hidden sm:block"></div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-4 sm:px-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => selectTab(tab)}
                className={`text-xs sm:text-sm font-semibold tracking-[0.2em] transition-colors duration-300 ${
                  activeTab === tab
                    ? "text-gray-950"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 h-px bg-gray-200 hidden sm:block"></div>
        </div>

        {/* Cards Showcase via Framer Motion */}
        <div className="relative w-full h-[400px] lg:h-[480px] flex items-center justify-center mt-6">
          {CARDS.map((card, index) => {
            let distance = index - currentIndex;
            if (distance < -1) distance += CARDS.length;
            if (distance > 1) distance -= CARDS.length;

            const isActive = distance === 0;
            let scale = 1, xOffset = "0%", zIndex = 10, opacity = 1;

            if (isActive) {
              scale = 1;
              xOffset = "0%";
              zIndex = 50;
            } else if (distance === 1) {
              scale = 0.85;
              xOffset = "105%";
              zIndex = 40;
            } else if (distance === -1) {
              scale = 0.85;
              xOffset = "-105%";
              zIndex = 40;
            }

            return (
              <motion.div
                key={card.id}
                className="absolute w-[280px] sm:w-[350px] lg:w-[450px] h-[340px] sm:h-[380px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer bg-neutral-100"
                style={{ zIndex }}
                animate={{ x: xOffset, scale, opacity }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => {
                  if (distance === 1) nextSlide();
                  if (distance === -1) prevSlide();
                }}
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                )}
                <div
                  className={`absolute bg-white/95 backdrop-blur-md rounded-xl text-center shadow-md transition-all duration-300 ${
                    isActive
                      ? "bottom-6 left-6 right-6 px-6 py-4"
                      : "bottom-4 left-4 right-4 px-4 py-3"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      isActive
                        ? "text-sm sm:text-base text-gray-900 font-semibold"
                        : "text-xs sm:text-sm text-gray-800"
                    }`}
                  >
                    {card.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={prevSlide}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-neutral-50 hover:text-gray-900 transition active:scale-95 z-50"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-neutral-50 hover:text-gray-900 transition active:scale-95 z-50"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FamilyHolidays;
