"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

// Types and Interfaces
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
  btnVariant: "outline" | "white" | "blue";
  cards: PricingCard[];
}

// Tier Data (All unified to dark theme)
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
    btnVariant: "outline",
    cards: [
      {
        id: "e1",
        duration: "20 Years",
        roomType: "Studio",
        emiStarts: "₹29,850/-",
        totalCost: "₹13,50,000/-",
      },
      {
        id: "e2",
        duration: "15 Years",
        roomType: "Studio",
        emiStarts: "₹26,414/-",
        totalCost: "₹11,65,000/-",
      },
      {
        id: "e3",
        duration: "10 Years",
        roomType: "Studio",
        emiStarts: "₹22,106/-",
        totalCost: "₹9,75,000/-",
      },
      {
        id: "e4",
        duration: "5 Years",
        roomType: "Studio",
        emiStarts: "₹28,704/-",
        totalCost: "₹7,40,000/-",
      },
      {
        id: "e5",
        duration: "20 Years",
        roomType: "1BR",
        emiStarts: "₹34,500/-",
        totalCost: "₹15,50,000/-",
      },
      {
        id: "e6",
        duration: "15 Years",
        roomType: "1BR",
        emiStarts: "₹30,400/-",
        totalCost: "₹13,40,000/-",
      },
      {
        id: "e7",
        duration: "10 Years",
        roomType: "1BR",
        emiStarts: "₹25,500/-",
        totalCost: "₹11,20,000/-",
      },
      {
        id: "e8",
        duration: "5 Years",
        roomType: "1BR",
        emiStarts: "₹33,100/-",
        totalCost: "₹8,50,000/-",
      },
    ],
  },
  ivory: {
    slug: "ivory",
    name: "IVORY",
    description:
      "Exceptional experiences timed beautifully for popular global travels.",
    cardBgClass: "bg-neutral-950 border-neutral-800 text-white",
    textClass: "text-white",
    mutedTextClass: "text-neutral-400",
    linePatternOpacity: "opacity-40",
    btnVariant: "outline",
    cards: [
      {
        id: "i1",
        duration: "25 Years",
        roomType: "Studio",
        emiStarts: "₹19,920/-",
        totalCost: "₹8,90,000/-",
      },
      {
        id: "i2",
        duration: "20 Years",
        roomType: "Studio",
        emiStarts: "₹17,571/-",
        totalCost: "₹7,75,000/-",
      },
      {
        id: "i3",
        duration: "15 Years",
        roomType: "Studio",
        emiStarts: "₹14,964/-",
        totalCost: "₹6,60,000/-",
      },
      {
        id: "i4",
        duration: "10 Years",
        roomType: "Studio",
        emiStarts: "₹19,783/-",
        totalCost: "₹5,10,000/-",
      },
      {
        id: "i5",
        duration: "25 Years",
        roomType: "1BR",
        emiStarts: "₹23,500/-",
        totalCost: "₹10,50,000/-",
      },
      {
        id: "i6",
        duration: "20 Years",
        roomType: "1BR",
        emiStarts: "₹20,600/-",
        totalCost: "₹9,10,000/-",
      },
      {
        id: "i7",
        duration: "15 Years",
        roomType: "1BR",
        emiStarts: "₹17,500/-",
        totalCost: "₹7,70,000/-",
      },
      {
        id: "i8",
        duration: "10 Years",
        roomType: "1BR",
        emiStarts: "₹23,100/-",
        totalCost: "₹5,95,000/-",
      },
    ],
  },
  jade: {
    slug: "jade",
    name: "JADE",
    description:
      "Curated quiet retreats optimized for serene personal exploration.",
    cardBgClass: "bg-neutral-950 border-neutral-800 text-white",
    textClass: "text-white",
    mutedTextClass: "text-neutral-400",
    linePatternOpacity: "opacity-40",
    btnVariant: "outline",
    cards: [
      {
        id: "j1",
        duration: "25 Years",
        roomType: "Studio",
        emiStarts: "₹13,420/-",
        totalCost: "₹6,40,000/-",
      },
      {
        id: "j2",
        duration: "20 Years",
        roomType: "Studio",
        emiStarts: "₹11,797/-",
        totalCost: "₹5,55,000/-",
      },
      {
        id: "j3",
        duration: "15 Years",
        roomType: "Studio",
        emiStarts: "₹10,309/-",
        totalCost: "₹4,85,000/-",
      },
      {
        id: "j4",
        duration: "10 Years",
        roomType: "Studio",
        emiStarts: "₹14,364/-",
        totalCost: "₹3,95,000/-",
      },
      {
        id: "j5",
        duration: "25 Years",
        roomType: "1BR",
        emiStarts: "₹15,800/-",
        totalCost: "₹7,50,000/-",
      },
      {
        id: "j6",
        duration: "20 Years",
        roomType: "1BR",
        emiStarts: "₹13,850/-",
        totalCost: "₹6,50,000/-",
      },
      {
        id: "j7",
        duration: "15 Years",
        roomType: "1BR",
        emiStarts: "₹12,100/-",
        totalCost: "₹5,70,000/-",
      },
      {
        id: "j8",
        duration: "10 Years",
        roomType: "1BR",
        emiStarts: "₹16,800/-",
        totalCost: "₹4,60,000/-",
      },
    ],
  },
};

