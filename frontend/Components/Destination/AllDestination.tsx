/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CtaButton from "@/UI/CtaButton";
import FallbackImage from "@/Components/Shared/FallbackImage";
import { locationImageUrl, locationImageFallback } from "@/lib/imageUrl";
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

const PAGE_LIMIT = 6;

const FALLBACK_LOCATIONS: Location[] = [
  {
    location_id: 1,
    location_name: "Jaipur",
    country: "India",
    type: "DOMESTIC",
    location_image: "https://images.unsplash.com/photo-1722577359807-96d328b8b303?auto=format&fit=crop&w=1000&q=80",
    description: "Jaipur, the Pink City of Rajasthan, is known for its majestic forts, royal palaces, and vibrant cultural heritage.",
  },
  {
    location_id: 2,
    location_name: "Meghalaya",
    country: "India",
    type: "DOMESTIC",
    location_image: "https://images.unsplash.com/photo-1685271567656-84a60da957d9?auto=format&fit=crop&w=1000&q=80",
    description: "Meghalaya, the abode of clouds, offers breathtaking living root bridges, cascading waterfalls, and lush rolling green hills.",
  },
  {
    location_id: 3,
    location_name: "Banaras",
    country: "India",
    type: "DOMESTIC",
    location_image: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1000&q=80",
    description: "Varanasi, also known as Banaras or Kashi, is a sacred city on the banks of the Ganges river in Uttar Pradesh, India. Famous for its ancient ghats, Kashi Vishwanath Temple, and evening Ganga Aarti rituals, it is regarded as the spiritual capital of India.",
  },
  {
    location_id: 4,
    location_name: "Ayodhya",
    country: "India",
    type: "DOMESTIC",
    location_image: "https://images.unsplash.com/photo-1707613009581-9dfc1c911d35?auto=format&fit=crop&w=1000&q=80",
    description: "Ayodhya, a city on the banks of the Sarayu river in Uttar Pradesh, is the birthplace of Rama and setting of the great epic Ramayana.",
  },
  {
    location_id: 5,
    location_name: "Aurangabad",
    country: "India",
    type: "DOMESTIC",
    location_image: "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1000&q=80",
    description: "Aurangabad is a city in Maharashtra state, in India. It is known for the 17th-century marble Bibi ka Maqbara shrine, styled on the Taj Mahal.",
  },
  {
    location_id: 6,
    location_name: "Goa",
    country: "India",
    type: "DOMESTIC",
    location_image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",
    description: "Goa is India's premier beach paradise, famous for golden sand beaches, vibrant night markets, and Portuguese heritage architecture.",
  },
  {
    location_id: 7,
    location_name: "Male",
    country: "Maldives",
    type: "INTERNATIONAL",
    location_image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1000&q=80",
    description: "Male is the densely populated capital of the Maldives, known for its colorful buildings, historic mosques, and serene ocean views.",
  },
  {
    location_id: 8,
    location_name: "Bora Bora",
    country: "Maldives",
    type: "INTERNATIONAL",
    location_image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80",
    description: "Bora Bora is a tropical island surrounded by sand-fringed islets and a turquoise lagoon protected by a coral reef.",
  },
  {
    location_id: 9,
    location_name: "Dubai",
    country: "United Arab Emirates",
    type: "INTERNATIONAL",
    location_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80",
    description: "Dubai is a global city in the UAE known for luxury shopping, ultramodern architecture, desert safaris, and iconic skyscrapers.",
  },
];

interface LocationTab {
  location_id: number;
  location_name: string;
}

