"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Minus, Check, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

// Data
const CAROUSEL_PRIVILEGES = [
  {
    id: 1,
    title: "6N/7D a year, your way",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    size: "short",
  },
  {
    id: 2,
    title: "Future-proof pricing",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    size: "tall",
    isPaused: true,
  },
  {
    id: 3,
    title: "Spacious suites for stays",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    size: "short",
  },
  {
    id: 4,
    title: "Unique family experiences",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    size: "tall",
    isPaused: true,
  },
  {
    id: 5,
    title: "140+ Premium Resorts Access",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
    size: "short",
  },
  {
    id: 6,
    title: "Best Experience",
    image:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    size: "tall",
    isPaused: true,
  },
];

const MEMBERSHIPS = [
  {
    title: "EBONY",
    subtitle: "Your year-round access to unforgettable family gateways",
    bgClass: "bg-black text-white border-neutral-800",
    benefits: [
      "6N/7D holidays every year across 52 weeks",
      "Complimentary breakfast for 2 per room per night",
      "Priority access to signature experiences",
      "Access to 140+ country international resorts",
    ],
  },
  {
    title: "IVORY",
    subtitle: "Experience destinations during the peak of their popularity",
    bgClass: "bg-[#EDE9E0] text-neutral-900 border-[#BEAD95]/20",
    benefits: [
      "6N/7D holidays every year across 46 weeks",
      "Complimentary breakfast for 2 per room per night",
      "Priority access to signature experiences",
      "Access to 140+ country international resorts",
    ],
  },
  {
    title: "JADE",
    subtitle: "Enjoy your favourite destinations during quieter seasons",
    bgClass: "bg-[#1B5B56] text-white border-emerald-900/20",
    benefits: [
      "6N/7D holidays every year across 24 weeks",
      "Complimentary breakfast for 2 per room per night",
      "Priority access to signature experiences",
      "Access to 140+ country international resorts",
    ],
  },
];

