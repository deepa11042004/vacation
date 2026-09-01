"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Leaf, ChevronLeft as InnerPrev, ChevronRight as InnerNext } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FallbackImage from "@/Components/Shared/FallbackImage";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80";

export interface ExperienceCard {
  id: number;
  location: string;
  image: string;
  images: string[];
}

const CARDS: ExperienceCard[] = [
  {
    id: 1,
    location: "Naldehra",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1736958703904-1b881cf6a9d7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 2,
    location: "Assonora",
    image:
      "https://images.unsplash.com/photo-1541738679621-172e4575a81d?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1541738679621-172e4575a81d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1623832912925-919f8eecfc04?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1646748019366-3f1c922bfe3b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1756797171579-a18cc61c75e4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1698430184517-1674a0e5af4f?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 3,
    location: "Madikeri",
    image:
      "https://images.unsplash.com/photo-1655128633542-b6b7e86e93b4?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1655128633542-b6b7e86e93b4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1569996980833-901b5cd2eb70?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1767086517907-20fdea9fb671?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1607543024015-8b6986aa13de?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1704632590108-c027b46bb466?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 4,
    location: "Munnar",
    image: "/Img/munnar.jpg",
    images: [
      "/Img/munnar.jpg",
      "https://plus.unsplash.com/premium_photo-1697730314165-2cd71dc3a6a4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1629813538702-64c925934e19?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1637066742971-726bee8d9f56?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1742106854508-3b9172e52545?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 5,
    location: "Goa",
    image:
      "https://plus.unsplash.com/premium_photo-1697729594707-0fc9e51c8eed?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://plus.unsplash.com/premium_photo-1697729594707-0fc9e51c8eed?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1541738679621-172e4575a81d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1623832912925-919f8eecfc04?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1756797171579-a18cc61c75e4?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 6,
    location: "Rishikesh",
    image:
      "https://images.unsplash.com/photo-1712510817140-917938f92e5b?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1712510817140-917938f92e5b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1603867106100-0d2039fc8757?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1718528565878-7fd7c72f5196?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1724864814923-548d7fd5f42e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566076009300-e313adb6f2a7?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 7,
    location: "Darjeeling",
    image:
      "https://images.unsplash.com/photo-1671711847762-b8308b444a42?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1671711847762-b8308b444a42?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1765419103085-756a54d834e5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1776405876488-c8a0f8af09f7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1765419102712-4c54e7542bd1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1646772809232-d2b6300c1688?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 8,
    location: "Andaman",
    image:
      "https://images.unsplash.com/photo-1767780949670-2ad63be09893?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1767780949670-2ad63be09893?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1780552362702-6e7ce64bdcf7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1721834058855-b9d0570722b4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1586359567798-283f10efb7cf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1764260073045-6cb555705fe4?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 9,
    location: "Manali",
    image: "/Img/manali.jpg",
    images: [
      "/Img/manali.jpg",
      "https://images.unsplash.com/photo-1597167231350-d057a45dc868?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1656437717503-971f67b6af21?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1647184544240-49cd48de3a58?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590518578533-112fcf0905e0?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 10,
    location: "Udaipur",
    image:
      "https://plus.unsplash.com/premium_photo-1697730426227-9056296a0315?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://plus.unsplash.com/premium_photo-1697730426227-9056296a0315?auto=format&fit=crop&w=1000&q=80",
      "https://plus.unsplash.com/premium_photo-1697730342875-3788c28451cd?auto=format&fit=crop&w=1000&q=80",
      "https://plus.unsplash.com/premium_photo-1697729424098-15d583e5e524?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1742924400583-8937604db85a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1591264247469-d072a1018915?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 11,
    location: "Jaipur",
    image:
      "https://plus.unsplash.com/premium_photo-1697730286559-98b1a193eef6?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://plus.unsplash.com/premium_photo-1697730286559-98b1a193eef6?auto=format&fit=crop&w=1000&q=80",
      "https://plus.unsplash.com/premium_photo-1697729831106-dbca67df36af?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1766162416670-1109d31aff5b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1773973552142-93ee4c23114d?auto=format&fit=crop&w=1000&q=80",
      "https://plus.unsplash.com/premium_photo-1661904509551-6570836702e8?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 12,
    location: "Ooty",
    image:
      "https://images.unsplash.com/photo-1711553186815-8fbc95d02155?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1711553186815-8fbc95d02155?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1771149149835-831e7b9689e9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1589136777351-fdc9c9cab193?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590765759804-0b2b579820b3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1771149149933-b1242e80a4ad?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 13,
    location: "Alleppey",
    image:
      "https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1593693401060-9fc28cf9e368?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1593417033942-bcdf26b74700?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1772729134867-e5ffe2cfbcbf?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 14,
    location: "Ladakh",
    image: "/Img/ladakh.jpg",
    images: [
      "/Img/ladakh.jpg",
      "https://plus.unsplash.com/premium_photo-1661962344178-19930ba15492?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566323124805-757e5c41d37c?auto=format&fit=crop&w=1000&q=80",
      "https://plus.unsplash.com/premium_photo-1661914279560-22b98d17d79c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1643368214091-6af1a029aee0?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 15,
    location: "Coorg",
    image: "/Img/coorg.jpg",
    images: [
      "/Img/coorg.jpg",
      "https://images.unsplash.com/photo-1599922760936-e840fa373d8d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1626002547082-f12bc6b7a72b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529057299613-a565b7ce93aa?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1740754010394-7b4d4e46af19?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 16,
    location: "Corbett",
    image:
      "https://images.unsplash.com/photo-1669021820347-f66f9d9eedf0?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1669021820347-f66f9d9eedf0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1669021820350-2432cadfd797?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1669021820355-7186908380d9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1771922365997-8e687eda46b0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1656828061952-d1f016e3b3c4?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 17,
    location: "Wayanad",
    image:
      "https://images.unsplash.com/photo-1623302485960-d61687113a11?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1623302485960-d61687113a11?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1691342538271-5a97b7c1c089?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1670877453773-f2b03f642124?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1683665446527-0bfa0d7a8822?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1729057889327-e94c3566aaa9?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 18,
    location: "Shimla",
    image: "/Img/shimla.jpg",
    images: [
      "/Img/shimla.jpg",
      "https://plus.unsplash.com/premium_photo-1697730350129-de0e9f2b1e82?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1609948543911-7f01ff385be5?auto=format&fit=crop&w=1000&q=80",
      "https://plus.unsplash.com/premium_photo-1697730487072-c7c29e113007?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 19,
    location: "Varanasi",
    image: "/Img/varanasi.jpg",
    images: [
      "/Img/varanasi.jpg",
      "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1699630923504-9a24dbaab37c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1776111898196-4b6eb7816839?auto=format&fit=crop&w=1000&q=80",
      "https://plus.unsplash.com/premium_photo-1723485664001-122971f79f6b?auto=format&fit=crop&w=1000&q=80",
    ],
  },
];

const UniverseExperiences = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % CARDS.length);
    setActiveImageIndex(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length);
    setActiveImageIndex(0);
  }, []);

  const nextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev + 1) % 5);
  }, []);

  const prevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev - 1 + 5) % 5);
  }, []);

  // Cycle inner 5 images on the active card every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => {
        if (prev === 4) {
          // Once 5 images are viewed, transition to the next card
          setCurrentIndex((c) => (c + 1) % CARDS.length);
          return 0;
        }
        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="relative w-full py-24 px-6 sm:px-10 lg:px-14 bg-white overflow-hidden font-display select-none">
      {/* Background Cloud Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Img/bg.png"
          alt="Cloud background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-950 text-center leading-tight">
          A Universe of Experiences
        </h2>
        <p className="text-base sm:text-lg text-gray-900 font-medium text-center max-w-3xl mt-4 leading-relaxed">
          Dive into a world of unforgettable moments, where every day brings a
          new adventure for you and your loved ones
        </p>

        {/* Cards Showcase via Framer Motion */}
        <div className="relative w-full h-[580px] sm:h-[640px] lg:h-[700px] flex items-center justify-center mt-12 mb-6">
          {CARDS.map((card, index) => {
            let distance = index - currentIndex;
            // Handle wrapping for any number of cards
            if (distance > Math.floor(CARDS.length / 2)) {
              distance -= CARDS.length;
            } else if (distance < -Math.floor(CARDS.length / 2)) {
              distance += CARDS.length;
            }

            const isActive = distance === 0;
            let scale = 0.8,
              xOffset = "0%",
              zIndex = 10,
              opacity = 0,
              rotate = 0; // hide extra cards

            if (isActive) {
              scale = 1;
              xOffset = "0%";
              zIndex = 50;
              rotate = 0;
              opacity = 1;
            } else if (distance === 1 || distance === -1) {
              scale = 0.9;
              xOffset = distance === 1 ? "105%" : "-105%";
              zIndex = 40;
              rotate = distance === 1 ? 6 : -6;
              opacity = 1;
            }

            // For the active card, use the currently selected image out of the 5. For side cards, show image 0
            const currentImg = isActive
              ? card.images[activeImageIndex] || card.images[0]
              : card.images[0];

            return (
              <motion.div
                key={card.id}
                className="group absolute w-[260px] sm:w-[300px] lg:w-[360px] h-[470px] sm:h-[520px] lg:h-[570px] rounded-[36px] overflow-hidden shadow-2xl cursor-pointer bg-neutral-100 flex flex-col justify-end"
                style={{ zIndex }}
                animate={{ x: xOffset, scale, opacity, rotate }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => {
                  if (distance === 1) nextSlide();
                  if (distance === -1) prevSlide();
                }}
              >
                {/* Background Image with Smooth Crossfade */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={currentImg}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <FallbackImage
                        src={currentImg}
                        fallbackSrc={FALLBACK_IMAGE}
                        alt={card.location}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* White Fade Overlay for Inactive Cards */}
                {!isActive && (
                  <div className="absolute inset-0 z-[5] bg-white/60 backdrop-brightness-110 pointer-events-none" />
                )}

                {/* Left/Right Click Navigators on Active Card */}
                {isActive && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
                    >
                      <InnerPrev size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
                    >
                      <InnerNext size={18} />
                    </button>
                  </>
                )}

                {/* Top Left Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                    <Leaf size={16} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-800">
                      {card.location}
                    </span>
                  </div>
                </div>

                {/* Bottom Card Element - Clean City Name */}
                <div className="relative z-10 m-6 mt-auto bg-white rounded-2xl p-4 shadow-lg flex flex-col gap-3.5 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-gray-950 shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-gray-950 tracking-tight">
                      {card.location}
                    </span>
                  </div>

                  {/* 5 Segmented Story Progress Bars */}
                  <div className="flex items-center gap-1.5 w-full h-1">
                    {card.images.map((_, imgIdx) => {
                      const isBarActive = isActive && imgIdx === activeImageIndex;
                      const isBarPassed = isActive && imgIdx < activeImageIndex;

                      return (
                        <button
                          key={imgIdx}
                          type="button"
                          aria-label={`View photo ${imgIdx + 1} of ${card.location}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isActive) {
                              setActiveImageIndex(imgIdx);
                            } else if (distance === 1) {
                              nextSlide();
                            } else if (distance === -1) {
                              prevSlide();
                            }
                          }}
                          className="flex-1 h-full rounded-full overflow-hidden bg-gray-200 hover:bg-gray-300 transition-colors p-0 border-0 cursor-pointer"
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isBarActive
                                ? "bg-gray-900 w-full"
                                : isBarPassed
                                ? "bg-gray-500 w-full"
                                : "w-0"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Controls with Gold Chevrons & Circular Dots */}
        <div className="flex flex-col items-center gap-6 mt-6 z-50">
          {/* Gold Chevron Navigation Arrows */}
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="text-[#b38b40] hover:text-[#8f6d2d] transition active:scale-90 p-1"
            >
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="text-[#b38b40] hover:text-[#8f6d2d] transition active:scale-90 p-1"
            >
              <ChevronRight size={28} strokeWidth={2.5} />
            </button>
          </div>

          {/* Pagination Circular Dots */}
          <div className="flex items-center gap-3.5 max-w-full overflow-x-auto py-1 px-2">
            {CARDS.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setActiveImageIndex(0);
                }}
                aria-label={`Go to card ${idx + 1}`}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  idx === currentIndex
                    ? "bg-black"
                    : "bg-[#d5dae0] hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniverseExperiences;


