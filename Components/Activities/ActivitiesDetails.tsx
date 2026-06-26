"use client";

import React from "react";
import { Minus } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import Image from "next/image";

// ─── Data Array Matching Image Layout Rules
interface ActivityItem {
  id: string;
  title: string;
  category: string;
  spotsCount: string;
  imageSrc: string;
}

const ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: "1",
    title: "Desert Safari",
    category: "Adventure",
    spotsCount: "05 Active Spots",
    imageSrc:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Paragliding",
    category: "Sky High",
    spotsCount: "03 Active Spots",
    imageSrc:
      "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "River Rafting",
    category: "Water Sports",
    spotsCount: "08 Active Spots",
    imageSrc:
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    title: "Scuba Diving",
    category: "Deep Sea",
    spotsCount: "04 Active Spots",
    imageSrc:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    title: "Jet Skiing",
    category: "Water Sports",
    spotsCount: "06 Active Spots",
    imageSrc:
      "https://images.unsplash.com/photo-1564633351631-e85bd59a91af?q=80&w=1148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "6",
    title: "Bungy Jumping",
    category: "Extreme",
    spotsCount: "02 Active Spots",
    imageSrc:
      "https://images.unsplash.com/photo-1549221360-456a9c197d5b?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "7",
    title: "Surfing",
    category: "Ocean",
    spotsCount: "09 Active Spots",
    imageSrc:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "8",
    title: "Skydiving",
    category: "Extreme",
    spotsCount: "01 Active Spot",
    imageSrc:
      "https://images.unsplash.com/photo-1483168527879-c66136b56105?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ActivitiesDetails() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-14 lg:px-40">
      {/* ─── Top Header Layout (Badge + Title & Button Alignment) ─── */}
      <div className="mb-10 w-full">
        <Badge
          text="Activities"
          variant="black"
          size="lg"
          icon={Minus}
          className="mb-4"
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
            Most Popular Activities
          </h2>
          <CtaButton
            text="View All Activities"
            variant="white"
            size="md"
            className="self-start sm:self-auto"
          />
        </div>
      </div>

      {/* ─── Cards Grid Layout ─── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {ACTIVITIES_DATA.map((activity) => (
          <div
            key={activity.id}
            className="group relative h-105 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md transition-all duration-300 hover:shadow-xl"
          >
            {/* Background Image Layer */}
            <Image
              fill
              src={activity.imageSrc}
              alt={activity.title}
              sizes="(max-w-640px) 100vw, (max-w-768px) 50vw, (max-w-1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/95 z-10" />

            {/* Top Left Pill Tag Category */}
            <span className="absolute left-5 top-5 z-20 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/10">
              {activity.category}
            </span>

            {/* Bottom Floating Typography Group */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col gap-1.5 transform-gpu">
              <h3 className="text-2xl font-bold text-white tracking-wide">
                {activity.title}
              </h3>
              <p className="text-sm font-medium text-gray-300 opacity-80">
                {activity.spotsCount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
