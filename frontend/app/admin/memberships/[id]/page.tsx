"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import { ArrowLeft, Loader2, Plus, AlertTriangle } from "lucide-react";

interface Membership {
  membership_id: number; membership_number: string; status: string;
  sale_date: string; start_date: string; end_date: string;
  total_price: number; discount_amount: number; net_price: number;
  down_payment: number; outstanding_balance: number; payment_mode: string;
  nights_remaining: number; nights_per_year: number;
  dsa?: string; reference_by?: string; cancellation_reason?: string; remarks?: string;
  client?: { client_id: number; client_code: string; first_name: string; last_name: string; email: string; mobile: string };
  package?: { name: string; category: string; unit_type: string; validity_years?: number; total_nights?: number };
}

interface Payment {
  payment_id: number; payment_number: string; payment_type: string;
  amount: number; payment_date: string; payment_mode: string; status: string;
  transaction_ref?: string; bank_name?: string; remarks?: string;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700", SUSPENDED: "bg-amber-50 text-amber-700",
  CANCELLED: "bg-red-50 text-red-600", EXPIRED: "bg-slate-100 text-slate-500",
};
const PAY_COLORS: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700", CANCELLED: "bg-red-50 text-red-600", PENDING: "bg-amber-50 text-amber-700",
};
const TYPE_COLORS: Record<string, string> = {
  DOWN_PAYMENT: "bg-blue-50 text-blue-700", INSTALMENT: "bg-indigo-50 text-indigo-700",
  AMC: "bg-violet-50 text-violet-700", PENALTY: "bg-orange-50 text-orange-700", REFUND: "bg-rose-50 text-rose-700",
};

