"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Minus } from "lucide-react";
import Badge from "@/UI/Badge";

// ─── Refactored Activities Data matching your exact list distributed across columns
const ACTIVITY_COLUMNS = [
  [
    {
      id: 1,
      title: "Desert Safari",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[3/4]",
    },
    {
      id: 2,
      title: "Paragliding",
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-square",
    },
    {
      id: 3,
      title: "River Rafting",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[3/4]",
    },
  ],
  [
    {
      id: 4,
      title: "Scuba Diving",
      image:
        "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[4/5]",
    },
    {
      id: 5,
      title: "Jet Skiing",
      image:
        "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[3/4]",
    },
    {
      id: 6,
      title: "Bungy Jumping",
      image:
        "https://images.unsplash.com/photo-1483168527879-c66136b56105?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-square",
    },
  ],
  [
    {
      id: 7,
      title: "Surfing",
      image:
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[4/5]",
    },
    {
      id: 8,
      title: "Skydiving",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[3/4]",
    },
    {
      id: 9,
      title: "Alpine Cable Cars",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[3/4]",
    },
  ],
];

// Animation presets
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 18 },
  },
};

export default function Activities() {
  return (
    <section className="bg-white text-black py-24 px-4 sm:px-6 lg:px-8 w-full overflow-hidden select-none font-display">
      <div className="max-w-7xl mx-auto">
        {/* ─── 1. Header Block with custom Badge & your requested headings ─── */}
        <div className="text-center flex flex-col items-center mb-16 md:mb-20">
          <Badge
            text="Follow Us"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-4"
          />

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-950 mb-5 max-w-3xl leading-tight">
            Discover More <br /> Across Our Channels
          </h2>
        </div>

        {/* ─── 2. Staggered Bento Layout System ─── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
        >
          {ACTIVITY_COLUMNS.map((column, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-6 w-full">
              {column.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className={`relative w-full ${activity.aspect} rounded-2xl overflow-hidden shadow-xs bg-neutral-200 group cursor-pointer`}
                >
                  {/* Activity Image Frame */}
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 33vw"
                    className="object-cover brightness-[0.93] group-hover:scale-103 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Clean Lower Title Mask overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 z-10">
                    <span className="text-white text-base font-bold tracking-wide">
                      {activity.title}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
