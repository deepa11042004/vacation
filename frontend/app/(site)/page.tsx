import Hero from "@/Components/Home/Hero";
import FamilyHolidays from "@/Components/Home/FamilyHolidays";
import Properties from "@/Components/Home/Properties";
import Destination from "@/Components/Home/Destination";
import ActivitiesGrid from "@/Components/Activities/ActivitiesGrid";
import UniverseExperiences from "@/Components/Home/UniverseExperiences";
import Itinerary from "@/Components/Home/Itinerary";
import FAQsec from "@/Components/Home/FAQsec";
import Testimonials from "@/Components/Home/Testimonials";
import Book from "@/Components/Home/Book";
import BookDetail from "@/Components/Home/BookDetail";
import Partners from "@/Components/Home/Partners";
import LogoAbout from "@/Components/About/LogoAbout";
import MembershipForm from "@/Components/Home/MembershipForm";

function page() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      
      {/* Shared Background for LogoAbout and FamilyHolidays */}
      <div className="relative w-full overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-full h-full z-0 opacity-40 pointer-events-none">
          {/* We import Image here, wait, Image isn't explicitly needed if we use an img tag, or we can use next/image but it needs importing. We can just use standard img tag or see if Image is imported. Let's check imports in page.tsx. Image is NOT imported in page.tsx usually. So I'll use standard img tag or just inline styles for background image, but img tag is easier. Actually, let's use an inline style or img tag */}
          <img
            src="/Img/white-texture.png"
            alt="Wavy texture"
            className="w-full h-full object-cover object-right-top"
          />
        </div>
        <div className="relative z-10">
          <LogoAbout hideBackground={true} />
          <FamilyHolidays hideBackground={true} />
        </div>
      </div>
      <UniverseExperiences />

      {/* <Book /> hidden as requested */}
      {/* <BookDetail /> hidden as requested */}
      <Destination />
      <Properties />
      <Itinerary />
      <ActivitiesGrid />
      <Testimonials />
      <Partners />
      <MembershipForm />
      <FAQsec />
    </main>
  );
}

export default page;
