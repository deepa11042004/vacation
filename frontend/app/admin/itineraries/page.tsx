"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api, getToken } from "@/lib/api";
import { itineraryImageUrl } from "@/lib/imageUrl";
import Modal from "@/Components/Admin/Modal";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import {
  Search, ChevronLeft, ChevronRight, Loader2, Plus, Pencil,
  Route, Trash2, RotateCcw, ShieldAlert, Globe, Home, Upload, X, GripVertical,
} from "lucide-react";

interface ScheduleRow {
  day: string;
  title: string;
  desc: string;
}

interface ItineraryImage {
  image_id: number;
  image_path: string;
  sort_order: number;
}

interface Itinerary {
  itinerary_id: number;
  slug: string;
  name: string;
  destination: string;
  type: "DOMESTIC" | "INTERNATIONAL";
  category?: string | null;
  badge?: string | null;
  duration?: string | null;
  days: number;
  nights: number;
  best_time?: string | null;
  image?: string | null;
  short_desc?: string | null;
  highlights?: string[] | null;
  inclusions?: string[] | null;
  schedule?: ScheduleRow[] | null;
  status: "ACTIVE" | "INACTIVE";
  remarks?: string | null;
  gallery?: ItineraryImage[] | null;
  deleted_at?: string | null;
}

interface FormState {
  name: string;
  slug: string;
  destination: string;
  type: "DOMESTIC" | "INTERNATIONAL";
  category: string;
  badge: string;
  duration: string;
  days: string;
  nights: string;
  best_time: string;
  status: "ACTIVE" | "INACTIVE";
  short_desc: string;
  highlights: string;
  inclusions: string;
  schedule: ScheduleRow[];
  remarks: string;
}

