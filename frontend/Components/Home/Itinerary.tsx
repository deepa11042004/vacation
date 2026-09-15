"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { MapPin, Minus, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import FallbackImage from "@/Components/Shared/FallbackImage";
import { itineraryImageUrl, itineraryImageFallback } from "@/lib/imageUrl";

interface ItineraryItem {
  itinerary_id: number;
  slug: string;
  name: string;
  destination: string;
  badge?: string | null;
  duration?: string | null;
  short_desc?: string | null;
  image?: string | null;
}

const fallbackItineraries: ItineraryItem[] = [
  {
    itinerary_id: 1,
    slug: "goa-coastal-escape",
    name: "Goa Sunkissed Shores & Beach Serenity",
    destination: "Goa, India",
    badge: "🇮🇳 Coastal Luxury",
    duration: "5 Days / 4 Nights",
    short_desc: "Immerse yourself in golden sands, Portuguese architecture, vibrant beach shacks, spice plantations, and romantic Mandovi river sunset cruises.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    itinerary_id: 2,
    slug: "bali-island-paradise",
    name: "Bali Tropical Temples & Island Romance",
    destination: "Bali, Indonesia",
    badge: "🌐 Island of Gods",
    duration: "6 Days / 5 Nights",
    short_desc: "Experience the magic of Bali with lush Ubud rice terraces, clifftop Uluwatu sunsets, sacred temples, Nusa Penida island speedboat tours, and private pool villas.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    itinerary_id: 3,
    slug: "kashmir-paradise-valley",
    name: "Kashmir Valley of Serenity & Alpine Meadows",
    destination: "Srinagar, Gulmarg & Pahalgam, India",
    badge: "🇮🇳 Heaven On Earth",
    duration: "6 Days / 5 Nights",
    short_desc: "Drift on Dal Lake in heritage cedar houseboats, ride the world-highest Gulmarg Gondola over snow peaks, and stroll through Pahalgam pine valleys.",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
  },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

function ItineraryCard({ item }: { item: ItineraryItem }) {
  return (
    <motion.article
      variants={fadeInUp}
      className="group flex flex-col h-full bg-white/95 backdrop-blur-sm border border-neutral-200/80 rounded-3xl overflow-hidden
                 hover:border-neutral-900/30 hover:shadow-2xl transition-all duration-500 transform-gpu"
    >
      {/* Image */}
      <Link href={`/itinerary/${item.slug}`} className="relative h-64 w-full overflow-hidden shrink-0 block bg-neutral-100">
        <FallbackImage
          src={itineraryImageUrl(item.image, item.itinerary_id)}
          fallbackSrc={itineraryImageFallback(item.itinerary_id)}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          unoptimized
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />

        {/* Badge & Duration Pills */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
          {item.badge ? (
            <span className="bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
              {item.badge}
            </span>
          ) : (
            <span />
          )}
          {item.duration && (
            <span className="bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
              <CalendarDays className="w-3 h-3 text-[#D4AF37]" />
              {item.duration}
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        {/* Destination */}
        <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-bold uppercase tracking-widest">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span>{item.destination}</span>
        </div>

        {/* Title */}
        <Link href={`/itinerary/${item.slug}`}>
          <h3 className="text-xl font-bold text-neutral-950 leading-snug tracking-tight line-clamp-2 group-hover:text-[#B8860B] transition-colors">
            {item.name}
          </h3>
        </Link>

        {/* Description */}
        {item.short_desc && (
          <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 flex-1 font-light">
            {item.short_desc}
          </p>
        )}

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-neutral-100 flex items-center justify-between gap-2">
          <Link
            href={`/itinerary/${item.slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 group-hover:text-black transition-colors"
          >
            <span>View Full Itinerary</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
          </Link>
          <CtaButton
            text="Explore"
            variant="white"
            size="sm"
            href={`/itinerary/${item.slug}`}
          />
        </div>
      </div>
    </motion.article>
  );
}

export default function Itinerary() {
  const [itineraries, setItineraries] = useState<ItineraryItem[]>(fallbackItineraries);

  useEffect(() => {
    fetch("/api/itineraries?limit=6&status=ACTIVE")
      .then((r) => r.json())
      .then((res) => {
        const list = res?.data?.itineraries;
        if (Array.isArray(list) && list.length > 0) {
          setItineraries(list);
        }
      })
      .catch((err) => {
        console.error("Failed to load home itineraries:", err);
      });
  }, []);

  return (
    <section className="w-full rounded-b-[6vw] bg-[#D4AF37] px-6 py-20 sm:px-10 lg:px-14 font-display">
      <div className="mx-auto max-w-7xl">
        {/* Header Layout */}
        <div className="mb-12 w-full">
          <Badge
            text="Experience Luxury, Adventure & Culture"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-4"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
              Exclusive Itineraries
            </h2>
            <CtaButton
              text="See All Itineraries"
              variant="white"
              size="md"
              href="/itinerary"
              className="self-start sm:self-auto"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {itineraries.slice(0, 3).map((item) => (
            <ItineraryCard key={item.itinerary_id || item.slug} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
