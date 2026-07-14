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
import { Minus } from "lucide-react";
import Testimonials from "@/Components/Home/Testimonials";
import { useRouter } from "next/navigation";

const NEW_CAROUSEL_DATA = [
  {
    title: "Spacious Rooms",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Premium Service",
    image:
      "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Scenic Locations",
    image:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Fine Dining",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Infinity Pools",
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Spa & Wellness",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Private Beaches",
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Exclusive Experiences",
    image:
      "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Guided Tours",
    image:
      "https://images.unsplash.com/photo-1533692328991-08159ff19fca?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Luxury Transport",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80",
  },
];

export const stayTypes = [
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
    id: 7,
    slug: "treehouses",
    title: "Treehouses",
    category: "Unique Stay",
    subtitle: "Stay Above the Forest",
    description: "Unique treehouse escapes surrounded by nature.",
    propertyCount: 420,
    image: "https://images.pexels.com/photos/1795508/pexels-photo-1795508.jpeg",
  },
  {
    id: 8,
    slug: "domes",
    title: "Domes",
    category: "Unique Stay",
    subtitle: "Sleep Under the Stars",
    description: "Geodesic domes offering unforgettable views.",
    propertyCount: 180,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNUo4rV1_9djgtxnxURxH--oqfDRrKrxdB5upl-MQWMDAUS79fC7oUkUA&s=10",
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
      "https://images.unsplash.com/photo-1771762210836-a0f3c96c402b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGlnbG9vJTIwc3RheXxlbnwwfHwwfHx8MA%3D%3D",
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
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/8f/05/3a/hillside-country-cabins.jpg?w=900&h=500&s=1",
  },
  {
    id: 25,
    slug: "tenthouses",
    title: "Tenthouses",
    category: "Unique Stay",
    subtitle: "Glamorous Camping",
    description: "Luxury tents and camps under star-filled skies.",
    propertyCount: 320,
    image:
      "https://5.imimg.com/data5/QM/FF/EP/ANDROID-10975077/product-jpeg.jpg",
  },
  {
    id: 1,
    slug: "hotels",
    title: "Hotels",
    category: "Classic Stay",
    subtitle: "Comfort & Convenience",
    description: "From budget-friendly to premium hotels in every destination.",
    propertyCount: 15420,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      "https://a0.muscache.com/im/pictures/3078a462-73d2-4716-9ec0-fbaf6f65e401.jpg?im_w=720",
  },
  {
    id: 9,
    slug: "glass-cabins",
    title: "Glass Cabins",
    category: "Nature Escape",
    subtitle: "Panoramic Views",
    description: "Modern cabins with floor-to-ceiling glass walls.",
    propertyCount: 215,
    image: "https://gos3.ibcdn.com/1e7e600a-de7b-4c82-b9f7-340d79d7accb.jpg",
  },
  {
    id: 10,
    slug: "houseboats",
    title: "Houseboats",
    category: "Water Stay",
    subtitle: "Live on the Water",
    description: "Floating accommodations on lakes, rivers, and canals.",
    propertyCount: 340,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTswbYBCsUg4tiZYqyjD0hTaeEcthSlDNP-fV9IYnqFbVGRjl9QFrUAI6A&s=10",
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
    id: 13,
    slug: "glamping",
    title: "Glamping",
    category: "Outdoor Luxury",
    subtitle: "Nature Meets Comfort",
    description: "Luxury camping with hotel-style comforts.",
    propertyCount: 760,
    image:
      "https://assets.culturetravel.in/ct-assets/4a84d526-d4a7-4d48-99f8-b81753311e94/thumbnail.jpg",
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
      "https://soultravelindia.com/wp-content/uploads/2021/10/Eco-Resorts-in-India.jpeg",
  },
  {
    id: 15,
    slug: "farm-stays",
    title: "Farm Stays",
    category: "Countryside",
    subtitle: "Rural Living",
    description: "Experience authentic countryside hospitality.",
    propertyCount: 540,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsRQ_Yk_t6jYb0rUDQSt7BX3Q_ZPapMr2r4GwY16xm2A&s=10",
  },
  {
    id: 16,
    slug: "desert-camps",
    title: "Desert Camps",
    category: "Adventure",
    subtitle: "Desert Nights",
    description: "Luxury tents and camps under star-filled skies.",
    propertyCount: 190,
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/50/06/eb/sunrise-view.jpg?w=900&h=500&s=1",
  },
  {
    id: 17,
    slug: "cave-hotels",
    title: "Cave Hotels",
    category: "Historic",
    subtitle: "Stay Underground",
    description: "Unique cave accommodations carved into rock formations.",
    propertyCount: 88,
    image: "https://gos3.ibcdn.com/6f28d1ee921411eb8eed0242ac110004.jpeg",
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
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/a1/4e/e5/riverside-heritage-homestay.jpg?w=900&h=500&s=1",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMmg_4UDXgQWvgw9A2xmCEemPeGdBG1ICsoMYCfsGSm8JAGKCVZ3uu574&s=10",
  },
  {
    id: 21,
    slug: "tiny-homes",
    title: "Tiny Homes",
    category: "Minimal Living",
    subtitle: "Small Space, Big Adventure",
    description: "Compact designer homes with everything you need.",
    propertyCount: 290,
    image:
      "https://images.squarespace-cdn.com/content/v1/5e8b80824d662840f6bb71a6/1715807115279-YDES1ZK7AHMGJ5F0RQNI/A54I0460+%281%29.jpg",
  },
  {
    id: 22,
    slug: "floating-villas",
    title: "Floating Villas",
    category: "Luxury Water Stay",
    subtitle: "Float in Style",
    description: "Exclusive floating villas with panoramic water views.",
    propertyCount: 38,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oefRXd_gxgoZexgczLnmECZYn2gqQHHKWxIuJfl-7mmx5OgN1h-wmrs&s=10",
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
      "https://www.viceroybali.com/wp-content/uploads/2024/10/what-is-a-wellness-retreat-1.png",
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
      "https://bunkout.in/wp-content/uploads/2023/07/WhatsApp-Image-2023-07-02-at-12.59.39-AM.jpeg",
  },
];

