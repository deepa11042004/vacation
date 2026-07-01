"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  Variants,
} from "framer-motion";
import Badge from "@/UI/Badge";
import CtaButton from "@/UI/CtaButton";
import {
  Minus,
  DollarSign,
  CalendarX,
  MessageSquare,
  ShieldCheck,
  Headphones,
  Zap,
} from "lucide-react";
import Testimonials from "@/Components/Home/Testimonials";


const GUARANTEE_FEATURES = [
  {
    id: "g1",
    title: "Best Price Guarantee",
    description: "We are committed to providing the most competitive rates. If you find a lower qualifying price online, we will match it and offer an additional discount, ensuring you always get the best value for your luxury stay.",
    imageSrc:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    icon: DollarSign,
  },
  {
    id: "g2",
    title: "Free Cancellation",
    description: "Travel plans can change unexpectedly. Enjoy peace of mind with our flexible booking options, offering free cancellation and effortless modifications on most reservations up to 24 hours before your arrival.",
    imageSrc:
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
    icon: CalendarX,
  },
  {
    id: "g3",
    title: "Verified Reviews",
    description: "Make informed decisions based on authentic feedback. Our platform only features verified reviews from real guests who have completed their stays, giving you transparent and trustworthy insights into every property.",
    imageSrc:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80",
    icon: MessageSquare,
  },
  {
    id: "g4",
    title: "Secure Payments",
    description: "Your privacy and financial security are our top priorities. All transactions are protected by industry-leading 256-bit SSL encryption and strict data privacy protocols, guaranteeing a safe and seamless checkout experience.",
    imageSrc:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
    icon: ShieldCheck,
  },
  {
    id: "g5",
    title: "24/7 Support",
    description: "Experience world-class hospitality before you even arrive. Our dedicated travel concierge team is available around the clock to assist with special requests, itinerary changes, and expert local recommendations.",
    imageSrc:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    icon: Headphones,
  },
  {
    id: "g6",
    title: "Instant Confirmation",
    description: "Skip the waiting period and secure your dream getaway immediately. Receive an instant booking confirmation directly to your inbox, complete with all the details you need for a frictionless check-in process.",
    imageSrc:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    icon: Zap,
  },
];

