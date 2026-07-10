import { notFound } from "next/navigation";
import PropertyDetails, { PropertyData } from "@/Components/Shared/PropertyDetails";
import { hotelImageUrl } from "@/lib/imageUrl";
import { stripHtml } from "@/lib/text";

interface HotelImage {
  image_id: number;
  image_path: string;
  sort_order: number;
}

interface ApiHotel {
  hotel_id: number;
  hotel_name: string;
  description?: string | null;
  address?: string | null;
  location?: { location_name: string; country: string };
  images?: HotelImage[];
}

export default async function HotelDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  let hotel: ApiHotel | null = null;

  try {
    const res = await fetch(`${apiBase}/api/hotels/${id}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      hotel = json?.data ?? null;
    }
  } catch {
    hotel = null;
  }

  if (!hotel) return notFound();

  const sortedImages = [...(hotel.images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const propertyData: PropertyData = {
    id: hotel.hotel_id,
    title: hotel.hotel_name,
    location: hotel.location
      ? `${hotel.location.location_name}, ${hotel.location.country}`
      : hotel.address ?? "",
    description: stripHtml(hotel.description),
    image: hotelImageUrl(sortedImages[0]?.image_path),
    subImages: sortedImages.slice(1, 3).map((img) => hotelImageUrl(img.image_path)),
    rating: 5,
  };

  return (
    <main className="bg-white min-h-screen pt-20">
      <PropertyDetails property={propertyData} />
    </main>
  );
}
