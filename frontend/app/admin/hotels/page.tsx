"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import ConfirmModal from "@/Components/Admin/ConfirmModal";
import Image from "next/image";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Building2,
} from "lucide-react";
import { hotelImageUrl } from "@/lib/imageUrl";

interface Location {
  location_id: number;
  location_name: string;
  country: string;
}

interface HotelImage {
  image_id: number;
  image_path: string;
  sort_order: number;
}

interface Hotel {
  hotel_id: number;
  hotel_code: string;
  hotel_name: string;
  property_type: string;
  hotel_type: string;
  status: string;
  address?: string | null;
  map_link?: string | null;
  description?: string | null;
  remarks?: string | null;
  deleted_at?: string | null;
  location?: { location_id: number; location_name: string; country: string };
  images?: HotelImage[];
}

const HOTEL_TYPES = ["HOTEL", "RESORT", "VILLA", "APARTMENT", "HOMESTAY", "GUEST_HOUSE"];

const inp =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const sel = `${inp} bg-white`;

const EMPTY: Record<string, string> = {
  hotel_name: "",
  location_id: "",
  property_type: "INTERNAL_PROPERTY",
  hotel_type: "HOTEL",
  address: "",
  map_link: "",
  description: "",
  remarks: "",
  status: "ACTIVE",
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function HotelTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    HOTEL: "bg-blue-50 text-blue-700",
    RESORT: "bg-teal-50 text-teal-700",
    VILLA: "bg-purple-50 text-purple-700",
    APARTMENT: "bg-orange-50 text-orange-700",
    HOMESTAY: "bg-pink-50 text-pink-700",
    GUEST_HOUSE: "bg-yellow-50 text-yellow-700",
  };
  const label: Record<string, string> = {
    GUEST_HOUSE: "Guest House",
    HOMESTAY: "Homestay",
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[type] ?? "bg-slate-100 text-slate-600"}`}
    >
      {label[type] ?? type.charAt(0) + type.slice(1).toLowerCase()}
    </span>
  );
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [editHotel, setEditHotel] = useState<Hotel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");

  const [confirm, setConfirm] = useState<{
    type: "soft" | "permanent" | "restore";
    hotel: Hotel;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const limit = 15;

  useEffect(() => {
    api
      .get<{ data: { locations: Location[] } }>("/locations?limit=200&status=ACTIVE")
      .then((res) => setLocations(res?.data?.locations ?? []));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (locationFilter) params.set("location_id", locationFilter);
      if (typeFilter) params.set("hotel_type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (query) params.set("search", query);
      if (showDeleted) params.set("includeDeleted", "true");
      const res = await api.get<{ data: { hotels: Hotel[]; total: number } }>(
        `/hotels?${params}`
      );
      setHotels(res?.data?.hotels ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [page, locationFilter, typeFilter, statusFilter, query, showDeleted]);

  useEffect(() => {
    load();
  }, [load]);

  function f(k: string, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function openCreate() {
    setEditHotel(null);
    setForm({ ...EMPTY });
    setFormErr("");
    setShowModal(true);
  }

  function openEdit(h: Hotel) {
    setEditHotel(h);
    setForm({
      hotel_name: h.hotel_name,
      location_id: String(h.location?.location_id ?? ""),
      property_type: h.property_type,
      hotel_type: h.hotel_type,
      status: h.status,
      address: h.address ?? "",
      map_link: h.map_link ?? "",
      description: h.description ?? "",
      remarks: h.remarks ?? "",
    });
    setFormErr("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.hotel_name || !form.location_id || !form.property_type || !form.hotel_type) {
      setFormErr("Hotel name, location, property type and hotel type are required.");
      return;
    }
    setSaving(true);
    setFormErr("");
    try {
      const payload = {
        hotel_name: form.hotel_name,
        location_id: Number(form.location_id),
        property_type: form.property_type,
        hotel_type: form.hotel_type,
        status: form.status,
        address: form.address || null,
        map_link: form.map_link || null,
        description: form.description || null,
        remarks: form.remarks || null,
      };
      if (editHotel) {
        await api.put(`/hotels/${editHotel.hotel_id}`, payload);
      } else {
        await api.post("/hotels", payload);
      }
      setShowModal(false);
      load();
    } catch (e: any) {
      setFormErr(e?.message ?? "Failed to save hotel.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmAction() {
    if (!confirm) return;
    setBusy(true);
    try {
      const { type, hotel } = confirm;
      if (type === "soft") {
        await api.delete(`/hotels/${hotel.hotel_id}`);
      } else if (type === "permanent") {
        await api.delete(`/hotels/${hotel.hotel_id}/permanent`);
      } else {
        await api.patch(`/hotels/${hotel.hotel_id}/restore`);
      }
      setConfirm(null);
      load();
    } catch {
      /* error visible in confirm modal */
    } finally {
      setBusy(false);
    }
  }

  const totalPages = Math.ceil(total / limit);
  const filterSel =
    "text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Hotels</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} hotels</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            className={filterSel}
            value={locationFilter}
            onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l.location_id} value={String(l.location_id)}>
                {l.location_name}, {l.country}
              </option>
            ))}
          </select>
          <select
            className={filterSel}
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Types</option>
            {HOTEL_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>
          <select
            className={filterSel}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <form
            onSubmit={(e) => { e.preventDefault(); setPage(1); setQuery(search); }}
            className="flex gap-2"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hotel name…"
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
            {query && (
              <button
                type="button"
                onClick={() => { setSearch(""); setQuery(""); setPage(1); }}
                className="px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Clear
              </button>
            )}
          </form>
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-600 border border-slate-300 rounded-lg px-3 py-2 hover:bg-slate-50">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => { setShowDeleted(e.target.checked); setPage(1); }}
              className="w-3.5 h-3.5 accent-red-500"
            />
            Show deleted
          </label>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Hotel
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
                {["", "Code", "Hotel Name", "Location", "Type", "Property", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-bold text-slate-500 uppercase tracking-wide px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hotels.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <Building2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">
                      {showDeleted ? "No deleted hotels" : "No hotels found"}
                    </p>
                  </td>
                </tr>
              )}
              {hotels.map((h) => {
                const isDeleted = !!h.deleted_at;
                return (
                  <tr
                    key={h.hotel_id}
                    className={`transition-colors ${isDeleted ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50"}`}
                  >
                    <td className="pl-3 pr-1 py-2 w-14">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        {h.images && h.images.length > 0 ? (
                          <Image
                            src={hotelImageUrl(
                              [...h.images].sort((a, b) => a.sort_order - b.sort_order)[0].image_path
                            )}
                            alt={h.hotel_name}
                            fill
                            sizes="44px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-slate-300 absolute inset-0 m-auto" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {h.hotel_code}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <span
                        className={`font-semibold text-sm leading-tight ${isDeleted ? "text-slate-400 line-through" : "text-slate-800"}`}
                      >
                        {h.hotel_name}
                      </span>
                      {isDeleted && (
                        <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wide">
                          Deleted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                      {h.location
                        ? `${h.location.location_name}, ${h.location.country}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <HotelTypeBadge type={h.hotel_type} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          h.property_type === "INTERNAL_PROPERTY"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {h.property_type === "INTERNAL_PROPERTY" ? "Internal" : "Associated"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          h.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {!isDeleted ? (
                          <>
                            <button
                              onClick={() => openEdit(h)}
                              title="Edit"
                              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirm({ type: "soft", hotel: h })}
                              title="Delete"
                              className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setConfirm({ type: "restore", hotel: h })}
                              title="Restore"
                              className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirm({ type: "permanent", hotel: h })}
                              title="Permanently delete"
                              className="p-1.5 rounded-md text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
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
          <p className="text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => { if (!saving) setShowModal(false); }}
        title={editHotel ? "Edit Hotel" : "New Hotel"}
        size="lg"
      >
        <div className="space-y-4">
          {formErr && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formErr}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Hotel Name" required>
                <input
                  className={inp}
                  value={form.hotel_name}
                  onChange={(e) => f("hotel_name", e.target.value)}
                  placeholder="e.g. The Grand Goa Resort"
                />
              </Field>
            </div>

            <Field label="Location" required>
              <select
                className={sel}
                value={form.location_id}
                onChange={(e) => f("location_id", e.target.value)}
              >
                <option value="">Select location…</option>
                {locations.map((l) => (
                  <option key={l.location_id} value={l.location_id}>
                    {l.location_name}, {l.country}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <select
                className={sel}
                value={form.status}
                onChange={(e) => f("status", e.target.value)}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </Field>

            <Field label="Property Type" required>
              <select
                className={sel}
                value={form.property_type}
                onChange={(e) => f("property_type", e.target.value)}
              >
                <option value="INTERNAL_PROPERTY">Internal Property</option>
                <option value="ASSOCIATED_PROPERTY">Associated Property</option>
              </select>
            </Field>

            <Field label="Hotel Type" required>
              <select
                className={sel}
                value={form.hotel_type}
                onChange={(e) => f("hotel_type", e.target.value)}
              >
                {HOTEL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </Field>

            <div className="col-span-2">
              <Field label="Address">
                <textarea
                  rows={2}
                  className={`${inp} resize-none`}
                  value={form.address}
                  onChange={(e) => f("address", e.target.value)}
                  placeholder="Full address…"
                />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Map Link">
                <input
                  className={inp}
                  value={form.map_link}
                  onChange={(e) => f("map_link", e.target.value)}
                  placeholder="https://maps.google.com/…"
                />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Description">
                <textarea
                  rows={3}
                  className={`${inp} resize-none`}
                  value={form.description}
                  onChange={(e) => f("description", e.target.value)}
                />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Remarks">
                <textarea
                  rows={2}
                  className={`${inp} resize-none`}
                  value={form.remarks}
                  onChange={(e) => f("remarks", e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => { if (!saving) setShowModal(false); }}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editHotel ? "Save Changes" : "Add Hotel"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Modals */}
      <ConfirmModal
        open={confirm?.type === "soft"}
        title="Delete Hotel"
        message={`Delete "${confirm?.hotel.hotel_name}"? It will be hidden but can be restored later.`}
        confirmLabel="Delete"
        variant="danger"
        loading={busy}
        onConfirm={handleConfirmAction}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
      <ConfirmModal
        open={confirm?.type === "restore"}
        title="Restore Hotel"
        message={`Restore "${confirm?.hotel.hotel_name}" back to active hotels?`}
        confirmLabel="Restore"
        variant="safe"
        loading={busy}
        onConfirm={handleConfirmAction}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
      <ConfirmModal
        open={confirm?.type === "permanent"}
        title="Permanently Delete Hotel"
        message={`Permanently erase "${confirm?.hotel.hotel_name}" and all its images? This cannot be undone.`}
        confirmLabel="Delete Forever"
        variant="permanent"
        loading={busy}
        onConfirm={handleConfirmAction}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
    </div>
  );
}
