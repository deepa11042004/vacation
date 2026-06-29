import ActivitiesGrid from "@/Components/Activities/ActivitiesGrid";
import MemberHome from "@/Components/Member/MemberHome";
import PlanSec from "@/Components/Member/PlanSec";
import React from "react";

function Member() {
  return (
    <>
      <MemberHome />
      <PlanSec />
      <ActivitiesGrid/>
    </>
  );
}

export default Member;
