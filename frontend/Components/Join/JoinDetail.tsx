"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PlanDetailsView, { PLAN_DATA_MAP, PlanInfo } from "./PlanDetailsView";

// Types and Interfaces
interface PricingCard {
  id: string;
  duration: string;
  roomType: "Studio" | "1BR";
  emiStarts: string;
  totalCost: string;
  planKey: string;
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

// Tier Data matching Image 3 exact pricing specification
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
      {
        id: "e1",
        duration: "20 Years",
        roomType: "Studio",
        emiStarts: "₹36,406/mo",
        totalCost: "₹11,65,000/-",
        planKey: "ebony-20",
      },
      {
        id: "e2",
        duration: "15 Years",
        roomType: "Studio",
        emiStarts: "₹30,469/mo",
        totalCost: "₹9,75,000/-",
        planKey: "ebony-15",
      },
      {
        id: "e3",
        duration: "10 Years",
        roomType: "Studio",
        emiStarts: "₹23,125/mo",
        totalCost: "₹7,40,000/-",
        planKey: "ebony-10",
      },
      {
        id: "e4",
        duration: "5 Years",
        roomType: "Studio",
        emiStarts: "₹16,719/mo",
        totalCost: "₹5,35,000/-",
        planKey: "ebony-5",
      },
    ],
  },
  ivory: {
    slug: "ivory",
    name: "IVORY",
    description:
      "Exceptional experiences timed beautifully for popular global travels.",
    cardBgClass: "bg-[#EDE9E0] border-[#BEAD95]/20 text-neutral-900",
    textClass: "text-neutral-900",
    mutedTextClass: "text-neutral-700",
    linePatternOpacity: "opacity-45",
    btnVariant: "white",
    cards: [
      {
        id: "i1",
        duration: "20 Years",
        roomType: "Studio",
        emiStarts: "₹24,219/mo",
        totalCost: "₹7,75,000/-",
        planKey: "ivory-20",
      },
      {
        id: "i2",
        duration: "15 Years",
        roomType: "Studio",
        emiStarts: "₹20,625/mo",
        totalCost: "₹6,60,000/-",
        planKey: "ivory-15",
      },
      {
        id: "i3",
        duration: "10 Years",
        roomType: "Studio",
        emiStarts: "₹15,938/mo",
        totalCost: "₹5,10,000/-",
        planKey: "ivory-10",
      },
      {
        id: "i4",
        duration: "5 Years",
        roomType: "Studio",
        emiStarts: "₹12,813/mo",
        totalCost: "₹4,10,000/-",
        planKey: "ivory-5",
      },
    ],
  },
  jade: {
    slug: "jade",
    name: "JADE",
    description:
      "Curated quiet retreats optimized for serene personal exploration.",
    cardBgClass: "bg-[#1B5B56] border-emerald-900/20 text-white",
    textClass: "text-white",
    mutedTextClass: "text-emerald-100/70",
    linePatternOpacity: "opacity-35",
    btnVariant: "outline",
    cards: [
      {
        id: "j1",
        duration: "20 Years",
        roomType: "Studio",
        emiStarts: "₹17,344/mo",
        totalCost: "₹5,55,000/-",
        planKey: "jade-20",
      },
      {
        id: "j2",
        duration: "15 Years",
        roomType: "Studio",
        emiStarts: "₹15,156/mo",
        totalCost: "₹4,85,000/-",
        planKey: "jade-15",
      },
      {
        id: "j3",
        duration: "10 Years",
        roomType: "Studio",
        emiStarts: "₹12,344/mo",
        totalCost: "₹3,95,000/-",
        planKey: "jade-10",
      },
      {
        id: "j4",
        duration: "5 Years",
        roomType: "Studio",
        emiStarts: "₹10,469/mo",
        totalCost: "₹3,35,000/-",
        planKey: "jade-5",
      },
    ],
  },
};

const TIER_ORDER = ["ebony", "ivory", "jade"];
const EASE = [0.22, 1, 0.36, 1] as const;

