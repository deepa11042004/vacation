"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Building, MapPin, Search, CheckCircle2, Loader2 } from "lucide-react";
import { memberApi } from "@/lib/member-api";
import { hotelImageUrl } from "@/lib/imageUrl";

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

export default function HotelsBenefitsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    memberApi.get<{ success: boolean; data: { hotels: Hotel[]; total: number } }>("/hotels?status=ACTIVE&limit=50")
      .then((res) => {
        if (res?.success) setHotels(Array.isArray(res.data?.hotels) ? res.data.hotels : []);
        else setError("Failed to load hotels.");
      })
      .catch(() => setError("Failed to load hotels."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  const filtered = hotels.filter((h) =>
    !searchTerm ||
    h.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.address ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  function primaryImage(h: Hotel) {
    if (!h.images?.length) return null;
    const sorted = [...h.images].sort((a, b) => a.sort_order - b.sort_order);
    return hotelImageUrl(sorted[0].image_path);
  }

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
              <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">No hotels found</h3>
              <p className="text-slate-500">
                {searchTerm ? `No results for "${searchTerm}"` : "No hotels available."}
              </p>
            </div>
          ) : (
            filtered.map((hotel) => {
              const img = primaryImage(hotel);
              return (
                <div key={hotel.hotel_id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] group hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <div className="h-48 relative overflow-hidden bg-slate-100">
                    {img ? (
                      <Image src={img} alt={hotel.hotel_name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building className="w-10 h-10 text-slate-300" />
                      </div>
                    )}
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
      )}
    </div>
  );
}
