export const GST_RATE = 5;

export interface CompanySettings {
  name: string;
  address: string;
  state: string;
  gst_number: string;
  phone: string;
  email: string;
}

export function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calcGst(total: number) {
  const base = parseFloat((total * 100 / (100 + GST_RATE)).toFixed(2));
  const gst  = parseFloat((total - base).toFixed(2));
  const half = parseFloat((gst / 2).toFixed(2));
  return { base, gst, half };
}

function BuyerRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-1.5 py-0.5 text-[13px]">
      <span className="font-bold w-28 shrink-0 text-black">{label}:</span>
      <span className="text-black">{value || "—"}</span>
    </div>
  );
}

export function InvoiceTemplate({
  form,
  isTax,
  co,
}: {
  form: Record<string, string>;
  isTax: boolean;
  co: CompanySettings;
}) {
  const amt = parseFloat(form.amount) || 0;
  const { base, gst, half } = calcGst(amt);
  const isInterState = form.state.trim().toLowerCase() !== co.state.toLowerCase();
  const tableAmount = isTax ? base : amt;

  return (
    <div
      id="invoice-print"
      className="bg-white border border-slate-200 rounded-xl p-8 print:border-0 print:rounded-none print:p-6 print:shadow-none"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="flex justify-between items-stretch mb-6 text-[13px] text-black">
        <div className="flex flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Logo"
            className="w-24 h-16 object-contain mb-3"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <p className="font-bold text-[14px]">{co.name}</p>
          <p>{co.address}</p>
          <p><span className="font-semibold">Phone:</span> {co.phone || "8447391828"}</p>
          <p><span className="font-semibold">Complaint Mail:</span> customercare@arenainternationalholidays.com</p>
          <p><span className="font-semibold">Official Mail:</span> {co.email || "info@arenainternationalholidays.com"}</p>
        </div>
        <div className="flex flex-col items-end justify-between py-2">
          <div className="text-right">
            <p><span className="font-semibold">Invoice No:</span> {form.invoice_no || "—"}</p>
            <p><span className="font-semibold">Date:</span> {form.issue_date || "—"}</p>
            {isTax && (
              <p className="mt-1 font-bold text-amber-700 border border-amber-400 px-1 py-0.5 rounded bg-amber-50 inline-block text-[10px]">
                TAX INVOICE
              </p>
            )}
          </div>
          <div className="text-right mt-auto pb-1">
            {isTax && co.gst_number && (
              <p><span className="font-semibold">GSTIN:</span> {co.gst_number}</p>
            )}
          </div>
        </div>
      </div>

      {/* Buyer + Payment Details */}
      <div className="grid grid-cols-2 mb-6 bg-[#f4f4f4] p-4 text-[13px] text-black gap-12">
        <div>
          <p className="font-bold text-[18px] mb-3">Buyer Details</p>
          <BuyerRow label="Name"        value={form.client_name} />
          <BuyerRow label="Email ID"    value={form.email} />
          <BuyerRow label="Address"     value={form.address} />
          <BuyerRow label="Customer ID" value={form.card_number} />
          <BuyerRow label="Mobile No"   value={form.phone} />
          <BuyerRow label="State"       value={form.state} />
          {isTax && <BuyerRow label="GST No" value={form.client_gst || "—"} />}
        </div>
        <div>
          <p className="font-bold text-[18px] mb-3">Payment Details</p>
          <BuyerRow label="Pay Mode"       value={form.payment_mode} />
          <BuyerRow label="Payment Type"   value={form.payment_type} />
          <BuyerRow label="Transaction ID" value={form.transaction_id || "NONE"} />
          <BuyerRow label="Bank Name"      value={form.bank || "—"} />
          <BuyerRow label="Cheque/Card No" value={form.card_cheque_no || "—"} />
          <BuyerRow label="Amount"         value={fmt(amt)} />
        </div>
      </div>

      {/* Particulars Table */}
      <table className="w-full text-[13px] text-black mb-2 border-collapse">
        <thead>
          <tr>
            <th className="text-left py-2 font-bold w-12 bg-white">S.No.</th>
            <th className="text-left py-2 font-bold bg-white">Particulars</th>
            <th className="text-right py-2 font-bold w-32 bg-white">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 align-top font-bold">1.</td>
            <td className="py-2 align-top">
              {form.description || "Holiday Package (Sheet Attached For Details)"}
            </td>
            <td className="py-2 align-top text-right font-bold">
              {fmt(tableAmount)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end text-[13px] text-black mt-4">
        <div className="w-96">
          <div className="flex justify-between py-1.5 border-t border-black">
            <span className="w-1/2"></span>
            <span className="w-1/4"></span>
            <span className="w-1/4 text-right font-bold">{fmt(tableAmount)}</span>
          </div>
          {isTax && (
            isInterState ? (
              <div className="flex justify-between py-1.5">
                <span className="w-1/2 font-bold text-right pr-4">Add :</span>
                <span className="w-1/4 font-bold text-center">IGST @{GST_RATE}%</span>
                <span className="w-1/4 text-right font-bold">{fmt(gst)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-1.5">
                  <span className="w-1/2 font-bold text-right pr-4">Add :</span>
                  <span className="w-1/4 font-bold text-center">CGST @{GST_RATE / 2}%</span>
                  <span className="w-1/4 text-right font-bold">{fmt(half)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="w-1/2"></span>
                  <span className="w-1/4 font-bold text-center">SGST @{GST_RATE / 2}%</span>
                  <span className="w-1/4 text-right font-bold">{fmt(half)}</span>
                </div>
              </>
            )
          )}
          <div className="flex justify-between py-2 border-t border-b-2 border-black mt-2">
            <span className="w-1/2"></span>
            <span className="w-1/4 font-bold text-center">Total Amount</span>
            <span className="w-1/4 font-bold text-right">{fmt(amt)}</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-6 border border-slate-200">
        <div className="bg-[#f4f4f4] px-4 py-1.5">
          <p className="text-[13px] font-bold text-black">Terms and Conditions</p>
        </div>
        <div className="px-4 py-2">
          <ul className="text-[13px] text-black space-y-0.5 list-disc list-inside">
            <li>All Cheques are subject to clearing from Bank.</li>
            <li>Holiday Amount is Non-Refundable.</li>
            <li>
              Sale of Holiday Package is Consider as &quot;Sale&quot; / &quot;Supply of Service&quot; under GST Act.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-100 pt-3">
        {co.name}
      </div>
    </div>
  );
}