function Badge({ value, map }: { value: string; map: Record<string, string> }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[value] ?? "bg-slate-100 text-slate-500"}`}>{value}</span>;
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return <div className="flex gap-2 py-1"><span className="text-slate-400 text-xs w-40 shrink-0">{label}</span><span className="text-slate-700 text-sm">{value}</span></div>;
}

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const sel = `${inp} bg-white`;

const EMPTY_PAY = { payment_type: "INSTALMENT", amount: "", payment_date: "", due_date: "", payment_mode: "CASH", transaction_ref: "", bank_name: "", status: "PAID", remarks: "" };

export default function MembershipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [payments, setPayments]     = useState<Payment[]>([]);
  const [loading, setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErr, setActionErr]   = useState("");

  // Add Payment modal
  const [showPay, setShowPay]     = useState(false);
  const [payForm, setPayForm]     = useState({ ...EMPTY_PAY });
  const [paySaving, setPaySaving] = useState(false);
  const [payErr, setPayErr]       = useState("");

  // Cancel reason
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  function loadData() {
    Promise.all([
      api.get<{ data: Membership }>(`/memberships/${id}`),
      api.get<{ data: { payments: Payment[] } | Payment[] }>(`/memberships/${id}/payments`),
    ]).then(([m, p]) => {
      setMembership(m?.data ?? null);
      const raw = p?.data as any;
      setPayments(Array.isArray(raw) ? raw : (raw?.payments ?? []));
      setLoading(false);
    });
  }

  useEffect(() => { loadData(); }, [id]);

  async function doAction(endpoint: string, body?: object) {
    setActionLoading(true); setActionErr("");
    const res = await api.post<{ success: boolean; message?: string }>(`/memberships/${id}/${endpoint}`, body ?? {});
    setActionLoading(false);
    if (res?.success) loadData();
    else setActionErr(res?.message ?? "Action failed.");
  }

  async function handleCancel() {
    if (!cancelReason.trim()) return;
    await doAction("cancel", { cancellation_reason: cancelReason });
    setShowCancel(false); setCancelReason("");
  }

  async function savePayment() {
    if (!payForm.amount || !payForm.payment_date || !payForm.payment_type || !payForm.payment_mode) {
      setPayErr("Amount, date, type and mode are required."); return;
    }
    if (!membership) return;
    setPaySaving(true); setPayErr("");
    const payload: Record<string, string | number> = {
      membership_id: Number(id),
      client_id: membership.client?.client_id ?? 0,
      payment_type: payForm.payment_type,
      amount: Number(payForm.amount),
      payment_date: payForm.payment_date,
      payment_mode: payForm.payment_mode,
      status: payForm.status,
    };
    if (payForm.due_date)       payload.due_date = payForm.due_date;
    if (payForm.transaction_ref) payload.transaction_ref = payForm.transaction_ref;
    if (payForm.bank_name)      payload.bank_name = payForm.bank_name;
    if (payForm.remarks)        payload.remarks = payForm.remarks;
    const res = await api.post<{ success: boolean; message?: string }>("/payments", payload);
    setPaySaving(false);
    if (res?.success) { setShowPay(false); setPayForm({ ...EMPTY_PAY }); loadData(); }
    else setPayErr(res?.message ?? "Failed to record payment.");
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  if (!membership) return <p className="text-slate-500">Membership not found.</p>;

  const m = membership;
  const paidAmount = Number(m.net_price) - Number(m.outstanding_balance);

  return (
    <div className="space-y-5 max-w-5xl">
      <Link href="/admin/memberships" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Back to Memberships
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 font-mono">{m.membership_number}</h2>
              <Badge value={m.status} map={STATUS_COLORS} />
            </div>
            <p className="text-slate-400 text-sm mt-1">
              <Link href={`/admin/clients/${m.client?.client_id}`} className="text-blue-600 hover:underline">
                {m.client?.first_name} {m.client?.last_name} ({m.client?.client_code})
              </Link>
            </p>
          </div>

          {/* Status Actions */}
          <div className="flex flex-col items-end gap-2">
            {m.status === "ACTIVE" && (
              <button onClick={() => doAction("suspend")} disabled={actionLoading}
                className="px-3 py-1.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 disabled:opacity-60">
                Suspend
              </button>
            )}
            {m.status === "SUSPENDED" && (
              <button onClick={() => doAction("reactivate")} disabled={actionLoading}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 disabled:opacity-60">
                Reactivate
              </button>
            )}
            {m.status !== "CANCELLED" && (
              <button onClick={() => { setCancelReason(""); setShowCancel(true); }} disabled={actionLoading}
                className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-60">
                Cancel Membership
              </button>
            )}
            {actionLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
          </div>
        </div>

        {actionErr && <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{actionErr}</p>}

        {/* Financial Summary */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Net Price",   value: `₹${Number(m.net_price).toLocaleString()}`,            color: "bg-slate-50" },
            { label: "Paid",        value: `₹${paidAmount.toLocaleString()}`,                      color: "bg-emerald-50" },
            { label: "Outstanding", value: `₹${Number(m.outstanding_balance).toLocaleString()}`,   color: "bg-red-50" },
          ].map(c => (
            <div key={c.label} className={`${c.color} rounded-lg p-4`}>
              <p className="text-xs text-slate-500 font-medium">{c.label}</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Package</p>
            <InfoRow label="Package Name"    value={m.package?.name} />
            <InfoRow label="Category"        value={m.package?.category} />
            <InfoRow label="Unit Type"       value={m.package?.unit_type} />
            <InfoRow label="Nights Remaining" value={`${m.nights_remaining} / ${m.nights_per_year} per yr`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Details</p>
            <InfoRow label="Sale Date"    value={new Date(m.sale_date).toLocaleDateString()} />
            <InfoRow label="Start Date"   value={new Date(m.start_date).toLocaleDateString()} />
            <InfoRow label="End Date"     value={new Date(m.end_date).toLocaleDateString()} />
            <InfoRow label="Total Price"  value={`₹${Number(m.total_price).toLocaleString()}`} />
            <InfoRow label="Discount"     value={Number(m.discount_amount) > 0 ? `₹${Number(m.discount_amount).toLocaleString()}` : null} />
            <InfoRow label="Down Payment" value={Number(m.down_payment) > 0 ? `₹${Number(m.down_payment).toLocaleString()}` : null} />
            <InfoRow label="Payment Mode" value={m.payment_mode} />
            <InfoRow label="DSA"          value={m.dsa} />
            <InfoRow label="Reference By" value={m.reference_by} />
            {m.cancellation_reason && <InfoRow label="Cancellation Reason" value={m.cancellation_reason} />}
            <InfoRow label="Remarks"      value={m.remarks} />
          </div>
        </div>
      </div>

      {/* Payments */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm">Payment History ({payments.length})</h2>
          {m.status !== "CANCELLED" && (
            <button onClick={() => { setPayForm({ ...EMPTY_PAY }); setPayErr(""); setShowPay(true); }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-3 h-3" /> Add Payment
            </button>
          )}
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>{["Pay No.", "Type", "Amount", "Date", "Mode", "Ref / Bank", "Status"].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payments.length === 0 && <tr><td colSpan={7} className="text-center text-slate-400 py-8">No payments yet</td></tr>}
            {payments.map(p => (
              <tr key={p.payment_id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.payment_number}</td>
                <td className="px-4 py-3"><Badge value={p.payment_type} map={TYPE_COLORS} /></td>
                <td className="px-4 py-3 font-semibold text-slate-800">₹{Number(p.amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{new Date(p.payment_date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-slate-600 text-xs">{p.payment_mode}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{[p.transaction_ref, p.bank_name].filter(Boolean).join(" / ") || "—"}</td>
                <td className="px-4 py-3"><Badge value={p.status} map={PAY_COLORS} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal */}
      <Modal open={showPay} onClose={() => setShowPay(false)} title="Add Payment">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Type <span className="text-red-500">*</span></label>
              <select className={sel} value={payForm.payment_type} onChange={e => setPayForm(f => ({ ...f, payment_type: e.target.value }))}>
                {["DOWN_PAYMENT","INSTALMENT","AMC","PENALTY","REFUND"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select className={sel} value={payForm.status} onChange={e => setPayForm(f => ({ ...f, status: e.target.value }))}>
                <option value="PAID">PAID</option><option value="PENDING">PENDING</option>
              </select>
            </div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Amount (₹) <span className="text-red-500">*</span></label><input type="number" className={inp} value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} placeholder={`Max ₹${Number(m.outstanding_balance).toLocaleString()}`} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Payment Date <span className="text-red-500">*</span></label><input type="date" className={inp} value={payForm.payment_date} onChange={e => setPayForm(f => ({ ...f, payment_date: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label><input type="date" className={inp} value={payForm.due_date} onChange={e => setPayForm(f => ({ ...f, due_date: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Payment Mode <span className="text-red-500">*</span></label>
              <select className={sel} value={payForm.payment_mode} onChange={e => setPayForm(f => ({ ...f, payment_mode: e.target.value }))}>
                {["CASH","CHEQUE","ONLINE","BANK_TRANSFER","CARD"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Transaction Ref / Cheque No.</label><input className={inp} value={payForm.transaction_ref} onChange={e => setPayForm(f => ({ ...f, transaction_ref: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Bank Name</label><input className={inp} value={payForm.bank_name} onChange={e => setPayForm(f => ({ ...f, bank_name: e.target.value }))} /></div>
          </div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Remarks</label><textarea rows={2} className={inp} value={payForm.remarks} onChange={e => setPayForm(f => ({ ...f, remarks: e.target.value }))} /></div>
          <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-700">
            Outstanding balance: <strong>₹{Number(m.outstanding_balance).toLocaleString()}</strong>
          </div>
        </div>
        {payErr && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{payErr}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowPay(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={savePayment} disabled={paySaving} className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
            {paySaving && <Loader2 className="w-4 h-4 animate-spin" />} Record Payment
          </button>
        </div>
      </Modal>

      {/* Cancel Membership Modal */}
      <Modal open={showCancel} onClose={() => setShowCancel(false)} title="Cancel Membership" size="sm">
        <div className="flex items-start gap-3 mb-4 bg-red-50 rounded-lg p-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">This action is irreversible. The membership will be permanently cancelled.</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Cancellation Reason <span className="text-red-500">*</span></label>
          <textarea rows={3} className={inp} value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Enter reason for cancellation…" />
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowCancel(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Go Back</button>
          <button onClick={handleCancel} disabled={!cancelReason.trim() || actionLoading}
            className="px-5 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60 flex items-center gap-2">
            {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />} Confirm Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
