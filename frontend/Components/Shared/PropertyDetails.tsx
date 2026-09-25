"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FallbackImage from "@/Components/Shared/FallbackImage";
import { hotelImageUrl, hotelImageFallback } from "@/lib/imageUrl";
import { stripHtml } from "@/lib/text";
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
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Send,
  Phone,
  Mail,
  User,
} from "lucide-react";

export interface PropertyData {
  id: number | string;
  title: string;
  location: string;
  description: string;
  images: string[];
  rating?: number;
  address?: string | null;
  mapLink?: string | null;
  locationId?: number;
}

interface RelatedHotel {
  hotel_id: number;
  hotel_name: string;
  images?: { image_path: string; sort_order: number }[];
}

interface PropertyDetailsProps {
  property: PropertyData;
}

const FALLBACK_IMAGE = "/Img/logo.png";

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [relatedHotels, setRelatedHotels] = useState<RelatedHotel[]>([]);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    checkIn: "",
    checkOut: "",
    guests: "2 Adults (1 Room)",
    query: "",
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingError("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          city: formData.city,
          hotel_name: stripHtml(property.title),
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          guests: formData.guests,
          query: formData.query,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingSubmitted(true);
      } else {
        setBookingError(data.error || "Failed to submit booking enquiry. Please try again.");
      }
    } catch {
      setBookingError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const galleryImages = Array.from(
    new Set(
      property.images && property.images.length > 0
        ? property.images.filter(Boolean)
        : [hotelImageFallback(property.id)]
    )
  );

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  // Keyboard navigation for lightbox
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

  // Fetch other active hotels in the same destination
  useEffect(() => {
    if (!property.locationId) return;
    const params = new URLSearchParams({
      location_id: String(property.locationId),
      status: "ACTIVE",
      limit: "5",
    });
    fetch(`/api/hotels?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res?.success) return;
        const hotels: RelatedHotel[] = res?.data?.hotels ?? [];
        setRelatedHotels(hotels.filter((h) => h.hotel_id !== property.id).slice(0, 4));
      })
      .catch(() => {});
  }, [property.locationId, property.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 bg-neutral-50/30 min-h-screen text-neutral-900">
      {/* --- Image Gallery Section --- */}
      <div className="space-y-4 mb-10">
        {/* Main Large Panel */}
        <div
          className="relative w-full h-[65vh] sm:h-[75vh] md:h-[680px] lg:h-[740px] rounded-2xl overflow-hidden cursor-pointer group shadow-xl bg-neutral-100"
          onClick={() => openGallery(0)}
        >
          <FallbackImage
            src={galleryImages[0]}
            fallbackSrc={hotelImageFallback(property.id)}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-[1.015] transition-transform duration-500"
            priority
            unoptimized
          />
        </div>

        {/* Gallery View - Thumbnail Images (only if more than 1 image available) */}
        {galleryImages.length > 1 && (
          <div
            className={`grid gap-3 sm:gap-4 h-[18vh] md:h-[160px] ${
              galleryImages.length === 2
                ? "grid-cols-2 max-w-md"
                : galleryImages.length === 3
                ? "grid-cols-2 max-w-xl"
                : galleryImages.length === 4
                ? "grid-cols-3 max-w-3xl"
                : galleryImages.length === 5
                ? "grid-cols-4 max-w-5xl"
                : galleryImages.length === 6
                ? "grid-cols-5"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
            }`}
          >
            {galleryImages.slice(1, 7).map((img, index) => {
              const actualIndex = index + 1;
              const isLast = index === Math.min(5, galleryImages.length - 2);
              const remaining = galleryImages.length - 7;

              return (
                <div
                  key={actualIndex}
                  className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group shadow-xs bg-neutral-100"
                  onClick={() => openGallery(actualIndex)}
                >
                  <FallbackImage
                    src={img}
                    fallbackSrc={hotelImageFallback(property.id)}
                    alt={`Gallery tile ${actualIndex}`}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    unoptimized
                  />
                  {isLast && remaining > 0 && (
                    <div className="absolute inset-0 bg-neutral-900/50 group-hover:bg-neutral-900/60 transition-colors flex items-center justify-center backdrop-blur-[2px]">
                      <span className="text-white font-bold text-sm md:text-base border-b-2 border-white pb-0.5 tracking-wider">
                        +{remaining} photos
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- Ultra-Fullscreen Lightbox Modal Overlay View --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/98 backdrop-blur-2xl select-none overflow-hidden">
          {/* Top Control Bar */}
          <div className="absolute top-3 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-8 md:px-12 pointer-events-none">
            {galleryImages.length > 1 ? (
              <span className="pointer-events-auto text-neutral-200 text-xs sm:text-sm font-bold tracking-wider bg-black/70 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md shadow-2xl">
                {currentIndex + 1} / {galleryImages.length}
              </span>
            ) : (
              <span />
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="pointer-events-auto p-3 text-neutral-200 hover:text-white bg-black/70 hover:bg-black/90 border border-white/20 rounded-full transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>

          {/* Left Arrow Button (if multiple images) */}
          {galleryImages.length > 1 && (
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) =>
                    (prev - 1 + galleryImages.length) % galleryImages.length
                )
              }
              className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 text-white bg-black/50 hover:bg-black/90 backdrop-blur-md rounded-full transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95 border border-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9" />
            </button>
          )}

          {/* Main Fullscreen Display Image Container */}
          <div className="relative w-[98vw] h-[92vh] max-w-[99vw] max-h-[96vh] flex items-center justify-center p-2 sm:p-4">
            <FallbackImage
              src={galleryImages[currentIndex]}
              fallbackSrc={hotelImageFallback(property.id)}
              alt={`Active lightbox image ${currentIndex + 1}`}
              fill
              className="object-contain drop-shadow-2xl"
              unoptimized
              priority
            />
          </div>

          {/* Right Arrow Button (if multiple images) */}
          {galleryImages.length > 1 && (
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
              }
              className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 text-white bg-black/50 hover:bg-black/90 backdrop-blur-md rounded-full transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95 border border-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9" />
            </button>
          )}

          {/* Bottom Floating Compact Thumbnails Bar (if multiple images) */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto max-w-[92vw] py-1.5 px-3 bg-black/70 border border-white/15 rounded-2xl backdrop-blur-md scrollbar-none shadow-2xl">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative shrink-0 w-14 h-10 sm:w-18 sm:h-12 rounded-xl overflow-hidden transition-all border-2 cursor-pointer ${
                      idx === currentIndex
                        ? "border-blue-500 scale-105 opacity-100 ring-4 ring-blue-500/50"
                        : "border-transparent opacity-40 hover:opacity-85"
                    }`}
                  >
                    <FallbackImage
                      src={img}
                      fallbackSrc={hotelImageFallback(property.id)}
                      alt={`Thumb tracker ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Main Structure Split Container --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start py-10">
        {/* LEFT COLUMN: Content Description & Stats */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {stripHtml(property.title)}
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

          {/* Book Now Banner CTA at End of Hotel Information */}
          <div className="border border-blue-100 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                Plan Your Stay at {stripHtml(property.title)}
              </h3>
              <p className="text-blue-100 text-sm">
                Submit basic details & your query to receive custom packages & quick availability check.
              </p>
            </div>
            <button
              onClick={() => {
                setBookingSubmitted(false);
                setBookingError("");
                setIsBookingOpen(true);
              }}
              className="shrink-0 bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 text-base cursor-pointer"
            >
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              Book Now
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Highlights & Metadata */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
          {/* Quick Booking CTA Card */}
          <div className="border border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-2xl p-6 shadow-xs text-center space-y-4">
            <div>
              <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase bg-blue-100 px-3 py-1 rounded-full">
                Best Rates Guaranteed
              </span>
              <h4 className="text-lg font-bold text-neutral-900 mt-3">Book Your Room Today</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Submit an instant enquiry to unlock member discounts & tailored travel packages.
              </p>
            </div>
            <button
              onClick={() => {
                setBookingSubmitted(false);
                setBookingError("");
                setIsBookingOpen(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" /> Book Now
            </button>
          </div>

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
          {property.address && (
            <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
              <h3 className="text-lg font-bold mb-3 text-neutral-900">
                Location
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed mb-4">
                {property.address}
              </p>
              <a
                href={
                  property.mapLink ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                <Navigation className="w-4 h-4" /> View on Map
              </a>
            </div>
          )}

          {/* Explore More Destinations */}
          {relatedHotels.length > 0 && (
            <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
              <h3 className="text-lg font-bold mb-4 text-neutral-900 border-b border-neutral-100 pb-3">
                Explore More Hotels
              </h3>
              <div className="space-y-4">
                {relatedHotels.map((hotel) => {
                  const sorted = [...(hotel.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
                  return (
                    <Link
                      key={hotel.hotel_id}
                      href={`/hotels/${hotel.hotel_id}`}
                      className="group cursor-pointer flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                          <FallbackImage
                            src={hotelImageUrl(sorted[0]?.image_path, hotel.hotel_id)}
                            fallbackSrc={hotelImageFallback(hotel.hotel_id)}
                            alt={hotel.hotel_name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {hotel.hotel_name}
                          </h4>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Enquiry Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-neutral-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white p-5 sm:p-6 relative shrink-0">
              <button
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Building className="w-4 h-4" /> Hotel Booking Enquiry
              </div>
              <h3 className="text-xl sm:text-2xl font-bold pr-8">{stripHtml(property.title)}</h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1">{property.location}</p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 md:p-8 overflow-y-auto grow">
              {bookingSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-neutral-900">Enquiry Submitted!</h4>
                  <p className="text-neutral-600 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for choosing Mandarin Vacations. Our travel consultant will contact you shortly with the best package and booking details for <strong>{stripHtml(property.title)}</strong>.
                  </p>
                  <button
                    onClick={() => setIsBookingOpen(false)}
                    className="mt-4 px-8 py-3 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          placeholder="Mobile Number"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Email Address"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Your City"
                        className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Check-in Date</label>
                      <input
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Check-out Date</label>
                      <input
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Guests / Rooms</label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                    >
                      <option value="1 Adult">1 Adult</option>
                      <option value="2 Adults (1 Room)">2 Adults (1 Room)</option>
                      <option value="2 Adults + 1 Child">2 Adults + 1 Child</option>
                      <option value="Family / Group">Family / Group (2+ Rooms)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Query / Special Requests</label>
                    <textarea
                      rows={3}
                      value={formData.query}
                      onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                      placeholder="Tell us any specific requirements, room preferences or questions..."
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                    />
                  </div>

                  {bookingError && (
                    <p className="text-xs text-rose-600 font-medium text-center">{bookingError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Booking Enquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
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
