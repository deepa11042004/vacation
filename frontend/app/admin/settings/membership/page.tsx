"use client";

import SeriesSettingsForm from "@/Components/Admin/SeriesSettingsForm";

export default function MembershipSettingsPage() {
  return (
    <SeriesSettingsForm
      title="Membership Settings"
      description="Set the membership number series. Every new client membership takes the next number from here."
      endpoint="/settings/membership-series"
      prefixHelp="Membership number = prefix + zero-padded number. Leave the prefix blank to use the first 3 letters of the package name (e.g. GOL-00101 for Gold)."
    />
  );
}
