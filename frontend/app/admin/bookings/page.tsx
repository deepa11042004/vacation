"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2, Search, ClipboardList, Download, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface SheetBooking {
  booking_id: number;
  booking_ref: string;
  confirmation_number?: string | null;
  client_id: number;
  client_name: string;
  client_email?: string | null;
  membership_number?: string | null;
  hotel_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  no_of_rooms: number;
  no_of_adults: number;
  children: number;
  night_type: string;
  booking_amount?: number | null;
  amount_paid_by_client: number;
  status: string;
  email_sent_at?: string | null;
}

const STATUS_FILTERS = [
  { value: "ACTIVE", label: "Confirmed & Completed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "ALL", label: "All" },
];

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-slate-200 text-slate-700",
  CANCELLED: "bg-red-100 text-red-600",
};

function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(`${String(d).slice(0, 10)}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtAmt(n?: number | string | null) {
  if (n === null || n === undefined || n === "") return "—";
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

const inp = "px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function BookingSheetPage() {
  const router = useRouter();
  const [rows, setRows] = useState<SheetBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("ACTIVE");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const limit = 20;

  const buildParams = useCallback((extra: Record<string, string> = {}) => {
    const p = new URLSearchParams({ status, ...extra });
    if (query) p.set("search", query);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    return p;
  }, [status, query, from, to]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<{ data: { bookings: SheetBooking[]; total: number } }>(
        `/bookings?${buildParams({ page: String(page), limit: String(limit) })}`,
      );
      setRows(res.data.bookings);
      setTotal(res.data.total);
    } catch (e) {
      setRows([]);
      setTotal(0);
      setError(e instanceof Error ? e.message : "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [buildParams, page]);

  useEffect(() => { load(); }, [load]);

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  function resetFilters() {
    setStatus("ACTIVE"); setFrom(""); setTo(""); setSearch(""); setQuery(""); setPage(1);
  }

  // Downloads every booking matching the current filters as a CSV (opens in Excel)
  async function exportCsv() {
    setExporting(true);
    try {
      const res = await api.get<{ data: { bookings: SheetBooking[] } }>(`/bookings?${buildParams({ page: "1", limit: "5000" })}`);
      const header = ["Booking ID", "Confirmation No", "Client", "Membership No", "Hotel", "Check-in", "Check-out", "Nights", "Rooms", "Adults", "Children", "Night Type", "Booking Amount", "Paid By Client", "Status", "Email Sent"];
      const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const lines = res.data.bookings.map(b => [
        b.booking_ref, b.confirmation_number, b.client_name, b.membership_number, b.hotel_name,
        String(b.check_in).slice(0, 10), String(b.check_out).slice(0, 10), b.nights, b.no_of_rooms, b.no_of_adults, b.children,
        b.night_type, b.booking_amount, b.amount_paid_by_client, b.status, b.email_sent_at ? "Yes" : "No",
      ].map(esc).join(","));
      const blob = new Blob(["\uFEFF" + [header.map(esc).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `booking-sheet-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const filtersActive = status !== "ACTIVE" || !!from || !!to || !!query;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-slate-500" /> Booking Sheet
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} booking{total !== 1 ? "s" : ""} across all clients. Click a row to open the client.</p>
        </div>
        <button
          onClick={exportCsv}
          disabled={exporting || total === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Export CSV
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={applySearch} className="flex flex-wrap items-end gap-3">
        <div className="relative flex-1 min-w-64 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className={`${inp} w-full pl-9`}
            placeholder="Search client, hotel, booking ID, confirmation no…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status</label>
          <select className={inp} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            {STATUS_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Check-in from</label>
          <input type="date" className={inp} value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Check-in to</label>
          <input type="date" className={inp} value={to} onChange={e => { setTo(e.target.value); setPage(1); }} />
        </div>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Search</button>
        {filtersActive && (
          <button type="button" onClick={resetFilters} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Clear</button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : error ? (
          <p className="text-sm text-red-600 text-center py-12">{error}</p>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <ClipboardList className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Booking ID", "Confirmation No", "Client", "Hotel", "Stay", "Guests", "Amount", "Status", "Email"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(b => (
                  <tr
                    key={b.booking_id}
                    onClick={() => router.push(`/admin/clients/${b.client_id}`)}
                    className={`cursor-pointer transition-colors hover:bg-slate-50 ${b.status === "CANCELLED" ? "opacity-60" : ""}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700 whitespace-nowrap">{b.booking_ref}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700 whitespace-nowrap">
                      {b.confirmation_number || <span className="text-amber-600 font-sans">Pending</span>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{b.client_name || "—"}</p>
                      <p className="text-xs text-slate-400 font-mono">{b.membership_number ?? ""}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-56">
                      <p className="truncate">{b.hotel_name}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                      {fmtDate(b.check_in)} <span className="text-slate-400">→</span> {fmtDate(b.check_out)}
                      <p className="text-slate-400">{b.nights} night{b.nights !== 1 ? "s" : ""} · {b.night_type.toLowerCase()}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                      {b.no_of_rooms} room{b.no_of_rooms !== 1 ? "s" : ""}
                      <p className="text-slate-400">{b.no_of_adults}A{b.children ? ` + ${b.children}C` : ""}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">
                      {fmtAmt(b.booking_amount)}
                      {Number(b.amount_paid_by_client) > 0 && <p className="text-slate-400">Paid {fmtAmt(b.amount_paid_by_client)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[b.status] ?? "bg-slate-100 text-slate-600"}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {b.email_sent_at
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" aria-label="Email sent" />
                        : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
