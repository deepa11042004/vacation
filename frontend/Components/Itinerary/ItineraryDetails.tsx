"use client";

import { useState, useEffect } from "react";
import FallbackImage from "@/Components/Shared/FallbackImage";
import CtaButton from "@/UI/CtaButton";
import { itineraryImageFallback } from "@/lib/imageUrl";
import {
  MapPin,
  CalendarDays,
  Sun,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export interface ItineraryScheduleItem {
  day: string;
  title: string;
  desc: string;
}

export interface ItineraryData {
  id: number;
  slug: string;
  name: string;
  destination: string;
  type: "DOMESTIC" | "INTERNATIONAL";
  category?: string | null;
  badge?: string | null;
  duration?: string | null;
  days: number;
  nights: number;
  best_time?: string | null;
  short_desc?: string | null;
  images: string[];
  highlights: string[];
  inclusions: string[];
  schedule: ItineraryScheduleItem[];
}

export default function ItineraryDetails({ itinerary }: { itinerary: ItineraryData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = itinerary.images.length > 0 ? itinerary.images : [itineraryImageFallback(itinerary.id)];

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, galleryImages.length]);

  const heroImage = galleryImages[0];
  const thumbImages = galleryImages.slice(1, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-3xl overflow-hidden mb-10 h-[320px] md:h-[460px]">
        <button
          onClick={() => openGallery(0)}
          className="relative md:col-span-2 md:row-span-2 h-full w-full group overflow-hidden"
        >
          <FallbackImage
            src={heroImage}
            fallbackSrc={itineraryImageFallback(itinerary.id)}
            alt={itinerary.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
        </button>
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
          {thumbImages.map((img, i) => (
            <button
              key={i}
              onClick={() => openGallery(i + 1)}
              className="relative w-full h-full group overflow-hidden"
            >
              <FallbackImage
                src={img}
                fallbackSrc={itineraryImageFallback(itinerary.id)}
                alt={`${itinerary.name} ${i + 2}`}
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              {i === thumbImages.length - 1 && galleryImages.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                  +{galleryImages.length - 5} more
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
          <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-white/80 hover:text-white">
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={() => setCurrentIndex((p) => (p - 1 + galleryImages.length) % galleryImages.length)}
            className="absolute left-4 sm:left-8 text-white/70 hover:text-white"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl h-[70vh] mx-4">
            <FallbackImage
              src={galleryImages[currentIndex]}
              fallbackSrc={itineraryImageFallback(itinerary.id)}
              alt={itinerary.name}
              fill
              sizes="90vw"
              className="object-contain"
              unoptimized
            />
          </div>
          <button
            onClick={() => setCurrentIndex((p) => (p + 1) % galleryImages.length)}
            className="absolute right-4 sm:right-8 text-white/70 hover:text-white"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            {itinerary.badge && (
              <span className="inline-block bg-neutral-100 text-neutral-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                {itinerary.badge}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-3 leading-snug">
              {itinerary.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500 font-medium">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{itinerary.destination}</span>
              {itinerary.duration && (
                <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />{itinerary.duration}</span>
              )}
              {itinerary.best_time && (
                <span className="flex items-center gap-1.5"><Sun className="w-4 h-4" />Best time: {itinerary.best_time}</span>
              )}
            </div>
            {itinerary.short_desc && (
              <p className="mt-5 text-neutral-600 leading-relaxed">{itinerary.short_desc}</p>
            )}
          </div>

          {itinerary.highlights.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E8C15B]" /> Trip Highlights
              </h2>
              <ul className="space-y-2.5">
                {itinerary.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                    <CheckCircle2 className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {itinerary.schedule.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-5">Day-by-Day Itinerary</h2>
              <div className="space-y-6">
                {itinerary.schedule.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-9 h-9 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                      {i < itinerary.schedule.length - 1 && <div className="w-px flex-1 bg-neutral-200 mt-1" />}
                    </div>
                    <div className="pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">{item.day}</span>
                      <h3 className="text-base font-bold text-neutral-900 mt-0.5 mb-1.5">{item.title}</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs p-6">
              <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Duration</span>
                  <span className="font-semibold text-neutral-900">{itinerary.duration ?? `${itinerary.days}D / ${itinerary.nights}N`}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Type</span>
                  <span className="font-semibold text-neutral-900">{itinerary.type === "DOMESTIC" ? "Domestic" : "International"}</span>
                </div>
                {itinerary.category && (
                  <div className="col-span-2">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Category</span>
                    <span className="font-semibold text-neutral-900">{itinerary.category}</span>
                  </div>
                )}
              </div>
              <CtaButton text="Enquire Now" variant="blue" size="md" href="/travel-desk" className="w-full justify-center" />
            </div>

            {itinerary.inclusions.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs p-6">
                <h2 className="text-base font-bold text-neutral-900 mb-4">What&apos;s Included</h2>
                <ul className="space-y-2.5">
                  {itinerary.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
