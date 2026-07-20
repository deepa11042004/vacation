"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Loader2, Minus } from "lucide-react";
import CtaButton from "@/UI/CtaButton";
import Badge from "@/UI/Badge";
import FallbackImage from "@/Components/Shared/FallbackImage";
import { hotelImageUrl, hotelImageFallback } from "@/lib/imageUrl";
import { stripHtml } from "@/lib/text";

interface HotelImage {
  image_id: number;
  image_path: string;
  sort_order: number;
}

interface Hotel {
  hotel_id: number;
  hotel_name: string;
  description?: string | null;
  location?: { location_id: number; location_name: string; country: string };
  images?: HotelImage[];
}

export default function DestinationHotelsPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "1";

  const [locationName, setLocationName] = useState("Destination");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/locations/${id}`).then((r) => r.json()),
      fetch(`/api/hotels?location_id=${id}&status=ACTIVE&limit=12`).then((r) => r.json()),
    ])
      .then(([locRes, hotelRes]) => {
        setLocationName(locRes?.data?.location_name ?? "Destination");
        setHotels(hotelRes?.data?.hotels ?? []);
        setTotal(hotelRes?.data?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  function coverImage(h: Hotel): string {
    const sorted = [...(h.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    return hotelImageUrl(sorted[0]?.image_path, h.hotel_id);
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
              {locationName}
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl font-medium">
              Explore our curated selection of stunning properties in {locationName} tailored for your
              perfect getaway.
            </p>
          </div>
        </div>

        {/* Grid */}
        {hotels.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">
            <p className="text-xl font-bold text-neutral-900 mb-2">No properties found</p>
            <p className="text-sm text-neutral-400">No hotels are listed for this destination yet.</p>
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
                  <FallbackImage
                    src={coverImage(hotel)}
                    fallbackSrc={hotelImageFallback(hotel.hotel_id)}
                    alt={hotel.hotel_name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    unoptimized
                  />
                </div>

                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center gap-2 text-neutral-500 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {hotel.location?.location_name ?? locationName}
                      {hotel.location?.country ? `, ${hotel.location.country}` : ""}
                    </span>
                  </div>
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
