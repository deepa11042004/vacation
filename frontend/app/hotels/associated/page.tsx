import HotelsHero from "@/Components/Hotels/HotelsHero";
import AllHotels from "@/Components/Hotels/AllHotels";

export default function AssociatedHotelsPage() {
  return (
    <main>
      <HotelsHero />
      <AllHotels type="associated" />
    </main>
  );
}
