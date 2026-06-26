"use client";

import React from "react";
import Image from "next/image";
import { Minus } from "lucide-react";
import Badge from "@/UI/Badge";

export default function ActivitiesHeader() {
  return (
    <section className="w-full bg-white px-6 py-8">
      <div className="relative mx-auto h-80 w-full max-w-7xl overflow-hidden rounded-2xl bg-gray-900 shadow-lg sm:h-95 md:h-105">
        {/* ─── Background Landscape Image ─── */}
        <Image
          fill
          priority
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80"
          alt="Exclusive aerial tropical coastline views"
          sizes="(max-w-1280px) 100vw, 1280px"
          className="object-cover object-center brightness-[0.85]"
        />

        {/* Soft comprehensive dark wash */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        {/* Bottom heavy vignetting matching the source layout */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-10" />

        {/* ─── Centered Layout Copy Content Block ─── */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Custom Tag Indicator Badge */}
          <Badge
            text="Tour Package"
            variant="white"
            size="lg"
            icon={Minus}
            className="mb-6 mr-4 backdrop-blur-xs"
          />

          {/* Master Section Heading Typography */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-xs">
            Our Exclusive Tour Activities
          </h1>
        </div>
      </div>
    </section>
  );
}
