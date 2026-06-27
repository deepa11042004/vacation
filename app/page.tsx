import Hero from "@/Components/Home/Hero";
import About from "@/Components/Home/About";
import React from "react";
import Properties from "@/Components/Home/Properties";
import Destination from "@/Components/Home/Destination";
import ActivitiesGrid from "@/Components/Activities/ActivitiesGrid";
import Itinerary from "@/Components/Home/Itinerary";
import FAQsec from "@/Components/Home/FAQsec";
import Testimonials from "@/Components/Home/Testimonials";

function page() {
  return (
    <>
      <Hero />
      <About />
      <Properties />
      <Destination />
      <Itinerary />
      <Testimonials />
      <ActivitiesGrid />
      <FAQsec />
    </>
  );
}

export default page;