const EMPTY: FormState = {
  name: "", slug: "", destination: "",
  type: "DOMESTIC", category: "", badge: "", duration: "",
  days: "", nights: "", best_time: "", status: "ACTIVE",
  short_desc: "", highlights: "", inclusions: "", schedule: [], remarks: "",
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

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [typeFilter, setTypeFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]           = useState("");
  const [query, setQuery]             = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [loading, setLoading]         = useState(true);

  const [showModal, setShowModal]     = useState(false);
  const [editItem, setEditItem]       = useState<Itinerary | null>(null);
  const [form, setForm]               = useState<FormState>({ ...EMPTY });
  const [saving, setSaving]           = useState(false);
  const [formErr, setFormErr]         = useState("");

  const [confirm, setConfirm] = useState<{ type: "soft" | "permanent" | "restore"; item: Itinerary } | null>(null);
  const [busy, setBusy]       = useState(false);

  const [coverFile, setCoverFile]       = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [gallery, setGallery]           = useState<ItineraryImage[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (query) params.set("search", query);
      if (showDeleted) params.set("includeDeleted", "true");
      const res = await api.get<{ data: { itineraries: Itinerary[]; total: number } }>(`/itineraries?${params}`);
      setItineraries(res?.data?.itineraries ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch { setItineraries([]); }
    finally { setLoading(false); }
  }, [page, typeFilter, statusFilter, query, showDeleted]);

  useEffect(() => { load(); }, [load]);

  function f<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function autoDuration(days: string, nights: string): string {
    const d = parseInt(days, 10);
    const n = parseInt(nights, 10);
    if (!d) return "";
    return `${d} Day${d === 1 ? "" : "s"} / ${isNaN(n) ? 0 : n} Night${n === 1 ? "" : "s"}`;
  }

  function openCreate() {
    setEditItem(null);
    setForm({ ...EMPTY });
    setFormErr("");
    setCoverFile(null);
    setCoverPreview("");
    setGallery([]);
    setShowModal(true);
  }

  function openEdit(item: Itinerary) {
    setEditItem(item);
    setForm({
      name:        item.name,
      slug:        item.slug,
      destination: item.destination,
      type:        item.type,
      category:    item.category ?? "",
      badge:       item.badge ?? "",
      duration:    item.duration ?? "",
      days:        String(item.days ?? ""),
      nights:      String(item.nights ?? ""),
      best_time:   item.best_time ?? "",
      status:      item.status,
      short_desc:  item.short_desc ?? "",
      highlights:  (item.highlights ?? []).join(", "),
      inclusions:  (item.inclusions ?? []).join(", "),
      schedule:    item.schedule ?? [],
      remarks:     item.remarks ?? "",
    });
    setFormErr("");
    setCoverFile(null);
    setCoverPreview(item.image ? itineraryImageUrl(item.image) : "");
    setGallery([...(item.gallery ?? [])].sort((a, b) => a.sort_order - b.sort_order));
    setShowModal(true);
  }

  function handleCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function addScheduleRow() {
    setForm(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: `Day ${prev.schedule.length + 1}`, title: "", desc: "" }],
    }));
  }

  function updateScheduleRow(idx: number, key: keyof ScheduleRow, value: string) {
    setForm(prev => ({
      ...prev,
      schedule: prev.schedule.map((row, i) => (i === idx ? { ...row, [key]: value } : row)),
    }));
  }

  function removeScheduleRow(idx: number) {
    setForm(prev => ({ ...prev, schedule: prev.schedule.filter((_, i) => i !== idx) }));
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files.length || !editItem) return;
    setGalleryUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("sort_order", String(gallery.length));
        const res = await fetch(`/api/itineraries/${editItem.itinerary_id}/images`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: fd,
        });
        const json = await res.json();
        if (json?.data) setGallery(prev => [...prev, json.data]);
      }
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  async function handleGalleryDelete(imageId: number) {
    if (!editItem) return;
    await fetch(`/api/itineraries/${editItem.itinerary_id}/images/${imageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setGallery(prev => prev.filter(img => img.image_id !== imageId));
  }

  async function handleSave() {
    if (!form.name || !form.destination || !form.type || !form.days) {
      setFormErr("Name, destination, type and days are required.");
      return;
    }
    setSaving(true);
    setFormErr("");
    try {
      const payload = {
        name:        form.name,
        slug:        form.slug || undefined,
        destination: form.destination,
        type:        form.type,
        category:    form.category || null,
        badge:       form.badge || null,
        duration:    form.duration || autoDuration(form.days, form.nights) || null,
        days:        parseInt(form.days, 10),
        nights:      form.nights ? parseInt(form.nights, 10) : 0,
        best_time:   form.best_time || null,
        status:      form.status,
        short_desc:  form.short_desc || null,
        highlights:  form.highlights ? form.highlights.split(",").map(s => s.trim()).filter(Boolean) : null,
        inclusions:  form.inclusions ? form.inclusions.split(",").map(s => s.trim()).filter(Boolean) : null,
        schedule:    form.schedule.length ? form.schedule : null,
        remarks:     form.remarks || null,
      };

      let itineraryId = editItem?.itinerary_id;
      if (editItem) {
        await api.put(`/itineraries/${editItem.itinerary_id}`, payload);
      } else {
        const res = await api.post<{ data: { itinerary_id: number } }>("/itineraries", payload);
        itineraryId = res?.data?.itinerary_id;
      }

      if (coverFile && itineraryId) {
        const fd = new FormData();
        fd.append("file", coverFile);
        await fetch(`/api/itineraries/${itineraryId}/image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: fd,
        });
      }

      setShowModal(false);
      load();
    } catch (e: any) {
      setFormErr(e?.message ?? "Failed to save itinerary.");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm) return;
    setBusy(true);
    try {
      if (confirm.type === "soft") {
        await api.delete(`/itineraries/${confirm.item.itinerary_id}`);
      } else if (confirm.type === "permanent") {
        await api.delete(`/itineraries/${confirm.item.itinerary_id}/permanent`);
      } else {
        await api.patch(`/itineraries/${confirm.item.itinerary_id}/restore`);
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
          <h1 className="text-xl font-bold text-slate-800">Itineraries</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} itineraries</p>
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
                placeholder="Name or destination…"
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <Plus className="w-4 h-4" /> Add Itinerary
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
                {["Itinerary", "Destination", "Duration", "Type", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itineraries.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Route className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">{showDeleted ? "No deleted itineraries" : "No itineraries found"}</p>
                  </td>
                </tr>
              )}
              {itineraries.map(it => {
                const isDeleted = !!it.deleted_at;
                return (
                  <tr key={it.itinerary_id} className={`hover:bg-slate-50 transition-colors ${isDeleted ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={itineraryImageUrl(it.image, it.itinerary_id)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className={`font-semibold block ${isDeleted ? "text-slate-400 line-through" : "text-slate-800"}`}>{it.name}</span>
                          {isDeleted && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wide">Deleted</span>}
                          {it.category && !isDeleted && <span className="text-[11px] text-slate-400">{it.category}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{it.destination}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{it.duration}</td>
                    <td className="px-4 py-3"><TypeBadge type={it.type} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${it.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {it.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {!isDeleted ? (
                          <>
                            <button onClick={() => openEdit(it)} title="Edit"
                              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirm({ type: "soft", item: it })} title="Delete"
                              className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setConfirm({ type: "restore", item: it })} title="Restore"
                              className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirm({ type: "permanent", item: it })} title="Permanently delete"
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
      <Modal open={showModal} onClose={() => { if (!saving) setShowModal(false); }} title={editItem ? "Edit Itinerary" : "New Itinerary"} size="lg">
        <div className="space-y-4">
          {formErr && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formErr}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Itinerary Name" required>
                <input className={inp} value={form.name}
                  onChange={e => f("name", e.target.value)}
                  placeholder="e.g. Goa Sunkissed Shores & Beach Serenity" />
              </Field>
            </div>
            <Field label="Slug">
              <input className={inp} value={form.slug}
                onChange={e => f("slug", e.target.value)}
                placeholder="auto-generated from name if left blank" />
            </Field>
            <Field label="Destination" required>
              <input className={inp} value={form.destination}
                onChange={e => f("destination", e.target.value)}
                placeholder="Goa, India" />
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
            <Field label="Category">
              <input className={inp} value={form.category}
                onChange={e => f("category", e.target.value)}
                placeholder="Beach & Coastal" />
            </Field>
            <Field label="Badge">
              <input className={inp} value={form.badge}
                onChange={e => f("badge", e.target.value)}
                placeholder="🇮🇳 Coastal Luxury" />
            </Field>
            <Field label="Days" required>
              <input type="number" min={1} className={inp} value={form.days}
                onChange={e => f("days", e.target.value)} />
            </Field>
            <Field label="Nights">
              <input type="number" min={0} className={inp} value={form.nights}
                onChange={e => f("nights", e.target.value)} />
            </Field>
            <Field label="Duration Label">
              <input className={inp} value={form.duration}
                onChange={e => f("duration", e.target.value)}
                placeholder={autoDuration(form.days, form.nights) || "5 Days / 4 Nights"} />
            </Field>
            <Field label="Best Time">
              <input className={inp} value={form.best_time}
                onChange={e => f("best_time", e.target.value)}
                placeholder="October to May" />
            </Field>
          </div>

          <Field label="Short Description">
            <textarea rows={2} className={inp} value={form.short_desc}
              onChange={e => f("short_desc", e.target.value)} />
          </Field>

          <Field label="Highlights">
            <input className={inp} value={form.highlights}
              onChange={e => f("highlights", e.target.value)}
              placeholder="Sunset Cruise, Heritage Cathedrals, Waterfalls (comma-separated)" />
          </Field>

          <Field label="Inclusions">
            <input className={inp} value={form.inclusions}
              onChange={e => f("inclusions", e.target.value)}
              placeholder="Beachfront Resort, Daily Breakfast, Airport Transfers (comma-separated)" />
          </Field>

          {/* Day-by-day schedule */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-600">Day-by-Day Schedule</label>
              <button type="button" onClick={addScheduleRow}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                <Plus className="w-3.5 h-3.5" /> Add Day
              </button>
            </div>
            <div className="space-y-2">
              {form.schedule.map((row, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                  <GripVertical className="w-4 h-4 text-slate-300 mt-2 shrink-0" />
                  <div className="grid grid-cols-12 gap-2 flex-1">
                    <input className={`${inp} col-span-2`} value={row.day}
                      onChange={e => updateScheduleRow(idx, "day", e.target.value)} placeholder="Day 1" />
                    <input className={`${inp} col-span-4`} value={row.title}
                      onChange={e => updateScheduleRow(idx, "title", e.target.value)} placeholder="Title" />
                    <textarea rows={1} className={`${inp} col-span-6 resize-y`} value={row.desc}
                      onChange={e => updateScheduleRow(idx, "desc", e.target.value)} placeholder="Description" />
                  </div>
                  <button type="button" onClick={() => removeScheduleRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {form.schedule.length === 0 && (
                <p className="text-xs text-slate-400 italic">No days added yet.</p>
              )}
            </div>
          </div>

          {/* Cover image */}
          <Field label="Cover Image">
            <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverPick} />
            {coverPreview ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverPreview} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(""); }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => coverInputRef.current?.click()}
                  className="absolute bottom-1.5 right-1.5 flex items-center gap-1 text-xs px-2 py-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-3 h-3" /> Change
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => coverInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
                <Upload className="w-5 h-5" />
                <span className="text-xs">Click to upload cover image</span>
              </button>
            )}
          </Field>

          {/* Gallery — only once the itinerary exists */}
          <Field label={`Gallery${editItem ? ` (${gallery.length})` : ""}`}>
            {editItem ? (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  {gallery.map(img => (
                    <div key={img.image_id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={itineraryImageUrl(img.image_path)} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleGalleryDelete(img.image_id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => galleryInputRef.current?.click()} disabled={galleryUploading}
                    className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50">
                    {galleryUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span className="text-[10px]">Add</span>
                  </button>
                </div>
                <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleGalleryUpload} />
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Save the itinerary first, then add gallery photos while editing.</p>
            )}
          </Field>

          <Field label="Remarks">
            <textarea rows={2} className={`${inp} resize-none`} value={form.remarks}
              onChange={e => f("remarks", e.target.value)} />
          </Field>

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => { if (!saving) setShowModal(false); }}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editItem ? "Save Changes" : "Add Itinerary"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Modals */}
      <ConfirmModal
        open={confirm?.type === "soft"}
        title="Delete Itinerary"
        message={`Delete "${confirm?.item.name}"?`}
        confirmLabel="Delete" variant="danger" loading={busy}
        onConfirm={handleDelete}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
      <ConfirmModal
        open={confirm?.type === "restore"}
        title="Restore Itinerary"
        message={`Restore "${confirm?.item.name}" back to active itineraries?`}
        confirmLabel="Restore" variant="safe" loading={busy}
        onConfirm={handleDelete}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
      <ConfirmModal
        open={confirm?.type === "permanent"}
        title="Permanently Delete Itinerary"
        message={`Permanently erase "${confirm?.item.name}"? This cannot be undone.`}
        confirmLabel="Delete Forever" variant="permanent" loading={busy}
        onConfirm={handleDelete}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
    </div>
  );
}
