"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { MapPin, Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

// Types
interface ItineraryItem {
  id: string;
  country: string;
  title: string;
  description: string;
  image: string;
}

// Data
const itinerariesData: ItineraryItem[] = [
  {
    id: "1",
    country: "United Arab Emirates",
    title: "Dubai — Desert Dreams & City Glamour",
    description:
      "Explore Jumeirah Mosque, Gold Souk, Dubai Mall, Spice Souk, and the historic Bastakiya Square. Drive past Atlantis, The Palm, and end with an unforgettable desert safari experience.",
    image:
      "https://images.unsplash.com/photo-1739900292622-a7f860175aad?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    country: "India",
    title: "Goa — Sun, Sand & Soul",
    description:
      "Goa offers much more than its famous party scene. Rich legacy, history, culture, and sun-soaked beaches make it a perfect destination for every kind of traveller seeking joy.",
    image:
      "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    country: "Indonesia",
    title: "Bali — Enchanting Island of Gods",
    description:
      "Bali's enchanting beauty, rich culture, and serene beaches create an unforgettable experience. Whether you seek adventure or relaxation, Bali has it all for you.",
    image:
      "https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?w=800&auto=format&fit=crop&q=80",
  },
];

// Animation Variants
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

// Card Component
interface CardProps {
  item: ItineraryItem;
}

function ItineraryCard({ item }: CardProps) {
  return (
    <motion.article
      variants={fadeInUp}
      className="group flex flex-col h-full bg-blue-50 border border-gray-300 rounded-3xl overflow-hidden
                 hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform-gpu"
    >
      {/* ── Image ── */}
      <div className="relative h-64 w-full overflow-hidden shrink-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-w-768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/60 pointer-events-none z-10" />
      </div>

      {/* ── Body ── */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        {/* Country */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-widest">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{item.country}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-950 leading-snug tracking-wide line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {item.description}
        </p>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between gap-2">
          <CtaButton
            text="Explore"
            variant="white"
            size="sm"
            href="/travel-desk"
          />
        </div>
      </div>
    </motion.article>
  );
}

// Main Section
export default function Itinerary() {
  return (
    <section className="w-full rounded-b-[6vw] bg-[#D4AF37] px-6 py-20 sm:px-10 lg:px-14 font-display">
        <div className="mx-auto max-w-7xl">
          {/* ── Header Layout ── */}
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
                Exclusive Itinerary
              </h2>
              <CtaButton
                text="See More Itineraries"
                variant="white"
                size="md"
                href="/destination#destinations"
                className="self-start sm:self-auto"
              />
            </div>
          </div>

          {/* ── Cards Grid ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {itinerariesData.map((item) => (
              <ItineraryCard key={item.id} item={item} />
            ))}
          </motion.div>
        </div>
    </section>
  );
}
