"use client";

import { useState, useEffect } from "react";
import { CreditCard, Building, CalendarCheck, Loader2, IndianRupee } from "lucide-react";
import { memberApi, getStoredMemberUser } from "@/lib/member-api";

interface Payment {
  payment_id: number;
  payment_number: string;
  payment_type: string;
  payment_date?: string | null;
  amount: number;
  payment_mode: string;
  status: string;
  transaction_ref?: string | null;
  bank_name?: string | null;
  remarks?: string | null;
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

const modeIcons: Record<string, typeof CreditCard> = {
  CARD: CreditCard,
  BANK_TRANSFER: Building,
  CHEQUE: Building,
  ONLINE: CreditCard,
  CASH: IndianRupee,
};

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredMemberUser<{ client_id?: number | null }>();
    const clientId = user?.client_id;
    if (!clientId) { setError("No client account linked."); setLoading(false); return; }

    memberApi.get<{ success: boolean; data: { payments: Payment[]; total: number } }>(`/clients/${clientId}/payments`)
      .then((res) => {
        if (res?.success) setPayments(Array.isArray(res.data?.payments) ? res.data.payments : []);
        else setError("Failed to load payments.");
      })
      .catch(() => setError("Failed to load payments."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">Payment History</h2>
        <p className="text-slate-500 max-w-2xl">Track all your membership payments and EMIs.</p>
      </div>

      {error || payments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{error || "No payments found."}</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-slate-50 border-b border-slate-100 text-sm font-bold text-slate-600 uppercase tracking-wider">
            <div className="col-span-4 ml-5">Payment Details</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Mode</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
          </div>

          <div className="divide-y divide-slate-100">
            {payments.map((p) => {
              const Icon = modeIcons[p.payment_mode] ?? CreditCard;
              const isCompleted = p.status === "PAID" || p.status === "Completed";
              return (
                <div key={p.payment_id} className="p-6 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-slate-50/50 transition-colors flex flex-col gap-4">
                  <div className="col-span-4 flex items-start gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 capitalize">{p.payment_type.replace(/_/g, " ")}</h4>
                      <p className="text-xs font-mono text-slate-500 mt-1">Ref: {p.payment_number}</p>
                    </div>
                  </div>

                  <div className="col-span-2 flex md:block justify-between items-center">
                    <span className="md:hidden text-sm text-slate-500 font-medium">Date</span>
                    <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                      <CalendarCheck className="w-4 h-4 text-slate-400 md:hidden" />
                      {fmt(p.payment_date)}
                    </div>
                  </div>

                  <div className="col-span-2 flex md:block justify-between items-center">
                    <span className="md:hidden text-sm text-slate-500 font-medium">Mode</span>
                    <span className="text-sm text-slate-700 font-medium capitalize">{p.payment_mode.replace(/_/g, " ")}</span>
                  </div>

                  <div className="col-span-2 flex md:block justify-between items-center">
                    <span className="md:hidden text-sm text-slate-500 font-medium">Amount</span>
                    <span className="font-bold text-slate-800 text-lg md:text-base">₹{p.amount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="col-span-2 flex md:block justify-between items-center">
                    <span className="md:hidden text-sm text-slate-500 font-medium">Status</span>
                    <span className={`inline-flex px-3 py-1 text-xs font-bold uppercase rounded-full ${
                      isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
