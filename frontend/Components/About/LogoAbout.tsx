import React from "react";
import Image from "next/image";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import { Minus, Check } from "lucide-react";

const highlights = [
  "Handpicked Properties",
  "24/7 Support",
  "Global Network",
  "Verified Reviews",
];

function LogoAbout({ hideBackground = false }: { hideBackground?: boolean }) {
  return (
    <section className={`relative w-full py-20 px-6 sm:px-10 lg:px-14 select-none ${hideBackground ? '' : 'overflow-hidden bg-white'}`}>
      {/* Background Texture Design */}
      {!hideBackground && (
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
          <Image
            src="/Img/white-texture.png"
            alt="Wavy line texture background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        {/* Left Side - Video */}
        <div className="w-full md:w-1/2 lg:w-7/12 flex justify-center md:justify-start">
          <div className="relative w-full max-w-xl lg:max-w-2xl">
            <div className="relative w-full aspect-video rounded-3xl md:rounded-4xl overflow-hidden shadow-2xl bg-[#0a192f]">
              <Image
                src="/Img/munnar.jpg"
                alt="A traveller taking in a scenic mountain valley view"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            </div>

            {/* Years of Experience Badge */}
            <div className="absolute -top-6 left-4 sm:-top-8 sm:-left-8 z-20 rounded-2xl bg-gradient-to-br from-[#E8C15B] to-[#b38b40] px-6 py-4 sm:px-7 sm:py-5 shadow-xl shadow-[#b38b40]/30 ring-1 ring-white/40">
              <p className="text-3xl sm:text-4xl font-bold leading-none text-[#141414]">
                10+
              </p>
              <p className="mt-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#141414]/80">
                Years of Experience
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-start text-left">
          <Badge
            text="ABOUT US"
            variant="black"
            size="sm"
            icon={Minus}
            className="mb-4"
          />

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="whitespace-nowrap">Mandarin Worldwide</span> <br />
            Vacations
          </h2>

          <p className="text-lg mt-5 font-medium text-gray-500">
            Mandarin Worldwide Vacations was founded with a singular vision: to
            connect travelers with extraordinary accommodations worldwide. We
            believe that every journey deserves exceptional service and
            unforgettable experiences.
          </p>

          <p className="text-lg mt-4 font-medium text-gray-500">
            Our curated collection spans continents, from serene mountain
            retreats to vibrant city escapes, each property handpicked to meet
            our exacting standards of excellence.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-200 shadow-sm">
                  <Check className="h-4 w-4 text-blue-600" strokeWidth={3} />
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <CtaButton
            href="/about"
            text="Read More"
            variant="blue"
            className="mt-6"
          />
        </div>
      </div>
    </section>
  );
}

export default LogoAbout;
