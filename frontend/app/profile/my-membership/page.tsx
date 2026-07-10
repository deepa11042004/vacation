"use client";

import { useState, useEffect } from "react";
import { CreditCard, Calendar, Moon, Award, Briefcase, Loader2 } from "lucide-react";
import { memberApi, getStoredMemberUser } from "@/lib/member-api";

interface Membership {
  membership_id: number;
  membership_number: string;
  package_name?: string | null;
  status: string;
  sale_date?: string | null;
  end_date?: string | null;
  validity_years?: number | null;
  nights_per_year?: number | null;
  nights_remaining?: number | null;
  total_price?: number | null;
  discount_amount?: number | null;
  net_price?: number | null;
  outstanding_balance?: number | null;
  dsa?: string | null;
  sales_consultant?: string | null;
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function currency(val?: number | null) {
  if (val == null) return "—";
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function MyMembershipPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredMemberUser<{ client_id?: number | null }>();
    const clientId = user?.client_id;
    if (!clientId) { setError("No client account linked."); setLoading(false); return; }

    memberApi.get<{ success: boolean; data: Membership[] }>(`/clients/${clientId}/memberships`)
      .then((res) => {
        if (res?.success) setMemberships(Array.isArray(res.data) ? res.data : []);
        else setError("Failed to load membership.");
      })
      .catch(() => setError("Failed to load membership."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  if (error || memberships.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">My Membership</h2>
          <p className="text-slate-500">View your membership details, available nights, and financial summary.</p>
        </div>
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{error || "No membership found."}</p>
        </div>
      </div>
    );
  }

  const m = memberships[0];
  const nightsPerYear = m.nights_per_year ?? 0;
  const nightsRemaining = m.nights_remaining ?? 0;
  const nightsUsed = nightsPerYear - nightsRemaining;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">My Membership</h2>
        <p className="text-slate-500 max-w-2xl">View your membership details, available nights, and financial summary.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Card */}
          <div className="bg-black rounded-3xl p-8 text-white shadow-2xl shadow-slate-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="relative z-10 flex flex-col min-h-50 justify-between">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">PELTOWN VACATIONS</p>
                  <h3 className="text-xl font-marcellus text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-yellow-500">
                    {m.package_name ?? "Membership"}
                  </h3>
                </div>
                <Award className="w-8 h-8 text-amber-400 opacity-80" />
              </div>
              <div>
                <p className="font-mono text-lg tracking-widest text-white/90 mb-4">{m.membership_number}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Valid Thru</p>
                    <p className="text-sm font-medium">{fmt(m.end_date)}</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase rounded-full">
                    {m.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nights */}
          {nightsPerYear > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
              <h4 className="text-lg font-bold text-slate-800 font-marcellus mb-6 flex items-center gap-2">
                <Moon className="w-5 h-5 text-blue-600" /> Nights Overview
              </h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Nights Remaining this year</span>
                    <span className="text-slate-800 font-bold">{nightsRemaining} / {nightsPerYear}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${nightsPerYear > 0 ? (nightsRemaining / nightsPerYear) * 100 : 0}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Entitled</p>
                    <p className="text-xl font-bold text-slate-800">{nightsPerYear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Used</p>
                    <p className="text-xl font-bold text-slate-800">{nightsUsed}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Term & Validity */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Calendar className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold text-slate-800 font-marcellus">Term & Validity</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Sale Date</p>
                <p className="font-semibold text-slate-800">{fmt(m.sale_date)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">End Date</p>
                <p className="font-semibold text-slate-800">{fmt(m.end_date)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Validity</p>
                <p className="font-semibold text-slate-800">{m.validity_years ? `${m.validity_years} Years` : "—"}</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><CreditCard className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold text-slate-800 font-marcellus">Financial Summary</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <p className="text-sm text-slate-500">Total Price</p>
                <p className="font-semibold text-slate-800">{currency(m.total_price)}</p>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <p className="text-sm text-slate-500">Discount</p>
                <p className="font-semibold text-emerald-600">{currency(m.discount_amount)}</p>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <p className="text-sm text-slate-500">Net Price</p>
                <p className="font-semibold text-slate-800">{currency(m.net_price)}</p>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <p className="text-sm text-slate-500 font-medium">Outstanding Balance</p>
                <p className={`font-bold ${m.outstanding_balance ? "text-rose-600" : "text-emerald-600"}`}>
                  {currency(m.outstanding_balance)}
                </p>
              </div>
            </div>
          </div>

          {/* Account Management */}
          {(m.dsa || m.sales_consultant) && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl"><Briefcase className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold text-slate-800 font-marcellus">Account Management</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {m.dsa && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">DSA</p>
                    <p className="font-semibold text-slate-800">{m.dsa}</p>
                  </div>
                )}
                {m.sales_consultant && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sales Consultant</p>
                    <p className="font-semibold text-slate-800">{m.sales_consultant}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
