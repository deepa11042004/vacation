"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import { Minus } from "lucide-react";

interface RevealWordProps {
  word: string;
  index: number;
  totalWords: number;
  progress: MotionValue<number>;
}

function RevealWord({ word, index, totalWords, progress }: RevealWordProps) {
  const start = 0.1 + (index / totalWords) * 0.4;
  const end = start + 0.05;
  const wordOpacity = useTransform(progress, [start, end], [0.15, 1]);

  return (
    <motion.span style={{ opacity: wordOpacity }} className="inline-block mr-3">
      {word}
    </motion.span>
  );
}

export default function Stay() {
  const phase12Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);

  /* Carousel dynamic active state */
  
  const [activeCard, setActiveCard] = useState(0);

  const { scrollYProgress: scrollPhase12 } = useScroll({
    target: phase12Ref,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: scrollPhase3 } = useScroll({
    target: phase3Ref,
    offset: ["start end", "end start"],
  });

  const centerImageWidth = useTransform(
    scrollPhase12,
    [0, 0.6],
    ["38vw", "100vw"],
  );
  const centerImageHeight = useTransform(
    scrollPhase12,
    [0, 0.6],
    ["65vh", "100vh"],
  );

  const leftImageX = useTransform(scrollPhase12, [0, 0.5], ["0px", "-160px"]);
  const leftImageOpacity = useTransform(scrollPhase12, [0, 0.4], [1, 0]);
  const rightImageX = useTransform(scrollPhase12, [0, 0.5], ["0px", "160px"]);
  const rightImageOpacity = useTransform(scrollPhase12, [0, 0.4], [1, 0]);

  const textStatement =
    "Cozy interiors, warm tones, and thoughtful details that make every stay feel personal.";
  const words = textStatement.split(" ");

  const orbitImages = [
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80",
  ];

  
  /* Expanded dataset for the coastal expanding carousel */
  
  const carouselCards = [
    {
      badge: "NEWS",
      title: "Tiptoe Simplicity with Honolua Blomfield",
      time: "5 mins ago",
      src: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "NEWS",
      title: "Ocean Wave of the Decade Contender",
      time: "35 mins ago",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "GALLERY",
      title: "Board Review: John John Florence & Jon Pyzel",
      time: "Yesterday",
      src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "ESCAPE",
      title: "Hidden Coves and Saltwater Shrines of the Basque Coast",
      time: "2 days ago",
      src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "CULTURE",
      title: "Morning Rituals: The Art of Unhurried Coastal Brewing",
      time: "1 week ago",
      src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    },
  ];

  
  /* Carousel navigation button handlers */
  
  const handlePrev = () => {
    setActiveCard((prev) => (prev === 0 ? carouselCards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveCard((prev) => (prev === carouselCards.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white text-black w-full overflow-x-hidden py-20">
      {/* Phase 1 & 2: Three-image expansion track */}
      <section
        ref={phase12Ref}
        className="min-h-[140vh] w-full flex flex-col justify-start relative pt-16 bg-white"
      >
        <div className="text-center mb-12 px-6">
          <Badge icon={Minus} text="Boutique Hotel" variant="black" className="mb-3 uppercase tracking-widest" />
          <h1 className="font-bold text-4xl md:text-6xl tracking-wide max-w-4xl mx-auto leading-tight text-black">
            A Boutique Escape <br /> In Timeless Streets
          </h1>
          <p className="text-sm tracking-[0.3em] text-black/40 mt-6 flex items-center justify-center gap-2">
            Scroll to uncover ↓
          </p>
        </div>

        <div className="w-full h-[75vh] flex items-center justify-center gap-6 px-6 md:px-12 sticky top-[15vh]">
          <motion.div
            style={{ x: leftImageX, opacity: leftImageOpacity }}
            className="hidden md:block w-[24vw] h-[55vh] overflow-hidden rounded-md shrink-0 relative"
          >
            <Image
              src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80"
              alt="Cafe interior"
              fill
              className="object-cover"
              priority
              sizes="24vw"
            />
          </motion.div>

          <motion.div
            style={{ width: centerImageWidth, height: centerImageHeight }}
            className="h-full overflow-hidden shadow-xl shrink-0 relative"
          >
            <Image
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80"
              alt="Grand Lobby Staircase"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>

          <motion.div
            style={{ x: rightImageX, opacity: rightImageOpacity }}
            className="hidden md:block w-[24vw] h-[55vh] overflow-hidden rounded-md shrink-0 relative"
          >
            <Image
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80"
              alt="Champagne dining"
              fill
              className="object-cover"
              priority
              sizes="24vw"
            />
          </motion.div>
        </div>
      </section>

      {/* Phase 3: Word-by-word lit text reveal */}
      <section
        ref={phase3Ref}
        className="min-h-[50vh] w-full bg-white flex flex-col items-center justify-center"
      >
        <Badge icon={Minus} text="Boutique Hotel" variant="black" className="mb-6 uppercase tracking-widest" />
        <h2 className="text-3xl md:text-6xl text-center font-semibold max-w-6xl uppercase leading-relaxed tracking-wide text-black">
          {words.map((word, idx) => (
            <RevealWord
              key={idx}
              word={word}
              index={idx}
              totalWords={words.length}
              progress={scrollPhase3}
            />
          ))}
        </h2>
      </section>

      {/* Phase 4: Single alignment container (Zig-zag track) */}
      <section className="w-full bg-white border-t border-black/5 py-32 px-6 md:px-24 flex flex-col gap-40 justify-center items-center relative">
        <div className="w-full max-w-7xl flex flex-col gap-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center w-full">
            <div className="md:col-span-5 h-[60vh] rounded-sm overflow-hidden shadow-md relative">
              <Image
                src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
                alt="Corner Suite"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <div className="md:col-span-7 space-y-8 md:pl-8">
              <h3 className="font-semibold text-5xl md:text-6xl tracking-tight flex items-center gap-6 text-black">
                Corner Suite
                <button className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-lg">
                  →
                </button>
              </h3>
              <div className="ml-2 text-sm space-y-1 tracking-widest text-black/60 font-mono">
                <p>Category : Suite</p>
                <p>Price : From €215</p>
              </div>
              <p className="ml-2 text-md text-black/80 font-light max-w-md leading-relaxed">
                A spacious corner retreat with warm light, elegant textures, and
                calm views. Designed for effortless comfort throughout your
                stay.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center w-full">
            <div className="md:col-span-7 space-y-8 md:pr-8 order-2 md:order-1">
              <h3 className="font-semibold text-5xl md:text-6xl tracking-tight flex items-center gap-6 text-black">
                Velvet Room
                <button className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-lg">
                  →
                </button>
              </h3>
              <div className="ml-2 text-sm space-y-1 tracking-widest text-black/60 font-mono">
                <p>Category : Room</p>
                <p>Price : From €85</p>
              </div>
              <p className="ml-2 text-md text-black/80 font-light max-w-md leading-relaxed">
                A cozy, softly lit room wrapped in warm tones and velvet
                textures. Perfect for restful nights, unhurried mornings, and
                moments of calm.
              </p>
            </div>
            <div className="md:col-span-5 h-[60vh] rounded-sm overflow-hidden shadow-md order-1 md:order-2 relative">
              <Image
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
                alt="Velvet Room"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Expanding Width Carousel with Button Controls */}
      <section className="w-full bg-white py-32 px-6 md:px-24 border-t border-b border-black/5">
        <div className="max-w-7xl mx-auto relative">
          {/* Header Layout with integrated Left/Right Control Buttons */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge icon={Minus} text="Journal & Updates" variant="black" className="mb-3 uppercase tracking-widest" />
              <h2 className="font-bold text-3xl md:text-5xl tracking-wide text-black">
                Stories From The Coast
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-black/10 bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300 text-lg shadow-sm"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-black/10 bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300 text-lg shadow-sm"
              >
                →
              </button>
            </div>
          </div>

          {/* Flexible Dynamic Track */}
          <div className="w-full h-[65vh] flex gap-4 overflow-hidden">
            {carouselCards.map((card, idx) => {
              const isActive = idx === activeCard;
              return (
                <motion.div
                  key={idx}
                  onClick={() => setActiveCard(idx)}
                  animate={{ flex: isActive ? 3.5 : 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full relative rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-black/5 bg-neutral-200 group shrink-0"
                >
                  <Image
                    src={card.src}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30 z-10" />

                  {/* Absolute Badge elements inside cards */}
                  <div className="absolute top-6 left-6 z-20">
                    <Badge icon={Minus} text={card.badge} variant="white" size="sm" />
                  </div>

                  {/* Text Overlay Layout */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 text-white flex flex-col justify-end h-1/2">
                    <motion.div
                      animate={{
                        opacity: isActive ? 1 : 0.4,
                        y: isActive ? 0 : 5,
                      }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <h4
                        className={`tracking-wide leading-tight transition-all duration-300 ${isActive ? "text-2xl md:text-3xl font-semibold max-w-xl" : "text-base font-medium line-clamp-2"}`}
                      >
                        {card.title}
                      </h4>
                      {isActive && (
                        <>
                          <p className="text-[11px] opacity-60 font-mono">
                            {card.time}
                          </p>
                          <div className="pt-2 flex items-center gap-2 text-xs font-semibold tracking-wider opacity-90 hover:opacity-100">
                            <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-sm">
                              →
                            </span>
                            Read more
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Phase 5: Rotating orbit gallery final base */}
      <section className="min-h-[160vh] w-full flex flex-col items-center justify-center relative bg-white overflow-hidden py-36">
        <div className="absolute w-200 h-200 md:w-212.5 md:h-212.5 border border-gray-300 rounded-full pointer-events-none animate-[pulse_6s_infinite]" />
        <div className="absolute w-262.5 h-262.5 md:w-275 md:h-275 border border-gray-300 rounded-full pointer-events-none" />

        <div className="text-center space-y-8 max-w-2xl px-6 z-10">
          <Badge icon={Minus} text="Boutique Experience" variant="black" className="mb-6 uppercase tracking-[0.4em]" />
          <h2 className="font-semibold text-5xl md:text-7xl tracking-wide leading-tight text-black">
            Enjoy A Cozy <br /> Weekend Stay
          </h2>
          <CtaButton text="Booking" variant="blue" size="sm" />
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-175 h-175 md:w-225 md:h-225 flex items-center justify-center rounded-full"
        >
          {orbitImages.map((src, index) => {
            const angle = (index / orbitImages.length) * 360;
            return (
              <div
                key={index}
                className="absolute w-28 h-36 md:w-40 md:h-56 overflow-hidden rounded-2xl shadow-lg border border-black/5 bg-white"
                style={{
                  transform: `rotate(${angle}deg) translateY(-380px) rotate(-${angle}deg)`,
                }}
              >
                <div className="w-full h-full relative">
                  <Image
                    src={src}
                    alt="Atmospheric hotel snippet"
                    fill
                    className="object-cover rounded-2xl brightness-100"
                    sizes="160px"
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
