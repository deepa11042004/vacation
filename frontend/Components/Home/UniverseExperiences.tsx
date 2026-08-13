"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const CARDS = [
  {
    id: 1,
    location: "Naldehra",
    activity: "Village Tour",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    location: "Assonora",
    activity: "Eco-trail Escapade",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    location: "Madikeri",
    activity: "Elephant Bathing",
    image:
      "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&w=1000&q=80",
  },
];

const UniverseExperiences = () => {
  const [currentIndex, setCurrentIndex] = useState(1);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % CARDS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full py-24 px-6 sm:px-10 lg:px-14 bg-white overflow-hidden font-display select-none">
      {/* Background Cloud Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Img/bg.png"
          alt="Cloud background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-950 text-center leading-tight">
          A Universe of Experiences
        </h2>
        <p className="text-base sm:text-lg text-gray-900 font-medium text-center max-w-3xl mt-4 leading-relaxed">
          Dive into a world of unforgettable moments, where every day brings a
          new adventure for you and your loved ones
        </p>

        {/* Cards Showcase via Framer Motion */}
        <div className="relative w-full h-[550px] lg:h-[650px] flex items-center justify-center mt-12 mb-6">
          {CARDS.map((card, index) => {
            let distance = index - currentIndex;
            if (distance < -1) distance += CARDS.length;
            if (distance > 1) distance -= CARDS.length;

            const isActive = distance === 0;
            let scale = 1,
              xOffset = "0%",
              zIndex = 10,
              opacity = 1,
              rotate = 0;

            if (isActive) {
              scale = 1;
              xOffset = "0%";
              zIndex = 50;
              rotate = 0;
            } else if (distance === 1) {
              scale = 0.9;
              xOffset = "58%";
              zIndex = 40;
              rotate = 6;
            } else if (distance === -1) {
              scale = 0.9;
              xOffset = "-58%";
              zIndex = 40;
              rotate = -6;
            }

            return (
              <motion.div
                key={card.id}
                className="absolute w-[220px] sm:w-[260px] lg:w-[310px] h-[420px] lg:h-[490px] rounded-[36px] overflow-hidden shadow-2xl cursor-pointer bg-neutral-100 flex flex-col justify-end"
                style={{ zIndex }}
                animate={{ x: xOffset, scale, opacity, rotate }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => {
                  if (distance === 1) nextSlide();
                  if (distance === -1) prevSlide();
                }}
              >
                {/* Background Image */}
                <Image
                  src={card.image}
                  alt={card.activity}
                  fill
                  className="object-cover absolute inset-0 z-0"
                />

                {/* Top Left Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                    <Leaf size={16} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-800">
                      {card.location}
                    </span>
                  </div>
                </div>

                {/* Bottom Card Element */}
                <div className="relative z-10 m-6 mt-auto bg-white rounded-2xl p-4 shadow-lg flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-950" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {card.location}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {card.activity}
                    </span>
                  </div>

                  {/* Segmented Progress Bars (Story Style) */}
                  <div className="flex gap-2 w-full h-1">
                    <div className="flex-1 bg-gray-300 rounded-full h-full"></div>
                    <div className="flex-1 bg-gray-100 rounded-full h-full"></div>
                    <div className="flex-1 bg-gray-100 rounded-full h-full"></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
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

export default UniverseExperiences;
