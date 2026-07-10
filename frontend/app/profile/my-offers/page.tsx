"use client";

import { useState, useEffect } from "react";
import { Gift, Sparkles, Clock, ArrowRight, Loader2 } from "lucide-react";
import { memberApi, getStoredMemberUser } from "@/lib/member-api";

interface Offer {
  offer_id: number;
  offer_name: string;
  valid_until?: string | null;
  is_redeemed?: boolean;
  created_at?: string | null;
}

const BANNER_COLORS = [
  "from-blue-600 to-indigo-600",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-600",
];

function fmt(dateStr?: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredMemberUser<{ client_id?: number | null }>();
    const clientId = user?.client_id;
    if (!clientId) { setError("No client account linked."); setLoading(false); return; }

    memberApi.get<{ success: boolean; data: { offers: Offer[] } }>(`/clients/${clientId}/offers`)
      .then((res) => {
        if (res?.success) setOffers(Array.isArray(res.data?.offers) ? res.data.offers : []);
        else setError("Failed to load offers.");
      })
      .catch(() => setError("Failed to load offers."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2 flex items-center gap-3">
            My Offers
            {offers.length > 0 && (
              <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-bold">{offers.length} Active</span>
            )}
          </h2>
          <p className="text-slate-500 max-w-2xl">Exclusive promotions and special offers attached to your membership.</p>
        </div>
      </div>

      {error ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <p className="text-slate-500">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {offers.map((offer, idx) => {
            const validity = fmt(offer.valid_until);
            return (
              <div key={offer.offer_id} className="group bg-white rounded-3xl border border-slate-300 overflow-hidden transition-all duration-300 flex flex-col">
                <div className={`h-32 bg-linear-to-r ${BANNER_COLORS[idx % BANNER_COLORS.length]} relative overflow-hidden p-6 text-white flex flex-col justify-between`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
                      {offer.is_redeemed ? "Redeemed" : "Active"}
                    </span>
                    <Gift className="w-6 h-6 text-white/80" />
                  </div>
                  <h3 className="relative z-10 text-xl font-bold font-marcellus truncate">{offer.offer_name}</h3>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mt-auto space-y-4">
                    {validity && (
                      <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                        Valid until {validity}
                      </div>
                    )}
                    {!offer.is_redeemed && (
                      <button className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white font-medium rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                        Claim Offer
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                    {offer.is_redeemed && (
                      <div className="w-full flex items-center justify-center py-3 bg-slate-100 text-slate-500 font-medium rounded-xl text-sm">
                        Already Redeemed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 flex flex-col items-center justify-center text-center min-h-48">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 font-marcellus">More offers coming soon</h3>
            <p className="text-sm text-slate-500 max-w-48">Check back later for seasonal discounts and exclusive partner deals.</p>
          </div>
        </div>
      )}
    </div>
  );
}
