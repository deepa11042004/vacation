"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, CalendarDays, CreditCard, Loader2 } from "lucide-react";
import { memberApi, getStoredMemberUser } from "@/lib/member-api";

interface AmcPayment {
  amc_payment_id: number;
  year_number: number;
  is_received: boolean;
  amount?: number | null;
  payment_date?: string | null;
  payment_mode?: string | null;
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function AmcStatusPage() {
  const [records, setRecords] = useState<AmcPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredMemberUser<{ client_id?: number | null }>();
    const clientId = user?.client_id;
    if (!clientId) { setError("No client account linked."); setLoading(false); return; }

    memberApi.get<{ success: boolean; data: { payments: AmcPayment[] } }>(`/clients/${clientId}/amc-payments`)
      .then((res) => {
        if (res?.success) setRecords(Array.isArray(res.data?.payments) ? res.data.payments : []);
        else setError("Failed to load AMC records.");
      })
      .catch(() => setError("Failed to load AMC records."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  const annualFee = records.find(r => r.amount != null)?.amount ?? null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">AMC Status</h2>
        <p className="text-slate-500 max-w-2xl">Track your Annual Maintenance Contract (AMC) payments and due dates.</p>
      </div>

      {error || records.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{error || "No AMC records found."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wider">Annual Fee</p>
                <h3 className="text-3xl font-bold font-marcellus mb-4">
                  {annualFee != null ? `₹${annualFee.toLocaleString("en-IN")}` : "—"}
                  <span className="text-lg text-blue-200 font-sans">/year</span>
                </h3>
                <p className="text-sm text-blue-50 leading-relaxed">
                  Your AMC covers maintenance ensuring quality for your membership stays.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
              <h3 className="text-xl font-bold text-slate-800 font-marcellus mb-8 border-b border-slate-100 pb-4">Payment Schedule</h3>
              <div className="space-y-8">
                {records.map((rec, idx) => (
                  <div key={rec.amc_payment_id} className="relative flex gap-6">
                    {idx !== records.length - 1 && (
                      <div className="hidden md:block absolute left-4.5 top-10 -bottom-8 w-px bg-slate-200"></div>
                    )}
                    <div className="shrink-0 relative z-10">
                      {rec.is_received ? (
                        <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                          <AlertCircle className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </div>

                    <div className={`flex-1 rounded-2xl border p-5 md:p-6 transition-all ${
                      rec.is_received ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100 bg-white shadow-sm"
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100/50">
                        <div>
                          <h4 className="text-lg font-bold text-slate-800">Year {rec.year_number}</h4>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            rec.is_received ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {rec.is_received ? "Received" : "Not Received"}
                          </span>
                        </div>
                        {rec.amount != null && (
                          <div className="text-left md:text-right">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Amount Due</p>
                            <p className="text-xl font-bold text-slate-800">₹{rec.amount.toLocaleString("en-IN")}</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded-lg"><CalendarDays className="w-4 h-4 text-slate-500" /></div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Payment Date</p>
                            <p className="text-sm font-semibold text-slate-700 mt-0.5">{fmt(rec.payment_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded-lg"><CreditCard className="w-4 h-4 text-slate-500" /></div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Payment Mode</p>
                            <p className="text-sm font-semibold text-slate-700 mt-0.5">{rec.payment_mode ?? "—"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
