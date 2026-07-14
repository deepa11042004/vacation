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
  Compass,
  Heart,
  Users,
  Building,
  Navigation,
} from "lucide-react";

export interface PropertyData {
  id: number | string;
  title: string;
  location: string;
  description: string;
  image: string;
  rating?: number;
  subImages?: string[];
}

interface PropertyDetailsProps {
  property: PropertyData;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = [
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80",
  ];

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 bg-neutral-50/30 min-h-screen text-neutral-900">
      {/* --- Image Gallery Section --- */}
      <div className="space-y-3 mb-10">
        {/* Main Large Panel */}
        <div
          className="relative w-full h-[45vh] md:h-120 rounded-xl overflow-hidden cursor-pointer group shadow-xs"
          onClick={() => openGallery(0)}
        >
          <Image
            src={galleryImages[0]}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
            priority
            unoptimized
          />
        </div>

        {/* Gallery View - 6 Thumbnail Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 h-[12vh] md:h-27.5">
          {galleryImages.slice(1, 7).map((img, index) => {
            const actualIndex = index + 1;
            const isLast = index === 5;

            return (
              <div
                key={actualIndex}
                className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer group shadow-xs"
                onClick={() => openGallery(actualIndex)}
              >
                <Image
                  src={img}
                  alt={`Gallery tile ${actualIndex}`}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  unoptimized
                />
                {isLast && (
                  <div className="absolute inset-0 bg-neutral-900/40 group-hover:bg-neutral-900/50 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold text-sm md:text-base border-b-2 border-white pb-0.5 tracking-wider">
                      +45 photos
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Lightbox Modal Overlay View --- */}
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md py-6">
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
                alt={`Active lightroom frame ${currentIndex}`}
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
                    alt={`Thumb tracker ${idx}`}
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

      {/* --- Main Structure Split Container --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start py-10">
        {/* LEFT COLUMN: Content Description & Stats */}
        <div className="lg:col-span-2 space-y-10">
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
          </div>

          {/* Amenities Grid */}
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

          {/* Hotel Information Box */}
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

        {/* RIGHT COLUMN: Sidebar Highlights & Metadata */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
          {/* Resort Highlights */}
          <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
            <h3 className="text-lg font-bold mb-4 text-neutral-900 border-b border-neutral-100 pb-3">
              Resort Highlights
            </h3>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-center gap-2.5">
                <Waves className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Outdoor Swimming Pool</span>
              </li>
              <li className="flex items-center gap-2.5">
                <SparklesIcon className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Full-Service Luxury Spa</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ActivityIcon className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Well Equipped Fitness Center</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ChefHat className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>4 Distinct Dining Options</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Scenic Heritage Viewpoints Nearby</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Wifi className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Complimentary High-Speed WiFi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ParkingCircle className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Ample Free Valet Parking Space</span>
              </li>
            </ul>
          </div>

          {/* Ideal For */}
          <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
            <h3 className="text-lg font-bold mb-4 text-neutral-900 border-b border-neutral-100 pb-3">
              Ideal For
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />{" "}
                Couples
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-semibold">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Families
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-semibold">
                <Building className="w-3.5 h-3.5 text-amber-600" /> Heritage
              </span>
            </div>
          </div>

          {/* Location Map Widget */}
          <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
            <h3 className="text-lg font-bold mb-3 text-neutral-900">
              Location
            </h3>
            <p className="text-neutral-500 text-xs leading-relaxed mb-4">
              Fatehabad Rd, Taj Nagri Phase 2, Ii, Agra, Basai, Uttar Pradesh
              282006
            </p>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
              <Navigation className="w-4 h-4" /> View on Map
            </button>
          </div>

          {/* Explore More Destinations */}
          <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
            <h3 className="text-lg font-bold mb-4 text-neutral-900 border-b border-neutral-100 pb-3">
              Explore More Destinations
            </h3>
            <div className="space-y-4">
              {[
                "Aaram Baagh Agra",
                "Crystal Sarovar Premiere",
                "DoubleTree by Hilton Agra",
                "Hotel Atulyaa Taj",
              ].map((dest, i) => (
                <div
                  key={i}
                  className="group cursor-pointer flex items-center justify-between py-1"
                >
                  <div>
                    <h4 className="text-sm font-bold text-neutral-800 group-hover:text-blue-600 transition-colors">
                      {dest}
                    </h4>
                    <span className="text-xs text-neutral-400">Agra</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple fallback internal components for any missing standard icons
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
    </svg>
  );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
