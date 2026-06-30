"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MapPin, Clock, Play, X, Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

// Types
interface ItineraryItem {
  id: string;
  country: string;
  title: string;
  description: string;
  duration: string;
  badge: string;
  image: string;
  youtubeId: string;
}

// Data
const itinerariesData: ItineraryItem[] = [
  {
    id: "1",
    country: "United Arab Emirates",
    title: "Dubai — Desert Dreams & City Glamour",
    description:
      "Explore Jumeirah Mosque, Gold Souk, Dubai Mall, Spice Souk, and the historic Bastakiya Square. Drive past Atlantis, The Palm, and end with an unforgettable desert safari experience.",
    duration: "5 Nights / 6 Days",
    badge: "✈️ 5 Nights",
    image:
      "https://images.unsplash.com/photo-1739900292622-a7f860175aad?w=800&auto=format&fit=crop&q=80",
    youtubeId: "Hs4arPj29_I",
  },
  {
    id: "2",
    country: "India",
    title: "Goa — Sun, Sand & Soul",
    description:
      "Goa offers much more than its famous party scene. Rich legacy, history, culture, and sun-soaked beaches make it a perfect destination for every kind of traveller seeking joy.",
    duration: "4 Nights / 5 Days",
    badge: "🏝️ 4 Nights",
    image:
      "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&auto=format&fit=crop&q=80",
    youtubeId: "BoFGjD9Bv-k",
  },
  {
    id: "3",
    country: "Indonesia",
    title: "Bali — Enchanting Island of Gods",
    description:
      "Bali's enchanting beauty, rich culture, and serene beaches create an unforgettable experience. Whether you seek adventure or relaxation, Bali has it all for you.",
    duration: "6 Nights / 7 Days",
    badge: "🌺 6 Nights",
    image:
      "https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?w=800&auto=format&fit=crop&q=80",
    youtubeId: "BFS9n4B_2xA",
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

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 28, stiffness: 320 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 16,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Card Component
interface CardProps {
  item: ItineraryItem;
  onPlay: (id: string) => void;
}

function ItineraryCard({ item, onPlay }: CardProps) {
  return (
    <motion.article
      variants={fadeInUp}
      className="group flex flex-col h-full bg-white border border-gray-300 rounded-3xl overflow-hidden
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

        {/* Badge */}
        <span className="absolute top-4 left-4 z-20 bg-white/25 backdrop-blur-md border border-white/10 text-white text-xs font-medium px-4 py-1.5 rounded-full tracking-wide shadow-xs select-none">
          {item.badge}
        </span>

        {/* Play button */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <button
            onClick={() => onPlay(item.youtubeId)}
            aria-label={`Play video for ${item.title}`}
            className="w-12 h-12 rounded-full border border-white/40 bg-white/15 backdrop-blur-md
                       flex items-center justify-center cursor-pointer
                       group-hover:bg-blue-600 group-hover:border-blue-600
                       transition-all duration-300 shadow-md"
          >
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        {/* Country */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-widest">
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
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{item.duration}</span>
          </div>

          <CtaButton
            text="Explore"
            variant="white"
            size="sm"
            href={`/itinerary/${item.id}`}
          />
        </div>
      </div>
    </motion.article>
  );
}

// Video Modal
interface VideoModalProps {
  videoId: string | null;
  onClose: () => void;
}

function VideoModal({ videoId, onClose }: VideoModalProps) {
  return (
    <AnimatePresence>
      {videoId && (
        <motion.div
          key="overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close video"
              className="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-black/60 border border-white/20
                         flex items-center justify-center text-white hover:bg-white/15 transition-colors duration-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 16:9 iframe */}
            <div className="relative pt-[56.25%] w-full bg-neutral-900">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main Section
export default function Itinerary() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <>
      <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-14 font-display">
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
                href="/itinerary"
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
              <ItineraryCard
                key={item.id}
                item={item}
                onPlay={setActiveVideoId}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Video Modal ── */}
      <VideoModal
        videoId={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />
    </>
  );
}