const TIER_ORDER = ["ebony", "ivory", "jade"];
const ROOM_TYPES = ["Studio", "1BR"];

// Ease
const EASE = [0.22, 1, 0.36, 1] as const;

export default function JoinDetail() {
  const [activeTab, setActiveTab] = useState<string>("ebony");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );

    TIER_ORDER.forEach((slug) => {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleTabChange = (slug: string) => {
    setActiveTab(slug);
    const element = document.getElementById(slug);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-white py-20 px-6 lg:py-30">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
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

        {/* Navigation Switcher */}
        <div className="flex justify-center mb-14 sticky top-25 z-40 py-4 -mx-6 px-6">
          <div className="inline-flex rounded-full bg-neutral-100 p-1.5 border border-neutral-200 shadow-xs">
            {Object.values(TIER_DATA).map((tier) => (
              <button
                key={tier.slug}
                onClick={() => handleTabChange(tier.slug)}
                className={`relative rounded-full px-6 py-2.5 text-xs font-bold tracking-widest transition-colors uppercase duration-300 ${
                  activeTab === tier.slug
                    ? "bg-neutral-950 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {activeTab === tier.slug && (
                  <motion.span
                    layoutId="tier-pill"
                    className="absolute inset-0 rounded-full bg-neutral-950 shadow-md -z-10"
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                )}
                {tier.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="relative flex flex-col gap-24">
          {TIER_ORDER.map((tierSlug) => {
            const tier = TIER_DATA[tierSlug];

            // Tier accent color for the heading divider line (kept distinct so sections are identifiable)
            const lineColor =
              tierSlug === "jade"
                ? "bg-teal-600"
                : tierSlug === "ivory"
                  ? "bg-neutral-500"
                  : "bg-black";

            return (
              <div
                key={tier.slug}
                id={tier.slug}
                className="relative scroll-mt-40"
              >
                <div className="mb-8 max-w-xl text-left md:pl-1">
                  <h3 className="text-xl font-bold uppercase text-neutral-950 tracking-wide flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tierSlug === "jade"
                          ? "bg-teal-700"
                          : tierSlug === "ivory"
                            ? "bg-neutral-600"
                            : "bg-black"
                      }`}
                    />
                    {tier.name} Ownership Options
                  </h3>
                  <p className="text-md text-gray-500 font-medium mt-2 ml-4">
                    {tier.description}
                  </p>
                </div>

                {/* Grouped Cards by Room Type */}
                <div className="overflow-hidden space-y-12">
                  {ROOM_TYPES.map((roomType) => {
                    const filteredCards = tier.cards.filter(
                      (c) => c.roomType === roomType,
                    );
                    if (filteredCards.length === 0) return null;

                    return (
                      <div key={roomType}>
                        {/* Room Type Heading */}
                        <div className="flex items-center gap-3 mb-5">
                          <span className={`h-px w-8 ${lineColor}`} />
                          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-950">
                            {roomType}
                          </h4>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
                          {filteredCards.map((card, idx) => (
                            <motion.div
                              key={card.id}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-40px" }}
                              transition={{
                                duration: 0.5,
                                delay: idx * 0.05,
                                ease: EASE,
                              }}
                              className={`relative flex flex-col justify-between p-6 xl:p-8 rounded-3xl border shadow-xs hover:shadow-lg transition-shadow duration-300 w-full h-67.5 overflow-hidden ${tier.cardBgClass}`}
                            >
                              <div
                                className={`absolute inset-0 pointer-events-none z-0 ${tier.linePatternOpacity}`}
                              >
                                <Image
                                  fill
                                  src="/Img/pattern.png"
                                  alt=""
                                  className="object-cover"
                                  aria-hidden="true"
                                />
                              </div>

                              <div className="relative z-10 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                  <h4 className="text-lg font-black tracking-wider uppercase font-sans leading-none">
                                    {tier.name}
                                  </h4>
                                </div>

                                {/* Badges: Room Type & Duration */}
                                <div className="flex gap-2 flex-wrap">
                                  <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border border-white/10 bg-white/10 text-white whitespace-nowrap">
                                    {card.roomType}
                                  </span>
                                  <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border border-white/10 bg-white/10 text-white whitespace-nowrap">
                                    {card.duration}
                                  </span>
                                </div>
                              </div>

                              <div className="relative z-10 grid grid-cols-2 gap-2 border-y border-white/10 py-4 my-2">
                                <div>
                                  <span className="text-[9px] uppercase font-bold tracking-widest block text-neutral-400">
                                    EMI Starts at
                                  </span>
                                  <p className="text-lg font-black tracking-tight mt-0.5 whitespace-nowrap text-white">
                                    {card.emiStarts}
                                  </p>
                                </div>
                                <div className="border-l border-white/10 pl-3">
                                  <span className="text-[9px] uppercase font-bold tracking-widest block text-neutral-400">
                                    Total Cost
                                  </span>
                                  <p className="text-lg font-black tracking-tight mt-0.5 whitespace-nowrap text-white">
                                    {card.totalCost}
                                  </p>
                                </div>
                              </div>

                              <div className="relative z-10 flex items-center justify-between mt-1 gap-2">
                                <CtaButton
                                  text="Buy Now"
                                  variant={tier.btnVariant}
                                  size="sm"
                                />
                                <button className="text-[11px] font-bold tracking-wide hover:underline cursor-pointer whitespace-nowrap text-neutral-400">
                                  + Compare
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
