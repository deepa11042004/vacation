import AboutHero from "@/Components/About/AboutHero";
import BookDetail from "@/Components/About/BookDetail";
import Story from "@/Components/About/Story";
import About from "@/Components/Home/About";
import FAQsec from "@/Components/Home/FAQsec";
import React from "react";

function about() {
  return (
    <>
      <AboutHero />
      <Story />
      <About />
      <BookDetail />
      <FAQsec />
    </>
  );
}

export default about;
