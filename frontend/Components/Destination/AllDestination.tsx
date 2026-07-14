/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CtaButton from "@/UI/CtaButton";
import { locationImageUrl } from "@/lib/imageUrl";
import { stripHtml } from "@/lib/text";

interface Location {
  location_id: number;
  location_name: string;
  country: string;
  type: "DOMESTIC" | "INTERNATIONAL";
  location_image?: string | null;
  description?: string | null;
}

interface AllDestinationProps {
  type?: "all" | "national" | "international";
}

type Category = "ALL" | "NATIONAL" | "INTERNATIONAL";

const LOCATIONS = [
  { name: "All", count: 0 }, // 0 or empty for 'All'
  { name: "Dehradun", count: 4 },
  { name: "Dalhousie", count: 3 },
  { name: "Varanasi", count: 5 },
  { name: "Kufri", count: 2 },
  { name: "Coimbatore", count: 4 },
  { name: "Chennai", count: 6 },
  { name: "Pondicherry", count: 3 },
  { name: "Coorg", count: 5 },
  { name: "Ayodhya", count: 2 },
  { name: "Vrindavan", count: 3 },
  { name: "Lucknow", count: 4 },
  { name: "Mahabaleshwar", count: 2 },
  { name: "Zirakpur", count: 1 },
  { name: "Lonavala", count: 4 },
  { name: "Indore", count: 3 },
  { name: "Vadodara", count: 2 },
];

export default function AllDestination({ type = "all" }: AllDestinationProps) {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category>(
    type === "all" ? "ALL" : type === "national" ? "NATIONAL" : "INTERNATIONAL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeLocation, setActiveLocation] = useState("All");

  const handleLocationClick = (loc: string) => {
    setActiveLocation(loc);
    if (loc === "All") {
      setSearchQuery("");
    } else {
      setSearchQuery(loc);
    }
  };

  const limit = 12;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, debouncedSearch]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status: "ACTIVE",
    });
    if (activeCategory === "NATIONAL") params.set("type", "DOMESTIC");
    if (activeCategory === "INTERNATIONAL") params.set("type", "INTERNATIONAL");
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

    setError("");
    fetch(`/api/locations?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res?.success) throw new Error(res?.message ?? "API error");
        setLocations(res?.data?.locations ?? []);
        setTotal(res?.data?.total ?? 0);
      })
      .catch((e) => { console.error("Locations API:", e); setError(e.message); setLocations([]); })
      .finally(() => setLoading(false));
  }, [page, activeCategory, debouncedSearch]);

  const totalPages = Math.ceil(total / limit);

  return (
    <section className="bg-white text-black py-24 px-6 sm:px-12 relative overflow-hidden w-full select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Category filter */}
        {type === "all" && (
          <div className="flex flex-wrap gap-3 items-center justify-center mb-16 border-b border-neutral-100 pb-8">
            {(["ALL", "NATIONAL", "INTERNATIONAL"] as const).map((cat) => {
              const isSelected = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearchQuery(""); }}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                    isSelected
                      ? "text-white"
                      : "text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="destination-filter-pill"
                      className="absolute inset-0 bg-neutral-900 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 text-xs tracking-widest uppercase">{cat}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="max-w-md mx-auto mb-12 relative">
          <div className="relative flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-neutral-900 rounded-full px-5 py-3 transition-all duration-300 shadow-xs">
            <Search className="w-4 h-4 text-neutral-400 mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveLocation("");
              }}
              placeholder="Search by name or country..."
              className="bg-transparent text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none w-full font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveLocation("All");
                }}
                className="p-1 hover:bg-neutral-200 rounded-full transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            )}
          </div>
        </div>

        {/* Location Tabs */}
        <div className="flex justify-center w-full mb-12 px-2">
          <div className="flex p-4 shadow-xs rounded-3xl max-w-4xl">
            <div className="flex flex-wrap justify-center gap-2 items-center w-full">
              {LOCATIONS.map((loc) => {
                const isActive = activeLocation === loc.name;
                return (
                  <button
                    key={loc.name}
                    onClick={() => handleLocationClick(loc.name)}
                    className={`relative cursor-pointer whitespace-nowrap shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-widest transition-colors uppercase duration-300 ${
                      isActive
                        ? "bg-neutral-950 text-white shadow-md"
                        : "text-gray-500 hover:text-gray-900 border border-neutral-200"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="destination-location-filter-pill"
                        className="absolute inset-0 rounded-full bg-neutral-950 shadow-md -z-10"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <span className="flex items-center justify-center gap-1.5">
                      <span>{loc.name}</span>
                      {loc.name !== "All" && loc.count > 0 && (
                        <span
                          className={`flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[10px] font-bold transition-colors duration-300 ${
                            isActive
                              ? "bg-white text-neutral-950"
                              : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                          }`}
                        >
                          {loc.count}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 text-sm">{error}</div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch"
            >
              <AnimatePresence mode="popLayout">
                {locations.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="col-span-full py-20 text-center flex flex-col items-center justify-center text-neutral-500"
                  >
                    <Search className="w-10 h-10 text-neutral-300 mb-4" />
                    <p className="text-xl font-bold text-neutral-900 mb-2">No destinations found</p>
                    <p className="text-sm text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                      Try a different search or category.
                    </p>
                  </motion.div>
                )}

                {locations.map((loc) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    key={loc.location_id}
                    onClick={() => router.push(`/destination/${loc.location_id}`)}
                    className="flex flex-col justify-between items-start group cursor-pointer w-full bg-white rounded-3xl"
                  >
                    <div className="w-full relative aspect-4/3 rounded-3xl overflow-hidden shadow-xs mb-6 bg-neutral-100">
                      <Image
                        src={locationImageUrl(loc.location_image)}
                        alt={`${loc.location_name} - ${loc.country}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out brightness-[0.96]"
                        unoptimized
                      />
                    </div>

                    <div className="grow mb-6">
                      <span className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase mb-1 block">
                        {loc.country}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors leading-snug">
                        {loc.location_name}
                      </h3>
                      <p className="text-neutral-500 font-light text-sm leading-relaxed tracking-wide line-clamp-3">
                        {stripHtml(loc.description)}
                      </p>
                    </div>

                    <div className="w-full pt-2 border-t border-transparent mt-2">
                      <CtaButton text="Explore Now" variant="white" size="sm" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-14">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-5 py-2 text-sm font-medium rounded-full border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-neutral-400">{page} / {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-5 py-2 text-sm font-medium rounded-full border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
