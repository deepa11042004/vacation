"use client";

import { useState, useEffect } from "react";
import { Ticket, Clock, Download, MapPin, Loader2 } from "lucide-react";
import { memberApi } from "@/lib/member-api";

interface Voucher {
  voucher_id: number;
  voucher_number: string;
  benefit: string;
  status: "ACTIVE" | "REDEEMED" | "EXPIRED";
  issue_date: string;
  expiry_date: string;
  validity: string;
  locations: string[];
}

const STATUS_STYLES: Record<Voucher["status"], string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  REDEEMED: "bg-slate-200 text-slate-600",
  EXPIRED: "bg-rose-100 text-rose-600",
};

function fmt(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    memberApi
      .get<{ success: boolean; data: { vouchers: Voucher[] } }>("/vouchers/my")
      .then((res) => {
        if (res?.success) setVouchers(Array.isArray(res.data?.vouchers) ? res.data.vouchers : []);
        else setError("Failed to load vouchers.");
      })
      .catch(() => setError("Failed to load vouchers."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const activeCount = vouchers.filter((v) => v.status === "ACTIVE").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2 flex items-center gap-3">
          My Vouchers
          {activeCount > 0 && (
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">{activeCount} Active</span>
          )}
        </h2>
        <p className="text-slate-500 max-w-2xl">Gift vouchers issued to you by Mandarine Worldwide Vacations.</p>
      </div>

      {error ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <p className="text-slate-500">{error}</p>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-4">
            <Ticket className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1 font-marcellus">No vouchers yet</h3>
          <p className="text-sm text-slate-500">Vouchers issued to you will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vouchers.map((v) => (
            <div key={v.voucher_id} className="bg-white rounded-3xl border border-slate-300 overflow-hidden flex flex-col">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="relative z-10 flex items-start justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[v.status]}`}>
                    {v.status}
                  </span>
                  <Ticket className="w-6 h-6 text-white/80" />
                </div>
                <h3 className="relative z-10 mt-4 text-xl font-bold font-marcellus">{v.benefit}</h3>
                <p className="relative z-10 mt-1 font-mono text-sm tracking-wider text-white/90">{v.voucher_number}</p>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-400 uppercase tracking-wider mb-0.5">Issued</p>
                    <p className="text-slate-800 font-medium text-sm">{fmt(v.issue_date)}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Valid until
                    </p>
                    <p className="text-slate-800 font-medium text-sm">{fmt(v.expiry_date)}</p>
                  </div>
                </div>

                {Array.isArray(v.locations) && v.locations.length > 0 && (
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                    <span>{v.locations.join(", ")}</span>
                  </div>
                )}

                <a
                  href={`/api/vouchers/download/${encodeURIComponent(v.voucher_number)}`}
                  className="mt-auto w-full flex items-center justify-center gap-2 py-3 bg-black text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Voucher
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
