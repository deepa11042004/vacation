"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Loader2, Minus } from "lucide-react";
import CtaButton from "@/UI/CtaButton";
import Badge from "@/UI/Badge";
import { hotelImageUrl } from "@/lib/imageUrl";
import { stripHtml } from "@/lib/text";

interface HotelImage {
  image_id: number;
  image_path: string;
  sort_order: number;
}

interface Hotel {
  hotel_id: number;
  hotel_name: string;
  hotel_type: string;
  description?: string | null;
  location?: { location_id: number; location_name: string; country: string };
  images?: HotelImage[];
}

const SLUG_TO_TYPE: Record<string, string> = {
  hotels: "HOTEL",
  resorts: "RESORT",
  villas: "VILLA",
  apartments: "APARTMENT",
  "vacation-homes": "HOMESTAY",
};

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function StayCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "hotels";

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const title = slugToTitle(slug);
  const hotelType = SLUG_TO_TYPE[slug] ?? null;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ status: "ACTIVE", limit: "12" });
    if (hotelType) params.set("hotel_type", hotelType);

    fetch(`/api/hotels?${params}`)
      .then((r) => r.json())
      .then((res) => {
        setHotels(res?.data?.hotels ?? []);
        setTotal(res?.data?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, hotelType]);

  function coverImage(h: Hotel): string {
    const sorted = [...(h.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    return hotelImageUrl(sorted[0]?.image_path);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 pt-32 pb-24 px-6 md:px-12 md:py-50 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-200 pb-8">
          <div className="flex flex-col gap-4">
            <Badge
              text={`${total}+ Properties Available`}
              variant="black"
              size="lg"
              icon={Minus}
              className="w-fit"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950">
              {title}
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl font-medium">
              Explore our curated selection of stunning {title.toLowerCase()} tailored for your perfect
              getaway.
            </p>
          </div>
        </div>

        {/* Grid */}
        {hotels.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">
            <p className="text-xl font-bold text-neutral-900 mb-2">No properties found</p>
            <p className="text-sm text-neutral-400">No {title.toLowerCase()} are listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                key={hotel.hotel_id}
                onClick={() => router.push(`/hotels/${hotel.hotel_id}`)}
                className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-neutral-100 group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={coverImage(hotel)}
                    alt={hotel.hotel_name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    unoptimized
                  />
                </div>

                <div className="p-6 flex flex-col grow">
                  {hotel.location && (
                    <div className="flex items-center gap-2 text-neutral-500 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {hotel.location.location_name}
                        {hotel.location.country ? `, ${hotel.location.country}` : ""}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-neutral-600 transition-colors">
                    {hotel.hotel_name}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                    {stripHtml(hotel.description)}
                  </p>

                  <div className="my-2">
                    <CtaButton text="View" size="sm" variant="blue" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
