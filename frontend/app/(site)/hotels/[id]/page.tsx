import { notFound } from "next/navigation";
import PropertyDetails, { PropertyData } from "@/Components/Shared/PropertyDetails";
import { AllHotelsList } from "@/data/mockData";

export default async function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hotelId = parseInt(id, 10);
  const hotel = AllHotelsList.find((h) => h.id === hotelId);

  if (!hotel) {
    return notFound();
  }

  const propertyData: PropertyData = {
    id: hotel.id,
    title: hotel.title,
    location: hotel.location,
    description: hotel.description,
    image: hotel.image,
    rating: 5,
  };

  return (
    <main className="bg-white min-h-screen pt-20">
      <PropertyDetails property={propertyData} />
    </main>
  );
}
