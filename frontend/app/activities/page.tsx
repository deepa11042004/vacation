import ActivitiesDetails from "@/Components/Activities/ActivitiesDetails";
import ActivitiesGrid from "@/Components/Activities/ActivitiesGrid";
import ActivityHero from "@/Components/Activities/ActivityHero";
import FAQsec from "@/Components/Home/FAQsec";

function Activities() {
  return (
    <>
      <ActivityHero />
      <ActivitiesDetails />
      <ActivitiesGrid />
      <FAQsec />
    </>
  );
}

export default Activities;
