/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CtaButton from "@/UI/CtaButton";
import { hotelImageUrl } from "@/lib/imageUrl";
import { stripHtml } from "@/lib/text";

interface HotelImage {
  image_id: number;
  image_path: string;
  sort_order: number;
}

interface Hotel {
  hotel_id: number;
  hotel_code: string;
  hotel_name: string;
  property_type: string;
  hotel_type: string;
  status: string;
  description?: string | null;
  location?: { location_id: number; location_name: string; country: string };
  images?: HotelImage[];
}

interface LocationTab {
  location_id: number;
  location_name: string;
}

interface AllHotelsProps {
  type?: "all" | "associated" | "internal";
}

type Category = "ALL" | "ASSOCIATED" | "INTERNAL";

const limit = 12;

export default function AllHotels({ type = "all" }: AllHotelsProps) {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const isFirstRender = useRef(true);
  const [activeCategory, setActiveCategory] = useState<Category>(
    type === "all" ? "ALL" : type === "associated" ? "ASSOCIATED" : "INTERNAL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Dynamic location tabs
  const [locationTabs, setLocationTabs] = useState<LocationTab[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [activeLocationName, setActiveLocationName] = useState("All");
  const [showAllTabs, setShowAllTabs] = useState(false);
  const TAB_LIMIT = 20;

  // Fetch location tabs on mount
  useEffect(() => {
    fetch("/api/locations?status=ACTIVE&limit=100")
      .then((r) => r.json())
      .then((res) => {
        if (res?.success) setLocationTabs(res.data?.locations ?? []);
      })
      .catch(() => {});
  }, []);

  const handleLocationClick = (locationId: number | null, locationName: string) => {
    setSelectedLocationId(locationId);
    setActiveLocationName(locationName);
  };

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset list back to page 1 when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setHotels([]);
    setPage(1);
  }, [activeCategory, debouncedSearch, selectedLocationId]);

  // Fetch — appends on load more, replaces on filter change
  useEffect(() => {
    const isMore = page > 1;
    if (isMore) setLoadingMore(true);
    else setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status: "ACTIVE",
    });
    if (activeCategory === "ASSOCIATED") params.set("property_type", "ASSOCIATED_PROPERTY");
    if (activeCategory === "INTERNAL") params.set("property_type", "INTERNAL_PROPERTY");
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (selectedLocationId !== null) params.set("location_id", String(selectedLocationId));

    setError("");
    fetch(`/api/hotels?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res?.success) throw new Error(res?.message ?? "API error");
        const incoming: Hotel[] = res?.data?.hotels ?? [];
        setTotal(res?.data?.total ?? 0);
        setHotels((prev) => {
          if (page === 1) return incoming;
          const seen = new Set(prev.map((h) => h.hotel_id));
          return [...prev, ...incoming.filter((h) => !seen.has(h.hotel_id))];
        });
      })
      .catch((e) => {
        console.error("Hotels API:", e);
        setError(e.message);
        if (page === 1) setHotels([]);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, [page, activeCategory, debouncedSearch, selectedLocationId]);

  const hasMore = hotels.length < total;

  // Auto-load the next page when the sentinel scrolls into view
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore]);

  function coverImage(h: Hotel): string {
    const sorted = [...(h.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    return hotelImageUrl(sorted[0]?.image_path);
  }

  return (
    <section className="bg-white text-black py-24 px-6 sm:px-12 relative overflow-hidden w-full select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Category filter — only on main /hotels route */}
        {type === "all" && (
          <div className="flex flex-wrap gap-3 items-center justify-center mb-16 border-b border-neutral-100 pb-8">
            {(["ALL", "ASSOCIATED", "INTERNAL"] as const).map((cat) => {
              const isSelected = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery("");
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or address..."
              className="bg-transparent text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none w-full font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-neutral-200 rounded-full transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            )}
          </div>
        </div>

        {/* Location Tabs — dynamic from API */}
        {locationTabs.length > 0 && (
          <div className="flex justify-center w-full mb-12 px-2">
            <div className="flex p-4 shadow-xs rounded-3xl max-w-4xl">
              <div className="flex flex-wrap justify-center gap-2 items-center w-full">
                {/* All tab */}
                <button
                  key="all"
                  onClick={() => handleLocationClick(null, "All")}
                  className={`relative cursor-pointer whitespace-nowrap shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-widest transition-colors uppercase duration-300 ${
                    activeLocationName === "All"
                      ? "bg-neutral-950 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-900 border border-neutral-200"
                  }`}
                >
                  {activeLocationName === "All" && (
                    <motion.span
                      layoutId="hotel-location-filter-pill"
                      className="absolute inset-0 rounded-full bg-neutral-950 shadow-md -z-10"
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  All
                </button>

                {/* Dynamic location tabs */}
                {(showAllTabs ? locationTabs : locationTabs.slice(0, TAB_LIMIT)).map((loc) => {
                  const isActive = activeLocationName === loc.location_name;
                  return (
                    <button
                      key={loc.location_id}
                      onClick={() => handleLocationClick(loc.location_id, loc.location_name)}
                      className={`relative cursor-pointer whitespace-nowrap shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-widest transition-colors uppercase duration-300 ${
                        isActive
                          ? "bg-neutral-950 text-white shadow-md"
                          : "text-gray-500 hover:text-gray-900 border border-neutral-200"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="hotel-location-filter-pill"
                          className="absolute inset-0 rounded-full bg-neutral-950 shadow-md -z-10"
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                      {loc.location_name}
                    </button>
                  );
                })}

                {/* More / Less toggle */}
                {locationTabs.length > TAB_LIMIT && (
                  <button
                    onClick={() => setShowAllTabs((v) => !v)}
                    className="whitespace-nowrap shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-dashed border-neutral-300 text-neutral-400 hover:text-neutral-700 hover:border-neutral-500 transition-colors duration-300"
                  >
                    {showAllTabs ? "Less" : `+${locationTabs.length - TAB_LIMIT} More`}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

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
                {hotels.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="col-span-full py-20 text-center flex flex-col items-center justify-center text-neutral-500"
                  >
                    <Search className="w-10 h-10 text-neutral-300 mb-4" />
                    <p className="text-xl font-bold text-neutral-900 mb-2">No hotels found</p>
                    <p className="text-sm text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                      Try a different search or category.
                    </p>
                  </motion.div>
                )}

                {hotels.map((hotel) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    key={hotel.hotel_id}
                    onClick={() => router.push(`/hotels/${hotel.hotel_id}`)}
                    className="flex flex-col justify-between items-start group cursor-pointer w-full bg-white rounded-3xl"
                  >
                    {/* Image */}
                    <div className="w-full relative aspect-4/3 rounded-3xl overflow-hidden shadow-xs mb-6 bg-neutral-100">
                      <Image
                        src={coverImage(hotel)}
                        alt={hotel.hotel_name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out brightness-[0.96]"
                        unoptimized
                      />
                    </div>

                    {/* Content */}
                    <div className="grow mb-6">
                      <span className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase mb-1 block">
                        {hotel.location?.location_name ?? ""}
                        {hotel.location?.country ? `, ${hotel.location.country}` : ""}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors leading-snug">
                        {hotel.hotel_name}
                      </h3>
                      <p className="text-neutral-500 font-light text-sm leading-relaxed tracking-wide line-clamp-3">
                        {stripHtml(hotel.description)}
                      </p>
                    </div>

                    <div className="w-full pt-2 border-t border-transparent mt-2">
                      <CtaButton text="Explore Now" variant="white" size="sm" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={sentinelRef} className="flex justify-center mt-14 h-10">
                {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
