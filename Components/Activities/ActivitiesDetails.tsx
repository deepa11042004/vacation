"use client";

import React from "react";
import { Minus, Clock } from "lucide-react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";

interface ActivityItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  videoSrc?: string;
  description: string;
}

const ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: "1",
    title: "Desert Safari",
    category: "Adventure",
    duration: "6 Hours",
    videoSrc: "https://www.pexels.com/download/video/4419251/",
    description:
      "A desert safari is a thrilling adventure that offers a unique blend of excitement, cultural experiences, and breathtaking golden dune landscapes.",
  },
  {
    id: "2",
    title: "Paragliding",
    category: "Sky High",
    duration: "2 Hours",
    videoSrc: "https://travlla-psi.vercel.app/video/Paragliding.mp4",
    description:
      "A desert safari is a thrilling adventure that offers a unique blend of excitement, cultural experiences, and breathtaking golden dune landscapes.",
  },
  {
    id: "3",
    title: "River Rafting",
    category: "Water Sports",
    duration: "4 Hours",
    videoSrc: "https://travlla-psi.vercel.app/video/rafting.mp4",
    description:
      "A desert safari is a thrilling adventure that offers a unique blend of excitement, cultural experiences, and breathtaking golden dune landscapes.",
  },
  {
    id: "4",
    title: "Scuba Diving",
    category: "Deep Sea",
    duration: "5 Hours",
    videoSrc: "https://travlla-psi.vercel.app/video/Scuba%20Diving.mp4",
    description:
      "A desert safari is a thrilling adventure that offers a unique blend of excitement, cultural experiences, and breathtaking golden dune landscapes.",
  },
  {
    id: "5",
    title: "Jet Skiing",
    category: "Water Sports",
    duration: "1 Hour",
    videoSrc: "https://travlla-psi.vercel.app/video/Jet%20Skiing.mp4",
    description:
      "A desert safari is a thrilling adventure that offers a unique blend of excitement, cultural experiences, and breathtaking golden dune landscapes.",
  },
  {
    id: "6",
    title: "Bungy Jumping",
    category: "Extreme",
    duration: "3 Hours",
    videoSrc: "https://travlla-psi.vercel.app/video/Bungy%20Jumping.mp4",
    description:
      "A desert safari is a thrilling adventure that offers a unique blend of excitement, cultural experiences, and breathtaking golden dune landscapes.",
  },
];

const firstRow = ACTIVITIES_DATA.slice(0, 3);
const secondRow = ACTIVITIES_DATA.slice(3, 6);

function ActivityCard({ item }: { item: ActivityItem }) {
  return (
    <article className="group flex flex-col h-full bg-white border border-gray-300 rounded-3xl overflow-hidden hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform-gpu">
      {/* ── Image/Video ── */}
      <div className="relative h-64 w-full overflow-hidden shrink-0">
        <video
          src={item.videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-103"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/60 pointer-events-none z-10" />

        {/* Badge */}
        <span className="absolute top-4 left-4 z-20 bg-white/25 backdrop-blur-md border border-white/10 text-white text-xs font-medium px-4 py-1.5 rounded-full tracking-wide shadow-xs select-none">
          {item.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-950 leading-snug tracking-wide line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {item.description}
        </p>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{item.duration}</span>
          </div>

          <CtaButton
            text="Read Details"
            variant="white"
            size="sm"
            href={`/activities/${item.id}`}
          />
        </div>
      </div>
    </article>
  );
}

interface FeatureActivityCardProps {
  title: string;
  badge: string;
  description1: string;
  description2?: string;
  buttonText: string;
  videoSrc: string;
  reversed?: boolean;
}

function FeatureActivityCard({
  title,
  badge,
  description1,
  description2,
  buttonText,
  videoSrc,
  reversed,
}: FeatureActivityCardProps) {
  return (
    <div
      className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center w-full py-8 ${
        reversed ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="w-full lg:w-[55%]">
        <div className="relative h-[55vh] w-full rounded-4xl overflow-hidden shadow-xl">
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="w-full lg:w-[45%] flex flex-col items-start text-left lg:px-4">
        <Badge icon={Minus} text={badge} variant="black" className="mb-5" />
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a2533] mb-6 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-600 mb-5 leading-relaxed text-base lg:text-lg">
          {description1}
        </p>
        {description2 && (
          <p className="text-gray-600 mb-8 leading-relaxed text-base lg:text-lg">
            {description2}
          </p>
        )}
        <CtaButton text={buttonText} variant="blue" />
      </div>
    </div>
  );
}

export default function ActivitiesDetails() {
  return (
    <section className="w-full bg-white px-6 pt-20 md:px-14 lg:px-40">
      {/* Header */}
      <div className="mb-14 w-full">
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

      {/* Row 1: 3 cards */}
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 mb-20">
        {firstRow.map((activity) => (
          <ActivityCard key={activity.id} item={activity} />
        ))}
      </div>

      {/* Row 2: Feature Card 1 */}
      <div className="mb-20">
        <FeatureActivityCard
          title="Skydiving"
          badge="High Adrenaline Experience"
          description1="Experience the ultimate rush of human flight! Leap from thousands of feet in the air and freefall at thrilling speeds before floating peacefully under a canopy with birds-eye views."
          description2="Whether it's your first tandem jump or your hundredth solo dive, the sheer adrenaline and unmatched perspective of skydiving will stay with you forever."
          buttonText="Book Flight Now"
          videoSrc="https://travlla-psi.vercel.app/video/Skydiving.mp4"
        />
      </div>

      {/* Row 3: 3 cards */}
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 mb-20">
        {secondRow.map((activity) => (
          <ActivityCard key={activity.id} item={activity} />
        ))}
      </div>

      {/* Row 4: Feature Card 2 (Reversed) */}
      <div className="mb-10">
        <FeatureActivityCard
          title="Deep Sea Scuba"
          badge="Ocean Exploration"
          description1="Dive into the mesmerizing world beneath the waves. Explore vibrant coral reefs, swim alongside exotic marine life, and experience the weightless wonder of the deep sea."
          description2="From colorful tropical fish to majestic sea turtles, every dive is a unique adventure. Discover hidden underwater landscapes and create memories that will last a lifetime."
          buttonText="Book Dive Now"
          videoSrc="https://www.pexels.com/download/video/34973318/"
          reversed={true}
        />
      </div>
    </section>
  );
}
