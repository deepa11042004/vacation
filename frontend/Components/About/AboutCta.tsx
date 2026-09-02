"use client";

import React from "react";
import { Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

export default function AboutCta({ hideBackground = false }: { hideBackground?: boolean }) {
  return (
    <section className={`w-full py-16 px-6 sm:px-10 lg:px-14 font-display ${hideBackground ? "" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full rounded-3xl bg-[#0b192e] p-10 sm:p-16 text-white overflow-hidden shadow-2xl flex flex-col items-center text-center">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl flex flex-col items-center">
            <Badge
              text="START YOUR JOURNEY"
              variant="white"
              size="sm"
              icon={Minus}
              className="mb-5"
            />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
              Ready to Experience Luxury?
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-medium leading-relaxed mb-10">
              Join thousands of satisfied travelers who have discovered the Mandarin difference. Let us help you create memories that last a lifetime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CtaButton text="Explore Packages" variant="white" size="md" href="/join" />
              <CtaButton text="Contact Us" variant="blue" size="md" href="/contact" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
