import AccommodationSec from "@/Components/Member/AccommodationSec";
import FAQsec from "@/Components/Home/FAQsec";
import KeyDetails from "@/Components/Member/KeyDetails";
import MemberHero from "@/Components/Member/MemberHero";
import PlanSec from "@/Components/Member/PlanSec";

function Member() {
  return (
    <>
      <MemberHero />
      <PlanSec />
      <AccommodationSec />
      <KeyDetails />
      <FAQsec />
    </>
  );
}

export default Member;
