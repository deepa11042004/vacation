"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Gift, Copy, Check, ArrowRight, Loader2, UserPlus } from "lucide-react";
import { memberApi, getStoredMemberUser } from "@/lib/member-api";

interface ReferralClient {
  client_id: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  mobile?: string | null;
}

interface Referral {
  membership_id: number;
  membership_number: string;
  status: string;
  sale_date?: string | null;
  client: ReferralClient | null;
}

interface ReferralsResponse {
  referrals: Referral[];
  total_referrals: number;
  points_per_referral: number;
  total_points: number;
}

interface MeResponse {
  membership?: { membership_number: string; status: string } | null;
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function statusColor(status?: string | null) {
  switch ((status ?? "").toUpperCase()) {
    case "ACTIVE": return "bg-emerald-100 text-emerald-700";
    case "SUSPENDED": return "bg-amber-100 text-amber-700";
    case "CANCELLED": return "bg-rose-100 text-rose-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

export default function ReferralsPage() {
  const router = useRouter();
  const [data, setData] = useState<ReferralsResponse | null>(null);
  const [membershipNumber, setMembershipNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = getStoredMemberUser<{ client_id?: number | null }>();
    const clientId = user?.client_id;
    if (!clientId) { setError("No client account linked."); setLoading(false); return; }

    Promise.all([
      memberApi.get<{ success: boolean; data: ReferralsResponse }>(`/clients/${clientId}/referrals`),
      memberApi.get<{ success: boolean; data: MeResponse }>("/auth/me"),
    ])
      .then(([referralsRes, meRes]) => {
        if (referralsRes?.success) setData(referralsRes.data);
        else setError("Failed to load referrals.");
        if (meRes?.success) setMembershipNumber(meRes.data?.membership?.membership_number ?? "");
      })
      .catch(() => setError("Failed to load referrals."))
      .finally(() => setLoading(false));
  }, []);

  function handleCopy() {
    if (!membershipNumber) return;
    navigator.clipboard.writeText(membershipNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">Referrals</h2>
        <p className="text-slate-500 max-w-2xl">
          Invite friends and family using your membership card number and earn points for every successful referral.
        </p>
      </div>

      {error ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <p className="text-slate-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Points Card */}
            <div className="lg:col-span-1 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wider">Referral Points</p>
                <h3 className="text-4xl font-bold font-marcellus mb-4">{(data?.total_points ?? 0).toLocaleString("en-IN")}</h3>
                <p className="text-sm text-blue-50 leading-relaxed mb-6">
                  You earn {data?.points_per_referral ?? 0} points for every friend who joins using your card number.
                </p>
                <button
                  onClick={() => router.push("/travel-desk")}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Redeem Points
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Share Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><UserPlus className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold text-slate-800 font-marcellus">Your Referral Card Number</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Share this number with friends and family. They can enter it as their referrer when they join, and you&apos;ll earn points once their membership is created.
              </p>
              {membershipNumber ? (
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="flex-1 font-mono text-lg font-bold text-slate-800 tracking-widest">{membershipNumber}</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No membership card number on file yet.</p>
              )}

              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Referrals</p>
                  <p className="text-2xl font-bold text-slate-800">{data?.total_referrals ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Points per Referral</p>
                  <p className="text-2xl font-bold text-slate-800">{data?.points_per_referral ?? 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Users className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold text-slate-800 font-marcellus">People You&apos;ve Referred</h3>
            </div>

            {!data || data.referrals.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-800 mb-2">No referrals yet</h4>
                <p className="text-slate-500">Share your card number above to start earning referral points.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {data.referrals.map((r) => {
                  const name = r.client ? [r.client.first_name, r.client.last_name].filter(Boolean).join(" ") : "Member";
                  return (
                    <div key={r.membership_id} className="p-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                          {name.charAt(0).toUpperCase() || "M"}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{name || "Member"}</h4>
                          <p className="text-xs font-mono text-slate-500 mt-0.5">{r.membership_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:gap-8 ml-15 md:ml-0">
                        <div className="text-sm text-slate-500">Joined {fmt(r.sale_date)}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
