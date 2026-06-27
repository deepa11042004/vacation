"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

// ─── Types and Interfaces
interface PricingCard {
  id: string;
  duration: string;
  roomType: string;
  emiStarts: string;
  totalCost: string;
}

interface TierGroup {
  slug: "ebony" | "ivory" | "jade";
  name: string;
  description: string;
  cardBgClass: string;
  textClass: string;
  mutedTextClass: string;
  linePatternOpacity: string;
  btnVariant: "transparent-white" | "white" | "blue";
  cards: PricingCard[];
}

// ─── Production Tier Data (Expanded to 4 options per tier group)
const TIER_DATA: Record<string, TierGroup> = {
  ebony: {
    slug: "ebony",
    name: "EBONY",
    description:
      "Premium access to signature gateways during golden peak seasons.",
    cardBgClass: "bg-neutral-950 border-neutral-800 text-white",
    textClass: "text-white",
    mutedTextClass: "text-neutral-400",
    linePatternOpacity: "opacity-40",
    btnVariant: "transparent-white",
    cards: [
      {
        id: "e1",
        duration: "25 Years",
        roomType: "Studio Suite",
        emiStarts: "₹29,850/-",
        totalCost: "₹13,50,000/-",
      },
      {
        id: "e2",
        duration: "20 Years",
        roomType: "Studio Suite",
        emiStarts: "₹26,414/-",
        totalCost: "₹11,65,000/-",
      },
      {
        id: "e3",
        duration: "15 Years",
        roomType: "Studio Suite",
        emiStarts: "₹22,106/-",
        totalCost: "₹9,75,000/-",
      },
      {
        id: "e4",
        duration: "10 Years",
        roomType: "Studio Suite",
        emiStarts: "₹28,704/-",
        totalCost: "₹7,40,000/-",
      },
    ],
  },
  ivory: {
    slug: "ivory",
    name: "IVORY",
    description:
      "Exceptional experiences timed beautifully for popular global travels.",
    cardBgClass: "bg-[#EAE6DD] border-[#DCD7CD] text-neutral-900",
    textClass: "text-neutral-900",
    mutedTextClass: "text-neutral-500",
    linePatternOpacity: "opacity-25",
    btnVariant: "white",
    cards: [
      {
        id: "i1",
        duration: "25 Years",
        roomType: "Studio Suite",
        emiStarts: "₹19,920/-",
        totalCost: "₹8,90,000/-",
      },
      {
        id: "i2",
        duration: "20 Years",
        roomType: "Studio Suite",
        emiStarts: "₹17,571/-",
        totalCost: "₹7,75,000/-",
      },
      {
        id: "i3",
        duration: "15 Years",
        roomType: "Studio Suite",
        emiStarts: "₹14,964/-",
        totalCost: "₹6,60,000/-",
      },
      {
        id: "i4",
        duration: "10 Years",
        roomType: "Studio Suite",
        emiStarts: "₹19,783/-",
        totalCost: "₹5,10,000/-",
      },
    ],
  },
  jade: {
    slug: "jade",
    name: "JADE",
    description:
      "Curated quiet retreats optimized for serene personal exploration.",
    cardBgClass: "bg-[#165B54] border-[#1B6B63] text-white",
    textClass: "text-white",
    mutedTextClass: "text-teal-200/70",
    linePatternOpacity: "opacity-30",
    btnVariant: "transparent-white",
    cards: [
      {
        id: "j1",
        duration: "25 Years",
        roomType: "Studio Suite",
        emiStarts: "₹13,420/-",
        totalCost: "₹6,40,000/-",
      },
      {
        id: "j2",
        duration: "20 Years",
        roomType: "Studio Suite",
        emiStarts: "₹11,797/-",
        totalCost: "₹5,55,000/-",
      },
      {
        id: "j3",
        duration: "15 Years",
        roomType: "Studio Suite",
        emiStarts: "₹10,309/-",
        totalCost: "₹4,85,000/-",
      },
      {
        id: "j4",
        duration: "10 Years",
        roomType: "Studio Suite",
        emiStarts: "₹14,364/-",
        totalCost: "₹3,95,000/-",
      },
    ],
  },
};

