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
        "https://images.pexels.com/photos/29306297/pexels-photo-29306297.jpeg",
      aspect: "aspect-[3/4]",
    },
    {
      id: 2,
      title: "Paragliding",
      image:
        "https://images.pexels.com/photos/3551078/pexels-photo-3551078.jpeg",
      aspect: "aspect-square",
    },
    {
      id: 3,
      title: "River Rafting",
      image:
        "https://images.pexels.com/photos/33732201/pexels-photo-33732201.jpeg",
      aspect: "aspect-[3/4]",
    },
  ],
  [
    {
      id: 4,
      title: "Scuba Diving",
      image:
        "https://images.pexels.com/photos/11060853/pexels-photo-11060853.jpeg",
      aspect: "aspect-[4/5]",
    },
    {
      id: 5,
      title: "Jet Skiing",
      image:
        "https://images.pexels.com/photos/18636557/pexels-photo-18636557.jpeg",
      aspect: "aspect-[3/4]",
    },
    {
      id: 6,
      title: "Bungy Jumping",
      image:
        "https://images.pexels.com/photos/27471607/pexels-photo-27471607.jpeg",
      aspect: "aspect-square",
    },
  ],
  [
    {
      id: 7,
      title: "Surfing",
      image:
        "https://images.pexels.com/photos/5007332/pexels-photo-5007332.jpeg",
      aspect: "aspect-[4/5]",
    },
    {
      id: 8,
      title: "Skydiving",
      image:
        "https://images.pexels.com/photos/28544954/pexels-photo-28544954.jpeg",
      aspect: "aspect-[3/4]",
    },
    {
      id: 9,
      title: "Alpine Cable Cars",
      image:
        "https://images.pexels.com/photos/28202478/pexels-photo-28202478.jpeg",
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
