"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { ArrowLeft, Loader2, Send, CheckCircle, AlertCircle } from "lucide-react";

interface Client {
  client_id: number; client_code: string;
  title?: string; first_name: string; middle_name?: string; last_name: string;
  email: string; mobile: string; country_code: string;
}

interface Membership {
  membership_number: string;
  package?: { name: string };
}

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

function genInvoiceNo(clientId: number) {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth() + 1;
  const fyS = m >= 4 ? y : y - 1;
  const fy = `${String(fyS).slice(2)}${String(fyS + 1).slice(2)}`;
  return `${fy}/${String(clientId).padStart(3, "0")}`;
}

export default function InvoicePage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  const [form, setForm] = useState({
    invoice_no: "", issue_date: new Date().toISOString().slice(0, 10),
    client_name: "", card_number: "", email: "", phone: "", address: "",
    payment_mode: "CASH", payment_type: "Cash",
    transaction_id: "", bank: "", card_cheque_no: "",
    amount: "", description: "Holiday Package (Sheet Attached For Details)", state: "",
  });

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function sendInvoice() {
    if (!form.amount || Number(form.amount) <= 0) {
      setToast({ type: "error", msg: "Please enter the payment amount." });
      return;
    }
    setSending(true);
    setToast(null);
    try {
      await api.post(`/clients/${id}/invoice`, form);
      setToast({ type: "success", msg: `Invoice sent to ${form.email}` });
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? "Failed to send invoice.";
      setToast({ type: "error", msg });
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    Promise.all([
      api.get<{ data: Client }>(`/clients/${id}`),
      api.get<{ data: { memberships: Membership[] } }>(`/memberships?client_id=${id}&limit=1`),
    ]).then(([cr, mr]) => {
      const c = cr?.data;
      const mem: Membership | undefined = mr?.data?.memberships?.[0];
      if (c) {
        setClient(c);
        const name = [c.title, c.first_name, c.middle_name, c.last_name].filter(Boolean).join(" ");
        setForm(f => ({
          ...f,
          invoice_no: genInvoiceNo(c.client_id),
          client_name: name,
          card_number: mem?.membership_number ?? c.client_code,
          email: c.email,
          phone: `${c.country_code} ${c.mobile}`,
        }));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {/* ── FORM (hidden when printing) ─────────────────────── */}
      <div className="print:hidden max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin/clients" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Generate Invoice</h1>
            {client && (
              <p className="text-sm text-slate-500">
                {client.first_name} {client.last_name} &middot; {client.client_code}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">

          {/* Row 1 — Invoice No + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Invoice No</label>
              <input className={inp} value={form.invoice_no} onChange={e => set("invoice_no", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Invoice Issue Date</label>
              <input type="date" className={inp} value={form.issue_date} onChange={e => set("issue_date", e.target.value)} />
            </div>
          </div>

          {/* Row 2 — Name + Card */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Client&apos;s Name</label>
              <input className={inp} value={form.client_name} onChange={e => set("client_name", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Client&apos;s Card Number</label>
              <input className={`${inp} bg-slate-50`} value={form.card_number} onChange={e => set("card_number", e.target.value)} />
            </div>
          </div>

          {/* Row 3 — Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <input className={inp} value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number</label>
              <input className={inp} value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address</label>
            <textarea rows={2} className={`${inp} resize-none`} value={form.address} onChange={e => set("address", e.target.value)} placeholder="Full address…" />
          </div>

          <hr className="border-slate-200" />
          <p className="text-sm font-semibold text-slate-700">Payment Details</p>

          {/* Payment Row 1 — Mode + Type + Txn */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment Mode</label>
              <select className={inp} value={form.payment_mode} onChange={e => set("payment_mode", e.target.value)}>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="ONLINE">Online / Razorpay</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CARD">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment Type</label>
              <select className={inp} value={form.payment_type} onChange={e => set("payment_type", e.target.value)}>
                <option>Cash</option>
                <option>Debit Card</option>
                <option>Credit Card</option>
                <option>Cheque</option>
                <option>UPI</option>
                <option>NEFT / RTGS</option>
                <option>Demand Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Transaction ID</label>
              <input className={inp} value={form.transaction_id} onChange={e => set("transaction_id", e.target.value)} placeholder="NONE" />
            </div>
          </div>

          {/* Payment Row 2 — Bank + Card/Cheque No + Amount */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bank</label>
              <input className={inp} value={form.bank} onChange={e => set("bank", e.target.value)} placeholder="Bank name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cheque / Credit Card / Debit Card No.</label>
              <input className={inp} value={form.card_cheque_no} onChange={e => set("card_cheque_no", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Amount (₹)</label>
              <input type="number" className={inp} value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0.00" />
            </div>
          </div>

          {/* Payment Row 3 — Description + State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment type</label>
              <input className={inp} value={form.description} onChange={e => set("description", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">State</label>
              <input className={inp} value={form.state} onChange={e => set("state", e.target.value)} placeholder="State" />
            </div>
          </div>

          <hr className="border-slate-200" />

          {toast && (
            <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${
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

          <button
            onClick={sendInvoice}
            disabled={sending}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? "Sending…" : "Send Invoice to Client"}
          </button>
        </div>
      </div>

    </>
  );
}
