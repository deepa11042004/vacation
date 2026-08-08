"use client";

import React from "react";
import Image from "next/image";
import Badge from "@/UI/Badge";
import { Minus } from "lucide-react";

const PARTNER_CATEGORIES: {
  title: string;
  partners: { name: string; id: number; ext?: string }[];
  direction: string;
  speed: number;
  imagePrefix: string;
  imageExt?: string;
  imageClassName: string;
}[] = [
  {
    title: "Travel Partners",
    partners: [
      { name: "Booking.com", id: 1 },
      { name: "EaseMyTrip", id: 2 },
      { name: "Goibibo", id: 3 },
      { name: "MakeMyTrip", id: 4 },
      { name: "Yatra", id: 5 },
      { name: "Agoda", id: 6 },
      { name: "Expedia", id: 7 },
    ],
    direction: "marquee-left",
    speed: 38,
    imagePrefix: "/partners/travel",
    imageClassName: "w-auto h-10 object-contain",
  },

  {
    title: "Associates Brands",
    partners: [
      { name: "TBO.com", id: 1 },
      { name: "Unimoni", id: 2 },
      { name: "AirIQ", id: 3 },
      { name: "RezLive", id: 4 },
      { name: "TravelBoutique", id: 5 },
      { name: "RateHawk", id: 6 },
      { name: "Hotelbeds", id: 7 },
    ],
    direction: "marquee-right",
    speed: 45,
    imagePrefix: "/associates/ass_partner",
    imageClassName: "w-auto h-8 object-contain",
  },
  
  {
    title: "Associate Properties",
    partners: [
      { name: "ITC Hotels", id: 4 },
      { name: "Marriott", id: 5 },
      { name: "Hilton", id: 6 },
      { name: "Radisson", id: 7 },
    ],
    direction: "marquee-right",
    speed: 42,
    imagePrefix: "/hotels/hotels",
    imageClassName: "w-auto h-14 object-contain",
  },
  
  {
    title: "Preferred Airlines",
    partners: [
      { name: "IndiGo", id: 1 },
      { name: "Qatar Airways", id: 2 },
      { name: "Vistara", id: 3 },
      { name: "Emirates", id: 4 },
      { name: "Akasa Air", id: 5 },
      { name: "AirAsia", id: 6 },
      { name: "Air India", id: 7 },
    ],
    direction: "marquee-left",
    speed: 35,
    imagePrefix: "/airlines/air",
    imageClassName: "w-auto h-16 object-contain",
  },

  {
    title: "Preferred Media Partners",
    partners: [
      { name: "The Times of India", id: 1 },
      { name: "NDTV", id: 2 },
      { name: "India Today", id: 3 },
      { name: "Hindustan Times", id: 4 },
      { name: "The Economic Times", id: 5 },
      { name: "The Hindu", id: 6 },
      { name: "CNBC TV18", id: 7 },
    ],
    direction: "marquee-right",
    speed: 40,
    imagePrefix: "/media/media",
    imageClassName: "w-auto h-12 object-contain",
  },
];

export default function Partners() {
  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-display selection:bg-blue-100 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/sky-bg.jpg')" }}
    >
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
                      className="w-48 h-24 md:w-56 md:h-28 shrink-0 bg-white border border-neutral-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center hover:scale-105 hover:shadow-[0_8px_20px_-4px_rgba(0,100,255,0.15)] hover:border-blue-100 transition-all duration-300 ease-out cursor-pointer group px-4"
                    >
                      <Image
                        src={`${category.imagePrefix}${partner.id}${partner.ext || category.imageExt || ".png"}`}
                        alt={partner.name}
                        width={120}
                        height={48}
                        className={category.imageClassName}
                      />
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
