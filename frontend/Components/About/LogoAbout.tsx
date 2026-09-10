import React from "react";
import Image from "next/image";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import { Minus } from "lucide-react";

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
                src="/Img/fanlogo.png"
                alt="Mandarin Worldwide Vacations Logo"
                fill
                priority
                className="object-contain p-10 sm:p-14"
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
            From intimate escapes to grand adventures, we craft journeys that
            redefine the art of travel. With meticulous attention to detail and
            a passion for authentic experiences, we invite you to explore the
            world in comfort, style, and wonder.
          </p>

          <CtaButton
            href="/about"
            text="Read More"
            variant="blue"
            className="mt-5"
          />
        </div>
      </div>
    </section>
  );
}

export default LogoAbout;
