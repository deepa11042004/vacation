import ActivitiesGrid from "@/Components/Activities/ActivitiesGrid";
import MemberHero from "@/Components/Member/MemberHero";
import MemberHome from "@/Components/Member/MemberHome";
import PlanSec from "@/Components/Member/PlanSec";
import React from "react";

function Member() {
  return (
    <>
      <MemberHero />
      <MemberHome />
      <PlanSec />
      <ActivitiesGrid />
    </>
  );
}

export default Member;
