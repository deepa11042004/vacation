import AboutHero from "@/Components/About/AboutHero";
import Story from "@/Components/About/Story";
import About from "@/Components/About/About";
import AboutStats from "@/Components/About/AboutStats";
import MissionVision from "@/Components/About/MissionVision";
import CoreValues from "@/Components/About/CoreValues";
import AboutCta from "@/Components/About/AboutCta";
import ContactInfo from "@/Components/About/ContactInfo";
import FAQsec from "@/Components/Home/FAQsec";

function about() {
  return (
    <main className="overflow-x-hidden">
      <AboutHero />

      {/* Shared Wavy Background Wrapper matching Homepage */}
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
          <AboutStats hideBackground={true} />
          <MissionVision hideBackground={true} />
          <CoreValues hideBackground={true} />
          <About hideBackground={true} />
          <AboutCta hideBackground={true} />
          <ContactInfo hideBackground={true} />
        </div>
      </div>

      {/* FAQ Section */}
      <FAQsec />
    </main>
  );
}

export default about;
