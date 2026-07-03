import DestinationHero from "@/Components/Destination/DestinationHero";
import AllDestination from "@/Components/Destination/AllDestination";

export default function NationalDestinationPage() {
  return (
    <main>
      <DestinationHero />
      <AllDestination type="national" />
    </main>
  );
}
