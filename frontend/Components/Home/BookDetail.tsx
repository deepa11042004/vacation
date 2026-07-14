"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Ticket,
  Mountain,
  Globe,
  Wallet,
  Minus,
  Map,
  Hotel,
} from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const FEATURES: Feature[] = [
  {
    id: "f1",
    title: "Seamless Booking",
    description:
      "Secure your expedition with a streamlined and confidential reservation process designed for efficiency and precision.",
    icon: Ticket,
  },
  {
    id: "f2",
    title: "Breathtaking Landscapes",
    description:
      "Explore awe-inspiring natural wonders, from pristine sandy beaches to majestic mountain peaks, curated for the ultimate getaway.",
    icon: Mountain,
  },
  {
    id: "f3",
    title: "Cultural Experiences",
    description:
      "Immerse yourself in rich local traditions, savor authentic cuisines, and forge genuine connections with vibrant communities globally.",
    icon: Globe,
  },
  {
    id: "f4",
    title: "24/7 Expert Support",
    description:
      "From pre-trip planning to in-country assistance, our team ensures you're supported at every step of your journey.",
    icon: Wallet,
  },
  {
    id: "f5",
    title: "Custom Itineraries",
    description:
      "Tailor your travels to your exact preferences, ensuring every destination matches your unique adventurous spirit.",
    icon: Map,
  },
  {
    id: "f6",
    title: "Luxury Stays",
    description:
      "Experience world-class accommodations hand-picked for their premium comfort, stunning views, and unmatched hospitality.",
    icon: Hotel,
  },
];

function FeatureCard({ data, index }: { data: Feature; index: number }) {
  const IconComponent = data.icon;
  const number = index + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-linear-to-br from-blue-100 to-blue-50 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10"
    >
      {/* Background Number */}
      <span className="absolute right-12 top-0 text-[160px] font-bold leading-none text-blue-200 select-none">
        {number}
      </span>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Icon Container */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-600/30">
          <IconComponent className="h-7 w-7" strokeWidth={2} />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            {data.title}
          </h3>
          <p className="text-sm font-medium leading-relaxed text-gray-600">
            {data.description}
          </p>
        </div>

        {/* Decorative Line */}
        <div className="mt-2 h-1 w-20 rounded-full bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-300 group-hover:w-32" />
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}

export default function BookingDetail() {
  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-blue-50 to-white px-6 py-24 md:px-40">
      <div className="relative">
        {/* Header */}
        <div className="mb-16 w-full">
          <Badge
            text="Why Choose Us"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-5"
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-3xl text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900">
              Travel destinations <br />
              across the globe.
            </h2>
            <CtaButton
              text="Explore Packages"
              variant="white"
              size="md"
              className="self-start"
            />
          </div>
        </div>

        {/* Card Grid - 2 Columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.id} data={feature} index={i} />
          ))}
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl" />
    </section>
  );
}
