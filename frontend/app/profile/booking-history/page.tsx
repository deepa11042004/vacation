"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Moon, ChevronRight, Search, Filter, Loader2 } from "lucide-react";
import { memberApi, getStoredMemberUser } from "@/lib/member-api";

interface Booking {
  booking_id: number;
  hotel_name: string;
  hotel_address?: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  status?: string | null;
  confirmation_number?: string | null;
  room_category?: string | null;
  no_of_adults?: number | null;
  children?: number | null;
  night_type?: string | null;
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function statusColor(status?: string | null) {
  switch ((status ?? "").toUpperCase()) {
    case "UPCOMING": case "CONFIRMED": return "bg-blue-100 text-blue-700 border-blue-200";
    case "COMPLETED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "CANCELLED": return "bg-rose-100 text-rose-700 border-rose-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

const FILTERS = ["All", "Upcoming", "Completed", "Cancelled"];

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const user = getStoredMemberUser<{ client_id?: number | null }>();
    const clientId = user?.client_id;
    if (!clientId) { setError("No client account linked."); setLoading(false); return; }

    memberApi.get<{ success: boolean; data: { bookings: Booking[] } }>(`/clients/${clientId}/bookings`)
      .then((res) => {
        if (res?.success) setBookings(Array.isArray(res.data?.bookings) ? res.data.bookings : []);
        else setError("Failed to load bookings.");
      })
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  const filtered = bookings.filter((b) => {
    const matchFilter = activeFilter === "All" || (b.status ?? "").toUpperCase() === activeFilter.toUpperCase();
    const matchSearch = !search || b.hotel_name.toLowerCase().includes(search.toLowerCase()) || (b.hotel_address ?? "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">Booking History</h2>
          <p className="text-slate-500 max-w-2xl">View your hotel stays linked to your membership.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search stays..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeFilter === f ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {error ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-500">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No bookings found</h3>
            <p className="text-slate-500">You don&apos;t have any {activeFilter.toLowerCase()} bookings at the moment.</p>
          </div>
        ) : (
          filtered.map((b) => (
            <div key={b.booking_id}
              className="group bg-white rounded-3xl p-4 md:p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-blue-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                      <div>
                        {b.hotel_address && (
                          <div className="flex items-center text-sm text-slate-500 font-medium mb-1">
                            <MapPin className="w-3.5 h-3.5 mr-1" />{b.hotel_address}
                          </div>
                        )}
                        <h3 className="text-2xl font-bold text-slate-800 font-marcellus leading-tight">{b.hotel_name}</h3>
                      </div>
                      <div className="text-left md:text-right flex md:flex-col items-center md:items-end gap-3">
                        {b.status && (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor(b.status)}`}>
                            {b.status}
                          </span>
                        )}
                        {b.confirmation_number && (
                          <p className="text-xs font-mono text-slate-500">Ref: {b.confirmation_number}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-600"><Calendar className="w-4 h-4" /></div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Dates</p>
                          <p className="text-sm font-bold text-slate-800">{fmt(b.check_in)} — {fmt(b.check_out)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-600"><Moon className="w-4 h-4" /></div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Nights Used</p>
                          <p className="text-sm font-bold text-slate-800">{b.nights} Nights</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end justify-end gap-4 mt-6 pt-6 border-t border-slate-100">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-1 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-sm group/btn">
                      View Details
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
