import Image from "next/image";
import {
  MapPin,
  Star,
  Sofa,
  BedDouble,
  Bath,
  WashingMachine,
  ChefHat,
  Wind,
  Refrigerator,
  Wifi,
  Waves,
  Clock,
  ParkingCircle,
  Info,
} from "lucide-react";

export interface PropertyData {
  id: number | string;
  title: string;
  location: string;
  description: string;
  image: string; // main image
  rating?: number;
  subImages?: string[]; // 2 extra images for the gallery
}

interface PropertyDetailsProps {
  property: PropertyData;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  // Use provided subImages or fallback to some placeholder images for the design
  const subImage1 =
    property.subImages?.[0] ||
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80";
  const subImage2 =
    property.subImages?.[1] ||
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-30 bg-white min-h-screen text-neutral-900">
      {/* --- Image Gallery --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 h-[50vh] md:h-150">
        {/* Main large image */}
        <div className="relative w-full h-full md:col-span-2 rounded-2xl overflow-hidden shadow-xs group">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
            unoptimized
          />
        </div>

        {/* Right side sub images */}
        <div className="hidden md:flex flex-col gap-4 col-span-1 h-full">
          <div className="relative w-full h-1/2 rounded-2xl overflow-hidden shadow-xs group">
            <Image
              src={subImage1}
              alt={`${property.title} View 1`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              sizes="33vw"
              unoptimized
            />
          </div>
          <div className="relative w-full h-1/2 rounded-2xl overflow-hidden shadow-xs group">
            <Image
              src={subImage2}
              alt={`${property.title} View 2`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              sizes="33vw"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* --- Content Area --- */}
      {/* We center the content or give it a max-width to balance since we removed the right widget */}
      <div className="max-w-4xl mx-auto md:mx-0 w-full space-y-10">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {property.title}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-neutral-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-neutral-700 font-bold ml-1">
                {property.rating || 5}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
            {property.description}
          </p>
          <button className="mt-4 text-sm font-bold border-b border-neutral-900 pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-colors">
            Read More
          </button>
        </div>

        {/* Amenities Section */}
        <div className="border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-xs">
          <h3 className="text-xl font-bold mb-6">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 text-sm text-neutral-600">
            <div className="flex items-center gap-3">
              <Sofa className="w-5 h-5 text-neutral-400" />
              <span>Lounge chairs : 2</span>
            </div>
            <div className="flex items-center gap-3">
              <WashingMachine className="w-5 h-5 text-neutral-400" />
              <span>Washing Machine : 5</span>
            </div>
            <div className="flex items-center gap-3">
              <Refrigerator className="w-5 h-5 text-neutral-400" />
              <span>Refrigerator : 5</span>
            </div>
            <div className="flex items-center gap-3">
              <BedDouble className="w-5 h-5 text-neutral-400" />
              <span>Bedroom : 2</span>
            </div>
            <div className="flex items-center gap-3">
              <ChefHat className="w-5 h-5 text-neutral-400" />
              <span>Oven : 2</span>
            </div>
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-neutral-400" />
              <span>Wifi : 2</span>
            </div>
            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 text-neutral-400" />
              <span>Bathroom : 4</span>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-neutral-400" />
              <span>Air Conditioner : 8</span>
            </div>
            <div className="flex items-center gap-3">
              <Waves className="w-5 h-5 text-neutral-400" />
              <span>Swimming Pool : 1</span>
            </div>
          </div>
        </div>

        {/* Hotel Information Section */}
        <div className="border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-xs">
          <h3 className="text-xl font-bold mb-6">Hotel Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 text-sm text-neutral-600">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-neutral-400" />
              <span>Check In : 3:00 pm</span>
            </div>
            <div className="flex items-center gap-3">
              <ParkingCircle className="w-5 h-5 text-neutral-400" />
              <span>Parking Area : 2</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-neutral-400" />
              <span>Check Out : 12:00 pm</span>
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center gap-3 mt-2 pt-6 border-t border-neutral-100">
              <Info className="w-5 h-5 text-neutral-400" />
              <span>Minimum Age to Check In : 17</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