export const stayTypes = [
  {
    id: 1,
    slug: "hotels",
    title: "Hotels",
    category: "Classic Stay",
    subtitle: "Comfort & Convenience",
    description: "From budget-friendly to premium hotels in every destination.",
    propertyCount: 15420,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    slug: "resorts",
    title: "Resorts",
    category: "Leisure",
    subtitle: "Relax & Recharge",
    description:
      "Beachfront, island, and luxury resorts with premium amenities.",
    propertyCount: 6840,
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    slug: "villas",
    title: "Villas",
    category: "Private Stay",
    subtitle: "Exclusive Luxury",
    description: "Private villas with pools, gardens, and stunning views.",
    propertyCount: 3920,
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    slug: "apartments",
    title: "Apartments",
    category: "Urban Stay",
    subtitle: "Feel at Home",
    description: "Fully furnished apartments for short and long stays.",
    propertyCount: 8320,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    slug: "vacation-homes",
    title: "Vacation Homes",
    category: "Entire Home",
    subtitle: "Perfect for Groups",
    description: "Spacious homes for families and group vacations.",
    propertyCount: 2860,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    slug: "beach-houses",
    title: "Beach Houses",
    category: "Coastal",
    subtitle: "Steps from the Ocean",
    description: "Wake up to sea views and sandy beaches.",
    propertyCount: 1250,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    slug: "treehouses",
    title: "Treehouses",
    category: "Unique Stay",
    subtitle: "Stay Above the Forest",
    description: "Unique treehouse escapes surrounded by nature.",
    propertyCount: 420,
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    slug: "domes",
    title: "Domes",
    category: "Unique Stay",
    subtitle: "Sleep Under the Stars",
    description: "Geodesic domes offering unforgettable views.",
    propertyCount: 180,
    image: "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg",
  },
  {
    id: 9,
    slug: "glass-cabins",
    title: "Glass Cabins",
    category: "Nature Escape",
    subtitle: "Panoramic Views",
    description: "Modern cabins with floor-to-ceiling glass walls.",
    propertyCount: 215,
    image:
      "https://images.pexels.com/photos/23999340/pexels-photo-23999340.jpeg",
  },
  {
    id: 10,
    slug: "houseboats",
    title: "Houseboats",
    category: "Water Stay",
    subtitle: "Live on the Water",
    description: "Floating accommodations on lakes, rivers, and canals.",
    propertyCount: 340,
    image: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
  },
  {
    id: 11,
    slug: "overwater-bungalows",
    title: "Overwater Bungalows",
    category: "Luxury",
    subtitle: "Ocean Paradise",
    description: "Iconic stays above crystal-clear lagoons.",
    propertyCount: 95,
    image:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 12,
    slug: "cabins",
    title: "Cabins",
    category: "Mountain Retreat",
    subtitle: "Cozy Escapes",
    description: "Rustic cabins surrounded by forests and mountains.",
    propertyCount: 1780,
    image:
      "https://images.pexels.com/photos/32334284/pexels-photo-32334284.jpeg",
  },
  {
    id: 13,
    slug: "glamping",
    title: "Glamping",
    category: "Outdoor Luxury",
    subtitle: "Nature Meets Comfort",
    description: "Luxury camping with hotel-style comforts.",
    propertyCount: 760,
    image: "https://images.pexels.com/photos/9491328/pexels-photo-9491328.jpeg",
  },
  {
    id: 14,
    slug: "eco-lodges",
    title: "Eco Lodges",
    category: "Sustainable",
    subtitle: "Green Getaways",
    description: "Eco-friendly accommodations in natural settings.",
    propertyCount: 630,
    image:
      "https://images.pexels.com/photos/23999340/pexels-photo-23999340.jpeg",
  },
  {
    id: 15,
    slug: "farm-stays",
    title: "Farm Stays",
    category: "Countryside",
    subtitle: "Rural Living",
    description: "Experience authentic countryside hospitality.",
    propertyCount: 540,
    image: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg",
  },
  {
    id: 16,
    slug: "desert-camps",
    title: "Desert Camps",
    category: "Adventure",
    subtitle: "Desert Nights",
    description: "Luxury tents and camps under star-filled skies.",
    propertyCount: 190,
    image: "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
  },
  {
    id: 17,
    slug: "cave-hotels",
    title: "Cave Hotels",
    category: "Historic",
    subtitle: "Stay Underground",
    description: "Unique cave accommodations carved into rock formations.",
    propertyCount: 88,
    image: "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg",
  },
  {
    id: 18,
    slug: "heritage-homes",
    title: "Heritage Homes",
    category: "Historic Stay",
    subtitle: "Timeless Elegance",
    description: "Historic mansions, palaces, and restored homes.",
    propertyCount: 310,
    image:
      "https://images.pexels.com/photos/38190567/pexels-photo-38190567.png",
  },
  {
    id: 19,
    slug: "castles",
    title: "Castles",
    category: "Royal Experience",
    subtitle: "Live Like Royalty",
    description: "Stay in magnificent castles with centuries of history.",
    propertyCount: 64,
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 20,
    slug: "igloos",
    title: "Igloos",
    category: "Snow Experience",
    subtitle: "Arctic Adventure",
    description: "Sleep beneath the Northern Lights in glass igloos.",
    propertyCount: 42,
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 21,
    slug: "tiny-homes",
    title: "Tiny Homes",
    category: "Minimal Living",
    subtitle: "Small Space, Big Adventure",
    description: "Compact designer homes with everything you need.",
    propertyCount: 290,
    image: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
  },
  {
    id: 22,
    slug: "floating-villas",
    title: "Floating Villas",
    category: "Luxury Water Stay",
    subtitle: "Float in Style",
    description: "Exclusive floating villas with panoramic water views.",
    propertyCount: 38,
    image: "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
  },
  {
    id: 23,
    slug: "wellness-retreats",
    title: "Wellness Retreats",
    category: "Relaxation",
    subtitle: "Mind & Body Escape",
    description: "Spa, yoga, meditation, and holistic wellness stays.",
    propertyCount: 520,
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 24,
    slug: "unique-stays",
    title: "Unique Stays",
    category: "Extraordinary",
    subtitle: "One-of-a-Kind Experiences",
    description: "Discover unforgettable accommodations unlike anywhere else.",
    propertyCount: 970,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
];

const FILTER_TABS = [
  { id: "all", label: "All Stays" },
  { id: "classic", label: "Classic & Urban" },
  { id: "nature", label: "Nature & Adventure" },
  { id: "water", label: "Water & Coastal" },
  { id: "unique", label: "Unique & Luxury" },
];

const gridVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const cardVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Stay() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredStays = stayTypes.filter((s) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "classic")
      return [
        "hotels",
        "resorts",
        "apartments",
        "vacation-homes",
        "heritage-homes",
        "castles",
        "villas",
      ].includes(s.slug);
    if (activeFilter === "nature")
      return [
        "treehouses",
        "domes",
        "cabins",
        "glamping",
        "eco-lodges",
        "farm-stays",
        "desert-camps",
        "glass-cabins",
        "igloos",
      ].includes(s.slug);
    if (activeFilter === "water")
      return [
        "beach-houses",
        "houseboats",
        "overwater-bungalows",
        "floating-villas",
      ].includes(s.slug);
    if (activeFilter === "unique")
      return [
        "cave-hotels",
        "tiny-homes",
        "wellness-retreats",
        "unique-stays",
      ].includes(s.slug);
    return true;
  });

  // Limit items in "All" view to keep grid manageable, or just show all
  const displayStays =
    activeFilter === "all" ? filteredStays.slice(0, 9) : filteredStays;

  const phase12Ref = useRef<HTMLDivElement>(null);

  /* Carousel dynamic active state */

  const [activeCard, setActiveCard] = useState(0);

  const { scrollYProgress: scrollPhase12 } = useScroll({
    target: phase12Ref,
    offset: ["start start", "end start"],
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
      badge: "WELLNESS",
      title: "Rejuvenate Your Senses at The Serenity Spa",
      src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "EXCLUSIVE",
      title: "Your Private Oasis: Infinity Pool & Cabanas",
      src: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "DINING",
      title: "A Culinary Journey: Farm-to-Table Fine Dining",
      src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "RELAXATION",
      title: "Unwind in Our Rooftop Lounge & Bar",
      src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "FITNESS",
      title: "State-of-the-Art Gym & Yoga Studio",
      src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
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
    <div className="bg-white text-black w-full overflow-x-clip py-20">
      {/* Phase 1 & 2: Three-image expansion track */}
      <section
        ref={phase12Ref}
        className="min-h-[140vh] w-full flex flex-col justify-start relative pt-16 bg-white"
      >
        <div className="text-center mb-12 px-6">
          <Badge
            icon={Minus}
            text="Stays"
            variant="black"
            className="mb-3 tracking-widest"
          />
          <h1 className="font-bold text-4xl md:text-6xl tracking-wide max-w-4xl mx-auto leading-tight text-black">
            Beyond the Map, <br /> Into Your Perfect Stay
          </h1>
          <p className="text-sm tracking-[0.3em] text-black mt-6 flex items-center justify-center gap-2">
            Scroll to uncover ↓
          </p>
        </div>

        <div className="w-full h-[75vh] flex items-center justify-center gap-6 px-6 md:px-12 sticky top-[15vh]">
          <motion.div
            style={{ x: leftImageX, opacity: leftImageOpacity }}
            className="hidden md:block w-[24vw] h-[55vh] overflow-hidden rounded-md shrink-0 relative"
          >
            <Image
              src="https://images.pexels.com/photos/1795508/pexels-photo-1795508.jpeg"
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

      {/* Why Book With Us Section */}
      <section className="w-full bg-white px-6 py-20 md:pt-50">
        <div className="mx-auto max-w-7xl">
          {/* Header Layout */}
          <div className="mb-14 w-full">
            <Badge
              text="Why Book With Us"
              variant="black"
              size="lg"
              icon={Minus}
              className="mb-4 tracking-widest"
            />

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl max-w-2xl leading-tight">
                Your Booking, Our Guarantee <br />
                <span className="text-xl font-medium text-gray-600 mt-2 block">
                  Every reservation comes with built-in protections and premium
                  service standards.
                </span>
              </h2>
            </div>
          </div>

          {/* Stacked Card Modules Matrix */}
          <div className="flex flex-col gap-6">
            {GUARANTEE_FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;

              return (
                <div
                  key={feature.id}
                  className="sticky w-full rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch duration-300"
                  style={{
                    top: "120px",
                    zIndex: index + 1,
                  }}
                >
                  {/* Left Side */}
                  <div className="md:col-span-5 flex flex-col justify-between gap-12 min-h-55">
                    {/* Top: Icon + Feature Heading */}
                    <div className="flex flex-col items-start gap-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                        <IconComponent className="h-5 w-5" strokeWidth={2.2} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-950 tracking-wide">
                        {feature.title}
                      </h3>
                    </div>

                    {/* Bottom */}
                    <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-sm">
                      {feature.description}
                    </p>
                  </div>

                  {/* Right Side  */}
                  <div className="relative md:col-span-7 h-65 sm:h-80 md:h-auto min-h-60 w-full overflow-hidden rounded-2xl bg-neutral-50 transform-gpu">
                    <Image
                      fill
                      src={feature.imageSrc}
                      alt={feature.title}
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className="object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Phase 4: Types of Hotels Grid */}
      <section className="w-full bg-white px-6 pt-20 flex flex-col justify-center items-center relative">
        <div className="w-full max-w-7xl flex flex-col gap-16">
          {/* Heading */}
          <div className="flex flex-col gap-6 items-center text-center">
            <Badge
              icon={Minus}
              text="Explore Our Options"
              variant="black"
              className="tracking-widest"
            />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
              Find Your Perfect Stay
            </h2>
          </div>

          {/* Navigation Switcher */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex flex-wrap justify-center rounded-full bg-neutral-100 p-1.5 border border-neutral-200 shadow-xs">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`relative rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-widest transition-colors uppercase duration-300 ${
                    activeFilter === tab.id
                      ? "bg-neutral-950 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {activeFilter === tab.id && (
                    <motion.span
                      layoutId="stay-filter-pill"
                      className="absolute inset-0 rounded-full bg-neutral-950 shadow-md -z-10"
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="overflow-hidden min-h-[40vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                variants={gridVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {displayStays.map((type) => (
                  <motion.div
                    key={type.id}
                    variants={cardVariants}
                    className="relative overflow-hidden rounded-2xl bg-neutral-100 group cursor-pointer shadow-xs hover:shadow-lg transition-shadow duration-300 transform-gpu"
                    style={{ aspectRatio: "3 / 4.2" }}
                  >
                    <Image
                      fill
                      src={type.image}
                      alt={type.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/90 z-10 pointer-events-none" />
                    <span className="absolute left-5 top-5 z-20 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/10 select-none">
                      {type.category}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col gap-1 transform-gpu">
                      <h3 className="text-2xl font-bold text-white tracking-wide">
                        {type.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-300 tracking-wider uppercase opacity-80">
                        {type.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA */}
          <div className="flex justify-center mt-4">
            <CtaButton text="View More Options" variant="blue" size="sm" />
          </div>
        </div>
      </section>

      {/* Dynamic Expanding Width Carousel with Button Controls */}
      <section className="w-full bg-white py-32 px-6 md:px-24 border-t border-b border-black/5">
        <div className="max-w-7xl mx-auto relative">
          {/* Header Layout with integrated Left/Right Control Buttons */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge
                icon={Minus}
                text="Stays Facility"
                variant="black"
                className="mb-5 tracking-widest"
              />
              <h2 className="font-bold text-3xl md:text-5xl tracking-wide text-black">
                Everything You Need
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
                    <Badge
                      icon={Minus}
                      text={card.badge}
                      variant="white"
                      size="sm"
                    />
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
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Phase 5: Rotating orbit gallery final base */}
      <section className="min-h-[160vh] w-full flex flex-col items-center justify-center relative bg-white overflow-hidden">
        <div className="absolute w-200 h-200 md:w-212.5 md:h-212.5 border border-gray-300 rounded-full pointer-events-none animate-[pulse_6s_infinite]" />
        <div className="absolute w-262.5 h-262.5 md:w-275 md:h-275 border border-gray-300 rounded-full pointer-events-none" />

        <div className="text-center space-y-8 max-w-2xl px-6 z-10">
          <h2 className="font-semibold text-5xl md:text-7xl tracking-wide leading-tight text-black">
            Ready for Your Next Vacation?
          </h2>
          <CtaButton text="Book Now" variant="blue" size="md" />
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
