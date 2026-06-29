"use client";

import React from "react";
import Image from "next/image";
import { Plane, Car, Compass, DollarSign, Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  icon: React.ElementType;
}

const BOOKING_FEATURES: FeatureCard[] = [
  {
    id: "f1",
    title: "Seamless Booking",
    description:
      "Secure your expedition with a streamlined and confidential reservation process designed for efficiency precision.",
    imageSrc:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    icon: Plane,
  },
  {
    id: "f2",
    title: "Arrival & Departure Service",
    description:
      "Enjoy seamless arrival and departure with our private, professionally managed transfer services.",
    imageSrc:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    icon: Car,
  },
  {
    id: "f3",
    title: "Professional Guides",
    description:
      "Navigate unmatched terrains alongside seasoned, certified wilderness veterans who safeguard every footprint of your tour path.",
    imageSrc:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80",
    icon: Compass,
  },
  {
    id: "f4",
    title: "Transparent Pricing",
    description:
      "Our pricing is thoughtfully structured reflect the precision, safety, and exclusivity behind every expedition.",
    imageSrc:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    icon: DollarSign,
  },
];

export default function BookingDetail() {
  return (
    <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-14 font-display">
      <div className="mx-auto max-w-7xl">
        {/* ─── Top Master Header Layout Group ─── */}
        <div className="mb-14 w-full">
          <Badge
            text="Why Choose Us"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-4"
          />

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl max-w-2xl leading-tight">
              Choose The Right Partner for <br /> Curated & Seamless Travel
            </h2>
            <div className="shrink-0">
              <CtaButton
                text="Explore All Packages"
                variant="white"
                size="md"
              />
            </div>
          </div>
        </div>

        {/* ─── Stacked Card Modules Matrix ─── */}
        <div className="flex flex-col gap-6">
          {BOOKING_FEATURES.map((feature, index) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={feature.id}
                className="sticky w-full rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch duration-300"
                style={{
                  top: "120px",
                  zIndex: index + 1,
                }}
              >
                {/* Left Side */}
                <div className="md:col-span-5 flex flex-col justify-between gap-12 min-h-55">
                  {/* Top: Icon + Feature Heading */}
                  <div className="flex flex-col items-start gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                      <IconComponent className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-950 tracking-wide">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Bottom */}
                  <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-sm">
                    {feature.description}
                  </p>
                </div>

                {/* Right Side  */}
                <div className="relative md:col-span-7 h-65 sm:h-80 md:h-auto min-h-60 w-full overflow-hidden rounded-2xl bg-neutral-50 transform-gpu">
                  <Image
                    fill
                    src={feature.imageSrc}
                    alt={feature.title}
                    sizes="(max-w-1024px) 100vw, 700px"
                    className="object-cover object-center"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
