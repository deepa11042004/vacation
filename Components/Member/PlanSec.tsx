"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { CheckCircle2, ShieldCheck, Star, Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

// ─── Section 1 Configuration Data
const BENEFITS = [
  "7N/8D holidays every year",
  "Large premium rooms",
  "Future-proof pricing",
  "24/7 concierge support",
  "Access to international resorts",
  "Crafted experiences",
  "Complimentary breakfast",
  "Easy exit, no questions asked",
];

// ─── Section 2 Configuration Data
const MEMBERSHIPS = [
  {
    title: "EBONY",
    subtitle: "Your year-round access to unforgettable family gateways",
    bgClass: "bg-black text-white border-neutral-800",
    lineColor: "#fff",
    bulletColor: "bg-white",
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
    lineColor: "#000",
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
    lineColor: "#fff",
    bulletColor: "bg-white",
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
    <section className="w-full bg-black overflow-hidden font-display">
      {/* ─── SECTION 1: Club Elevate INFO (Dark Luxury Layer) ─── */}
      <div className="relative py-24 px-6 max-w-6xl mx-auto text-center z-10">
        {/* Subtle Decorative Abstract Lines Background */}
        <div className="absolute top-0 left-0 w-44 h-44 opacity-20 pointer-events-none select-none">
          <svg
            viewBox="0 0 100 100"
            className="stroke-neutral-700 fill-none stroke-[0.5]"
          >
            <path d="M0,0 Q30,70 100,100 M0,20 Q40,80 100,120 M0,40 Q50,90 100,140" />
          </svg>
        </div>

        {/* Customized Dynamic Identity Badge */}
        <Badge
          text="Club Elevate"
          variant="white"
          size="lg"
          icon={Minus}
          className="mb-4"
        />

        <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
          A World of Privileged Access
        </h3>

        <p className="text-neutral-300 font-medium text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-16">
          Club Elevate unlocks privileged access to 140+ premium Club Mahindra
          resorts, offering 7 nights/8 days holidays every year — filled with
          cherished family moments and thoughtfully crafted experiences across
          India and beyond. This membership programme is designed for modern
          families who seek simplicity, flexibility, and elevated holiday
          experiences.
        </p>

        {/* Open Grid Layout for Key Benefits */}
        <div className="max-w-4xl mx-auto">
          <h4 className="text-sm font-semibold tracking-widest text-blue-600 uppercase text-center mb-8 flex items-center justify-center gap-2">
            <Star className="w-4 h-4 fill-blue-600" /> Key Privileged Benefits
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 cursor-pointer">
            {BENEFITS.map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-3 bg-neutral-900/40 rounded-full border border-neutral-800/30 hover:border-blue-600/30 transition duration-300"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-white text-md font-medium tracking-wide">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: MEMBERSHIP PLANS (3D TILT CARDS) ─── */}
      <div className="bg-white text-black rounded-t-[2.5rem] py-24 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          {/* Custom Tag Indicator Badge */}
          <Badge
            text="Membership Plans"
            variant="white"
            size="lg"
            icon={Minus}
            className="mb-5"
          />

          <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-black mb-5 max-w-4xl mx-auto leading-tight">
            Your Key to Unlock Privileged Experiences
          </h3>

          <p className="text-gray-500 text-xs md:text-sm font-semibold tracking-widest mb-16 uppercase">
            Select from <span className="text-black font-bold">Ebony</span>,{" "}
            <span className="text-neutral-900 font-bold">Ivory</span>, and{" "}
            <span className="text-[#165B54] font-bold">Jade</span> Keys and
            enter a world of seamless vacations
          </p>

          {/* Cards Flex Grid Wrapper */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16 cursor-pointer">
            {MEMBERSHIPS.map((card, idx) => (
              <TiltCard key={idx} card={card} />
            ))}
          </div>

          {/* Bottom Call To Action Component */}
          <div className="flex justify-center">
            <CtaButton text="Know More" variant="white" size="md" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SUB-COMPONENT: REUSABLE 3D MOUSE TILT CARD ───
function TiltCard({ card }: { card: (typeof MEMBERSHIPS)[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = cardRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rX = -(mouseY / height) * 12;
    const rY = (mouseX / width) * 12;

    rotateX.set(rX);
    rotateY.set(rY);
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
      className={`relative rounded-3xl p-8 border flex flex-col justify-between text-left transition-all duration-200 ease-out shadow-xs hover:shadow-xl select-none overflow-hidden h-full min-h-115 transform-gpu ${card.bgClass}`}
    >
      {/* Decorative Background Contour Vector Grid */}
      <div
        className="absolute top-0 right-0 w-60 h-40 pointer-events-none select-none opacity-20 z-0"
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
        <span className="text-xs uppercase font-bold tracking-widest opacity-60 block mb-1">
          Membership Tier
        </span>
        <h4 className="text-3xl font-extrabold tracking-wide mb-4 font-sans">
          {card.title}
        </h4>
        <p className="text-sm opacity-80 leading-relaxed font-medium mb-6 border-b border-current/10 pb-6">
          {card.subtitle}
        </p>

        <h5 className="text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-1.5 opacity-90">
          <ShieldCheck className="w-4 h-4 opacity-70" /> Tier Privileges:
        </h5>

        <ul className="space-y-4">
          {card.benefits.map((benefit, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm font-medium leading-normal"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${card.bulletColor}`}
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
