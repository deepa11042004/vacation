"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { ShieldCheck, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

// Data
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
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
    size: "tall",
    isPaused: true,
  },
];

const MEMBERSHIPS = [
  {
    title: "EBONY",
    subtitle: "Your year-round access to unforgettable family gateways",
    bgClass: "bg-black text-white border-neutral-800",
    lineColor: "rgba(255,255,255,0.08)",
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
    bgClass: "bg-black text-white border-neutral-800",
    lineColor: "rgba(0,0,0,0.05)",
    bulletColor: "bg-white",
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
    bgClass: "bg-black text-white border-neutral-800",
    lineColor: "rgba(255,255,255,0.08)",
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
    <section className="w-full overflow-hidden select-none">
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
          offering 7 nights/8 days holidays every year — filled with cherished
          family moments and thoughtfully crafted experiences.
        </p>

        {/* HORIZONTAL SLIDING PRIVILEGES CAROUSEL */}
        <div className="w-full relative flex flex-col items-center mt-4">
          <h4 className="text-3xl font-bold tracking-wider text-white mb-10">
            Handpicked Privileges
          </h4>

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
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10" />
                    <div className="absolute left-6 bottom-6 z-20 flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10">
                      <span className="text-sm font-medium text-white tracking-wide">
                        {card.title}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
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

          <div className="flex justify-center">
            <CtaButton text="Join Now" href="/join" variant="white" size="md" />
          </div>
        </div>
      </div>
    </section>
  );
}

// SUB-COMPONENT: REUSABLE 3D MOUSE TILT CARD
function TiltCard({ card }: { card: (typeof MEMBERSHIPS)[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = cardRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // Subtle tilt effect (reduced for a stiffer, premium credit card feel)
    rotateX.set(-(mouseY / rect.height) * 8);
    rotateY.set((mouseX / rect.width) * 8);

    // Track cursor for the follower tag
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{ transform }}
      className="relative w-full max-w-sm aspect-[1.586] cursor-pointer group"
    >
      {/* Interactive Cursor Follower Tag */}
      {isHovered && (
        <motion.span
          style={{ x: cursorX, y: cursorY }}
          className="absolute z-50 bg-white text-black rounded-2xl px-3 py-1.5 text-xs font-bold pointer-events-none shadow-lg -translate-x-1/2 -translate-y-1/2 flex items-center gap-1"
        >
          {isFlipped ? "Flip" : "Flip"}
        </motion.span>
      )}

      {/* Inner Wrapper for 3D Flip Animation */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        {/* ─── FRONT FACE ─── */}
        <div
          className={`absolute inset-0 rounded-3xl p-6 flex flex-col justify-between text-left shadow-xl overflow-hidden border ${card.bgClass}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Background Pattern SVG */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Image
              src="/Img/pattern.png"
              alt="Background pattern"
              fill
              className="object-cover mix-blend-overlay"
              unoptimized
            />
          </div>

          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none rounded-3xl" />

          {/* Front Content */}
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="inline-flex justify-between items-center">
              <Image
                src="/Img/fan.png"
                alt="Fan Icon"
                width={48}
                height={48}
                className="w-12 h-12 object-contain drop-shadow-md"
              />
              <span className="text-xs uppercase font-bold tracking-widest opacity-60">
                Membership
              </span>
            </div>

            <div>
              <h4 className="text-3xl font-extrabold tracking-wide mb-2 font-sans">
                {card.title}
              </h4>
              <p className="text-sm opacity-80 leading-relaxed font-medium">
                {card.subtitle}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div className="text-xs opacity-60 font-mono tracking-widest">
                **** **** **** {card.title.substring(0, 4).toUpperCase()}
              </div>
              <div className="w-8 h-8 rounded-full opacity-80 border border-current flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* ─── BACK FACE ─── */}
        <div
          className={`absolute inset-0 rounded-3xl p-6 flex flex-col justify-between text-left shadow-xl overflow-hidden border ${card.bgClass}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none rounded-3xl" />
          {/* Background Pattern SVG */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Image
              src="/Img/pattern.png"
              alt="Background pattern"
              fill
              className="object-cover mix-blend-overlay"
              unoptimized
            />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 opacity-70" />
              <h5 className="text-sm font-bold tracking-wider uppercase">
                Benefits
              </h5>
            </div>

            <ul className="space-y-3 grow">
              {card.benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${card.bulletColor}`}
                  />
                  <span className="font-medium opacity-90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
