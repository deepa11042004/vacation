"use client";

import React from "react";
import { motion } from "motion/react";
import { Ticket, Car, Compass, Wallet, Minus } from "lucide-react";
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
    title: "Professional Guide",
    description:
      "Navigate unmatched terrains alongside seasoned, certified wilderness veterans who safeguard every footprint of your tour path.",
    icon: Car,
  },
  {
    id: "f3",
    title: "Transparent Pricing",
    description:
      "Our pricing is thoughtfully structured to reflect the precision, safety, and exclusivity behind every expedition.",
    icon: Compass,
  },
  {
    id: "f4",
    title: "24/7 Expert Support",
    description:
      "From pre-trip planning to in-country assistance, our team ensures you're supported at every step of your journey.",
    icon: Wallet,
  },
];

function FeatureCard({ data, index }: { data: Feature; index: number }) {
  const IconComponent = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      className="group flex flex-col gap-5 rounded-3xl border border-gray-200 bg-blue-50 p-7 transition-colors duration-300 hover:border-blue-600"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs transition-transform duration-300 group-hover:scale-105">
        <IconComponent className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-black">
        {data.title}
      </h3>
      <p className="text-sm font-medium leading-relaxed text-gray-500">
        {data.description}
      </p>
    </motion.div>
  );
}

export default function BookingDetail() {
  return (
    <section className="relative w-full overflow-hidden bg-white px-6 py-24 md:px-40">
      <div className="relative">
        {/* header */}
        <div className="mb-16 w-full">
          <Badge
            text="Why Choose Us"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-5"
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-3xl text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight text-black">
              Travel destinations <br />
              across the globe.
            </h2>
            <CtaButton text="Explore Packages" variant="white" size="md" className="self-start" />
          </div>
        </div>

        {/* card row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.id} data={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
