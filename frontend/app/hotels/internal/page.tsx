import HotelsHero from "@/Components/Hotels/HotelsHero";
import AllHotels from "@/Components/Hotels/AllHotels";

export default function InternalHotelsPage() {
  return (
    <main>
      <HotelsHero />
      <AllHotels type="internal" />
    </main>
  );
}
