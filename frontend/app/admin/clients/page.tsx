"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import { Search, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Client {
  client_id: number; client_code: string;
  title?: string; first_name: string; last_name: string;
  email: string; mobile: string; country_code: string;
  status: string; created_at: string;
}

const EMPTY_FORM = {
  title: "", first_name: "", middle_name: "", last_name: "",
  gender: "MALE", mobile: "", alternate_mobile: "", email: "",
  country_code: "+91", date_of_birth: "", sales_consultant: "",
  take_over_manager: "", dsa: "", reference_by: "", spouse_name: "",
  marriage_anniversary: "", remarks: "",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const sel = `${inp} bg-white`;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [query, setQuery]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]       = useState({ ...EMPTY_FORM });
  const [saving, setSaving]   = useState(false);
  const [formErr, setFormErr] = useState("");
  const limit = 12;

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (query) params.set("search", query);
    if (statusFilter) params.set("status", statusFilter);
    api.get<{ data: { clients: Client[]; total: number } }>(`/clients?${params}`).then(res => {
      setClients(res?.data?.clients ?? []);
      setTotal(res?.data?.total ?? 0);
      setLoading(false);
    });
  }, [page, query, statusFilter]);

  useEffect(() => { load(); }, [load]);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  function openCreate() { setForm({ ...EMPTY_FORM }); setFormErr(""); setShowModal(true); }

  async function handleSave() {
    if (!form.first_name || !form.last_name || !form.mobile || !form.email || !form.country_code || !form.gender) {
      setFormErr("First name, last name, mobile, email, country code and gender are required."); return;
    }
    setSaving(true); setFormErr("");
    const payload: Record<string, string | undefined> = {};
    Object.entries(form).forEach(([k, v]) => { if (v) payload[k] = v; });
    const res = await api.post<{ success: boolean; message?: string }>("/clients", payload);
    setSaving(false);
    if (res?.success) { setShowModal(false); load(); }
    else setFormErr(res?.message ?? "Failed to create client.");
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-slate-500 text-sm">{total} clients</p>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Statuses</option>
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
          <button onClick={openCreate} className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? <div className="flex items-center justify-center h-48"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{["Code", "Name", "Email", "Mobile", "Status", "Joined", ""].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.length === 0 && <tr><td colSpan={7} className="text-center text-slate-400 py-10">No clients found</td></tr>}
              {clients.map(c => (
                <tr key={c.client_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.client_code}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.title} {c.first_name} {c.last_name}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{c.country_code} {c.mobile}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/clients/${c.client_id}`} className="text-blue-600 hover:text-blue-700 font-medium text-xs">View →</Link>
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
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Client" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title"><input className={inp} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Mr / Mrs / Ms" /></Field>
          <Field label="Gender" required>
            <select className={sel} value={form.gender} onChange={e => set("gender", e.target.value)}>
              <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
            </select>
          </Field>
          <Field label="First Name" required><input className={inp} value={form.first_name} onChange={e => set("first_name", e.target.value)} /></Field>
          <Field label="Middle Name"><input className={inp} value={form.middle_name} onChange={e => set("middle_name", e.target.value)} /></Field>
          <Field label="Last Name" required><input className={inp} value={form.last_name} onChange={e => set("last_name", e.target.value)} /></Field>
          <Field label="Date of Birth"><input type="date" className={inp} value={form.date_of_birth} onChange={e => set("date_of_birth", e.target.value)} /></Field>
          <Field label="Country Code" required><input className={inp} value={form.country_code} onChange={e => set("country_code", e.target.value)} placeholder="+91" /></Field>
          <Field label="Mobile" required><input className={inp} value={form.mobile} onChange={e => set("mobile", e.target.value)} /></Field>
          <Field label="Alternate Mobile"><input className={inp} value={form.alternate_mobile} onChange={e => set("alternate_mobile", e.target.value)} /></Field>
          <Field label="Email" required><input type="email" className={inp} value={form.email} onChange={e => set("email", e.target.value)} /></Field>
          <Field label="Spouse Name"><input className={inp} value={form.spouse_name} onChange={e => set("spouse_name", e.target.value)} /></Field>
          <Field label="Anniversary"><input type="date" className={inp} value={form.marriage_anniversary} onChange={e => set("marriage_anniversary", e.target.value)} /></Field>
          <Field label="Sales Consultant"><input className={inp} value={form.sales_consultant} onChange={e => set("sales_consultant", e.target.value)} /></Field>
          <Field label="Take Over Manager"><input className={inp} value={form.take_over_manager} onChange={e => set("take_over_manager", e.target.value)} /></Field>
          <Field label="DSA">
            <select className={sel} value={form.dsa} onChange={e => set("dsa", e.target.value)}>
              <option value="">None</option><option value="VENUE">Venue</option><option value="CSDO">CSDO</option><option value="OTHER">Other</option>
            </select>
          </Field>
          <Field label="Reference By"><input className={inp} value={form.reference_by} onChange={e => set("reference_by", e.target.value)} /></Field>
          <div className="col-span-2"><Field label="Remarks"><textarea rows={2} className={inp} value={form.remarks} onChange={e => set("remarks", e.target.value)} /></Field></div>
        </div>
        {formErr && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formErr}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Client
          </button>
        </div>
      </Modal>
    </div>
  );
}
