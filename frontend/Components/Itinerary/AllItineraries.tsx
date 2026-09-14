/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, MapPin, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import CtaButton from "@/UI/CtaButton";
import FallbackImage from "@/Components/Shared/FallbackImage";
import { itineraryImageUrl, itineraryImageFallback } from "@/lib/imageUrl";

interface Itinerary {
  itinerary_id: number;
  slug: string;
  name: string;
  destination: string;
  type: "DOMESTIC" | "INTERNATIONAL";
  category?: string | null;
  badge?: string | null;
  duration?: string | null;
  image?: string | null;
  short_desc?: string | null;
}

type Category = "ALL" | "DOMESTIC" | "INTERNATIONAL";

const limit = 12;

export default function AllItineraries() {
  const router = useRouter();
  const [items, setItems] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const isFirstRender = useRef(true);
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setItems([]);
    setPage(1);
  }, [activeCategory, debouncedSearch]);

  useEffect(() => {
    const isMore = page > 1;
    if (isMore) setLoadingMore(true);
    else setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status: "ACTIVE",
    });
    if (activeCategory !== "ALL") params.set("type", activeCategory);
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

    setError("");
    fetch(`/api/itineraries?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res?.success) throw new Error(res?.message ?? "API error");
        const incoming: Itinerary[] = res?.data?.itineraries ?? [];
        setTotal(res?.data?.total ?? 0);
        setItems((prev) => {
          if (page === 1) return incoming;
          const seen = new Set(prev.map((h) => h.itinerary_id));
          return [...prev, ...incoming.filter((h) => !seen.has(h.itinerary_id))];
        });
      })
      .catch((e) => {
        console.error("Itineraries API:", e);
        setError(e.message);
        if (page === 1) setItems([]);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, [page, activeCategory, debouncedSearch]);

  const hasMore = items.length < total;

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

  return (
    <section className="bg-white text-black py-24 px-6 sm:px-12 relative overflow-hidden w-full select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-3 items-center justify-center mb-16 border-b border-neutral-100 pb-8">
          {(["ALL", "DOMESTIC", "INTERNATIONAL"] as const).map((cat) => {
            const isSelected = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                  isSelected
                    ? "text-white"
                    : "text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="itinerary-filter-pill"
                    className="absolute inset-0 bg-neutral-900 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 text-xs tracking-widest uppercase">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-16 relative">
          <div className="relative flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-neutral-900 rounded-full px-5 py-3 transition-all duration-300 shadow-xs">
            <Search className="w-4 h-4 text-neutral-400 mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or destination..."
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
                {items.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="col-span-full py-20 text-center flex flex-col items-center justify-center text-neutral-500"
                  >
                    <Search className="w-10 h-10 text-neutral-300 mb-4" />
                    <p className="text-xl font-bold text-neutral-900 mb-2">No itineraries found</p>
                    <p className="text-sm text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                      Try a different search or category.
                    </p>
                  </motion.div>
                )}

                {items.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    key={item.itinerary_id}
                    onClick={() => router.push(`/itinerary/${item.slug}`)}
                    className="flex flex-col justify-between items-start group cursor-pointer w-full bg-white rounded-3xl"
                  >
                    {/* Image */}
                    <div className="w-full relative aspect-4/3 rounded-3xl overflow-hidden shadow-xs mb-6 bg-neutral-100">
                      <FallbackImage
                        src={itineraryImageUrl(item.image, item.itinerary_id)}
                        fallbackSrc={itineraryImageFallback(item.itinerary_id)}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out brightness-[0.97]"
                        unoptimized
                      />
                      {item.badge && (
                        <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-[11px] font-bold px-3 py-1.5 rounded-full text-white shadow-sm">
                          {item.badge}
                        </span>
                      )}
                      {item.category && (
                        <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-[11px] font-bold px-3 py-1.5 rounded-full text-neutral-900 shadow-sm">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="grow mb-6">
                      <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-bold uppercase tracking-widest mb-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.destination}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mb-2 group-hover:text-neutral-600 transition-colors leading-snug line-clamp-2">
                        {item.name}
                      </h3>
                      {item.duration && (
                        <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-semibold mb-3">
                          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.duration}</span>
                        </div>
                      )}
                      <p className="text-neutral-500 font-light text-sm leading-relaxed tracking-wide line-clamp-3">
                        {item.short_desc}
                      </p>
                    </div>

                    <div className="w-full pt-2 border-t border-transparent mt-2">
                      <CtaButton text="View Itinerary" variant="white" size="sm" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

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
