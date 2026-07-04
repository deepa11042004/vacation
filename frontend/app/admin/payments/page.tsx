"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Payment {
  payment_id: number; payment_number: string;
  payment_type: string; amount: number; payment_date: string;
  payment_mode: string; status: string; transaction_ref?: string; bank_name?: string; remarks?: string;
  membership?: { membership_number: string; membership_id: number };
  client?: { client_id: number; first_name: string; last_name: string };
}

const STATUS_COLORS: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700", CANCELLED: "bg-red-50 text-red-600", PENDING: "bg-amber-50 text-amber-700",
};
const TYPE_COLORS: Record<string, string> = {
  DOWN_PAYMENT: "bg-blue-50 text-blue-700", INSTALMENT: "bg-indigo-50 text-indigo-700",
  AMC: "bg-violet-50 text-violet-700", PENALTY: "bg-orange-50 text-orange-700", REFUND: "bg-rose-50 text-rose-700",
};

function Badge({ value, map }: { value: string; map: Record<string, string> }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[value] ?? "bg-slate-100 text-slate-500"}`}>{value}</span>;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [status, setStatus]     = useState("");
  const [type, setType]         = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate]     = useState("");
  const [search, setSearch]     = useState("");
  const [query, setQuery]       = useState("");
  const [loading, setLoading]   = useState(true);
  const limit = 15;

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status)   params.set("status", status);
    if (type)     params.set("payment_type", type);
    if (fromDate) params.set("from_date", fromDate);
    if (toDate)   params.set("to_date", toDate);
    if (query)    params.set("search", query);
    api.get<{ data: { payments: Payment[]; total: number } }>(`/payments?${params}`).then(res => {
      setPayments(res?.data?.payments ?? []);
      setTotal(res?.data?.total ?? 0);
      setLoading(false);
    });
  }, [page, status, type, fromDate, toDate, query]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);
  const sel = "text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select className={sel} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All</option>
              {["PAID", "PENDING", "CANCELLED"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
            <select className={sel} value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
              <option value="">All</option>
              {["DOWN_PAYMENT","INSTALMENT","AMC","PENALTY","REFUND"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">From Date</label>
            <input type="date" className={sel} value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(1); }} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">To Date</label>
            <input type="date" className={sel} value={toDate} onChange={e => { setToDate(e.target.value); setPage(1); }} />
          </div>
          <form onSubmit={e => { e.preventDefault(); setPage(1); setQuery(search); }} className="flex gap-2 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pay no. or client…"
                  className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button type="submit" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">Go</button>
          </form>
          {(status || type || fromDate || toDate || query) && (
            <button onClick={() => { setStatus(""); setType(""); setFromDate(""); setToDate(""); setQuery(""); setSearch(""); setPage(1); }}
              className="text-xs text-slate-500 hover:text-slate-700 underline mt-4">Clear filters</button>
          )}
        </div>
      </div>

      <p className="text-slate-500 text-sm">{total} payments</p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        {loading ? <div className="flex items-center justify-center h-48"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /></div> : (
          <table className="w-full text-sm min-w-215">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{["Pay No.", "Client", "Membership", "Type", "Amount", "Date", "Mode", "Status"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 && <tr><td colSpan={8} className="text-center text-slate-400 py-10">No payments found</td></tr>}
              {payments.map(p => (
                <tr key={p.payment_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.payment_number}</td>
                  <td className="px-4 py-3">
                    <p className="text-slate-800 text-xs font-medium">{p.client?.first_name} {p.client?.last_name}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.membership?.membership_number ?? "—"}</td>
                  <td className="px-4 py-3"><Badge value={p.payment_type} map={TYPE_COLORS} /></td>
                  <td className="px-4 py-3 font-semibold text-slate-800">₹{Number(p.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{new Date(p.payment_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{p.payment_mode}</td>
                  <td className="px-4 py-3"><Badge value={p.status} map={STATUS_COLORS} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
