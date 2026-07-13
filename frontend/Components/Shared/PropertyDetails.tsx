"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Star,
  Sofa,
  BedDouble,
  Bath,
  WashingMachine,
  ChefHat,
  Wind,
  Refrigerator,
  Wifi,
  Waves,
  Clock,
  ParkingCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export interface PropertyData {
  id: number | string;
  title: string;
  location: string;
  description: string;
  image: string; // main image
  rating?: number;
  subImages?: string[]; // array for extra photos
}

interface PropertyDetailsProps {
  property: PropertyData;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // image
  const dummyImages = [
    // Top Left (Main Suite)
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80",
    // Top Right 1 (Bedroom View)
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
    // Top Right 2 (Bathroom)
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    // Bottom 1 (Hallway)
    "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=600&auto=format&fit=crop&q=80",
    // Bottom 2 (Exterior Night)
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80",
    // Bottom 3 (Balcony/View)
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80",
    // Bottom 4 (Living Lounge)
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&auto=format&fit=crop&q=80",
    // Bottom 5 (Dining Area/Overlay base)
    "https://images.pexels.com/photos/29000037/pexels-photo-29000037.jpeg",
  ];

  const galleryImages =
    property.subImages && property.subImages.length >= 7
      ? [property.image, ...property.subImages]
      : dummyImages;

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 bg-neutral-50/30 min-h-screen text-neutral-900">
      {/* --- Image Gallery  --- */}
      <div className="space-y-3 mb-10">
        {/* Top Split Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[45vh] md:h-120">
          {/* Main Large Left Panel */}
          <div
            className="relative md:col-span-2 h-full rounded-xl overflow-hidden cursor-pointer group shadow-sm"
            onClick={() => openGallery(0)}
          >
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
              priority
              unoptimized
            />
          </div>

          {/* Stacked Right Panel */}
          <div className="hidden md:flex flex-col gap-3 h-full col-span-1">
            <div
              className="relative w-full h-1/2 rounded-xl overflow-hidden cursor-pointer group shadow-sm"
              onClick={() => openGallery(1)}
            >
              <Image
                src={galleryImages[1]}
                alt="Room detail view"
                fill
                className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
                unoptimized
              />
            </div>
            <div
              className="relative w-full h-1/2 rounded-xl overflow-hidden cursor-pointer group shadow-sm"
              onClick={() => openGallery(2)}
            >
              <Image
                src={galleryImages[2]}
                alt="Bathroom space"
                fill
                className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Row Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 h-[14vh] md:h-31.25">
          {galleryImages.slice(3, 8).map((img, index) => {
            const actualIndex = index + 3;
            const isLast = index === 4;

            return (
              <div
                key={actualIndex}
                className={`relative w-full h-full rounded-xl overflow-hidden cursor-pointer group shadow-sm ${
                  index >= 2 ? "hidden sm:block" : "" // responsive handling for tight screens
                } ${index >= 4 ? "hidden md:block" : ""}`}
                onClick={() => openGallery(actualIndex)}
              >
                <Image
                  src={img}
                  alt={`Gallery tile ${actualIndex}`}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  unoptimized
                />
                {isLast && (
                  <div className="absolute inset-0 bg-neutral-900/40 group-hover:bg-neutral-900/50 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold text-lg border-b-2 border-white tracking-wide pb-0.5">
                      +5 photos
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Gallery View --- */}
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md py-6">
          {/* Top Bar Navigation Actions */}
          <div className="w-full flex items-center justify-between px-6 md:px-12">
            <span className="text-neutral-200 text-sm font-semibold tracking-wider bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-xs">
              {currentIndex + 1} / {galleryImages.length}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 text-neutral-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Main Stage Frame */}
          <div className="relative w-full max-w-5xl h-[60vh] px-4 flex items-center justify-between gap-4">
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) =>
                    (prev - 1 + galleryImages.length) % galleryImages.length,
                )
              }
              className="p-3 text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all shrink-0"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <div className="relative w-full h-full max-h-[55vh]">
              <Image
                src={galleryImages[currentIndex]}
                alt={`Active lightbox slide ${currentIndex + 1}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
              }
              className="p-3 text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all shrink-0"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>

          {/* Bottom Synchronized Scrub Strip */}
          <div className="w-full max-w-5xl px-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start md:justify-center scrollbar-none">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden transition-all border-2 ${
                    idx === currentIndex
                      ? "border-blue-500 scale-105 opacity-100 ring-4 ring-blue-500/20"
                      : "border-transparent opacity-40 hover:opacity-70"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumb map ${idx}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Content Area --- */}
      <div className="max-w-4xl mx-auto md:mx-0 w-full space-y-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {property.title}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-neutral-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-neutral-700 font-bold ml-1">
                {property.rating || 5}
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
            {property.description}
          </p>
          <button className="mt-4 text-sm font-bold border-b border-neutral-900 pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-colors">
            Read More
          </button>
        </div>

        {/* Amenities Section */}
        <div className="border border-neutral-200 rounded-2xl p-6 md:p-8 bg-white shadow-xs">
          <h3 className="text-xl font-bold mb-6">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 text-sm text-neutral-600">
            <div className="flex items-center gap-3">
              <Sofa className="w-5 h-5 text-neutral-400" />
              <span>Lounge chairs : 2</span>
            </div>
            <div className="flex items-center gap-3">
              <WashingMachine className="w-5 h-5 text-neutral-400" />
              <span>Washing Machine : 5</span>
            </div>
            <div className="flex items-center gap-3">
              <Refrigerator className="w-5 h-5 text-neutral-400" />
              <span>Refrigerator : 5</span>
            </div>
            <div className="flex items-center gap-3">
              <BedDouble className="w-5 h-5 text-neutral-400" />
              <span>Bedroom : 2</span>
            </div>
            <div className="flex items-center gap-3">
              <ChefHat className="w-5 h-5 text-neutral-400" />
              <span>Oven : 2</span>
            </div>
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-neutral-400" />
              <span>Wifi : 2</span>
            </div>
            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 text-neutral-400" />
              <span>Bathroom : 4</span>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-neutral-400" />
              <span>Air Conditioner : 8</span>
            </div>
            <div className="flex items-center gap-3">
              <Waves className="w-5 h-5 text-neutral-400" />
              <span>Swimming Pool : 1</span>
            </div>
          </div>
        </div>

        {/* Hotel Information Section */}
        <div className="border border-neutral-200 rounded-2xl p-6 md:p-8 bg-white shadow-xs">
          <h3 className="text-xl font-bold mb-6">Hotel Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 text-sm text-neutral-600">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-neutral-400" />
              <span>Check In : 3:00 pm</span>
            </div>
            <div className="flex items-center gap-3">
              <ParkingCircle className="w-5 h-5 text-neutral-400" />
              <span>Parking Area : 2</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-neutral-400" />
              <span>Check Out : 12:00 pm</span>
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center gap-3 mt-2 pt-6 border-t border-neutral-100">
              <Info className="w-5 h-5 text-neutral-400" />
              <span>Minimum Age to Check In : 17</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
