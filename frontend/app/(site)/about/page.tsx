import AboutHero from "@/Components/About/AboutHero";
import BookDetail from "@/Components/Home/BookDetail";
import Story from "@/Components/About/Story";
import About from "@/Components/About/About";
import FAQsec from "@/Components/Home/FAQsec";
import ContactInfo from "@/Components/About/ContactInfo";

function about() {
  return (
    <main className="overflow-x-hidden">
      <AboutHero />
      
      {/* Shared Background for Story, About and ContactInfo */}
      <div className="relative w-full overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-full h-full z-0 opacity-40 pointer-events-none">
          <img
            src="/Img/white-texture.png"
            alt="Wavy texture"
            className="w-full h-full object-cover object-right-top"
          />
        </div>
        <div className="relative z-10">
          <Story hideBackground={true} />
          <About hideBackground={true} />
          <ContactInfo hideBackground={true} />
        </div>
      </div>

      <BookDetail />
      <FAQsec />
    </main>
  );
}

export default about;
