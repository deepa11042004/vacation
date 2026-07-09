"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import {
  Search, ChevronLeft, ChevronRight, Loader2, Plus, Pencil,
  MapPin, Trash2, RotateCcw, ShieldAlert, Globe, Home,
} from "lucide-react";

interface Location {
  location_id: number;
  location_code: string;
  location_name: string;
  country: string;
  type: "DOMESTIC" | "INTERNATIONAL";
  status: "ACTIVE" | "INACTIVE";
  is_online: boolean;
  location_image?: string | null;
  map_link?: string | null;
  description?: string | null;
  famous_sightseens?: string[] | null;
  remarks?: string | null;
  deleted_at?: string | null;
}

interface FormState {
  location_name: string;
  location_code: string;
  country: string;
  type: "DOMESTIC" | "INTERNATIONAL";
  status: "ACTIVE" | "INACTIVE";
  is_online: boolean;
  location_image: string;
  map_link: string;
  description: string;
  famous_sightseens: string;
  remarks: string;
}

const EMPTY: FormState = {
  location_name: "", location_code: "", country: "",
  type: "DOMESTIC", status: "ACTIVE", is_online: false,
  location_image: "", map_link: "", description: "",
  famous_sightseens: "", remarks: "",
};

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const sel = `${inp} bg-white`;

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  return type === "DOMESTIC"
    ? <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"><Home className="w-3 h-3" />Domestic</span>
    : <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700"><Globe className="w-3 h-3" />Intl</span>;
}

