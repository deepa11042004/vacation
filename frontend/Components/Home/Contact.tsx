"use client";

import Image from "next/image";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import { Minus } from "lucide-react";

export default function LuxuryContactBooking() {
  return (
    <div className="bg-white text-black min-h-screen antialiased overflow-x-hidden py-24">
      {/* TOP SPLIT LAYOUT */}
      <main className="bg-white w-full grid grid-cols-1 lg:grid-cols-12 min-h-screen relative">
        {/* Left Column */}
        <div className="lg:col-span-6 flex flex-col p-8 md:p-16 lg:p-24 space-y-12 relative">
          <div className="pb-4">
            <Badge icon={Minus} text="Information ↓" variant="black" className="uppercase tracking-[0.3em]" />
          </div>

          {/* Location Block */}
          <div className="space-y-3 pt-4">
            <h3 className="text-4xl font-semibold text-black">Location</h3>
            <p className="text-base font-semibold leading-relaxed opacity-80">
              7 Basta Lane, Mala Strana <br /> Prague 1, 11800
            </p>
            <div>
              <CtaButton text="Map" variant="white" size="sm" />
            </div>
          </div>

          <hr className="border-black/10 w-full" />

          {/* Reservations Block */}
          <div className="space-y-3">
            <h3 className="text-4xl font-semibold text-black">Reservations</h3>
            <p className="text-sm font-semibold leading-relaxed opacity-60 max-w-sm">
              Need help booking your stay or managing an existing reservation?
            </p>
            <div>
              <CtaButton text="Book Now" variant="white" size="sm" />
            </div>
          </div>

          {/* Contact Block */}
          <div className="space-y-3">
            <h3 className="text-4xl font-semibold text-black">Contact</h3>
            <p className="text-sm font-semibold leading-relaxed opacity-60 max-w-sm">
              For general inquiries or special requests, our team is available
              every day.
            </p>
            <div className="flex flex-wrap gap-4">
              <CtaButton text="Email Us" variant="white" size="sm" />
              <CtaButton text="Call Us" variant="white" size="sm" />
            </div>
          </div>

          <hr className="border-black/10 w-full" />

          {/* Stay Connected Signup Box */}
          <div className="space-y-6 max-w-xl">
            <div className="space-y-1">
              <h3 className="text-4xl font-semibold text-black">
                Stay connected with us
              </h3>
              <p className="text-sm font-semibold opacity-60">
                For general inquiries or special requests, our team is available
                every day.
              </p>
            </div>

            <div className="border border-black/10 p-8 rounded-sm space-y-6 bg-white">
              <div className="flex items-center border-b border-black/10 py-3">
                <span className="text-[10px] uppercase tracking-widest opacity-40 font-semibold w-24">
                  Name
                </span>
                <input
                  type="text"
                  defaultValue="George"
                  className="bg-transparent border-none p-0 outline-none text-sm font-semibold w-full focus:ring-0 text-black"
                />
              </div>
              <div className="flex items-center border-b border-black/10 py-3">
                <span className="text-[10px] uppercase tracking-widest opacity-40 font-semibold w-24">
                  Email
                </span>
                <input
                  type="email"
                  defaultValue="webbster@example.com"
                  className="bg-transparent border-none p-0 outline-none text-sm font-semibold w-full focus:ring-0 text-black"
                />
              </div>

              <div className="pt-2">
                <CtaButton text="Sign up" variant="blue" size="md" />
              </div>
            </div>
          </div>

          {/* Absolute Title Overlay */}
          <div className="hidden lg:block absolute right-0 top-[18%] translate-x-1/2 z-20 pointer-events-none">
            <h1 className="text-6xl xl:text-7xl tracking-tight leading-[0.95] uppercase font-semibold text-black bg-white py-4 px-6 select-none">
              Book Your <br /> Experience
            </h1>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:col-span-6 min-h-[50vh] lg:min-h-screen relative bg-neutral-100 border-l border-black/10 z-10">
          <Image
            src="https://images.pexels.com/photos/15263559/pexels-photo-15263559.jpeg"
            alt="Atmospheric architecture at night"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </main>
    </div>
  );
}
