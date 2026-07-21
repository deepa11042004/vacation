"use client";

import { useState, useEffect, useRef } from "react";
import { Building, MapPin, Search, CheckCircle2, Loader2 } from "lucide-react";
import { memberApi } from "@/lib/member-api";
import FallbackImage from "@/Components/Shared/FallbackImage";
import { hotelImageUrl, hotelImageFallback } from "@/lib/imageUrl";

interface HotelImage {
  image_id: number;
  image_path: string;
  sort_order: number;
}

interface Hotel {
  hotel_id: number;
  hotel_name: string;
  address?: string | null;
  property_type: string;
  hotel_type: string;
  status: string;
  description?: string | null;
  location_id: number;
  images?: HotelImage[];
}

const PAGE_LIMIT = 12;

export default function HotelsBenefitsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const isFirstRender = useRef(true);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset list back to page 1 when the search term changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setHotels([]);
    setPage(1);
  }, [debouncedSearch]);

  // Fetch — appends on load more, replaces on filter change
  useEffect(() => {
    const isMore = page > 1;
    if (isMore) setLoadingMore(true);
    else setLoading(true);

    const params = new URLSearchParams({ status: "ACTIVE", page: String(page), limit: String(PAGE_LIMIT) });
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

    setError("");
    memberApi.get<{ success: boolean; data: { hotels: Hotel[]; total: number } }>(`/hotels?${params}`)
      .then((res) => {
        if (!res?.success) throw new Error("API error");
        const incoming = Array.isArray(res.data?.hotels) ? res.data.hotels : [];
        setTotal(res.data?.total ?? 0);
        setHotels((prev) => {
          if (page === 1) return incoming;
          const seen = new Set(prev.map((h) => h.hotel_id));
          return [...prev, ...incoming.filter((h) => !seen.has(h.hotel_id))];
        });
      })
      .catch(() => {
        setError("Failed to load hotels.");
        if (page === 1) setHotels([]);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, [page, debouncedSearch]);

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

  function primaryImage(h: Hotel) {
    const sorted = [...(h.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    return hotelImageUrl(sorted[0]?.image_path, h.hotel_id);
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">Hotels & Benefits</h2>
          <p className="text-slate-500 max-w-2xl">
            Explore the exclusive network of properties accessible under your membership.
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hotels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all w-full md:w-72"
          />
        </div>
      </div>

      {error ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <p className="text-slate-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">No hotels found</h3>
                <p className="text-slate-500">
                  {debouncedSearch ? `No results for "${debouncedSearch}"` : "No hotels available."}
                </p>
              </div>
            ) : (
              hotels.map((hotel) => {
                const img = primaryImage(hotel);
                return (
                  <div key={hotel.hotel_id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] group hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <div className="h-48 relative overflow-hidden bg-slate-100">
                      <FallbackImage
                        src={img}
                        fallbackSrc={hotelImageFallback(hotel.hotel_id)}
                        alt={hotel.hotel_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                          {hotel.property_type.replace(/_/g, " ")}
                        </span>
                        <h3 className="mt-1 text-xl font-bold text-white font-marcellus truncate">{hotel.hotel_name}</h3>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      {hotel.address && (
                        <div className="flex items-center text-sm text-slate-600 mb-4 font-medium">
                          <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                          <span className="truncate">{hotel.address}</span>
                        </div>
                      )}
                      {hotel.description && (
                        <p className="text-sm text-slate-500 line-clamp-3 mb-4">{hotel.description}</p>
                      )}
                      <div className="mt-auto flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-sm text-slate-700 font-medium capitalize">
                          {hotel.hotel_type.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Infinite scroll sentinel */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center h-10">
              {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
