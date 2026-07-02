"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import CtaButton from "@/UI/CtaButton";

export default function Book() {
  const [destination, setDestination] = useState("");
  const [adults, setAdults] = useState("");
  const [rooms, setRooms] = useState("2 Bed Rooms");

  return (
    <section className="w-full bg-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Search Container */}
        <div className="w-full bg-white rounded-4xl p-6 sm:p-8 border border-gray-200">
          {/* Header Title */}
          <h2 className="text-3xl sm:text-4xl font-medium text-black tracking-tight mb-6 pl-1">
            Plan Your Stays
          </h2>

          {/* Form Matrix Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* 1. Destination */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-black pl-1">
                Destination
              </label>
              <div className="relative">
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-neutral-100 hover:bg-neutral-200/70 transition-colors text-sm text-neutral-600 font-normal h-14 px-4 rounded-full appearance-none outline-none cursor-pointer"
                >
                  <option value="" disabled hidden>
                    Destination
                  </option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Darjeeling">Darjeeling</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/80 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            {/* 2. Check-in — Out */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-black pl-1">
                Check-in — Out
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-neutral-100 hover:bg-neutral-200/70 transition-colors text-sm text-neutral-600 font-normal h-14 px-4 rounded-full appearance-none outline-none"
                />
              </div>
            </div>

            {/* 3. Adults */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-black pl-1">
                Adults
              </label>
              <div className="relative">
                <select
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full bg-neutral-100 hover:bg-neutral-200/70 transition-colors text-sm text-neutral-600 font-normal h-14 px-4 rounded-full appearance-none outline-none cursor-pointer"
                >
                  <option value="" disabled hidden>
                    Adults
                  </option>
                  <option value="1 Adult">1 Adult</option>
                  <option value="2 Adults">2 Adults</option>
                  <option value="3 Adults">3 Adults</option>
                  <option value="4+ Adults">4+ Adults</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/80 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            {/* 4. Number Of Rooms */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-black pl-1">
                Number Of Rooms
              </label>
              <div className="relative">
                <select
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  className="w-full bg-neutral-100 hover:bg-neutral-200/70 transition-colors text-sm text-black font-normal h-14 px-4 rounded-full appearance-none outline-none cursor-pointer"
                >
                  <option value="1 Bed Room">1 Bed Room</option>
                  <option value="2 Bed Rooms">2 Bed Rooms</option>
                  <option value="3 Bed Rooms">3 Bed Rooms</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/80 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            {/* Search Trigger Button */}
            <div className="md:col-span-12 w-full flex justify-center mt-4">
              <CtaButton text="Search" variant="blue" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
