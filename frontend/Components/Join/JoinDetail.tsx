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
  roomType: "Studio" | "1BR";
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

// Tier Data
const TIER_DATA: Record<string, TierGroup> = {
  ebony: {
    slug: "ebony",
    name: "EBONY",
    description:
      "Premium access to signature gateways during golden peak seasons.",
    cardBgClass: "bg-black border-neutral-800 text-white",
    textClass: "text-white",
    mutedTextClass: "text-neutral-400",
    linePatternOpacity: "opacity-40",
    btnVariant: "outline",
    cards: [
      // Studios
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
      // 1BR Options
      {
        id: "e1-1br",
        duration: "20 Years",
        roomType: "1BR",
        emiStarts: "₹38,500/-",
        totalCost: "₹17,20,000/-",
      },
      {
        id: "e2-1br",
        duration: "15 Years",
        roomType: "1BR",
        emiStarts: "₹34,200/-",
        totalCost: "₹14,90,000/-",
      },
      {
        id: "e3-1br",
        duration: "10 Years",
        roomType: "1BR",
        emiStarts: "₹28,900/-",
        totalCost: "₹12,60,000/-",
      },
      {
        id: "e4-1br",
        duration: "5 Years",
        roomType: "1BR",
        emiStarts: "₹36,800/-",
        totalCost: "₹9,50,000/-",
      },
    ],
  },
  ivory: {
    slug: "ivory",
    name: "IVORY",
    description:
      "Exceptional experiences timed beautifully for popular global travels.",
    cardBgClass: "bg-[#040B30] border-gray-400 text-white",
    textClass: "text-white",
    mutedTextClass: "text-gray-200/70",
    linePatternOpacity: "opacity-25",
    btnVariant: "white",
    cards: [
      // Studios
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
      // 1BR Options
      {
        id: "i1-1br",
        duration: "25 Years",
        roomType: "1BR",
        emiStarts: "₹25,600/-",
        totalCost: "₹11,40,000/-",
      },
      {
        id: "i2-1br",
        duration: "20 Years",
        roomType: "1BR",
        emiStarts: "₹22,800/-",
        totalCost: "₹9,95,000/-",
      },
      {
        id: "i3-1br",
        duration: "15 Years",
        roomType: "1BR",
        emiStarts: "₹19,300/-",
        totalCost: "₹8,45,000/-",
      },
      {
        id: "i4-1br",
        duration: "10 Years",
        roomType: "1BR",
        emiStarts: "₹25,100/-",
        totalCost: "₹6,50,000/-",
      },
    ],
  },
  jade: {
    slug: "jade",
    name: "JADE",
    description:
      "Curated quiet retreats optimized for serene personal exploration.",
    cardBgClass: "bg-[#004B23] border-gray-400 text-white",
    textClass: "text-white",
    mutedTextClass: "text-gray-200/70",
    linePatternOpacity: "opacity-30",
    btnVariant: "outline",
    cards: [
      // Studios
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
      // 1BR Options
      {
        id: "j1-1br",
        duration: "25 Years",
        roomType: "1BR",
        emiStarts: "₹17,200/-",
        totalCost: "₹8,20,000/-",
      },
      {
        id: "j2-1br",
        duration: "20 Years",
        roomType: "1BR",
        emiStarts: "₹15,100/-",
        totalCost: "₹7,10,000/-",
      },
      {
        id: "j3-1br",
        duration: "15 Years",
        roomType: "1BR",
        emiStarts: "₹13,200/-",
        totalCost: "₹6,20,000/-",
      },
      {
        id: "j4-1br",
        duration: "10 Years",
        roomType: "1BR",
        emiStarts: "₹18,400/-",
        totalCost: "₹5,05,000/-",
      },
    ],
  },
};

