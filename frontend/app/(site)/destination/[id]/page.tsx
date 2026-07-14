"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Star, Minus } from "lucide-react";
import CtaButton from "@/UI/CtaButton";
import Badge from "@/UI/Badge";

// Dummy data generator based on location name
const generateDummyProperties = (title: string) => {
  const propertyCount = Math.floor(Math.random() * 500) + 100;
  
  const properties = Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    name: `${title} Retreat ${i + 1}`,
    description: `Experience the ultimate relaxation at this stunning ${title.toLowerCase()}. Enjoy world-class amenities and breathtaking views for an unforgettable stay.`,
    location: title,
    price: Math.floor(Math.random() * 500) + 150,
    rating: (Math.random() * 1 + 4).toFixed(1),
    reviews: Math.floor(Math.random() * 300) + 20,
    image: `https://images.unsplash.com/photo-${
      [
        "1512917774080-9991f1c4c750",
        "1499793983690-e29da59ef1c2",
        "1522708323590-d24dbb6b0267",
        "1507525428034-b723cf961d3e",
        "1470770841072-f978cf4d019e",
        "1582719508461-905c673771fd",
      ][Math.floor(Math.random() * 6)]
    }?auto=format&fit=crop&w=800&q=80`,
  }));

  return { title, propertyCount, properties };
};

export default function DestinationHotelsPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "1";

  const [data, setData] = useState<{
    title: string;
    propertyCount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: any[];
  } | null>(null);

  useEffect(() => {
    // Fetch the actual destination name, then generate dummy hotels
    fetch(`/api/locations/${id}`)
      .then((res) => res.json())
      .then((json) => {
        const title = json?.data?.location_name || "Destination";
        setData(generateDummyProperties(title));
      })
      .catch(() => {
        setData(generateDummyProperties("Destination"));
      });
  }, [id]);

  if (!data)
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <main className="min-h-screen bg-neutral-50 pt-32 pb-24 px-6 md:px-12 md:py-50 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-200 pb-8">
          <div className="flex flex-col gap-4">
            <Badge
              text="429+ Properties Available"
              variant="black"
              size="lg"
              icon={Minus}
              className="w-fit"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950">
              {data.title}
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl font-medium">
              Explore our curated selection of stunning{" "}
              {data.title.toLowerCase()} tailored for your perfect getaway.
            </p>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.properties.map((prop, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={prop.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-neutral-100 group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
                <Image
                  src={prop.image}
                  alt={prop.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-neutral-900">
                    {prop.rating}
                  </span>
                  <span className="text-xs font-medium text-neutral-400">
                    ({prop.reviews})
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col grow">
                <div className="flex items-center gap-2 text-neutral-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {prop.location}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {prop.name}
                </h3>
                <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                  {prop.description}
                </p>

                <div className="my-2">
                  <CtaButton text="View" size="sm" variant="blue" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
