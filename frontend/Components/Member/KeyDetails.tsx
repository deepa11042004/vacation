"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "@/UI/Badge";
import { useEffect, useState } from "react";

// Types
interface TenetItem {
  id: number;
  title: string;
  image: string;
  benefits: string[];
}

// Data
const KEY_TENETS: TenetItem[] = [
  {
    id: 1,
    title: "We've Got You Covered",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "Keystone gives you 7 nights/8 days of holidays every year. If you miss your vacation, you can carry forward up to 14 nights.",
      "Breakfast is on us. Other meals come with special savings.",
      "Protect your long-term holiday goals with future-proof pricing.",
      "Pick a plan based on your preferences with three unique Keys and flexible tenures.",
    ],
  },
  {
    id: 2,
    title: "Special Privileges",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "Avail 52, 46, and 24 weeks of holiday access across applicable seasons for EBONY, IVORY, and JADE Keys respectively.",
      "Enjoy 25% discounts on eligible in-resort spends.",
      "Nominate up to 7 family members.",
    ],
  },
  {
    id: 3,
    title: "Holiday Benefits",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "You can start booking your holidays up to 4 months in advance. All bookings are confirmed on a first-come, first-served basis.",
      "The number of rooms you can book and the seasons you travel in are based on your membership plan.",
      "Your membership unlocks thoughtfully crafted experiences for you and your loved ones.",
    ],
  },
  {
    id: 4,
    title: "Seamless Booking & Flexibility",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "Book your stays up to 4 months in advance with guaranteed confirmation.",
      "Flexible carry-forward options for unused nights, ensuring your time is never wasted.",
      "Easy modification and cancellation policies tailored specifically for members.",
    ],
  },
  {
    id: 5,
    title: "Exclusive Member Events",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "Invitations to private, members-only events and exclusive culinary experiences.",
      "Early access to new resort openings and special seasonal holiday packages.",
      "Curated local experiences and guided tours at select premium destinations.",
    ],
  },
  {
    id: 6,
    title: "Dedicated Concierge Support",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "24/7 dedicated member support for all your travel and booking needs.",
      "Personalized itinerary planning and special request handling before your stay.",
      "Priority assistance for flight, transfer, and premium activity bookings.",
    ],
  },
];
export default function KeyDetails() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = KEY_TENETS.length;
  const angleStep = 360 / total;
  const radius = 340;

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % total);

  return (
    <section className="w-full bg-blue-50 px-6 py-20 sm:px-10 lg:px-14 font-display overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header Layout */}
        <div className="mb-12 w-full text-center">
          <Badge
            text="Key Tenets"
            variant="black"
            size="lg"
            icon={Minus}
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
            Memberships | Key Tenets
          </h2>
        </div>

        {/* 3D Carousel Container*/}
        <div
          className="relative w-full max-w-5xl mx-auto h-112.5 flex items-center justify-center mt-40"
          style={{ perspective: "1500px" }}
        >
          {/* 3D Rotor */}
          <motion.div
            className="relative w-[320px] h-95"
            style={{ transformStyle: "preserve-3d" }}
            animate={{
              rotateY: -activeIndex * angleStep,
              rotateX: 8,
            }}
            transition={{ type: "spring", stiffness: 80, damping: 25 }}
          >
            {KEY_TENETS.map((item, i) => {
              const isActive = i === activeIndex;

              return (
                <motion.div
                  key={item.id}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`,
                  }}
                  animate={{
                    opacity: isActive ? 1 : 1,
                    filter: isActive ? "blur(0px)" : "blur(0px)",
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {/* The Actual Card UI */}
                  <div
                    className={`group flex flex-col h-full bg-white border rounded-3xl overflow-hidden transition-all duration-300
                      ${isActive ? "border-blue-600 shadow-blue-100" : "border-gray-200"}`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {/* Image */}
                    <div className="relative h-32 w-full overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/50 pointer-events-none z-10" />
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col gap-2 bg-white">
                      <h3 className="text-base font-bold text-gray-950 leading-tight tracking-wide line-clamp-2">
                        {item.title}
                      </h3>

                      <ul className="flex flex-col gap-1.5 text-gray-600 text-xs leading-snug mt-2">
                        {item.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-blue-600 shrink-0 opacity-90" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {KEY_TENETS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
