"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Pencil,
} from "lucide-react";

interface Location {
  location_id: number;
  location_name: string;
  country: string;
}
interface Hotel {
  hotel_id: number;
  hotel_name: string;
  property_type: string;
  hotel_type: string;
  status: string;
  address?: string;
  map_link?: string;
  description?: string;
  remarks?: string;
  location?: { location_id: number; location_name: string; country: string };
}

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

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editHotel, setEditHotel] = useState<Hotel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const limit = 12;

  useEffect(() => {
    api
      .get<{
        data: { locations: Location[] };
      }>("/locations?limit=200&status=ACTIVE")
      .then((res) => setLocations(res?.data?.locations ?? []));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (locationFilter) params.set("location_id", locationFilter);
    if (typeFilter) params.set("hotel_type", typeFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (query) params.set("search", query);
    api
      .get<{ data: { hotels: Hotel[]; total: number } }>(`/hotels?${params}`)
      .then((res) => {
        setHotels(res?.data?.hotels ?? []);
        setTotal(res?.data?.total ?? 0);
        setLoading(false);
      });
  }, [page, locationFilter, typeFilter, statusFilter, query]);

  useEffect(() => {
    load();
  }, [load]);

  function f(k: string, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function openCreate() {
    setEditHotel(null);
    setForm({ ...EMPTY });
    setErr("");
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
    setErr("");
    setShowModal(true);
  }

  async function handleSave() {
    if (
      !form.hotel_name ||
      !form.location_id ||
      !form.property_type ||
      !form.hotel_type
    ) {
      setErr(
        "Hotel name, location, property type and hotel type are required.",
      );
      return;
    }
    setSaving(true);
    setErr("");
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
    const res = editHotel
      ? await api.put<{ success: boolean; message?: string }>(
          `/hotels/${editHotel.hotel_id}`,
          payload,
        )
      : await api.post<{ success: boolean; message?: string }>(
          "/hotels",
          payload,
        );
    setSaving(false);
    if (res?.success) {
      setShowModal(false);
      load();
    } else setErr(res?.message ?? "Failed to save hotel.");
  }

  const totalPages = Math.ceil(total / limit);
  const filterSel =
    "text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-slate-500 text-sm">{total} hotels</p>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            className={filterSel}
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setPage(1);
            }}
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
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Types</option>
            {[
              "HOTEL",
              "RESORT",
              "VILLA",
              "APARTMENT",
              "HOMESTAY",
              "GUEST_HOUSE",
            ].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className={filterSel}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQuery(search);
            }}
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
          </form>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Hotel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      ) : hotels.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-16">
          No hotels found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {hotels.map((h) => (
            <div
              key={h.hotel_id}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    {h.hotel_name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {h.location?.location_name}, {h.location?.country}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {h.status}
                  </span>
                  <button
                    onClick={() => openEdit(h)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {h.hotel_type}
                </span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {h.property_type === "INTERNAL_PROPERTY"
                    ? "Internal"
                    : "Associated"}
                </span>
              </div>
              {h.address && (
                <p className="text-xs text-slate-400 leading-relaxed">
                  {h.address}
                </p>
              )}
              {h.description && (
                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-2">
                  {h.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

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

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editHotel ? "Edit Hotel" : "New Hotel"}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Hotel Name" required>
              <input
                className={inp}
                value={form.hotel_name}
                onChange={(e) => f("hotel_name", e.target.value)}
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
              {[
                "HOTEL",
                "RESORT",
                "VILLA",
                "APARTMENT",
                "HOMESTAY",
                "GUEST_HOUSE",
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <div className="col-span-2">
            <Field label="Address">
              <textarea
                rows={2}
                className={inp}
                value={form.address}
                onChange={(e) => f("address", e.target.value)}
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
                rows={2}
                className={inp}
                value={form.description}
                onChange={(e) => f("description", e.target.value)}
              />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Remarks">
              <textarea
                rows={2}
                className={inp}
                value={form.remarks}
                onChange={(e) => f("remarks", e.target.value)}
              />
            </Field>
          </div>
        </div>
        {err && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {err}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
            {editHotel ? "Save Changes" : "Add Hotel"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
