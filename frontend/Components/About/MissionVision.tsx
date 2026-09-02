"use client";

import React from "react";
import { Target, Eye, Heart, Minus } from "lucide-react";
import Badge from "@/UI/Badge";

export default function MissionVision({ hideBackground = false }: { hideBackground?: boolean }) {
  const cards = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To connect travelers with exceptional accommodations worldwide, providing seamless access to luxury experiences that inspire, rejuvenate, and create lasting memories.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To become the world's most trusted platform for premium hospitality, setting new standards in curated travel experiences and personalized service excellence.",
    },
    {
      icon: Heart,
      title: "Our Promise",
      description:
        "Every property in our collection meets rigorous standards. We promise authenticity, quality, and an unwavering commitment to your satisfaction and comfort.",
    },
  ];

  return (
    <section className={`w-full py-20 px-6 sm:px-10 lg:px-14 font-display ${hideBackground ? "" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <Badge
          text="WHAT DRIVES US"
          variant="black"
          size="lg"
          icon={Minus}
          className="mb-5"
        />

        <h2 className="text-3xl font-bold leading-tight text-gray-950 sm:text-4xl lg:text-5xl tracking-tight mb-4">
          Our Mission &amp; Vision
        </h2>

        <p className="text-base sm:text-lg text-gray-500 font-medium max-w-3xl leading-relaxed">
          We are guided by a commitment to excellence, a passion for travel, and a dedication to creating moments that last a lifetime.
        </p>

        {/* 3 Grid Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
          {cards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div
                key={idx}
                className="bg-[#edf3ff] rounded-3xl p-8 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all duration-300"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 shadow-sm flex items-center justify-center mb-6">
                  <IconComp size={28} strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-gray-950 mb-3">
                  {card.title}
                </h3>

                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