const FILTER_TABS = [
  { id: "all", label: "All Stays" },
  { id: "villas", label: "Villas" },
  { id: "treehouses", label: "Treehouse" },
  { id: "domes", label: "Domes" },
  { id: "igloos", label: "Igloos" },
  { id: "cabins", label: "Cabin" },
  { id: "tenthouses", label: "Tenthouse" },
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
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeFanIndex, setActiveFanIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveFanIndex((prev) => (prev + 1) % NEW_CAROUSEL_DATA.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const filteredStays = stayTypes.filter((s) => {
    if (activeFilter === "all") return true;
    return s.slug === activeFilter;
  });

  // "All"
  const displayStays =
    activeFilter === "all" ? filteredStays.slice(0, 24) : filteredStays;

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
      badge: "SCENIC VIEWS",
      title: "Wake up to breathtaking landscapes every morning.",
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "LOCAL EXPERIENCES",
      title:
        "Immerse yourself in authentic culture and unforgettable adventures.",
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "PEACEFUL ESCAPES",
      title: "Disconnect from the everyday and reconnect with nature.",
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "UNIQUE STAYS",
      title: "Sleep somewhere extraordinary, from treehouses to glass domes.",
      src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "LASTING MEMORIES",
      title:
        "Create unforgettable moments with family, friends, or someone special.",
      src: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
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
            className="mb-3 mr-8 tracking-widest"
          />
          <h1 className="font-bold text-4xl md:text-5xl lg:text-7xl tracking-wide max-w-4xl mx-auto leading-tight text-black">
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
              src="https://images.pexels.com/photos/1795508/pexels-photo-1795508.jpeg?auto=compress&cs=tinysrgb&w=600"
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

      {/* Phase 2: Types of Hotels Grid */}
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
          <div className="flex justify-center w-full mb-4 px-2">
            <div className="flex bg-neutral-100 p-1.5 border border-neutral-200 shadow-xs rounded-4xl md:rounded-full max-w-full">
              <div className="flex overflow-x-auto scrollbar-hide gap-1.5 items-center w-full">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`relative whitespace-nowrap shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-widest transition-colors uppercase duration-300 ${
                      activeFilter === tab.id
                        ? "bg-neutral-950 text-white shadow-md"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {activeFilter === tab.id && (
                      <motion.span
                        layoutId="stay-filter-pill"
                        className="absolute inset-0 rounded-full bg-neutral-950 shadow-md -z-10"
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    )}
                    {tab.label}
                  </button>
                ))}
              </div>
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
                    onClick={() => router.push(`/stays/${type.slug}`)}
                    className="relative overflow-hidden rounded-2xl bg-neutral-100 group cursor-pointer shadow-xs hover:shadow-lg transition-shadow duration-300 transform-gpu"
                    style={{ aspectRatio: "3 / 3" }}
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
                      <p className="text-xs font-bold text-gray-300 tracking-wider uppercase opacity-80">
                        {type.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Phase 3: Dynamic Fan Carousel Section */}
      <section className="w-full bg-white px-6 pt-30 pb-20 overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-7xl flex flex-col gap-16 py-15">
          {/* Heading */}
          <div className="flex flex-col gap-6 items-center text-center">
            <Badge
              icon={Minus}
              text="Why Choose Us"
              variant="black"
              className="tracking-widest"
            />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-widest text-black">
              Experience Comfort, <br /> Unforgettable Moments
            </h2>
          </div>
        </div>

        <div
          className="relative w-full max-w-6xl h-100 flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          <AnimatePresence>
            {NEW_CAROUSEL_DATA.map((item, index) => {
              let offset = index - activeFanIndex;
              const total = NEW_CAROUSEL_DATA.length;

              if (offset < -Math.floor(total / 2)) offset += total;
              if (offset > Math.floor(total / 2)) offset -= total;

              if (Math.abs(offset) > 2) return null;

              const isCenter = offset === 0;
              const xPos = offset * 300;
              const zPos = isCenter ? 50 : Math.abs(offset) * -120;
              const rotateY = offset * -15;
              const rotateZ = offset * 8;
              const yPos = Math.abs(offset) * 30;

              return (
                <motion.div
                  key={item.title}
                  initial={false}
                  animate={{
                    x: xPos,
                    y: yPos,
                    z: zPos,
                    rotateY: rotateY,
                    rotateZ: rotateZ,
                    scale: isCenter ? 1.1 : 1,
                    zIndex: 10 - Math.abs(offset),
                    opacity: 1,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  // Changed: Removed overflow-hidden and background from wrapper to isolate the image container from the text block
                  className="absolute w-60 flex flex-col items-center cursor-pointer select-none"
                  style={{ transformOrigin: "bottom center" }}
                  onClick={() => setActiveFanIndex(index)}
                >
                  {/* The Image "Cube" - Separate container mimicking card-design.png structure */}
                  <div className="relative w-full h-64 rounded-3xl overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="240px"
                      className="object-cover"
                      priority={isCenter}
                    />
                  </div>

                  {/* Text Area - Positioned safely below the isolated image block */}
                  <div className="w-full flex flex-col items-center justify-center pt-4 text-center">
                    <h3 className="text-base sm:text-lg font-medium text-black tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="gap-2 mt-12 sm:mt-16 z-10 hidden">
          {NEW_CAROUSEL_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFanIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeFanIndex === idx ? "bg-blue-500 w-6" : "bg-gray-200"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Phase 4: Dynamic Expanding Width Carousel with Button Controls */}
      <section className="w-full bg-white py-20 md:py-32 px-4 md:px-24">
        <div className="max-w-7xl mx-auto relative">
          {/* Header Layout with integrated Left/Right Control Buttons */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
            <div>
              <Badge
                icon={Minus}
                text="WHAT AWAITS YOU"
                variant="black"
                className="mb-5 tracking-widest"
              />
              <h2 className="font-bold text-3xl md:text-6xl tracking-wide text-black">
                Experiences That Make <br className="hidden md:block" />
                Every Stay Memorable
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
          <div className="w-full h-[75vh] md:h-[65vh] flex flex-col md:flex-row gap-2 md:gap-4 overflow-hidden">
            {carouselCards.map((card, idx) => {
              const isActive = idx === activeCard;
              return (
                <motion.div
                  key={idx}
                  onClick={() => setActiveCard(idx)}
                  animate={{ flex: isActive ? 3.5 : 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full relative rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-black/5 bg-neutral-200 group shrink-0"
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
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                    <Badge
                      icon={Minus}
                      text={card.badge}
                      variant="white"
                      size="sm"
                    />
                  </div>

                  {/* Text Overlay Layout */}
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-20 text-white flex flex-col justify-end h-1/2">
                    <motion.div
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 5,
                      }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <h4
                        className={`tracking-wide leading-tight transition-all duration-300 ${isActive ? "text-xl sm:text-2xl md:text-3xl font-bold max-w-xl" : "text-sm md:text-base font-medium line-clamp-2"}`}
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
      <section className="min-h-[150vh] w-full flex flex-col items-center justify-center relative bg-white overflow-hidden">
        <div className="absolute w-200 h-200 md:w-212.5 md:h-212.5 border border-blue-600 rounded-full pointer-events-none animate-[pulse_6s_infinite]" />
        <div className="absolute w-262.5 h-262.5 md:w-275 md:h-275 border border-blue-600 rounded-full pointer-events-none" />

        <div className="text-center space-y-8 max-w-2xl px-6 z-10">
          <h2 className="font-bold text-5xl md:text-7xl tracking-wide leading-tight text-black">
            Ready for Your Next Vacation?
          </h2>
          <CtaButton text="Book Now" variant="blue" size="md" />
        </div>

        <div className="absolute w-175 h-175 md:w-225 md:h-225 flex items-center justify-center rounded-full animate-[spin_60s_linear_infinite]">
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
        </div>
      </section>
    </div>
  );
}