export default function JoinDetail() {
  const [activeTab, setActiveTab] = useState<string>("ebony");
  const currentTier = TIER_DATA[activeTab];

  return (
    <section className="w-full bg-white py-20 px-6 lg:py-30 ">
      <div className="mx-auto max-w-7xl">
        {/* ─── Header Section ─── */}
        <div className="flex flex-col items-center text-center mb-12">
          <Badge
            text="Investment Matrix"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-4"
          />
          <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-5xl">
            Membership Ownership Tiers
          </h2>
          <p className="mt-3 max-w-2xl text-base text-gray-500 font-medium">
            Review detailed tier-level financial allocations structured across
            custom operational lifespans.
          </p>
        </div>

        {/* ─── Level Navigation Switcher ─── */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex rounded-full bg-neutral-100 p-1.5 border border-neutral-200 shadow-xs">
            {Object.values(TIER_DATA).map((tier) => (
              <button
                key={tier.slug}
                onClick={() => setActiveTab(tier.slug)}
                className={`rounded-full px-6 py-2.5 text-xs font-bold tracking-widest transition-all uppercase duration-300 ${
                  activeTab === tier.slug
                    ? "bg-neutral-950 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tier.name}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Dynamic Content Layout ─── */}
        <div className="relative">
          {/* Active Info Bar Description */}
          <div className="mb-6 max-w-xl text-left md:pl-1">
            <h3 className="text-xl font-bold uppercase text-neutral-950 tracking-wide flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${activeTab === "jade" ? "bg-[#165B54]" : activeTab === "ivory" ? "bg-[#c7bfb0]" : "bg-black"}`}
              />
              {currentTier.name} Ownership Options
            </h3>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {currentTier.description}
            </p>
          </div>

          {/* ─── Fixed 4-Card Responsive Grid Row (Replaces Carousel) ─── */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
            <AnimatePresence mode="popLayout">
              {currentTier.cards.map((card, idx) => (
                <motion.div
                  key={`${activeTab}-${card.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{
                    duration: 0.35,
                    delay: idx * 0.05,
                    ease: "easeOut",
                  }}
                  className={`relative flex flex-col justify-between p-6 xl:p-8 rounded-3xl border shadow-xs hover:shadow-lg transition-all duration-300 w-full h-67.5 overflow-hidden ${currentTier.cardBgClass}`}
                >
                  {/* Pattern Layer via next/image */}
                  <div
                    className={`absolute inset-0 pointer-events-none z-0 ${currentTier.linePatternOpacity}`}
                  >
                    <Image
                      fill
                      src="/Img/pattern.png"
                      alt=""
                      className="object-cover"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Top Block Hierarchy */}
                  <div className="relative z-10 flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-lg font-black tracking-wider uppercase font-sans leading-none">
                        {currentTier.name}
                      </h4>
                      <span
                        className={`text-[11px] font-semibold tracking-wide block mt-1.5 ${currentTier.mutedTextClass}`}
                      >
                        {card.roomType}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-xs border border-current/10 whitespace-nowrap">
                      {card.duration}
                    </span>
                  </div>

                  {/* Pricing Midpoint Data Row */}
                  <div className="relative z-10 grid grid-cols-2 gap-2 border-y border-current/10 py-4 my-2">
                    <div>
                      <span
                        className={`text-[9px] uppercase font-bold tracking-widest block ${currentTier.mutedTextClass}`}
                      >
                        EMI Starts at
                      </span>
                      <p className="text-lg font-black tracking-tight mt-0.5 whitespace-nowrap">
                        {card.emiStarts}
                      </p>
                    </div>
                    <div className="border-l border-current/10 pl-3">
                      <span
                        className={`text-[9px] uppercase font-bold tracking-widest block ${currentTier.mutedTextClass}`}
                      >
                        Total Cost
                      </span>
                      <p className="text-lg font-black tracking-tight mt-0.5 whitespace-nowrap">
                        {card.totalCost}
                      </p>
                    </div>
                  </div>

                  {/* Lower Interaction Block Row */}
                  <div className="relative z-10 flex items-center justify-between mt-1 gap-2">
                    <CtaButton
                      text="Buy Now"
                      variant="white"
                      size="sm"
                    />
                    <button
                      className={`text-[11px] font-bold tracking-wide hover:underline cursor-pointer whitespace-nowrap ${currentTier.mutedTextClass}`}
                    >
                      + Compare
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