interface CardSliderProps {
  group: { title: string; data: PricingCard[] };
  tier: TierGroup;
  onSelectPlan: (planKey: string) => void;
}

function CardSlider({ group, tier, onSelectPlan }: CardSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const firstCard = sliderRef.current.firstElementChild as HTMLElement;
      const cardWidth = firstCard ? firstCard.offsetWidth : 384;
      const scrollAmount = cardWidth + 24; // card width + gap (24)
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-12">
      <h4 className="text-lg font-bold tracking-wide text-black mb-4 uppercase md:pl-5">
        {group.title}
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

      <div className="relative w-full overflow-hidden px-1 sm:px-4">
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4 w-full"
        >
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
              className={`relative shrink-0 w-[290px] sm:w-[340px] lg:w-[370px] flex flex-col justify-between p-6 xl:p-8 rounded-3xl border shadow-xs hover:shadow-lg transition-shadow duration-300 h-67.5 overflow-hidden snap-start ${tier.cardBgClass}`}
            >
              <div
                className={`absolute inset-0 pointer-events-none z-0 ${
                  tier.slug === "ivory" ? "opacity-15 invert" : "opacity-20"
                }`}
              >
                <Image
                  fill
                  src="/Img/pattern.png"
                  alt=""
                  className="object-cover scale-125"
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
                      className={`object-contain ${
                        tier.slug === "ivory" ? "" : "brightness-200"
                      }`}
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
                <button
                  onClick={() => onSelectPlan(card.planKey)}
                  className={`flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer shadow-md active:scale-95 ${
                    tier.slug === "ivory"
                      ? "bg-neutral-900 text-white hover:bg-neutral-800"
                      : "bg-white text-neutral-950 hover:bg-neutral-200"
                  }`}
                >
                  <span>Buy Now</span>
                  <span className="text-sm">↗</span>
                </button>
                <button
                  onClick={() => onSelectPlan(card.planKey)}
                  className={`text-[11px] font-bold tracking-wide hover:underline cursor-pointer whitespace-nowrap ${tier.mutedTextClass}`}
                >
                  + Compare
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center items-center gap-4 mt-6 w-full">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 bg-white text-black hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-md"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 bg-white text-black hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-md"
            aria-label="Next slide"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface JoinDetailProps {
  selectedTier?: string;
  buyNewPlan?: string;
  initialPlanKey?: string;
  initialTenure?: string;
}

export default function JoinDetail({
  selectedTier,
  buyNewPlan,
  initialPlanKey,
  initialTenure,
}: JoinDetailProps) {
  // Determine if Plan Details page should be open by default
  const defaultPlanKey = React.useMemo(() => {
    if (initialPlanKey && PLAN_DATA_MAP[initialPlanKey]) {
      return initialPlanKey;
    }
    if (selectedTier && initialTenure) {
      const key = `${selectedTier.toLowerCase()}-${initialTenure.replace(/\D/g, "")}`;
      if (PLAN_DATA_MAP[key]) return key;
    }
    if (buyNewPlan === "true" || buyNewPlan === "1") {
      const tier = selectedTier?.toLowerCase() || "ebony";
      return `${tier}-20`;
    }
    return null;
  }, [initialPlanKey, selectedTier, initialTenure, buyNewPlan]);

  const [activePlanKey, setActivePlanKey] = useState<string | null>(defaultPlanKey);

  const activeTiers = React.useMemo(() => {
    return selectedTier && TIER_ORDER.includes(selectedTier.toLowerCase())
      ? [selectedTier.toLowerCase()]
      : TIER_ORDER;
  }, [selectedTier]);

  const [activeTab, setActiveTab] = useState<string>(activeTiers[0]);

  React.useEffect(() => {
    if (activePlanKey) return; // don't observe scroll if plan detail is active

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -59% 0px" }
    );

    activeTiers.forEach((slug) => {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTiers, activePlanKey]);

  const handleTabChange = (slug: string) => {
    setActiveTab(slug);
    const element = document.getElementById(slug);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Render Plan Details View if active
  if (activePlanKey && PLAN_DATA_MAP[activePlanKey]) {
    return (
      <PlanDetailsView
        plan={PLAN_DATA_MAP[activePlanKey]}
        onBack={() => setActivePlanKey(null)}
      />
    );
  }

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
            {/* EBONY Card */}
            <div className="relative w-full sm:w-1/3 h-52 sm:h-56 rounded-2xl bg-gradient-to-br from-[#2a2a2a] via-[#141414] to-[#050505] p-6 text-white shadow-2xl border border-neutral-700 flex flex-col justify-center overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none">
                <Image
                  src="/Img/pattern.png"
                  alt=""
                  fill
                  className="object-cover scale-125"
                />
              </div>
              <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-500 via-transparent to-transparent" />

              <div className="flex flex-col items-center justify-center h-full z-10 gap-2">
                <div className="w-44 h-32 relative opacity-95">
                  <Image
                    src="/Img/fanlogo.png"
                    alt=""
                    fill
                    className="object-contain brightness-200"
                  />
                </div>
                <h3 className="text-[11px] font-bold tracking-[0.35em] font-serif uppercase text-white">
                  EBONY
                </h3>
              </div>
            </div>

            {/* IVORY Card (Center & Prominent) */}
            <div className="relative w-full sm:w-1/3 h-56 sm:h-60 rounded-2xl bg-gradient-to-br from-[#ECE0CD] via-[#D8C7B0] to-[#BEAD95] p-6 text-neutral-900 shadow-2xl border border-amber-200/50 flex flex-col justify-center overflow-hidden z-10 sm:-translate-y-3 group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
                <Image
                  src="/Img/pattern.png"
                  alt=""
                  fill
                  className="object-cover scale-125"
                />
              </div>
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

              <div className="flex flex-col items-center justify-center h-full z-10 gap-2">
                <div className="w-48 h-36 relative">
                  <Image
                    src="/Img/fanlogo.png"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-[12px] font-bold tracking-[0.35em] font-serif uppercase text-neutral-900">
                  IVORY
                </h3>
              </div>
            </div>

            {/* JADE Card */}
            <div className="relative w-full sm:w-1/3 h-52 sm:h-56 rounded-2xl bg-gradient-to-br from-[#14574E] via-[#0B3D37] to-[#042420] p-6 text-white shadow-2xl border border-emerald-500/40 flex flex-col justify-center overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none">
                <Image
                  src="/Img/pattern.png"
                  alt=""
                  fill
                  className="object-cover scale-125"
                />
              </div>
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-300 via-transparent to-transparent" />

              <div className="flex flex-col items-center justify-center h-full z-10 gap-2">
                <div className="w-44 h-32 relative opacity-95">
                  <Image
                    src="/Img/fanlogo.png"
                    alt=""
                    fill
                    className="object-contain brightness-200"
                  />
                </div>
                <h3 className="text-[11px] font-bold tracking-[0.35em] font-serif uppercase text-emerald-100">
                  JADE
                </h3>
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
        {activeTiers.length > 1 && (
          <div className="flex justify-center mb-14 sticky top-20 z-40 py-4 -mx-6 px-6">
            <div className="inline-flex rounded-full bg-neutral-100 p-1.5 border border-neutral-200 shadow-xs">
              {Object.values(TIER_DATA).map((tier) => (
                <button
                  key={tier.slug}
                  onClick={() => handleTabChange(tier.slug)}
                  className={`relative rounded-full px-6 py-2.5 text-xs font-bold tracking-widest transition-colors uppercase duration-300 cursor-pointer ${
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
        )}

        {/* Dynamic Content */}
        <div className="relative flex flex-col gap-24">
          {activeTiers.map((tierSlug) => {
            const tier = TIER_DATA[tierSlug];

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

                <CardSlider
                  group={{ title: "Studios", data: tier.cards }}
                  tier={tier}
                  onSelectPlan={(planKey) => setActivePlanKey(planKey)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
