"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { Ticket, Car, Compass, Wallet, Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

interface Waypoint {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  icon: React.ElementType;
}

const WAYPOINTS: Waypoint[] = [
  {
    id: "w1",
    title: "Seamless Booking",
    description:
      "Secure your expedition with a streamlined and confidential reservation process designed for efficiency precision.",
    imageSrc:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    icon: Ticket,
  },
  {
    id: "w2",
    title: "Professional Guide",
    description:
      "Navigate unmatched terrains alongside seasoned, certified wilderness veterans who safeguard every footprint of your tour path.",
    imageSrc:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    icon: Car,
  },
  {
    id: "w3",
    title: "Transparent Pricing",
    description:
      "Our pricing is thoughtfully structured reflect the precision, safety, and exclusivity behind every expedition.",
    imageSrc:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80",
    icon: Compass,
  },
  {
    id: "w4",
    title: "24/7 Expert Support",
    description:
      "From pre-trip planning to in-country assistance, our team ensures you're supported at every step of your journey.",
    imageSrc:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    icon: Wallet,
  },
];

function WaypointRow({ data, index }: { data: Waypoint; index: number }) {
  const align = index % 2 === 0 ? "left" : "right";
  const IconComponent = data.icon;

  return (
    <div className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-0">
      {/* timeline marker node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40% 0px -40% 0px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute left-6 top-6 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-blue-600 bg-white text-black md:left-1/2 md:top-1/2 md:-translate-y-1/2"
      >
        <IconComponent className="h-4 w-4" strokeWidth={2} />
      </motion.div>

      {/* content card */}
      <motion.div
        initial={{ opacity: 0, x: align === "left" ? -24 : 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`pl-16 md:pl-2 ${
          align === "left"
            ? "md:col-span-5 md:col-start-1 md:pr-14 md:text-left"
            : "md:col-span-5 md:col-start-8 md:pl-14"
        }`}
      >
        <h3 className="mb-3 text-2xl font-semibold tracking-tight text-black sm:text-[1.75rem]">
          {data.title}
        </h3>
        <p className="max-w-md text-sm font-medium leading-relaxed text-gray-500">
          {data.description}
        </p>
      </motion.div>

      {/* contextual imagery block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        className={`relative ml-16 h-56 w-[calc(100%-4rem)] overflow-hidden rounded-2xl bg-white sm:h-64 md:ml-0 md:h-72 md:w-auto ${
          align === "left"
            ? "md:col-span-6 md:col-start-7"
            : "md:col-span-6 md:col-start-1 md:row-start-1"
        }`}
      >
        <Image
          fill
          src={data.imageSrc}
          alt={data.title}
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover object-center"
          loading="lazy"
        />
      </motion.div>
    </div>
  );
}

export default function BookingDetail() {
  const routeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: routeRef,
    offset: ["start 0.75", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative w-full overflow-hidden bg-white px-6 py-24 md:px-40">
      <div className="relative">
        {/* navigation / content header assembly */}
        <div className="mb-20 w-full">
          <Badge
            text="Why Choose Us"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-5"
          />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-3xl text-3xl md:text-6xl font-semibold leading-[1.1] tracking-tight text-black">
              Choose The Right Partner for <br /> Curated & Seamless Travel
            </h2>
            <CtaButton text="Explore Packages" variant="white" size="md" />
          </div>
        </div>

        {/* linear waypoint roadmap */}
        <div ref={routeRef} className="relative">
          {/* mobile tracking rail */}
          <div className="absolute bottom-0 left-6 top-0 w-px -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,#3A5CFB_0_6px,transparent_6px_12px)] opacity-40 md:hidden" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-0 left-6 top-0 w-px origin-top -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,#3A5CFB_0_6px,transparent_6px_12px)] md:hidden"
          />

          {/* desktop centralized layout rail */}
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,#3A5CFB_0_6px,transparent_6px_12px)] opacity-40 md:block" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-0 left-1/2 top-0 hidden w-px origin-top -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,#3A5CFB_0_6px,transparent_6px_12px)] md:block"
          />

          <div className="flex flex-col gap-20 md:gap-28">
            {WAYPOINTS.map((wp, i) => (
              <WaypointRow key={wp.id} data={wp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
