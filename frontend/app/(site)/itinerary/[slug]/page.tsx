import { notFound } from "next/navigation";
import ItineraryDetails, { ItineraryData } from "@/Components/Itinerary/ItineraryDetails";
import { itineraryImageUrl } from "@/lib/imageUrl";

interface ApiItineraryImage {
  image_id: number;
  image_path: string;
  sort_order: number;
}

interface ApiItinerary {
  itinerary_id: number;
  slug: string;
  name: string;
  destination: string;
  type: "DOMESTIC" | "INTERNATIONAL";
  category?: string | null;
  badge?: string | null;
  duration?: string | null;
  days: number;
  nights: number;
  best_time?: string | null;
  image?: string | null;
  short_desc?: string | null;
  highlights?: string[] | null;
  inclusions?: string[] | null;
  schedule?: { day: string; title: string; desc: string }[] | null;
  gallery?: ApiItineraryImage[];
}

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  let itinerary: ApiItinerary | null = null;

  try {
    let res = await fetch(`${apiBase}/api/itineraries/slug/${slug}`, { cache: "no-store" });
    if (!res.ok) {
      res = await fetch(`https://mwvpl.com/api/itineraries/slug/${slug}`, { cache: "no-store" });
    }
    if (res.ok) {
      const json = await res.json();
      itinerary = json?.data ?? null;
    }
  } catch {
    try {
      const res = await fetch(`https://mwvpl.com/api/itineraries/slug/${slug}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        itinerary = json?.data ?? null;
      }
    } catch {
      itinerary = null;
    }
  }

  if (!itinerary) return notFound();

  const sortedImages = [...(itinerary.gallery ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const rawImages = [
    ...(itinerary.image ? [itineraryImageUrl(itinerary.image, itinerary.itinerary_id)] : []),
    ...sortedImages.map((img) => itineraryImageUrl(img.image_path, itinerary!.itinerary_id)),
  ];
  const images = Array.from(new Set(rawImages));

  const itineraryData: ItineraryData = {
    id: itinerary.itinerary_id,
    slug: itinerary.slug,
    name: itinerary.name,
    destination: itinerary.destination,
    type: itinerary.type,
    category: itinerary.category,
    badge: itinerary.badge,
    duration: itinerary.duration,
    days: itinerary.days,
    nights: itinerary.nights,
    best_time: itinerary.best_time,
    short_desc: itinerary.short_desc ?? "",
    images,
    highlights: itinerary.highlights ?? [],
    inclusions: itinerary.inclusions ?? [],
    schedule: itinerary.schedule ?? [],
  };

  return (
    <main className="bg-white min-h-screen pt-24">
      <ItineraryDetails itinerary={itineraryData} />
    </main>
  );
}
