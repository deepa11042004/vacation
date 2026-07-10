"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { ShieldCheck, Minus, Play, Pause } from "lucide-react";
import Image from "next/image";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

// Reconfigured Data Array
const CAROUSEL_PRIVILEGES = [
  {
    id: 1,
    title: "7N/8D a year, your way",
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
    hasControls: true,
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
    hasControls: true,
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
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
    size: "tall",
    hasControls: true,
    isPaused: true,
  },
];

const MEMBERSHIPS = [
  {
    title: "EBONY",
    subtitle: "Your year-round access to unforgettable family gateways",
    bgClass: "bg-black text-white border-neutral-800",
    lineColor: "rgba(255,255,255,0.08)",
    bulletColor: "bg-cyan-400",
    benefits: [
      "7N/8D holidays every year across 52 weeks",
      "Complimentary breakfast for 2 per room per night, up to 10 years",
      "Priority access to signature experiences",
      "Access to international resorts",
    ],
  },
  {
    title: "IVORY",
    subtitle: "Experience destinations during the peak of their popularity",
    bgClass: "bg-[#EAE6DD] text-neutral-900 border-[#DCD7CD]",
    lineColor: "rgba(0,0,0,0.05)",
    bulletColor: "bg-neutral-900",
    benefits: [
      "7N/8D holidays every year across 46 weeks",
      "Complimentary breakfast for 2 per room per night, up to 10 years",
      "Priority access to signature experiences",
      "Access to international resorts",
    ],
  },
  {
    title: "JADE",
    subtitle: "Enjoy your favourite destinations during quieter seasons",
    bgClass: "bg-[#165B54] text-white border-[#1B6B63]",
    lineColor: "rgba(255,255,255,0.08)",
    bulletColor: "bg-cyan-300",
    benefits: [
      "7N/8D holidays every year across 24 weeks",
      "Complimentary breakfast for 2 per room per night, up to 10 years",
      "Priority access to signature experiences",
      "Access to international resorts",
    ],
  },
];

export default function PlanSec() {
  return (
    <section className="bg-black w-full overflow-hidden select-none">
      {/* SECTION 1: Club Elevate INFO */}
      <div className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto text-center z-10">
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
          offering 7 nights/8 days holidays every year — filled with cherished
          family moments and thoughtfully crafted experiences.
        </p>

        {/* HORIZONTAL SLIDING PRIVILEGES CAROUSEL */}
        <div className="w-full relative flex flex-col items-center mt-4">
          <h4 className="text-3xl font-bold tracking-wider text-white mb-10">
            Handpicked Privileges
          </h4>

          {/* ─── Infinite Continuous Marquee Engine ─── */}
          <style>{`
            @keyframes marqueeLeft {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
          <div className="relative w-full mt-2">
            <div
              className="flex w-max items-center"
              style={{ animation: "marqueeLeft 30s linear infinite" }}
            >
              {[...CAROUSEL_PRIVILEGES, ...CAROUSEL_PRIVILEGES].map(
                (card, idx) => (
                  <div
                    key={`${card.id}-${idx}`}
                    className={`relative shrink-0 overflow-hidden rounded-2xl bg-neutral-900 shadow-xs group mr-5 ${
                      card.size === "short"
                        ? "h-80 w-70 md:h-90 md:w-70"
                        : "h-100 w-80 md:h-110 md:w-120"
                    }`}
                  >
                    <Image
                      fill
                      src={card.image}
                      alt={card.title}
                      sizes="(max-width: 768px) 350px, 450px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Image Lower Linear Vignette */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10" />

                    {/* Tag Component Overlay */}
                    <div className="absolute left-6 bottom-6 z-20 flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10">
                      <span className="text-sm font-medium text-white tracking-wide">
                        {card.title}
                      </span>
                    </div>

                    {/* Status Action Overlays */}
                    {card.hasControls && (
                      <div className="absolute right-6 bottom-6 z-20 flex items-center gap-1.5 rounded-lg bg-black/40 px-4 py-1.5 backdrop-blur-md border border-white/10 text-white text-sm font-medium">
                        <span className="mr-1">
                          {card.isPaused ? "Pause" : "Play"}
                        </span>
                        {card.isPaused ? (
                          <Pause className="h-4 w-4 fill-white" />
                        ) : (
                          <Play className="h-4 w-4 fill-white" />
                        )}
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: MEMBERSHIP PLANS */}
      <div className="bg-white text-black rounded-t-[2.5rem] py-24 px-6 w-full">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-14">
            {MEMBERSHIPS.map((card, idx) => (
              <TiltCard key={idx} card={card} />
            ))}
          </div>

          <div className="flex justify-center">
            <CtaButton text="Know More" variant="white" size="md" />
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
    rotateX.set(-(mouseY / rect.height) * 14);
    rotateY.set((mouseX / rect.width) * 14);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className={`relative rounded-3xl p-8 border flex flex-col justify-between text-left transition-all duration-150 ease-out shadow-md select-none overflow-hidden h-full min-h-120 ${card.bgClass}`}
    >
      <div
        className="absolute top-0 right-0 w-60 h-40 pointer-events-none select-none opacity-40 z-0"
        style={{ color: card.lineColor }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full stroke-current fill-none stroke-[0.75]"
        >
          <path d="M30,-20 Q80,20 130,40 M10,-20 Q70,30 130,60 M-10,-20 Q60,40 130,80 M-30,-20 Q50,50 130,100" />
        </svg>
      </div>

      <div className="relative z-10">
        <span className="text-xs uppercase font-bold tracking-widest text-neutral-400 block mb-1">
          Key
        </span>
        <h4 className="text-3xl font-extrabold tracking-wide mb-4 font-sans">
          {card.title}
        </h4>
        <p className="text-sm opacity-80 leading-relaxed font-medium mb-6 border-b border-neutral-700/20 pb-6">
          {card.subtitle}
        </p>

        <h5 className="text-xs font-bold tracking-wider uppercase mb-4 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 opacity-70" /> Benefits:
        </h5>

        <ul className="space-y-3.5">
          {card.benefits.map((benefit, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-xs leading-relaxed"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${card.bulletColor}`}
              />
              <span className="text-sm font-medium opacity-90">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
