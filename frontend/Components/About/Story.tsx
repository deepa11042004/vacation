"use client";

import React from "react";
import Image from "next/image";
import { Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

export default function Story() {
  return (
    <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-14 font-display">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Side */}
          <div className="relative w-full h-[75vh] lg:col-span-6 overflow-hidden rounded-3xl shadow-xs">
            <Image
              fill
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
              alt="Traveler standing over a vast mountain valley with arms wide open"
              sizes="(max-w-1024px) 100vw, 600px"
              className="object-cover object-center"
              priority
            />
          </div>

          {/*  Right Side */}
          <div className="flex flex-col items-start lg:col-span-6 lg:pl-6 relative">
            {/* Custom Section Label */}
            <Badge
              text="Our Story"
              variant="black"
              size="lg"
              icon={Minus}
              className="mb-5"
            />

            {/* Main Header Display */}
            <h2 className="text-3xl font-semibold leading-tight text-gray-950 sm:text-4xl lg:text-5xl tracking-tight mb-6 max-w-xl">
              Discovering beauty Then <br /> sharing it exclusively
            </h2>

            {/* Paragraph Blocks */}
            <div className="flex flex-col gap-4 text-sm sm:text-base font-medium text-gray-500 max-w-xl leading-relaxed mb-8">
              <p>
                Our story started 2010 with simple conviction adventure should
                feel effortless. It all began with a belief that travel awaken
                the spirit.
              </p>
              <p>
                What began as a focused effort to remove uncertainty from remote
                travel has grown into a globally respected expedition company.
                We now guide travelers across mountains, polar regions, and wild
                frontiers with expert planning and unwavering standards.
              </p>
            </div>

            {/* Action Control + Floating Offset Image Group */}
            <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-8 mt-4">
              {/* Custom Integrated CTA Button */}
              <div className="shrink-0">
                <CtaButton text="Contact Us" variant="white" size="md" />
              </div>

              {/* Smaller Asymmetric Floating Image Card */}
              <div className="relative w-full max-w-70 h-45 overflow-hidden rounded-2xl bg-neutral-100 shadow-md transform-gpu transition-transform duration-500 hover:scale-[1.02] self-start sm:self-auto">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80"
                  alt="Group of hikers with backpacks trekking along a sunny hillside path"
                  sizes="280px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
