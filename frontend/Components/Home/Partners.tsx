"use client";

import React from "react";
import Badge from "@/UI/Badge";
import { Minus } from "lucide-react";

const PARTNER_CATEGORIES = [
  {
    title: "Preferred Airlines",
    partners: [
      "Emirates",
      "IndiGo",
      "Qatar Airways",
      "Vistara",
      "AirAsia",
      "SpiceJet",
      "Air India",
    ],
    direction: "marquee-left",
    speed: 35,
  },
  {
    title: "Our Preferred Hotels",
    partners: [
      "Golden Tulip",
      "Park Plaza",
      "Ramada",
      "The Fern",
      "WelcomHeritage",
      "Country Inn",
      "Taj",
      "Oberoi",
    ],
    direction: "marquee-right",
    speed: 40,
  },
  {
    title: "Travel Partners",
    partners: [
      "Booking.com",
      "EaseMyTrip",
      "Goibibo",
      "MakeMyTrip",
      "Yatra",
      "Agoda",
      "Expedia",
    ],
    direction: "marquee-left",
    speed: 38,
  },
  {
    title: "B2B Channel Partners",
    partners: [
      "TBO.com",
      "Unimoni",
      "AirIQ",
      "RezLive",
      "TravelBoutique",
      "RateHawk",
      "Hotelbeds",
    ],
    direction: "marquee-right",
    speed: 45,
  },
];

export default function Partners() {
  return (
    <section className="bg-blue-50 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-display selection:bg-blue-100">
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33333%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-33.33333%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* ─── Header Section ─── */}
        <div className="text-center flex flex-col items-center mb-16 md:mb-24">
          <Badge
            text="Our Network"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-6"
          />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950 mb-6">
            Trusted Partners
          </h2>
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            We work with the world&apos;s leading travel brands to deliver
            exceptional, reliable, and premium experiences globally.
          </p>
        </div>

        {/* ─── Marquees Section ─── */}
        <div className="flex flex-col gap-16 md:gap-20">
          {PARTNER_CATEGORIES.map((category, idx) => (
            <div key={idx} className="flex flex-col gap-6">
              <h3 className="text-xl md:text-2xl font-semibold text-center text-neutral-900 tracking-tight">
                {category.title}
              </h3>

              {/* Edge mask for smooth fade in/out on sides */}
              <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div
                  className="flex w-max gap-4 md:gap-8 py-4 px-4"
                  style={{
                    animation: `${category.direction} ${category.speed}s linear infinite`,
                    willChange: "transform",
                  }}
                >
                  {/* Duplicating the array 3 times because we translate by 33.33% to create a perfect seamless loop */}
                  {[
                    ...category.partners,
                    ...category.partners,
                    ...category.partners,
                  ].map((partner, pIdx) => (
                    <div
                      key={`${idx}-${pIdx}`}
                      className="w-48 h-24 md:w-56 md:h-28 shrink-0 bg-white border border-neutral-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center hover:scale-105 hover:shadow-[0_8px_20px_-4px_rgba(0,100,255,0.15)] hover:border-blue-100 transition-all duration-300 ease-out cursor-pointer group"
                    >
                      <span className="font-bold text-neutral-400 group-hover:text-blue-600 transition-colors duration-300 text-lg md:text-xl text-center px-4">
                        {partner}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