const TIER_ORDER = ["ebony", "ivory", "jade"];
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
    <section className="w-full bg-white pb-20 lg:pb-30">
      {/* Header Section - Luxury KEYSTONE Style Banner */}
      <div className="relative w-full bg-black text-white py-20 px-6 md:px-12 overflow-hidden shadow-2xl mb-14">
        {/* Fine Wavy Line Background Pattern */}
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <Image
              src="/Img/pattern.png"
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Top Tagline */}
            <span className="text-xs uppercase font-medium tracking-[0.35em] text-neutral-400 mb-3">
              LAUNCHING
            </span>

            {/* Main Header */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.25em] uppercase text-white font-serif leading-tight">
              MEMBERSHIP OWNERSHIP TIERS
            </h2>

            {/* Subtitle */}
            <span className="text-xs sm:text-sm uppercase font-semibold tracking-[0.3em] text-neutral-300 mt-3 mb-10">
              PRIVILEGED ACCESS
            </span>

            {/* 3 Tier Cards Graphic Showcase */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 my-6 w-full max-w-5xl px-4">
              {/* IVORY Card */}
              <div className="relative w-full sm:w-1/3 h-52 sm:h-56 rounded-2xl bg-gradient-to-br from-[#ECE0CD] via-[#D8C7B0] to-[#BEAD95] p-6 text-neutral-900 shadow-2xl border border-amber-200/50 flex flex-col justify-center overflow-hidden group hover:scale-105 transition-transform duration-300">
                {/* Texture Image Layer */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
                  <Image
                    src="/Img/pattern.png"
                    alt=""
                    fill
                    className="object-cover scale-125"
                  />
                </div>
                {/* Additional Sheen */}
                <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                
                <div className="flex flex-col items-center justify-center h-full z-10 gap-2">
                  <div className="w-44 h-32 relative opacity-95">
                    <Image src="/Img/fanlogo.png" alt="" fill className="object-contain" />
                  </div>
                  <h3 className="text-[11px] font-bold tracking-[0.35em] font-serif uppercase text-neutral-900">IVORY</h3>
                </div>
              </div>

              {/* EBONY Card (Center & Prominent) */}
              <div className="relative w-full sm:w-1/3 h-56 sm:h-60 rounded-2xl bg-gradient-to-br from-[#2a2a2a] via-[#141414] to-[#050505] p-6 text-white shadow-2xl border border-neutral-700 flex flex-col justify-center overflow-hidden z-10 sm:-translate-y-3 group hover:scale-105 transition-transform duration-300">
                {/* Texture Image Layer */}
                <div className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none">
                  <Image
                    src="/Img/pattern.png"
                    alt=""
                    fill
                    className="object-cover scale-125"
                  />
                </div>
                {/* Additional Metallic Sheen */}
                <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-500 via-transparent to-transparent" />
                
                <div className="flex flex-col items-center justify-center h-full z-10 gap-2">
                  <div className="w-48 h-36 relative">
                    <Image src="/Img/fanlogo.png" alt="" fill className="object-contain brightness-200" />
                  </div>
                  <h3 className="text-[12px] font-bold tracking-[0.35em] font-serif uppercase text-white">EBONY</h3>
                </div>
              </div>

              {/* JADE Card */}
              <div className="relative w-full sm:w-1/3 h-52 sm:h-56 rounded-2xl bg-gradient-to-br from-[#14574E] via-[#0B3D37] to-[#042420] p-6 text-white shadow-2xl border border-emerald-500/40 flex flex-col justify-center overflow-hidden group hover:scale-105 transition-transform duration-300">
                {/* Texture Image Layer */}
                <div className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none">
                  <Image
                    src="/Img/pattern.png"
                    alt=""
                    fill
                    className="object-cover scale-125"
                  />
                </div>
                {/* Additional Emerald Glow Sheen */}
                <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-300 via-transparent to-transparent" />
                
                <div className="flex flex-col items-center justify-center h-full z-10 gap-2">
                  <div className="w-44 h-32 relative opacity-95">
                    <Image src="/Img/fanlogo.png" alt="" fill className="object-contain brightness-200" />
                  </div>
                  <h3 className="text-[11px] font-bold tracking-[0.35em] font-serif uppercase text-emerald-100">JADE</h3>
                </div>
              </div>
            </div>

            {/* Bottom Lifespan Text */}
            <span className="text-xs uppercase font-medium tracking-[0.3em] text-neutral-400 mt-8">
              FIVE, TEN, FIFTEEN &amp; TWENTY YEAR MEMBERSHIPS
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          {/* Navigation Switcher */}
          <div className="flex justify-center mb-14 sticky top-20 z-40 py-4 -mx-6 px-6">
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

            // Separate cards into Room Types
            const studioCards = tier.cards.filter(
              (c) => c.roomType === "Studio",
            );
            const oneBrCards = tier.cards.filter((c) => c.roomType === "1BR");

            return (
              <div
                key={tier.slug}
                id={tier.slug}
                className="relative scroll-mt-40"
              >
                <div className="mb-6 max-w-xl text-left md:pl-1">
                  <h3 className="text-xl font-bold uppercase text-neutral-950 tracking-wide flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tier.slug === "jade"
                          ? "bg-[#165B54]"
                          : tier.slug === "ivory"
                            ? "bg-[#c7bfb0]"
                            : "bg-black"
                      }`}
                    />
                    {tier.name} Ownership Options
                  </h3>
                  <p className="text-md text-gray-500 font-medium mt-2 ml-4">
                    {tier.description}
                  </p>
                </div>

                {/* Render Function for Card Grids */}
                {[
                  { title: "Studios", data: studioCards },
                  { title: "1 Bedroom Suites", data: oneBrCards },
                ].map((group, groupIdx) => (
                  <div
                    key={group.title}
                    className={groupIdx > 0 ? "mt-12" : ""}
                  >
                    <h4 className="text-lg font-bold tracking-wide text-black mb-4 uppercase md:pl-5">
                      {group.title}
                    </h4>

                    <div className="overflow-hidden">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
                        {group.data.map((card, idx) => (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{
                              duration: 0.5,
                              delay: idx * 0.1,
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

                            {/* Top row containing Logo, Labels, and Duration */}
                            <div className="relative z-10 flex justify-between items-center gap-4">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-24 sm:h-12 sm:w-28 shrink-0">
                                  <Image
                                    src="/Img/fanlogo.png"
                                    alt="Logo"
                                    fill
                                    className="object-contain"
                                    priority={idx < 3}
                                  />
                                </div>
                                <div>
                                  <h4 className="text-lg font-black tracking-wider uppercase font-sans leading-none">
                                    {tier.name}
                                  </h4>
                                  <span
                                    className={`text-[11px] font-bold tracking-wide block mt-1.5 ${tier.mutedTextClass}`}
                                  >
                                    {card.roomType}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-xs border border-current/10 whitespace-nowrap">
                                {card.duration}
                              </span>
                            </div>

                            <div className="relative z-10 grid grid-cols-2 gap-2 border-y border-current/10 py-4 my-2">
                              <div>
                                <span
                                  className={`text-[9px] uppercase font-bold tracking-widest block ${tier.mutedTextClass}`}
                                >
                                  EMI Starts at
                                </span>
                                <p className="text-lg font-black tracking-tight mt-0.5 whitespace-nowrap">
                                  {card.emiStarts}
                                </p>
                              </div>
                              <div className="border-l border-current/10 pl-3">
                                <span
                                  className={`text-[9px] uppercase font-bold tracking-widest block ${tier.mutedTextClass}`}
                                >
                                  Total Cost
                                </span>
                                <p className="text-lg font-black tracking-tight mt-0.5 whitespace-nowrap">
                                  {card.totalCost}
                                </p>
                              </div>
                            </div>

                            <div className="relative z-10 flex items-center justify-between mt-1 gap-2">
                              <CtaButton
                                text="Buy Now"
                                variant={tier.btnVariant}
                                size="sm"
                                href="/contact"
                              />
                              <button
                                className={`text-[11px] font-bold tracking-wide hover:underline cursor-pointer whitespace-nowrap ${tier.mutedTextClass}`}
                              >
                                + Compare
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
