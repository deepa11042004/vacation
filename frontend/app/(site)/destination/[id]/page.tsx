import { notFound } from "next/navigation";
import PropertyDetails, { PropertyData } from "@/Components/Shared/PropertyDetails";
import { AllDestinationList } from "@/data/mockData";

export default async function DestinationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destinationId = parseInt(id, 10);
  const destination = AllDestinationList.find((d) => d.id === destinationId);

  if (!destination) {
    return notFound();
  }

  const propertyData: PropertyData = {
    id: destination.id,
    title: destination.title,
    location: destination.location,
    description: destination.description,
    image: destination.image,
    rating: 5,
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Include Navbar if necessary, though it might be in layout.tsx. 
          Assuming Navbar handles its own spacing/transparency */}
      <PropertyDetails property={propertyData} />
    </main>
  );
}
