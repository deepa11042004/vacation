"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import { Search, ChevronLeft, ChevronRight, Loader2, Plus, Pencil, MapPin } from "lucide-react";

interface Location {
  location_id: number; location_name: string; country: string;
  type: string; status: string; description?: string; map_link?: string; remarks?: string;
}

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const sel = `${inp} bg-white`;

const EMPTY: Record<string, string> = {
  location_name: "", country: "", type: "DOMESTIC",
  description: "", map_link: "", remarks: "", status: "ACTIVE",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]       = useState("");
  const [query, setQuery]         = useState("");
  const [loading, setLoading]     = useState(true);
  const [editLoc, setEditLoc]     = useState<Location | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ ...EMPTY });
  const [saving, setSaving]       = useState(false);
  const [err, setErr]             = useState("");
  const limit = 15;

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (typeFilter)   params.set("type", typeFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (query)        params.set("search", query);
    api.get<{ data: { locations: Location[]; total: number } }>(`/locations?${params}`).then(res => {
      setLocations(res?.data?.locations ?? []);
      setTotal(res?.data?.total ?? 0);
      setLoading(false);
    });
  }, [page, typeFilter, statusFilter, query]);

  useEffect(() => { load(); }, [load]);

  function f(k: string, v: string) { setForm(prev => ({ ...prev, [k]: v })); }

  function openCreate() {
    setEditLoc(null); setForm({ ...EMPTY }); setErr(""); setShowModal(true);
  }

  function openEdit(loc: Location) {
    setEditLoc(loc);
    setForm({
      location_name: loc.location_name, country: loc.country, type: loc.type, status: loc.status,
      description: loc.description ?? "", map_link: loc.map_link ?? "", remarks: loc.remarks ?? "",
    });
    setErr(""); setShowModal(true);
  }

  async function handleSave() {
    if (!form.location_name || !form.country || !form.type) {
      setErr("Location name, country and type are required."); return;
    }
    setSaving(true); setErr("");
    const payload = {
      location_name: form.location_name, country: form.country, type: form.type, status: form.status,
      description: form.description || null, map_link: form.map_link || null, remarks: form.remarks || null,
    };
    const res = editLoc
      ? await api.put<{ success: boolean; message?: string }>(`/locations/${editLoc.location_id}`, payload)
      : await api.post<{ success: boolean; message?: string }>("/locations", payload);
    setSaving(false);
    if (res?.success) { setShowModal(false); load(); }
    else setErr(res?.message ?? "Failed to save location.");
  }

  const totalPages = Math.ceil(total / limit);
  const filterSel = "text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-slate-500 text-sm">{total} locations</p>
        <div className="flex items-center gap-2 flex-wrap">
          <select className={filterSel} value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            <option value="DOMESTIC">Domestic</option>
            <option value="INTERNATIONAL">International</option>
          </select>
          <select className={filterSel} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <form onSubmit={e => { e.preventDefault(); setPage(1); setQuery(search); }} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Location name…"
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">Search</button>
          </form>
          <button onClick={openCreate} className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Location
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading
          ? <div className="flex items-center justify-center h-48"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /></div>
          : <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{["Location", "Country", "Type", "Status", "Description", ""].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {locations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <MapPin className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">No locations found</p>
                    </td>
                  </tr>
                )}
                {locations.map(l => (
                  <tr key={l.location_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{l.location_name}</td>
                    <td className="px-4 py-3 text-slate-600">{l.country}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${l.type === "DOMESTIC" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                        {l.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${l.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs max-w-xs truncate">{l.description ?? "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editLoc ? "Edit Location" : "New Location"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Field label="Location Name" required><input className={inp} value={form.location_name} onChange={e => f("location_name", e.target.value)} placeholder="e.g. Goa, Maldives" /></Field></div>
            <Field label="Country" required><input className={inp} value={form.country} onChange={e => f("country", e.target.value)} placeholder="India, UAE, Thailand…" /></Field>
            <Field label="Type" required>
              <select className={sel} value={form.type} onChange={e => f("type", e.target.value)}>
                <option value="DOMESTIC">Domestic</option>
                <option value="INTERNATIONAL">International</option>
              </select>
            </Field>
            <Field label="Status">
              <select className={sel} value={form.status} onChange={e => f("status", e.target.value)}>
                <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
              </select>
            </Field>
            <Field label="Map Link"><input className={inp} value={form.map_link} onChange={e => f("map_link", e.target.value)} placeholder="https://maps.google.com/…" /></Field>
          </div>
          <Field label="Description"><textarea rows={2} className={inp} value={form.description} onChange={e => f("description", e.target.value)} /></Field>
          <Field label="Remarks"><textarea rows={2} className={inp} value={form.remarks} onChange={e => f("remarks", e.target.value)} /></Field>
        </div>
        {err && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editLoc ? "Save Changes" : "Add Location"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
