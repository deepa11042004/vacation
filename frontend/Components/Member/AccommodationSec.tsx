"use client";

import React from "react";
import Image from "next/image";
import { BedDouble } from "lucide-react";

const ACCOMMODATIONS = [
  {
    id: 1,
    title: "1 BR Standard Room",
    occupancy: "4 Adults · 2 Children",
    description:
      "A premium, spacious layout comfortably hosting up to four adults and two children under the age of six.",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    title: "Studio Standard Room",
    occupancy: "2 Adults · 2 Children",
    description:
      "Our expansive studio suite — equivalent to two standard rooms — accommodates up to two adults and two children under six.",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
  },
  /*
  {
    id: 3,
    title: "2 BR Deluxe Suite",
    occupancy: "6 Adults · 2 Children",
    description:
      "An expansive two-bedroom suite offering opulent master bedrooms, private living quarters, and scenic balcony views.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    title: "Presidential Villa",
    occupancy: "8 Adults · 4 Children",
    description:
      "The pinnacle of luxury featuring private pool access, master king suites, and dedicated personalized butler service.",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
  },
  */
];

export default function AccommodationSec() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 font-display selection:bg-amber-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center flex flex-col items-center mb-14 sm:mb-16">
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#b8860b] mb-3">
            ACCOMMODATION
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
            Your home{" "}
            <span className="font-serif italic font-normal text-[#b8860b] relative inline-block border-b-2 border-[#b8860b]/40 pb-1">
              away from home
            </span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {ACCOMMODATIONS.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl p-4 sm:p-5 border border-neutral-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_35px_-10px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Occupancy Pill Overlay */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs sm:text-sm font-medium flex items-center gap-2 border border-white/10 shadow-lg">
                  <BedDouble className="w-4 h-4 text-amber-300" />
                  <span>{item.occupancy}</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="px-2 pb-3 flex flex-col flex-grow">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 tracking-tight group-hover:text-[#b8860b] transition-colors">
                  {item.title}
                </h3>
                <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
