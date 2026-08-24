"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import FallbackImage from "@/Components/Shared/FallbackImage";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80";

const CARDS = [
  {
    id: 1,
    location: "Naldehra",
    activity: "Village Tour",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    location: "Assonora",
    activity: "Eco-trail Escapade",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    location: "Madikeri",
    activity: "Elephant Bathing",
    image:
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    location: "Munnar",
    activity: "Tea Trails",
    image:
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    location: "Goa",
    activity: "Beach Walk",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    location: "Rishikesh",
    activity: "River Rafting",
    image:
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 7,
    location: "Darjeeling",
    activity: "Toy Train Ride",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 8,
    location: "Andaman",
    activity: "Scuba Diving",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 9,
    location: "Manali",
    activity: "Snow Trekking",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
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
        <div className="relative w-full h-[580px] sm:h-[640px] lg:h-[700px] flex items-center justify-center mt-12 mb-6">
          {CARDS.map((card, index) => {
            let distance = index - currentIndex;
            // Handle wrapping for any number of cards
            if (distance > Math.floor(CARDS.length / 2)) {
              distance -= CARDS.length;
            } else if (distance < -Math.floor(CARDS.length / 2)) {
              distance += CARDS.length;
            }

            const isActive = distance === 0;
            let scale = 0.8, xOffset = "0%", zIndex = 10, opacity = 0, rotate = 0; // hide extra cards

            if (isActive) {
              scale = 1;
              xOffset = "0%";
              zIndex = 50;
              rotate = 0;
              opacity = 1;
            } else if (distance === 1 || distance === -1) {
              scale = 0.9;
              xOffset = distance === 1 ? "105%" : "-105%";
              zIndex = 40;
              rotate = distance === 1 ? 6 : -6;
              opacity = 1;
            }

            return (
              <motion.div
                key={card.id}
                className="absolute w-[260px] sm:w-[300px] lg:w-[360px] h-[470px] sm:h-[520px] lg:h-[570px] rounded-[36px] overflow-hidden shadow-2xl cursor-pointer bg-neutral-100 flex flex-col justify-end"
                style={{ zIndex }}
                animate={{ x: xOffset, scale, opacity, rotate }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => {
                  if (distance === 1) nextSlide();
                  if (distance === -1) prevSlide();
                }}
              >
                {/* Background Image */}
                <FallbackImage
                  src={card.image}
                  fallbackSrc={FALLBACK_IMAGE}
                  alt={card.activity}
                  fill
                  className="object-cover absolute inset-0 z-0"
                />

                {/* White Fade Overlay for Inactive Cards */}
                {!isActive && (
                  <div className="absolute inset-0 z-[5] bg-white/60 backdrop-brightness-110 pointer-events-none" />
                )}

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
