import { notFound } from "next/navigation";
import PropertyDetails, { PropertyData } from "@/Components/Shared/PropertyDetails";
import { locationImageUrl } from "@/lib/imageUrl";
import { stripHtml } from "@/lib/text";

interface ApiLocation {
  location_id: number;
  location_name: string;
  country: string;
  description?: string | null;
  location_image?: string | null;
}

export default async function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  let location: ApiLocation | null = null;

  try {
    const res = await fetch(`${apiBase}/api/locations/${id}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      location = json?.data ?? null;
    }
  } catch {
    location = null;
  }

  if (!location) return notFound();

  const propertyData: PropertyData = {
    id: location.location_id,
    title: location.location_name,
    location: location.country,
    description: stripHtml(location.description),
    image: locationImageUrl(location.location_image),
    rating: 5,
  };

  return (
    <main className="bg-white min-h-screen">
      <PropertyDetails property={propertyData} />
    </main>
  );
}
