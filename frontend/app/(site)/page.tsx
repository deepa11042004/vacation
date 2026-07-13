import Hero from "@/Components/Home/Hero";
import Properties from "@/Components/Home/Properties";
import Destination from "@/Components/Home/Destination";
import ActivitiesGrid from "@/Components/Activities/ActivitiesGrid";
import Itinerary from "@/Components/Home/Itinerary";
import FAQsec from "@/Components/Home/FAQsec";
import Testimonials from "@/Components/Home/Testimonials";
import Book from "@/Components/Home/Book";
import BookDetail from "@/Components/Home/BookDetail";
import Partners from "@/Components/Home/Partners";
import LogoAbout from "@/Components/About/LogoAbout";

function page() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Book />
      <LogoAbout/>
      <BookDetail />
      <Destination />
      <Properties />
      <Itinerary />
      <Partners />
      <Testimonials />
      <ActivitiesGrid />
      <FAQsec />
    </main>
  );
}

export default page;
