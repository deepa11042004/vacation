"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Play, Pause } from "lucide-react";
import Badge from "@/UI/Badge";

// ─── Membership Marquee Data Array ───
interface MemberCardItem {
  id: string;
  imageSrc: string;
  instagramTag: string;
  hasControls?: boolean;
  isPaused?: boolean;
  size?: "short" | "tall";
}

const MEMBER_GALLERY: MemberCardItem[] = [
  {
    id: "m1",
    imageSrc:
      "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&q=80",
    instagramTag: "@team_charli",
    size: "short",
  },
  {
    id: "m2",
    imageSrc:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80",
    instagramTag: "@kayes",
    size: "tall",
    hasControls: true,
    isPaused: true,
  },
  {
    id: "m3",
    imageSrc:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    instagramTag: "@mawfaisal",
    size: "short",
  },
  {
    id: "m4",
    imageSrc:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    instagramTag: "@arif",
    size: "tall",
    hasControls: true,
    isPaused: true,
  },
  {
    id: "m5",
    imageSrc:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80",
    instagramTag: "@travel_luxe",
    size: "short",
  },
  {
    id: "m6",
    imageSrc:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    instagramTag: "@arif",
    size: "tall",
    hasControls: true,
    isPaused: true,
  },
];

export default function MemberHome() {
  return (
    <section className="w-full bg-white py-20 overflow-hidden font-display">
      {/* ─── 1. Header Copy Block (Aligned to Reference Photo) ─── */}
      <div className="mb-14 flex flex-col items-center text-center px-6">
        <Badge
          text="Join Us"
          variant="black"
          size="lg"
          icon={Minus}
          className="mb-5"
        />

        <h2 className="max-w-5xl text-3xl font-semibold leading-[1.2] text-gray-950 sm:text-4xl md:text-5xl lg:text-6xl tracking-tight">
          Journey to the Planet’s Rarest <br /> Places, With Refined in Every
          Detail
        </h2>
      </div>

      {/* ─── 2. Infinite Continuous Marquee Engine ─── */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex w-max items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {[...MEMBER_GALLERY, ...MEMBER_GALLERY].map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className={`relative shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-xs group mr-5 ${
                card.size === "short"
                  ? "h-100 md:h-90 md:w-60"
                  : "h-125 md:h-110 md:w-120"
              }`}
            >
              <Image
                fill
                src={card.imageSrc}
                alt={`Club members travel snapshot ${card.instagramTag}`}
                sizes="(max-width: 768px) 350px, 450px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Image Lower Linear Vignette */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10" />

              {/* Tag Component Overlay */}
              <div className="absolute left-6 bottom-6 z-20 flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10">
                <Minus className="h-3.5 w-3.5 text-white" />
                <span className="text-sm font-medium text-white tracking-wide">
                  {card.instagramTag}
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
          ))}
        </motion.div>
      </div>
    </section>
  );
}
