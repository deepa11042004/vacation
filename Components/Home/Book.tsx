"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import CtaButton from "@/UI/CtaButton";

export default function Book() {
  const [lookingFor, setLookingFor] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("2 Bed Rooms");
  const [activeFilter, setActiveFilter] = useState("City");

  const filterOptions = ["City", "House", "Aparment", "Residencial"];

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Search Container */}
        <div className="w-full bg-white rounded-4xl p-6 sm:p-8 border border-gray-200">
          {/* Header Title */}
          <h2 className="text-3xl sm:text-4xl font-medium text-black tracking-tight mb-6 pl-1">
            Find The Best Place
          </h2>

          {/* Form Matrix Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* 1. Looking For */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-black pl-1">
                Looking For
              </label>
              <div className="relative">
                <select
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  className="w-full bg-neutral-100 hover:bg-neutral-200/70 transition-colors text-sm text-neutral-600 font-normal h-14 px-4 rounded-full appearance-none outline-none cursor-pointer"
                >
                  <option value="" disabled hidden>
                    Enter Type
                  </option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/80 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            {/* 2. Price */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-medium text-black pl-1">
                Price
              </label>
              <div className="relative">
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-neutral-100 hover:bg-neutral-200/70 transition-colors text-sm text-neutral-600 font-normal h-14 px-4 rounded-full appearance-none outline-none cursor-pointer"
                >
                  <option value="" disabled hidden>
                    Price
                  </option>
                  <option value="low">$0 - $1,500</option>
                  <option value="mid">$1,500 - $3,000</option>
                  <option value="high">$3,000+</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/80 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            {/* 3. Locations */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-black pl-1">
                Locations
              </label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-neutral-100 hover:bg-neutral-200/70 transition-colors text-sm text-neutral-600 font-normal h-14 px-4 rounded-full appearance-none outline-none cursor-pointer"
                >
                  <option value="" disabled hidden>
                    Tour Name
                  </option>
                  <option value="new-york">New York, USA</option>
                  <option value="london">London, UK</option>
                  <option value="paris">Paris, France</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/80 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            {/* 4. Number Of Rooms */}
            <div className="md:col-span-2 flex flex-col gap-2">
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
            <div className="md:col-span-2 w-full">
              <CtaButton text="Search" variant="blue" />
            </div>
          </div>

          {/* Bottom Filter Navigation Options */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pl-1 text-sm">
            <span className="font-bold text-black mr-2">Filter</span>
            {filterOptions.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full transition-all cursor-pointer font-medium ${
                  activeFilter === filter
                    ? "bg-neutral-100 text-black"
                    : "text-black/80 hover:text-black"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
