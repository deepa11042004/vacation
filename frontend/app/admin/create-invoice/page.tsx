"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Search, ChevronLeft, ChevronRight, Loader2, FileText, Receipt } from "lucide-react";

interface Client {
  client_id: number;
  membership_number?: string | null;
  first_name: string; last_name: string;
  email: string; mobile: string; country_code: string;
  status: string; created_at: string; deleted_at?: string | null;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [clients,      setClients]      = useState<Client[]>([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState("");
  const [query,        setQuery]        = useState("");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [loading,      setLoading]      = useState(true);
  const limit = 12;

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (query)        params.set("search", query);
    if (statusFilter) params.set("status", statusFilter);
    api.get<{ data: { clients: Client[]; total: number } }>(`/clients?${params}`).then(res => {
      setClients(res?.data?.clients ?? []);
      setTotal(res?.data?.total ?? 0);
      setLoading(false);
    }).catch(() => { setClients([]); setTotal(0); setLoading(false); });
  }, [page, query, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  function go(clientId: number, type: "invoice" | "tax") {
    router.push(`/admin/create-invoice/${clientId}?type=${type}`);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Create Invoice</h1>
        <p className="text-sm text-slate-500 mt-0.5">Select a client to generate an invoice</p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-slate-500 text-sm">{total} clients</p>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <form onSubmit={e => { e.preventDefault(); setPage(1); setQuery(search); }} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Name, email, mobile…"
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Membership No", "Name", "Email", "Mobile", "Status", "Joined", "Invoice"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.length === 0 && (
                <tr><td colSpan={7} className="text-center text-slate-400 py-10">No clients found</td></tr>
              )}
              {clients.map(c => (
                <tr key={c.client_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.membership_number ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.first_name} {c.last_name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{c.country_code} {c.mobile}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      c.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => go(c.client_id, "invoice")}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        Invoice
                      </button>
                      <button
                        onClick={() => go(c.client_id, "tax")}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md bg-slate-700 text-white hover:bg-slate-800 transition-colors"
                      >
                        <Receipt className="w-3 h-3" />
                        Tax
                      </button>
                    </div>
                  </td>
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
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
