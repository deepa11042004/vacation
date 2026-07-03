"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import CtaButton from "@/UI/CtaButton";

import { AllHotelsList } from "@/data/mockData";

interface AllHotelsProps {
  type?: "all" | "associated" | "internal";
}

export default function AllHotels({ type = "all" }: AllHotelsProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<
    "ALL" | "ASSOCIATED" | "INTERNAL"
  >(type === "all" ? "ALL" : type === "associated" ? "ASSOCIATED" : "INTERNAL");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering Logic
  const filteredHotels = AllHotelsList.filter((hotel) => {
    let matchesCategory = true;
    if (activeCategory === "ALL") matchesCategory = true;
    else if (activeCategory === "ASSOCIATED")
      matchesCategory = hotel.category === "associated";
    else if (activeCategory === "INTERNAL")
      matchesCategory = hotel.category === "internal";

    let matchesSearch = true;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      matchesSearch =
        hotel.title.toLowerCase().includes(query) ||
        hotel.location.toLowerCase().includes(query) ||
        hotel.description.toLowerCase().includes(query);
    }

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-white text-black py-24 px-6 sm:px-12 relative overflow-hidden w-full select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 1. FILTERING CATEGORY NAVIGATION ROW (Only visible on main route) */}
        {type === "all" && (
          <div className="flex flex-wrap gap-3 items-center justify-center mb-16 border-b border-neutral-100 pb-8">
            {(["ALL", "ASSOCIATED", "INTERNAL"] as const).map((cat) => {
              const isSelected = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery(""); // Clear search when switching categories
                  }}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                    isSelected
                      ? "text-white"
                      : "text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="hotels-filter-pill"
                      className="absolute inset-0 bg-neutral-900 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10 text-xs tracking-widest uppercase">
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. SEARCH BAR */}
        <div className="max-w-md mx-auto mb-12 relative">
          <div className="relative flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-neutral-900 rounded-full px-5 py-3 transition-all duration-300 shadow-xs">
            <Search className="w-4 h-4 text-neutral-400 mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, or details..."
              className="bg-transparent text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none w-full font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-neutral-200 rounded-full transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            )}
          </div>
        </div>

        {/* 3. CARDS GRID */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredHotels.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="col-span-full py-20 text-center flex flex-col items-center justify-center text-neutral-500"
              >
                <Search className="w-10 h-10 text-neutral-300 mb-4" />
                <p className="text-xl font-bold text-neutral-900 mb-2">
                  No hotels found
                </p>
                <p className="text-sm text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                  We couldn&apos;t find any results matching &ldquo;
                  {searchQuery}&rdquo;. Try checking for typos or searching for
                  a different keyword.
                </p>
              </motion.div>
            )}

            {filteredHotels.map((hotel) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                key={hotel.id}
                onClick={() => router.push(`/hotels/${hotel.id}`)}
                className="flex flex-col justify-between items-start group cursor-pointer w-full bg-white rounded-3xl"
              >
                {/* Media Image Area Container */}
                <div className="w-full relative aspect-4/3 rounded-3xl overflow-hidden shadow-xs mb-6 bg-neutral-100">
                  <Image
                    src={hotel.image}
                    alt={`${hotel.title} - ${hotel.location}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out brightness-[0.96]"
                  />
                </div>

                {/* Location Name & Title Wrapper */}
                <div className="grow mb-6">
                  {/* Location Name */}
                  <span className="text-[11px] font-bold text-neutral-400 tracking-wider font-sans uppercase mb-1 block">
                    {hotel.location}
                  </span>

                  {/* Property Name */}
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors leading-snug">
                    {hotel.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-500 font-light text-sm leading-relaxed tracking-wide line-clamp-3">
                    {hotel.description}
                  </p>
                </div>

                {/* 3. Footer Action Call */}
                <div className="w-full pt-2 border-t border-transparent mt-2">
                  <CtaButton
                    text="Explore Now"
                    variant="white"
                    size="sm"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
