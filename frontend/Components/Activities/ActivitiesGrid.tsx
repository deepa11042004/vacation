"use client";

import Image from "next/image";
import { Minus } from "lucide-react";
import Badge from "@/UI/Badge";

const ACTIVITY_COLUMNS = [
  [
    {
      id: 1,
      title: "Desert Safari",
      image: "https://images.pexels.com/photos/29306297/pexels-photo-29306297.jpeg?auto=compress&cs=tinysrgb&w=600",
      aspect: "aspect-[3/3]",
    },
    {
      id: 2,
      title: "Paragliding",
      image: "https://images.pexels.com/photos/3551078/pexels-photo-3551078.jpeg?auto=compress&cs=tinysrgb&w=600",
      aspect: "aspect-[3/3]",
    },
    {
      id: 3,
      title: "River Rafting",
      image: "https://images.pexels.com/photos/33732201/pexels-photo-33732201.jpeg?auto=compress&cs=tinysrgb&w=600",
      aspect: "aspect-[3/3]",
    },
  ],
  [
    {
      id: 4,
      title: "Scuba Diving",
      image: "https://images.pexels.com/photos/11060853/pexels-photo-11060853.jpeg?auto=compress&cs=tinysrgb&w=600",
      aspect: "aspect-[3/3]",
    },
    {
      id: 5,
      title: "Jet Skiing",
      image: "https://images.pexels.com/photos/18636557/pexels-photo-18636557.jpeg?auto=compress&cs=tinysrgb&w=600",
      aspect: "aspect-[3/3]",
    },
    {
      id: 6,
      title: "Bungy Jumping",
      image: "https://images.pexels.com/photos/27471607/pexels-photo-27471607.jpeg?auto=compress&cs=tinysrgb&w=600",
      aspect: "aspect-[3/3]",
    },
  ],
  [
    {
      id: 7,
      title: "Surfing",
      image: "https://images.pexels.com/photos/5007332/pexels-photo-5007332.jpeg?auto=compress&cs=tinysrgb&w=600",
      aspect: "aspect-[3/3]",
    },
    {
      id: 8,
      title: "Skydiving",
      image: "https://images.pexels.com/photos/28544954/pexels-photo-28544954.jpeg?auto=compress&cs=tinysrgb&w=600",
      aspect: "aspect-[3/3]",
    },
    {
      id: 9,
      title: "Alpine Cable Cars",
      image: "https://images.pexels.com/photos/28202478/pexels-photo-28202478.jpeg?auto=compress&cs=tinysrgb&w=600",
      aspect: "aspect-[3/3]",
    },
  ],
];

const DURATIONS = [30, 35, 40];

export default function Activities() {
  return (
    <section className="bg-white text-black py-24 px-4 sm:px-6 lg:px-8 w-full overflow-hidden select-none font-display">
      <style>{`
        @keyframes marqueeUp {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes marqueeDown {
          from { transform: translateY(-50%); }
          to   { transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* ─── Header ─── */}
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

        {/* ─── Infinite Vertical Marquee ─── */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start h-150 md:h-300 overflow-hidden rounded-3xl">
          <div className="absolute inset-x-0 top-0 h-10 bg-linear-to-b from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white to-transparent z-10 pointer-events-none" />

          {ACTIVITY_COLUMNS.map((column, colIdx) => (
            <div key={colIdx} className="h-full w-full">
              <div
                className="flex flex-col gap-6 w-full pb-6"
                style={{
                  animation: `${colIdx % 2 === 0 ? "marqueeUp" : "marqueeDown"} ${DURATIONS[colIdx]}s linear infinite`,
                }}
              >
                {/* 2× duplication is enough for a seamless loop */}
                {[...column, ...column].map((activity, idx) => (
                  <div
                    key={`${activity.id}-${idx}`}
                    className={`relative w-full ${activity.aspect} rounded-2xl overflow-hidden shadow-xs bg-neutral-200 group cursor-pointer shrink-0`}
                  >
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover brightness-[0.93] group-hover:scale-103 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 z-10">
                      <span className="text-white text-base font-bold tracking-wide">
                        {activity.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
