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
import Image from "next/image";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
}

const FEATURES: Feature[] = [
  {
    id: "f1",
    title: "Seamless Booking",
    description:
      "Secure your expedition with a streamlined and confidential reservation process designed for efficiency and precision.",
    icon: Ticket,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "f2",
    title: "Breathtaking Landscapes",
    description:
      "Explore awe-inspiring natural wonders, from pristine sandy beaches to majestic mountain peaks, curated for the ultimate getaway.",
    icon: Mountain,
    image: "https://images.pexels.com/photos/346820/pexels-photo-346820.jpeg",
  },
  {
    id: "f3",
    title: "Cultural Experiences",
    description:
      "Immerse yourself in rich local traditions, savor authentic cuisines, and forge genuine connections with vibrant communities globally.",
    icon: Globe,
    image:
      "https://plus.unsplash.com/premium_photo-1720798648593-d47ef30eb141?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y3VsdHVyYWwlMjBleHBlcmllbmNlfGVufDB8fDB8fHww",
  },
  {
    id: "f4",
    title: "24/7 Expert Support",
    description:
      "From pre-trip planning to in-country assistance, our team ensures you're supported at every step of your journey.",
    icon: Wallet,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "f5",
    title: "Custom Itineraries",
    description:
      "Tailor your travels to your exact preferences, ensuring every destination matches your unique adventurous spirit.",
    icon: Map,
    image:
      "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "f6",
    title: "Luxury Stays",
    description:
      "Experience world-class accommodations hand-picked for their premium comfort, stunning views, and unmatched hospitality.",
    icon: Hotel,
    image:
      "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1320&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-blue-50 transition-colors duration-300 hover:border-blue-600"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col gap-5 p-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs transition-transform duration-300 group-hover:scale-105">
          <IconComponent className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-black">
          {data.title}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-gray-500">
          {data.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function BookingDetail() {
  return (
    <section className="relative rounded-b-[6vw] w-full overflow-hidden bg-white px-6 py-24 md:px-40">
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
            <CtaButton
              text="Explore Packages"
              variant="white"
              size="md"
              className="self-start"
            />
          </div>
        </div>

        {/* card row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.id} data={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
