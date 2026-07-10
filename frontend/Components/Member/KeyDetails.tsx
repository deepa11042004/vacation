"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, Minus } from "lucide-react";
import Badge from "@/UI/Badge";

// Types
interface TenetItem {
  id: number;
  title: string;
  image: string;
  benefits: string[];
}

// Data
const KEY_TENETS: TenetItem[] = [
  {
    id: 1,
    title: "We've Got You Covered",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "Keystone gives you 7 nights/8 days of holidays every year. If you miss your vacation, you can carry forward up to 14 nights.",
      "Breakfast is on us. Other meals come with special savings.",
      "Protect your long-term holiday goals with future-proof pricing.",
      "Pick a plan based on your preferences with three unique Keys and flexible tenures."
    ]
  },
  {
    id: 2,
    title: "Special Privileges",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "Avail 52, 46, and 24 weeks of holiday access across applicable seasons for EBONY, IVORY, and JADE Keys respectively.",
      "Enjoy 25% discounts on eligible in-resort spends.",
      "Nominate up to 7 family members."
    ]
  },
  {
    id: 3,
    title: "Holiday Benefits",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "You can start booking your holidays up to 4 months in advance. All bookings are confirmed on a first-come, first-served basis.",
      "The number of rooms you can book and the seasons you travel in are based on your membership plan.",
      "Your membership unlocks thoughtfully crafted experiences for you and your loved ones."
    ]
  }
];

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

// Card Component
interface CardProps {
  item: TenetItem;
}

function TenetCard({ item }: CardProps) {
  return (
    <motion.article
      variants={fadeInUp}
      className="group flex flex-col h-full bg-blue-50 border border-gray-300 rounded-3xl overflow-hidden
                 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform-gpu"
    >
      {/* ── Image ── */}
      <div className="relative h-64 w-full overflow-hidden shrink-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/60 pointer-events-none z-10" />
      </div>

      {/* ── Body ── */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-950 leading-snug tracking-wide line-clamp-2">
          {item.title}
        </h3>

        {/* Benefits List */}
        <ul className="flex flex-col gap-3 flex-1 text-gray-500 text-sm leading-relaxed">
          {item.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-black shrink-0 opacity-80" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

// Main Section
export default function KeyDetails() {
  return (
    <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-14 font-display">
      <div className="mx-auto max-w-7xl">
        {/* ── Header Layout ── */}
        <div className="mb-12 w-full">
          <Badge
            text="Key Tenets"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-4"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
              Privileges & Benefits
            </h2>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {KEY_TENETS.map((item) => (
            <TenetCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
