import Hero from "@/Components/Home/Hero";
import About from "@/Components/Home/About";
import React from "react";
import Properties from "@/Components/Home/Properties";
import Destination from "@/Components/Home/Destination";
import ActivitiesGrid from "@/Components/Activities/ActivitiesGrid";
import Itinerary from "@/Components/Home/Itinerary";
import FAQsec from "@/Components/Home/FAQsec";
import Testimonials from "@/Components/Home/Testimonials";
import Book from "@/Components/Home/Book";
import Story from "@/Components/About/Story";
import BookDetail from "@/Components/About/BookDetail";

function page() {
  return (
    <>
      <Hero />
      <Book />
      <BookDetail />
      <Story />
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
