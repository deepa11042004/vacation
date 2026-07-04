"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  ArrowLeft, Loader2, Printer, Send, CheckCircle, AlertCircle, FileText,
} from "lucide-react";

const GST_RATE = 5;

interface CompanySettings {
  name: string;
  address: string;
  state: string;
  gst_number: string;
  phone: string;
  email: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function genInvoiceNo(clientId: number) {
  const now = new Date();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  const fyS = m >= 4 ? y : y - 1;
  const fy = `${String(fyS).slice(2)}${String(fyS + 1).slice(2)}`;
  return `${fy}/${String(clientId).padStart(3, "0")}`;
}

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calcGst(total: number) {
  const base = parseFloat((total * 100 / (100 + GST_RATE)).toFixed(2));
  const gst  = parseFloat((total - base).toFixed(2));
  const half = parseFloat((gst / 2).toFixed(2));
  return { base, gst, half };
}

const inp =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function BuyerRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-1.5 py-0.5 text-[13px]">
      <span className="font-bold w-28 shrink-0 text-black">{label}:</span>
      <span className="text-black">{value || "—"}</span>
    </div>
  );
}

// ── Invoice Template ─────────────────────────────────────────────────────────
function InvoiceTemplate({
  form, isTax, co,
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

// ── Form step ────────────────────────────────────────────────────────────────
function FormStep({
  form, setForm, isTax, clientId, co, onGenerate,
}: {
  form: Record<string, string>;
  setForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isTax: boolean;
  clientId: string;
  co: CompanySettings;
  onGenerate: () => void;
}) {
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  const amt = parseFloat(form.amount) || 0;
  const { base, gst, half } = calcGst(amt);
  const isInterState = form.state.trim().toLowerCase() !== co.state.toLowerCase();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">

      <div className="grid grid-cols-2 gap-4">
        <Field label="Invoice No">
          <input className={inp} value={form.invoice_no} onChange={e => set("invoice_no", e.target.value)} />
        </Field>
        <Field label="Issue Date">
          <input type="date" className={inp} value={form.issue_date} onChange={e => set("issue_date", e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Client Name">
          <input className={inp} value={form.client_name} onChange={e => set("client_name", e.target.value)} />
        </Field>
        <Field label="Membership / Card No">
          <input className={inp} value={form.card_number} onChange={e => set("card_number", e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Email">
          <input className={inp} value={form.email} onChange={e => set("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className={inp} value={form.phone} onChange={e => set("phone", e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Address">
          <textarea
            rows={2}
            className={`${inp} resize-none`}
            value={form.address}
            onChange={e => set("address", e.target.value)}
            placeholder="Full address…"
          />
        </Field>
        <Field label={isTax ? "State (determines IGST / CGST+SGST)" : "State"}>
          <input
            className={inp}
            value={form.state}
            onChange={e => set("state", e.target.value)}
            placeholder="Client state"
          />
        </Field>
      </div>

      {isTax && (
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <Field label="Client GST No.">
            <input className={inp} value={form.client_gst} onChange={e => set("client_gst", e.target.value)} placeholder="Client's GSTIN" />
          </Field>
          <Field label="Company GST No.">
            <input className={inp} value={form.company_gst} onChange={e => set("company_gst", e.target.value)} placeholder="Your company GSTIN" />
          </Field>
        </div>
      )}

      <hr className="border-slate-200" />
      <p className="text-sm font-semibold text-slate-700">Payment Details</p>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Payment Mode">
          <select className={inp} value={form.payment_mode} onChange={e => set("payment_mode", e.target.value)}>
            <option value="CASH">Cash</option>
            <option value="CHEQUE">Cheque</option>
            <option value="ONLINE">Online / Razorpay</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CARD">Card</option>
          </select>
        </Field>
        <Field label="Payment Type">
          <select className={inp} value={form.payment_type} onChange={e => set("payment_type", e.target.value)}>
            <option>Cash</option>
            <option>Debit Card</option>
            <option>Credit Card</option>
            <option>Cheque</option>
            <option>UPI</option>
            <option>NEFT / RTGS</option>
            <option>Demand Draft</option>
          </select>
        </Field>
        <Field label="Transaction ID">
          <input className={inp} value={form.transaction_id} onChange={e => set("transaction_id", e.target.value)} placeholder="NONE" />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Bank Name">
          <input className={inp} value={form.bank} onChange={e => set("bank", e.target.value)} placeholder="Bank name" />
        </Field>
        <Field label="Cheque / Card No.">
          <input className={inp} value={form.card_cheque_no} onChange={e => set("card_cheque_no", e.target.value)} />
        </Field>
        <Field label="Total Amount (₹) — GST included">
          <input
            type="number"
            className={inp}
            value={form.amount}
            onChange={e => set("amount", e.target.value)}
            placeholder="0.00"
          />
        </Field>
      </div>

      <Field label="Particulars">
        <input className={inp} value={form.description} onChange={e => set("description", e.target.value)} />
      </Field>

      {/* GST breakdown preview — Tax Invoice only */}
      {isTax && amt > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800 space-y-0.5">
          <p><span className="font-semibold">Base amount (excl. GST):</span> {fmt(base)}</p>
          {isInterState
            ? <p><span className="font-semibold">IGST @{GST_RATE}%:</span> {fmt(gst)}</p>
            : <>
                <p><span className="font-semibold">CGST @{GST_RATE / 2}%:</span> {fmt(half)}</p>
                <p><span className="font-semibold">SGST @{GST_RATE / 2}%:</span> {fmt(half)}</p>
              </>
          }
          <p className="font-semibold pt-0.5">
            Tax type:{" "}
            {isInterState
              ? `IGST — client state "${form.state || "?"}" ≠ company state "${co.state}"`
              : `CGST + SGST — same state: ${co.state}`}
          </p>
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={onGenerate}
          disabled={!form.amount || Number(form.amount) <= 0}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Generate Invoice
        </button>
      </div>
    </div>
  );
}

// ── Preview step ─────────────────────────────────────────────────────────────
function PreviewStep({
  form, isTax, clientId, co, onBack,
}: {
  form: Record<string, string>;
  isTax: boolean;
  clientId: string;
  co: CompanySettings;
  onBack: () => void;
}) {
  const [sending, setSending] = useState(false);
  const [toast,   setToast]   = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [email,   setEmail]   = useState(form.email);

  async function sendInvoice() {
    setSending(true); setToast(null);
    try {
      await api.post(`/clients/${clientId}/invoice`, {
        ...form,
        email,
        invoice_type: isTax ? "tax" : "invoice",
      });
      setToast({ type: "success", msg: `Invoice sent to ${email}` });
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? "Failed to send invoice.";
      setToast({ type: "error", msg });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Action bar — screen only */}
      <div className="print:hidden flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Edit
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <input
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Recipient email…"
          />
          <button
            onClick={sendInvoice}
            disabled={sending}
            className="flex items-center gap-2 bg-orange-500 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-60 transition-colors"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? "Sending…" : "Email"}
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-800 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      {toast && (
        <div className={`print:hidden flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${
          toast.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {toast.type === "success"
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      <InvoiceTemplate form={form} isTax={isTax} co={co} />
    </div>
  );
}

// ── Page inner ───────────────────────────────────────────────────────────────
interface Client {
  client_id: number;
  first_name: string; middle_name?: string; last_name: string;
  email: string; mobile: string; country_code: string;
}
interface MembershipList {
  memberships: { membership_number: string; payment_mode: string }[];
}
interface ClientAddress {
  primary_address?: string | null;
  primary_state?: string | null;
  primary_pincode?: string | null;
}

const CO_DEFAULTS: CompanySettings = {
  name: "Arena International Holidays",
  address: "101, Pratap Nagar, Mayur Vihar, Phase-1 Delhi-110091",
  state: "Delhi",
  gst_number: "",
  phone: "",
  email: "",
};

function InvoicePageInner() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const id           = params.id as string;
  const isTax        = searchParams.get("type") === "tax";

  const [loading, setLoading] = useState(true);
  const [step,    setStep]    = useState<"form" | "preview">("form");
  const [co,      setCo]      = useState<CompanySettings>(CO_DEFAULTS);

  const [form, setForm] = useState<Record<string, string>>({
    invoice_no: "", issue_date: new Date().toISOString().slice(0, 10),
    client_name: "", card_number: "", email: "", phone: "",
    address: "", state: "",
    payment_mode: "ONLINE", payment_type: "Debit Card",
    transaction_id: "", bank: "", card_cheque_no: "",
    amount: "",
    description: "Holiday Package (Sheet Attached For Details)",
    client_gst: "",
    company_gst: "",
  });

  // Reset to form whenever the invoice type toggles
  useEffect(() => { setStep("form"); }, [isTax]);

  useEffect(() => {
    const load = async () => {
      try {
        // Each fetch is independent — a failed address/payment fetch won't blank the client fields
        const safe = <T,>(p: Promise<T>) => p.catch(() => null);

        const [cr, mr, ar, coRes] = await Promise.all([
          safe(api.get<{ data: Client }>(`/clients/${id}`)),
          safe(api.get<{ data: MembershipList }>(`/memberships?client_id=${id}&limit=1`)),
          safe(api.get<{ data: ClientAddress | null }>(`/clients/${id}/address`)),
          safe(api.get<{ data: CompanySettings }>(`/settings/company`)),
        ]);

        if (coRes?.data) setCo(coRes.data);

        const c    = (cr as { data?: Client } | null)?.data;
        const mem  = (mr as { data?: MembershipList } | null)?.data?.memberships?.[0];
        const addr = (ar as { data?: ClientAddress | null } | null)?.data;

        if (c) {
          const name      = [c.first_name, c.middle_name, c.last_name].filter(Boolean).join(" ");
          const addrParts = [addr?.primary_address, addr?.primary_pincode].filter(Boolean);
          const addrStr   = addrParts.join(", ");

          setForm(f => ({
            ...f,
            invoice_no:  genInvoiceNo(c.client_id),
            client_name: name,
            card_number: mem?.membership_number ?? "",
            email:       c.email,
            phone:       `${c.country_code} ${c.mobile}`,
            address:     addrStr,
            state:       addr?.primary_state ?? "",
            company_gst: coRes?.data?.gst_number ?? "",
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Top bar */}
      <div className="print:hidden flex items-center gap-3">
        {step === "form" && (
          <Link href={`/admin/clients/${id}`} className="text-slate-400 hover:text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">
            {isTax ? "Tax Invoice" : "Invoice"}
          </h1>
        </div>
        {/* Type toggle only shown on the form step */}
        {step === "form" && (
          <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm">
            <Link
              href={`/admin/clients/${id}/invoice?type=invoice`}
              className={`px-4 py-2 font-medium transition-colors ${!isTax ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              Invoice
            </Link>
            <Link
              href={`/admin/clients/${id}/invoice?type=tax`}
              className={`px-4 py-2 font-medium border-l border-slate-300 transition-colors ${isTax ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              Tax Invoice
            </Link>
          </div>
        )}
      </div>

      {step === "form" ? (
        <FormStep
          form={form}
          setForm={setForm}
          isTax={isTax}
          clientId={id}
          co={co}
          onGenerate={() => setStep("preview")}
        />
      ) : (
        <PreviewStep
          form={form}
          isTax={isTax}
          clientId={id}
          co={co}
          onBack={() => setStep("form")}
        />
      )}
    </div>
  );
}

// ── Export with Suspense (required for useSearchParams) ──────────────────────
export default function InvoicePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    }>
      <InvoicePageInner />
    </Suspense>
  );
}