export default function LocationsPage() {
  const [locations, setLocations]   = useState<Location[]>([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]         = useState("");
  const [query, setQuery]           = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [loading, setLoading]       = useState(true);

  const [showModal, setShowModal]   = useState(false);
  const [editLoc, setEditLoc]       = useState<Location | null>(null);
  const [form, setForm]             = useState<FormState>({ ...EMPTY });
  const [saving, setSaving]         = useState(false);
  const [formErr, setFormErr]       = useState("");

  const [confirm, setConfirm] = useState<{ type: "soft" | "permanent" | "restore"; loc: Location } | null>(null);
  const [busy, setBusy]       = useState(false);

  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (query) params.set("search", query);
      if (showDeleted) params.set("includeDeleted", "true");
      const res = await api.get<{ data: { locations: Location[]; total: number } }>(`/locations?${params}`);
      setLocations(res?.data?.locations ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch { setLocations([]); }
    finally { setLoading(false); }
  }, [page, typeFilter, statusFilter, query, showDeleted]);

  useEffect(() => { load(); }, [load]);

  function f(k: keyof FormState, v: string | boolean) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function autoCode(name: string): string {
    const words = name.trim().toUpperCase().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 5);
    return words.map(w => w[0]).join("").slice(0, 5);
  }

  function openCreate() {
    setEditLoc(null);
    setForm({ ...EMPTY });
    setFormErr("");
    setShowModal(true);
  }

  function openEdit(loc: Location) {
    setEditLoc(loc);
    setForm({
      location_name:     loc.location_name,
      location_code:     loc.location_code,
      country:           loc.country,
      type:              loc.type,
      status:            loc.status,
      is_online:         loc.is_online ?? false,
      location_image:    loc.location_image ?? "",
      map_link:          loc.map_link ?? "",
      description:       loc.description ?? "",
      famous_sightseens: (loc.famous_sightseens ?? []).join(", "),
      remarks:           loc.remarks ?? "",
    });
    setFormErr("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.location_name || !form.country || !form.type) {
      setFormErr("Location name, country and type are required.");
      return;
    }
    setSaving(true);
    setFormErr("");
    try {
      const payload = {
        location_name:     form.location_name,
        location_code:     form.location_code || autoCode(form.location_name),
        country:           form.country,
        type:              form.type,
        status:            form.status,
        is_online:         form.is_online,
        location_image:    form.location_image || null,
        map_link:          form.map_link || null,
        description:       form.description || null,
        famous_sightseens: form.famous_sightseens
          ? form.famous_sightseens.split(",").map(s => s.trim()).filter(Boolean)
          : null,
        remarks: form.remarks || null,
      };
      if (editLoc) {
        await api.put(`/locations/${editLoc.location_id}`, payload);
      } else {
        await api.post("/locations", payload);
      }
      setShowModal(false);
      load();
    } catch (e: any) {
      setFormErr(e?.message ?? "Failed to save location.");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm) return;
    setBusy(true);
    try {
      if (confirm.type === "soft") {
        await api.delete(`/locations/${confirm.loc.location_id}`);
      } else if (confirm.type === "permanent") {
        await api.delete(`/locations/${confirm.loc.location_id}/permanent`);
      } else {
        await api.patch(`/locations/${confirm.loc.location_id}/restore`);
      }
      setConfirm(null);
      load();
    } catch { /* error stays visible via confirm modal */ }
    finally { setBusy(false); }
  }

  const totalPages = Math.ceil(total / limit);
  const filterSel = "text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Locations</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} locations</p>
        </div>
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
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Name or country…"
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">Search</button>
            {query && (
              <button type="button" onClick={() => { setSearch(""); setQuery(""); setPage(1); }}
                className="px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Clear</button>
            )}
          </form>
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-600 border border-slate-300 rounded-lg px-3 py-2 hover:bg-slate-50">
            <input
              type="checkbox" checked={showDeleted}
              onChange={e => { setShowDeleted(e.target.checked); setPage(1); }}
              className="w-3.5 h-3.5 accent-red-500"
            />
            Show deleted
          </label>
          <button onClick={openCreate}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Location
          </button>
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
                {["Code", "Location", "Country", "Type", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {locations.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <MapPin className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">{showDeleted ? "No deleted locations" : "No locations found"}</p>
                  </td>
                </tr>
              )}
              {locations.map(l => {
                const isDeleted = !!l.deleted_at;
                return (
                  <tr key={l.location_id} className={`hover:bg-slate-50 transition-colors ${isDeleted ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{l.location_code}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${isDeleted ? "text-slate-400 line-through" : "text-slate-800"}`}>{l.location_name}</span>
                      {isDeleted && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wide">Deleted</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{l.country}</td>
                    <td className="px-4 py-3"><TypeBadge type={l.type} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${l.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {!isDeleted ? (
                          <>
                            <button onClick={() => openEdit(l)} title="Edit"
                              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirm({ type: "soft", loc: l })} title="Delete"
                              className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setConfirm({ type: "restore", loc: l })} title="Restore"
                              className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirm({ type: "permanent", loc: l })} title="Permanently delete"
                              className="p-1.5 rounded-md text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors">
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
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

      {/* Add / Edit Modal */}
      <Modal open={showModal} onClose={() => { if (!saving) setShowModal(false); }} title={editLoc ? "Edit Location" : "New Location"} size="md">
        <div className="space-y-4">
          {formErr && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formErr}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Location Name" required>
                <input className={inp} value={form.location_name}
                  onChange={e => { f("location_name", e.target.value); if (!editLoc) f("location_code", autoCode(e.target.value)); }}
                  placeholder="e.g. Goa, Maldives" />
              </Field>
            </div>
            <Field label="Location Code" required>
              <input className={inp} value={form.location_code}
                onChange={e => f("location_code", e.target.value.toUpperCase())}
                placeholder="GOA" maxLength={20} />
            </Field>
            <Field label="Country" required>
              <input className={inp} value={form.country}
                onChange={e => f("country", e.target.value)}
                placeholder="India, UAE, Thailand…" />
            </Field>
            <Field label="Type" required>
              <select className={sel} value={form.type} onChange={e => f("type", e.target.value as "DOMESTIC" | "INTERNATIONAL")}>
                <option value="DOMESTIC">Domestic</option>
                <option value="INTERNATIONAL">International</option>
              </select>
            </Field>
            <Field label="Status">
              <select className={sel} value={form.status} onChange={e => f("status", e.target.value as "ACTIVE" | "INACTIVE")}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </Field>
            <Field label="Map Link">
              <input className={inp} value={form.map_link}
                onChange={e => f("map_link", e.target.value)}
                placeholder="https://maps.google.com/…" />
            </Field>
            <Field label="Image Filename">
              <input className={inp} value={form.location_image}
                onChange={e => f("location_image", e.target.value)}
                placeholder="goa.jpg" />
            </Field>
          </div>

          <Field label="Famous Sightseens">
            <input className={inp} value={form.famous_sightseens}
              onChange={e => f("famous_sightseens", e.target.value)}
              placeholder="Baga Beach, Calangute Beach, Dudhsagar Falls (comma-separated)" />
          </Field>

          <Field label="Description">
            <textarea rows={3} className={inp} value={form.description}
              onChange={e => f("description", e.target.value)} />
          </Field>

          <div className="flex items-center gap-3">
            <Field label="Remarks">
              <textarea rows={2} className={`${inp} resize-none`} value={form.remarks}
                onChange={e => f("remarks", e.target.value)} />
            </Field>
            <div className="shrink-0 pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => f("is_online", !form.is_online)}
                  className={`w-10 h-5 rounded-full transition-colors ${form.is_online ? "bg-teal-500" : "bg-slate-300"} relative`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.is_online ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-xs font-medium text-slate-600">Online</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => { if (!saving) setShowModal(false); }}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editLoc ? "Save Changes" : "Add Location"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Modals */}
      <ConfirmModal
        open={confirm?.type === "soft"}
        title="Delete Location"
        message={`Delete "${confirm?.loc.location_name}"? ${confirm?.loc.location_name ? "This location cannot be deleted if it has hotels assigned to it." : ""}`}
        confirmLabel="Delete" variant="danger" loading={busy}
        onConfirm={handleDelete}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
      <ConfirmModal
        open={confirm?.type === "restore"}
        title="Restore Location"
        message={`Restore "${confirm?.loc.location_name}" back to active locations?`}
        confirmLabel="Restore" variant="safe" loading={busy}
        onConfirm={handleDelete}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
      <ConfirmModal
        open={confirm?.type === "permanent"}
        title="Permanently Delete Location"
        message={`Permanently erase "${confirm?.loc.location_name}"? This cannot be undone.`}
        confirmLabel="Delete Forever" variant="permanent" loading={busy}
        onConfirm={handleDelete}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
    </div>
  );
}
