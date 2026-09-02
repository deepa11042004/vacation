"use client";

import React from "react";
import { Gem, Handshake, Lightbulb, Users, Minus } from "lucide-react";
import Badge from "@/UI/Badge";

export default function CoreValues({ hideBackground = false }: { hideBackground?: boolean }) {
  const values = [
    {
      icon: Gem,
      title: "Excellence",
      description: "We strive for perfection in every detail of our service.",
    },
    {
      icon: Handshake,
      title: "Integrity",
      description:
        "Honest, transparent relationships with our partners and guests.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Continuously evolving to enhance your travel experience.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building lasting relationships with our global family.",
    },
  ];

  return (
    <section className={`w-full py-20 px-6 sm:px-10 lg:px-14 font-display ${hideBackground ? "" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <Badge
          text="OUR FOUNDATION"
          variant="black"
          size="lg"
          icon={Minus}
          className="mb-5"
        />

        <h2 className="text-3xl font-bold leading-tight text-gray-950 sm:text-4xl lg:text-5xl tracking-tight mb-12">
          Core Values
        </h2>

        {/* 4 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-stretch">
          {values.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#edf3ff] rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all duration-300"
              >
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-white text-blue-600 shadow-sm flex items-center justify-center mb-5">
                  <IconComp size={24} strokeWidth={2} />
                </div>

                <h3 className="text-lg font-bold text-gray-950 mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm font-medium text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
