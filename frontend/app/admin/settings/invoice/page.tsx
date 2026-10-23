"use client";

import SeriesSettingsForm from "@/Components/Admin/SeriesSettingsForm";

export default function InvoiceSettingsPage() {
  return (
    <SeriesSettingsForm
      title="Invoice Settings"
      description="Set the invoice number series. Every new invoice and tax invoice takes the next number from here."
      endpoint="/settings/invoice-series"
      prefixHelp="Invoice number = prefix + zero-padded number, e.g. prefix INV-, start 1001 and 6 digits gives INV-001001."
    />
  );
}
