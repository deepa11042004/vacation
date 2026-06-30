"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useMotionValue, useSpring, useInView } from "framer-motion";


// Counter Mechanism
interface CounterProps {
  value: number;
  direction?: "up" | "down";
}

function Counter({ value }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 70,
    damping: 24,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
}

// Main Component
export default function About() {
  return (
    <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-14 font-display">
      <div className="mx-auto max-w-7xl">
        {/* Layout Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-stretch">
          {/* Left Block Card */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#edf3ff] p-6 md:col-span-3 min-h-95">
            <div className="flex flex-col gap-1">
              <div className="text-4xl font-bold tracking-tight text-black sm:text-5xl flex items-center">
                <Counter value={5000} />
                <span className="text-blue-600 ml-0.5">+</span>
              </div>
              <p className="text-sm font-medium text-gray-500">
                Our Happy Travelers
              </p>
            </div>

            <div className="relative mt-6 h-48 w-full overflow-hidden rounded-2xl">
              <Image
                fill
                src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&q=80"
                alt="Campfire relaxation under a high valley cliff"
                sizes="(max-w-768px) 100vw, 300px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Center Column Card */}
          <div className="relative min-h-95 overflow-hidden rounded-3xl bg-gray-100 md:col-span-6 shadow-xs">
            <Image
              fill
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
              alt="Two travelers walking towards towering high altitude clear alpine ridges"
              sizes="(max-w-768px) 100vw, 600px"
              className="object-cover"
              priority
            />
          </div>

          {/* Right Block Card */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#edf3ff] p-6 md:col-span-3 min-h-95">
            <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl">
              <Image
                fill
                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80"
                alt="Two hikers adjusting safety gear along technical trail mountain tracks"
                sizes="(max-w-768px) 100vw, 300px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-4xl font-bold tracking-tight text-black sm:text-5xl flex items-center">
                <Counter value={100} />
                <span className="text-blue-600 ml-0.5">%</span>
              </div>
              <p className="text-sm font-medium text-gray-500">
                Customer Satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
