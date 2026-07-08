"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Search, Plus, ChevronLeft, ChevronRight, Loader2, MoreVertical, Pencil, Trash2, RotateCcw, Eye } from "lucide-react";

interface Client {
  client_id: number;
  membership_number?: string | null;
  first_name: string; last_name: string;
  email: string; mobile: string; country_code: string;
  status: string; created_at: string; deleted_at?: string | null;
}

function ActionMenu({ client, onRefresh }: { client: Client; onRefresh: () => void }) {
  const [open, setOpen]             = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy]             = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isDeleted = !!client.deleted_at;

  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setConfirming(false);
      }
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, []);

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return; }
    setBusy(true);
    try {
      await api.delete(`/clients/${client.client_id}`);
      setOpen(false); onRefresh();
    } catch { setBusy(false); }
  }

  async function handleRestore() {
    setBusy(true);
    try {
      await api.post(`/clients/${client.client_id}/restore`, {});
      setOpen(false); onRefresh();
    } catch { setBusy(false); }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(o => !o); setConfirming(false); }}
        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1 overflow-hidden" style={{ zIndex: 9999 }}>
          {!isDeleted && (
            <button
              onClick={() => { setOpen(false); router.push(`/admin/clients/${client.client_id}/edit`); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-400" />
              Edit
            </button>
          )}

          {isDeleted ? (
            <button
              onClick={handleRestore}
              disabled={busy}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              {busy ? "Restoring…" : "Restore"}
            </button>
          ) : (
            <button
              onClick={handleDelete}
              disabled={busy}
              className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors ${
                confirming ? "bg-red-50 text-red-700 font-semibold" : "text-red-600 hover:bg-red-50"
              }`}
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              {busy ? "Deleting…" : confirming ? "Confirm Delete" : "Delete"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}


export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [query, setQuery]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 12;

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit), include_deleted: "true" });
    if (query) params.set("search", query);
    if (statusFilter) params.set("status", statusFilter);
    api.get<{ data: { clients: Client[]; total: number } }>(`/clients?${params}`).then(res => {
      setClients(res?.data?.clients ?? []);
      setTotal(res?.data?.total ?? 0);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching clients:", err);
      setClients([]);
      setTotal(0);
      setLoading(false);
    });
  }, [page, query, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-slate-500 text-sm">{total} clients</p>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <form onSubmit={e => { e.preventDefault(); setPage(1); setQuery(search); }} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Name, email, mobile…"
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">Search</button>
          </form>
          <button
            onClick={() => router.push("/admin/clients/new")}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-visible">
        {loading ? <div className="flex items-center justify-center h-48"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /></div> : (
          <table className="w-full text-sm" style={{ overflow: 'visible' }}>
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{["Membership No", "Name", "Email", "Mobile", "Status", "Joined", "Actions"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.length === 0 && <tr><td colSpan={7} className="text-center text-slate-400 py-10">No clients found</td></tr>}
              {clients.map(c => {
                const deleted = !!c.deleted_at;
                return (
                  <tr key={c.client_id} className={`transition-colors ${deleted ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-slate-50"}`}>
                    <td className={`px-4 py-3 font-mono text-xs ${deleted ? "text-blue-400" : "text-slate-500"}`}>{c.membership_number ?? "—"}</td>
                    <td className={`px-4 py-3 font-medium ${deleted ? "text-blue-600" : "text-slate-800"}`}>
                      {c.first_name} {c.last_name}
                      {deleted && <span className="ml-2 text-[10px] font-semibold bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full">Deleted</span>}
                    </td>
                    <td className={`px-4 py-3 text-xs ${deleted ? "text-blue-400" : "text-slate-600"}`}>{c.email}</td>
                    <td className={`px-4 py-3 text-xs ${deleted ? "text-blue-400" : "text-slate-600"}`}>{c.country_code} {c.mobile}</td>
                    <td className="px-4 py-3">
                      {deleted ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-400">DELETED</span>
                      ) : c.status === "INACTIVE" ? (
                        <div className="flex flex-col items-start gap-0.5">
                          <button
                            onClick={() => router.push(`/admin/clients/new?activate=${c.client_id}`)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                          >
                            INACTIVE
                          </button>
                          <span className="text-[10px] text-slate-400 pl-0.5">Click to activate</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">ACTIVE</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-xs ${deleted ? "text-blue-400" : "text-slate-400"}`}>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {!deleted && (
                          <button
                            onClick={() => router.push(`/admin/clients/${c.client_id}`)}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                        )}
                        <ActionMenu client={c} onRefresh={load} />
                      </div>
                    </td>
                  </tr>
                );
              })}
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
