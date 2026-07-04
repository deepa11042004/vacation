"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import { Search, ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";

interface Membership {
  membership_id: number; membership_number: string; status: string;
  outstanding_balance: number; net_price: number; sale_date: string; end_date: string;
  client?: { client_id: number; first_name: string; last_name: string };
  package?: { name: string; category: string };
}

interface Pkg { package_id: number; name: string; category: string; validity_years: number; base_price: number }
interface Client { client_id: number; first_name: string; last_name: string; email: string }

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700", SUSPENDED: "bg-amber-50 text-amber-700",
  CANCELLED: "bg-red-50 text-red-600", EXPIRED: "bg-slate-100 text-slate-500",
};
const CAT_COLORS: Record<string, string> = {
  SILVER: "bg-slate-100 text-slate-600", GOLD: "bg-amber-50 text-amber-700", PLATINUM: "bg-violet-50 text-violet-700",
};

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const sel = `${inp} bg-white`;
const EMPTY_MEM = { package_id: "", sale_date: "", start_date: "", total_price: "", discount_amount: "0", payment_mode: "CASH", down_payment: "0", dsa: "", reference_by: "", remarks: "" };

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery]   = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 12;

  // New Membership modal
  const [showMem, setShowMem]     = useState(false);
  const [packages, setPackages]   = useState<Pkg[]>([]);
  const [clients, setClients]     = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [memForm, setMemForm]     = useState({ ...EMPTY_MEM });
  const [memSaving, setMemSaving] = useState(false);
  const [memErr, setMemErr]       = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);
    if (query)  params.set("search", query);
    api.get<{ data: { memberships: Membership[]; total: number } }>(`/memberships?${params}`).then(res => {
      setMemberships(res?.data?.memberships ?? []);
      setTotal(res?.data?.total ?? 0);
      setLoading(false);
    });
  }, [page, status, query]);

  useEffect(() => { load(); }, [load]);

  function openNewMembership() {
    setSelectedClient(null); setClientSearch(""); setClients([]);
    setMemForm({ ...EMPTY_MEM }); setMemErr("");
    api.get<{ data: { packages: Pkg[] } }>("/packages?limit=100&status=ACTIVE").then(res => setPackages(res?.data?.packages ?? []));
    setShowMem(true);
  }

  async function searchClients() {
    if (!clientSearch.trim()) return;
    const res = await api.get<{ data: { clients: Client[] } }>(`/clients?search=${encodeURIComponent(clientSearch)}&limit=8`);
    setClients(res?.data?.clients ?? []);
  }

  async function saveMembership() {
    if (!selectedClient) { setMemErr("Please select a client."); return; }
    if (!memForm.package_id || !memForm.sale_date || !memForm.start_date || !memForm.total_price) {
      setMemErr("Package, dates and total price are required."); return;
    }
    setMemSaving(true); setMemErr("");
    const payload: Record<string, string | number> = {
      client_id: selectedClient.client_id,
      package_id: Number(memForm.package_id),
      sale_date: memForm.sale_date, start_date: memForm.start_date,
      total_price: Number(memForm.total_price),
      discount_amount: Number(memForm.discount_amount || 0),
      payment_mode: memForm.payment_mode,
      down_payment: Number(memForm.down_payment || 0),
    };
    if (memForm.dsa) payload.dsa = memForm.dsa;
    if (memForm.reference_by) payload.reference_by = memForm.reference_by;
    if (memForm.remarks) payload.remarks = memForm.remarks;
    const res = await api.post<{ success: boolean; message?: string }>("/memberships", payload);
    setMemSaving(false);
    if (res?.success) { setShowMem(false); load(); }
    else setMemErr(res?.message ?? "Failed to create membership.");
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-slate-500 text-sm">{total} memberships</p>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Statuses</option>
            {["ACTIVE","SUSPENDED","EXPIRED","CANCELLED"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <form onSubmit={e => { e.preventDefault(); setPage(1); setQuery(search); }} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Card no. or reference…"
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">Search</button>
          </form>
          <button onClick={openNewMembership} className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> New Membership
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        {loading ? <div className="flex items-center justify-center h-48"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /></div> : (
          <table className="w-full text-sm min-w-200">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{["Card No.", "Client", "Package", "Category", "Outstanding", "Status", "Sale Date", "Expires", ""].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memberships.length === 0 && <tr><td colSpan={9} className="text-center text-slate-400 py-10">No memberships found</td></tr>}
              {memberships.map(m => (
                <tr key={m.membership_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">{m.membership_number}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/clients/${m.client?.client_id}`} className="text-blue-600 text-xs hover:underline">{m.client?.first_name} {m.client?.last_name}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{m.package?.name}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CAT_COLORS[m.package?.category ?? ""] ?? "bg-slate-100 text-slate-500"}`}>{m.package?.category}</span></td>
                  <td className="px-4 py-3 font-semibold text-slate-800">₹{Number(m.outstanding_balance).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[m.status] ?? "bg-slate-100 text-slate-500"}`}>{m.status}</span></td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{new Date(m.sale_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{new Date(m.end_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Link href={`/admin/memberships/${m.membership_id}`} className="text-blue-600 hover:text-blue-700 font-medium text-xs">View →</Link></td>
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

      {/* New Membership Modal */}
      <Modal open={showMem} onClose={() => setShowMem(false)} title="New Membership" size="lg">
        {/* Step 1 - Client Selection */}
        <div className="mb-4 pb-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Step 1 — Select Client</p>
          {selectedClient
            ? <div className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-blue-900">{selectedClient.first_name} {selectedClient.last_name}</p>
                  <p className="text-xs text-blue-600">{selectedClient.email}</p>
                </div>
                <button onClick={() => { setSelectedClient(null); setClients([]); setClientSearch(""); }} className="text-xs text-blue-600 hover:text-blue-800 underline">Change</button>
              </div>
            : <div className="flex gap-2">
                <input value={clientSearch} onChange={e => setClientSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && searchClients()}
                  placeholder="Search by name, email or client code…" className={inp} />
                <button onClick={searchClients} className="px-3 py-2 text-sm bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700 whitespace-nowrap">Search</button>
              </div>
          }
          {!selectedClient && clients.length > 0 && (
            <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden">
              {clients.map(c => (
                <button key={c.client_id} onClick={() => { setSelectedClient(c); setClients([]); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 text-sm">
                  <span className="font-medium text-slate-800">{c.first_name} {c.last_name}</span>
                  <span className="text-slate-400 ml-2 text-xs">{c.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2 - Membership Details */}
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Step 2 — Membership Details</p>
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Package <span className="text-red-500">*</span></label>
            <select className={sel} value={memForm.package_id} onChange={e => setMemForm(f => ({ ...f, package_id: e.target.value }))}>
              <option value="">Select package…</option>
              {packages.map(p => <option key={p.package_id} value={p.package_id}>{p.name} ({p.category}) — ₹{Number(p.base_price).toLocaleString()}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Sale Date <span className="text-red-500">*</span></label><input type="date" className={inp} value={memForm.sale_date} onChange={e => setMemForm(f => ({ ...f, sale_date: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Start Date <span className="text-red-500">*</span></label><input type="date" className={inp} value={memForm.start_date} onChange={e => setMemForm(f => ({ ...f, start_date: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Total Price (₹) <span className="text-red-500">*</span></label><input type="number" className={inp} value={memForm.total_price} onChange={e => setMemForm(f => ({ ...f, total_price: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Discount (₹)</label><input type="number" className={inp} value={memForm.discount_amount} onChange={e => setMemForm(f => ({ ...f, discount_amount: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Down Payment (₹)</label><input type="number" className={inp} value={memForm.down_payment} onChange={e => setMemForm(f => ({ ...f, down_payment: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Payment Mode <span className="text-red-500">*</span></label>
              <select className={sel} value={memForm.payment_mode} onChange={e => setMemForm(f => ({ ...f, payment_mode: e.target.value }))}>
                {["CASH","CHEQUE","ONLINE","BANK_TRANSFER","CARD"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">DSA</label>
              <select className={sel} value={memForm.dsa} onChange={e => setMemForm(f => ({ ...f, dsa: e.target.value }))}>
                <option value="">None</option><option value="VENUE">Venue</option><option value="CSDO">CSDO</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Reference By</label><input className={inp} value={memForm.reference_by} onChange={e => setMemForm(f => ({ ...f, reference_by: e.target.value }))} /></div>
          </div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Remarks</label><textarea rows={2} className={inp} value={memForm.remarks} onChange={e => setMemForm(f => ({ ...f, remarks: e.target.value }))} /></div>
          {memForm.total_price && (
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 space-y-0.5">
              <p>Net: ₹{(Number(memForm.total_price) - Number(memForm.discount_amount || 0)).toLocaleString()}</p>
              <p>Outstanding: ₹{(Number(memForm.total_price) - Number(memForm.discount_amount || 0) - Number(memForm.down_payment || 0)).toLocaleString()}</p>
            </div>
          )}
        </div>
        {memErr && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{memErr}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowMem(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={saveMembership} disabled={memSaving} className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
            {memSaving && <Loader2 className="w-4 h-4 animate-spin" />} Create Membership
          </button>
        </div>
      </Modal>
    </div>
  );
}