export default function AllDestination({ type = "all" }: AllDestinationProps) {
  const router = useRouter();
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category>(
    type === "all" ? "ALL" : type === "national" ? "NATIONAL" : "INTERNATIONAL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activePlace, setActivePlace] = useState("All");
  const [placeTabs, setPlaceTabs] = useState<LocationTab[]>([]);
  const [showAllTabs, setShowAllTabs] = useState(false);
  const TAB_LIMIT = 20;
  const isFirstRender = useRef(true);

  // Re-fetch place tabs whenever category changes
  useEffect(() => {
    setShowAllTabs(false);
    const params = new URLSearchParams({ status: "ACTIVE", limit: "200", sort: "name" });
    if (activeCategory === "NATIONAL") params.set("type", "DOMESTIC");
    if (activeCategory === "INTERNATIONAL") params.set("type", "INTERNATIONAL");
    fetch(`/api/locations?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && res.data?.locations?.length > 0) {
          setPlaceTabs(res.data.locations);
        } else {
          throw new Error("No place tabs");
        }
      })
      .catch(() => {
        let tabs = FALLBACK_LOCATIONS;
        if (activeCategory === "NATIONAL") tabs = tabs.filter((l) => l.type === "DOMESTIC");
        if (activeCategory === "INTERNATIONAL") tabs = tabs.filter((l) => l.type === "INTERNATIONAL");
        setPlaceTabs(tabs.map((l) => ({ location_id: l.location_id, location_name: l.location_name })));
      });
  }, [activeCategory]);

  const handlePlaceClick = (place: string) => {
    setActivePlace(place);
    setSearchQuery(place === "All" ? "" : place);
  };

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // When filters change, reset list back to page 1
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setAllLocations([]);
    setPage(1);
  }, [activeCategory, debouncedSearch]);

  // Fetch — appends on load more, replaces on filter change
  useEffect(() => {
    const isMore = page > 1;
    if (isMore) setLoadingMore(true);
    else setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_LIMIT),
      status: "ACTIVE",
      sort: "name",
    });
    if (activeCategory === "NATIONAL") params.set("type", "DOMESTIC");
    if (activeCategory === "INTERNATIONAL") params.set("type", "INTERNATIONAL");
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

    setError("");
    fetch(`/api/locations?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res?.success) throw new Error(res?.message ?? "API error");
        const incoming: Location[] = res?.data?.locations ?? [];
        if (incoming.length === 0) throw new Error("No data");
        setTotal(res?.data?.total ?? incoming.length);
        setAllLocations((prev) => {
          if (page === 1) return incoming;
          const seen = new Set(prev.map((l) => l.location_id));
          return [...prev, ...incoming.filter((l) => !seen.has(l.location_id))];
        });
      })
      .catch((e) => {
        console.error("Locations API fallback engaged:", e);
        setError("");
        let filtered = FALLBACK_LOCATIONS;
        if (activeCategory === "NATIONAL") filtered = filtered.filter((l) => l.type === "DOMESTIC");
        if (activeCategory === "INTERNATIONAL") filtered = filtered.filter((l) => l.type === "INTERNATIONAL");
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.trim().toLowerCase();
          filtered = filtered.filter(
            (l) => l.location_name.toLowerCase().includes(q) || l.country.toLowerCase().includes(q)
          );
        }
        setAllLocations(filtered);
        setTotal(filtered.length);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, [page, activeCategory, debouncedSearch]);

  const hasMore = allLocations.length < total;

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

  return (
    <section id="destinations" className="bg-white text-black py-24 px-6 sm:px-12 relative overflow-hidden w-full select-none">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Category filter */}
        {type === "all" && (
          <div className="flex flex-wrap gap-3 items-center justify-center mb-16 border-b border-neutral-100 pb-8">
            {(["ALL", "NATIONAL", "INTERNATIONAL"] as const).map((cat) => {
              const isSelected = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery("");
                    setActivePlace("All");
                  }}
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
                setActivePlace("");
              }}
              placeholder="Search by name or country..."
              className="bg-transparent text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none w-full font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActivePlace("All");
                }}
                className="p-1 hover:bg-neutral-200 rounded-full transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            )}
          </div>
        </div>

        {/* Place Tabs — static shortcuts */}
        <div className="flex justify-center w-full mb-12 px-2">
          <div className="flex p-4 shadow-xs rounded-3xl max-w-5xl">
            <div className="flex flex-wrap justify-center gap-2 items-center w-full">
              {/* All tab */}
              <button
                onClick={() => handlePlaceClick("All")}
                className={`relative cursor-pointer whitespace-nowrap shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-widest transition-colors uppercase duration-300 ${
                  activePlace === "All"
                    ? "bg-neutral-950 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900 border border-neutral-200"
                }`}
              >
                {activePlace === "All" && (
                  <motion.span
                    layoutId="dest-place-pill"
                    className="absolute inset-0 rounded-full bg-neutral-950 shadow-md -z-10"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                All
              </button>

              {(showAllTabs ? placeTabs : placeTabs.slice(0, TAB_LIMIT)).map((loc) => {
                const isActive = activePlace === loc.location_name;
                return (
                  <button
                    key={loc.location_id}
                    onClick={() => handlePlaceClick(loc.location_name)}
                    className={`relative cursor-pointer whitespace-nowrap shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-widest transition-colors uppercase duration-300 ${
                      isActive
                        ? "bg-neutral-950 text-white shadow-md"
                        : "text-gray-500 hover:text-gray-900 border border-neutral-200"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dest-place-pill"
                        className="absolute inset-0 rounded-full bg-neutral-950 shadow-md -z-10"
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    {loc.location_name}
                  </button>
                );
              })}

              {/* More / Less toggle */}
              {placeTabs.length > TAB_LIMIT && (
                <button
                  onClick={() => setShowAllTabs((v) => !v)}
                  className="whitespace-nowrap shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-dashed border-neutral-300 text-neutral-400 hover:text-neutral-700 hover:border-neutral-500 transition-colors duration-300"
                >
                  {showAllTabs ? "Less" : `+${placeTabs.length - TAB_LIMIT} More`}
                </button>
              )}
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
                {allLocations.length === 0 && (
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

                {allLocations.map((loc) => {
                  let img = locationImageUrl(loc.location_image, loc.location_id);
                  let desc = loc.description && loc.description.trim() ? stripHtml(loc.description) : "";

                  const nameLower = loc.location_name.toLowerCase();
                  if (nameLower === "banaras" || nameLower === "varanasi") {
                    img = "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1000&q=80";
                    if (!desc) {
                      desc = "Varanasi, also known as Banaras or Kashi, is a sacred city on the banks of the Ganges river in Uttar Pradesh, India. Famous for its ancient ghats, Kashi Vishwanath Temple, and evening Ganga Aarti rituals, it is regarded as the spiritual capital of India.";
                    }
                  }

                  return (
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
                        <FallbackImage
                          src={img}
                          fallbackSrc={locationImageFallback(loc.location_id)}
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
                          {desc || `${loc.location_name} is a premier destination in ${loc.country}, featuring historic landmarks, spiritual heritage, and breathtaking views.`}
                        </p>
                      </div>

                      <div className="w-full pt-2 border-t border-transparent mt-2">
                        <CtaButton text="Explore Now" variant="white" size="sm" />
                      </div>
                    </motion.div>
                  );
                })}
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
