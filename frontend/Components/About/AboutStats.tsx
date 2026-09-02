"use client";

import React from "react";

export interface StatItem {
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: "140+", label: "Countries & Destinations" },
  { value: "50+", label: "Unique Experiences" },
  { value: "15K+", label: "Happy Guests" },
  { value: "4.9", label: "Average Rating" },
];

export default function AboutStats({ hideBackground = false }: { hideBackground?: boolean }) {
  return (
    <section className={`w-full py-12 px-6 sm:px-10 lg:px-14 font-display ${hideBackground ? "" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#edf3ff] rounded-3xl p-8 sm:p-12 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-blue-200/60">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center text-center ${
                idx > 0 ? "pt-6 md:pt-0" : ""
              }`}
            >
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-gray-500 uppercase mt-2">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