export default function PlanSec() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 304; // card width (280) + gap (24)
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="plans" className="w-full overflow-hidden select-none">
      {/* SECTION 1: Club Elevate INFO */}
      <div className="bg-black relative pt-24 pb-16 px-6 w-full mx-auto text-center z-10">
        <div className="absolute top-0 left-0 w-44 h-44 opacity-20 pointer-events-none select-none">
          <svg
            viewBox="0 0 100 100"
            className="stroke-neutral-700 fill-none stroke-[0.5]"
          >
            <path d="M0,0 Q30,70 100,100 M0,20 Q40,80 100,120 M0,40 Q50,90 100,140" />
          </svg>
        </div>

        <div className="flex justify-center">
          <Badge
            text="Club Elevate"
            variant="white"
            size="lg"
            icon={Minus}
            className="mb-4"
          />
        </div>

        <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
          A World of Privileged Access
        </h3>

        <p className="text-neutral-300 font-medium text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-16">
          Club Elevate unlocks privileged access to 140+ premium resorts,
          offering 6 nights/7 days holidays every year — filled with cherished
          family moments and thoughtfully crafted experiences.
        </p>

        {/* HORIZONTAL PRIVILEGES CAROUSEL */}
        <div className="w-full relative flex flex-col items-center mt-4 px-4">
          <h4 className="text-3xl font-bold tracking-wider text-white mb-10">
            Handpicked Privileges
          </h4>

          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {/* Carousel Wrapper */}
          <div className="relative w-full max-w-6xl overflow-hidden">
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
            >
              {CAROUSEL_PRIVILEGES.map((card) => (
                <div
                  key={card.id}
                  className="relative shrink-0 w-[280px] h-[360px] overflow-hidden rounded-3xl bg-neutral-900 shadow-lg group snap-start"
                >
                  <Image
                    fill
                    src={card.image}
                    alt={card.title}
                    sizes="280px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                  
                  {/* Floating White Title Card */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-center rounded-2xl bg-white/95 py-4 px-3 shadow-md backdrop-blur-xs">
                    <span className="text-sm font-semibold text-neutral-900 text-center tracking-wide leading-tight">
                      {card.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center items-center gap-4 mt-8 w-full">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-neutral-300 bg-white text-black hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-md"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-neutral-300 bg-white text-black hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-md"
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: MEMBERSHIP PLANS */}
      <div className="bg-white text-black rounded-[6vw] py-24 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-5">
            <Badge
              text="Membership Plans"
              variant="white"
              size="lg"
              icon={Minus}
            />
          </div>
          <h3 className="text-2xl md:text-6xl font-bold tracking-tight text-black mb-5">
            Your Key to Unlock Privileged Experiences
          </h3>
          <p className="text-neutral-500 text-xs md:text-sm font-medium tracking-wide mb-14 uppercase">
            Select from <span className="text-black font-bold">Ebony</span>,{" "}
            <span className="text-neutral-900 font-bold">Ivory</span>, and{" "}
            <span className="text-[#165B54] font-bold">Jade</span> Keys and
            enter a world of seamless vacations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-14 justify-items-center">
            {MEMBERSHIPS.map((card, idx) => (
              <TiltCard key={idx} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// SUB-COMPONENT: REUSABLE 3D MOUSE TILT CARD
function TiltCard({ card }: { card: (typeof MEMBERSHIPS)[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = cardRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // Subtle tilt effect for a premium credit card feel
    rotateX.set(-(mouseY / rect.height) * 8);
    rotateY.set((mouseX / rect.width) * 8);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const isLight = card.title === "IVORY";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className="relative w-full max-w-sm cursor-pointer group h-full"
    >
      <div
        className={`relative w-full h-full rounded-3xl p-6 md:p-8 flex flex-col justify-between text-left shadow-2xl overflow-hidden border transition-all duration-300 group-hover:shadow-white/10 ${card.bgClass}`}
      >
        {/* Background Pattern */}
        <div className={`absolute inset-0 pointer-events-none ${
          isLight ? "opacity-15 invert" : "opacity-20"
        }`}>
          <Image
            src="/Img/pattern.png"
            alt="Background pattern"
            fill
            className="object-cover scale-125"
            unoptimized
          />
        </div>

        {/* Glossy Overlay */}
        {/* <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none rounded-3xl" /> */}

        {/* Card Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 gap-2">
            <Image
              src="/Img/fanlogo.png"
              alt="Mandarin Worldwide Vacations"
              width={160}
              height={48}
              className={`h-10 md:h-12 w-auto max-w-[130px] sm:max-w-[170px] object-contain shrink-0 ${
                isLight ? "" : "brightness-200"
              }`}
            />
            <div className="flex gap-2 shrink-0">
              <span className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase backdrop-blur-md ${
                isLight 
                  ? "bg-black/10 border border-black/20 text-neutral-900" 
                  : "bg-white/10 border border-white/20 text-white"
              }`}>
                Studio
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-3 font-sans">
              {card.title}
            </h4>
            <p className={`text-sm leading-relaxed font-medium ${
              isLight ? "text-neutral-800" : "text-white/80"
            }`}>
              {card.subtitle}
            </p>
          </div>

          {/* Benefits List */}
          {card.benefits && (
            <ul className="space-y-3 mb-8">
              {card.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isLight 
                      ? "bg-black/10 border border-black/20" 
                      : "bg-white/10 border border-white/20"
                  }`}>
                    <Check className={`w-3 h-3 ${isLight ? "text-neutral-900" : "text-white"}`} />
                  </div>
                  <span className={`text-sm font-medium leading-snug ${
                    isLight ? "text-neutral-800" : "text-white/80"
                  }`}>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto space-y-4">
            <CtaButton
              text="Join Now"
              href={`/join?tier=${card.title.toLowerCase()}`}
              variant="white"
              size="sm"
              className="w-fit"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
