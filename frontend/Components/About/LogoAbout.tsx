import React from "react";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import { Minus } from "lucide-react";

function LogoAbout() {
  return (
    <section className="bg-white w-full py-20 px-6 sm:px-10 lg:px-14 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        {/* Left Side - Video */}
        <div className="w-full md:w-1/2 lg:w-7/12 flex justify-center md:justify-start">
          <div className="relative w-full max-w-xl lg:max-w-2xl aspect-video rounded-3xl md:rounded-4xl overflow-hidden shadow-2xl bg-[#0a192f]">
            <video
              src="/Video/logovideo.mp4"
              poster="/Img/newlogo.jpeg"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Optional overlay for subtle blending */}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
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
            Mandarin WorlWide Vacation
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
