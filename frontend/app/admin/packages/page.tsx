"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import { Loader2, Plus, Pencil } from "lucide-react";

interface Package {
  package_id: number;
  name: string;
  category: string;
  status: string;
  unit_type: string;
  base_price: number;
  amc_amount: number;
  total_nights: number;
  nights_per_year: number;
  validity_years: number;
  max_adults?: number;
  max_children?: number;
  description?: string;
}

const CAT_STYLES: Record<
  string,
  { border: string; badge: string; label: string }
> = {
  SILVER: {
    border: "border-slate-300",
    badge: "bg-slate-100 text-slate-600",
    label: "Silver",
  },
  GOLD: {
    border: "border-amber-300",
    badge: "bg-amber-50 text-amber-700",
    label: "Gold",
  },
  PLATINUM: {
    border: "border-violet-300",
    badge: "bg-violet-50 text-violet-700",
    label: "Platinum",
  },
};

const inp =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const sel = `${inp} bg-white`;

const EMPTY: Record<string, string> = {
  name: "",
  category: "SILVER",
  unit_type: "STUDIO",
  validity_years: "",
  total_nights: "",
  nights_per_year: "",
  max_adults: "2",
  max_children: "1",
  base_price: "",
  amc_amount: "0",
  description: "",
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

export default function PackagesPage() {
  const [grouped, setGrouped] = useState<Record<string, Package[]>>({
    SILVER: [],
    GOLD: [],
    PLATINUM: [],
  });
  const [loading, setLoading] = useState(true);
  const [editPkg, setEditPkg] = useState<Package | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function load() {
    setLoading(true);
    api
      .get<{ data: Record<string, Package[]> }>("/packages/grouped")
      .then((res) => {
        setGrouped(res?.data ?? { SILVER: [], GOLD: [], PLATINUM: [] });
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  function f(k: string, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function openCreate() {
    setEditPkg(null);
    setForm({ ...EMPTY });
    setErr("");
    setShowModal(true);
  }

  function openEdit(pkg: Package) {
    setEditPkg(pkg);
    setForm({
      name: pkg.name,
      category: pkg.category,
      unit_type: pkg.unit_type,
      validity_years: String(pkg.validity_years),
      total_nights: String(pkg.total_nights),
      nights_per_year: String(pkg.nights_per_year),
      max_adults: String(pkg.max_adults ?? 2),
      max_children: String(pkg.max_children ?? 1),
      base_price: String(pkg.base_price),
      amc_amount: String(pkg.amc_amount),
      description: pkg.description ?? "",
      status: pkg.status,
    });
    setErr("");
    setShowModal(true);
  }

  async function handleSave() {
    if (
      !form.name ||
      !form.category ||
      !form.unit_type ||
      !form.validity_years ||
      !form.total_nights ||
      !form.nights_per_year ||
      !form.base_price
    ) {
      setErr(
        "Name, category, unit type, validity years, nights, and base price are required.",
      );
      return;
    }
    setSaving(true);
    setErr("");
    const payload = {
      name: form.name,
      category: form.category,
      unit_type: form.unit_type,
      validity_years: Number(form.validity_years),
      total_nights: Number(form.total_nights),
      nights_per_year: Number(form.nights_per_year),
      max_adults: Number(form.max_adults),
      max_children: Number(form.max_children),
      base_price: Number(form.base_price),
      amc_amount: Number(form.amc_amount),
      description: form.description || null,
      status: form.status,
    };
    const res = editPkg
      ? await api.put<{ success: boolean; message?: string }>(
          `/packages/${editPkg.package_id}`,
          payload,
        )
      : await api.post<{ success: boolean; message?: string }>(
          "/packages",
          payload,
        );
    setSaving(false);
    if (res?.success) {
      setShowModal(false);
      load();
    } else setErr(res?.message ?? "Failed to save package.");
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );

  const totalCount = Object.values(grouped).flat().length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm">{totalCount} packages</p>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> New Package
        </button>
      </div>

      {(["SILVER", "GOLD", "PLATINUM"] as const).map((cat) => {
        const list = grouped[cat] ?? [];
        const style = CAT_STYLES[cat];
        return (
          <div key={cat}>
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${style.badge} ${style.border}`}
              >
                {style.label}
              </span>
              <span className="text-slate-400 text-xs">
                {list.length} package{list.length !== 1 ? "s" : ""}
              </span>
            </div>
            {list.length === 0 ? (
              <p className="text-slate-400 text-sm pl-1">
                No {style.label.toLowerCase()} packages yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {list.map((pkg) => (
                  <div
                    key={pkg.package_id}
                    className={`bg-white rounded-xl border-2 ${style.border} p-5 space-y-3`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">
                          {pkg.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {pkg.unit_type}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${pkg.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                        >
                          {pkg.status}
                        </span>
                        <button
                          onClick={() => openEdit(pkg)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      ₹{Number(pkg.base_price).toLocaleString()}
                    </p>
                    <div className="text-xs text-slate-400 space-y-0.5">
                      <p>
                        AMC: ₹{Number(pkg.amc_amount).toLocaleString()} ·
                        Validity: {pkg.validity_years} yr
                        {pkg.validity_years !== 1 ? "s" : ""}
                      </p>
                      <p>
                        Nights: {pkg.nights_per_year}/yr · Total:{" "}
                        {pkg.total_nights}
                      </p>
                      {pkg.max_adults && (
                        <p>
                          Max {pkg.max_adults} adults, {pkg.max_children}{" "}
                          children
                        </p>
                      )}
                    </div>
                    {pkg.description && (
                      <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-100 pt-2">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editPkg ? "Edit Package" : "New Package"}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Package Name" required>
              <input
                className={inp}
                value={form.name}
                onChange={(e) => f("name", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Category" required>
            <select
              className={sel}
              value={form.category}
              onChange={(e) => f("category", e.target.value)}
            >
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="PLATINUM">Platinum</option>
            </select>
          </Field>
          <Field label="Unit Type" required>
            <select
              className={sel}
              value={form.unit_type}
              onChange={(e) => f("unit_type", e.target.value)}
            >
              {["STUDIO", "1BHK", "2BHK", "SUITE"].map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Validity (years)" required>
            <input
              type="number"
              min="1"
              className={inp}
              value={form.validity_years}
              onChange={(e) => f("validity_years", e.target.value)}
            />
          </Field>
          <Field label="Total Nights" required>
            <input
              type="number"
              min="1"
              className={inp}
              value={form.total_nights}
              onChange={(e) => f("total_nights", e.target.value)}
            />
          </Field>
          <Field label="Nights Per Year" required>
            <input
              type="number"
              min="1"
              className={inp}
              value={form.nights_per_year}
              onChange={(e) => f("nights_per_year", e.target.value)}
            />
          </Field>
          <Field label="Max Adults">
            <input
              type="number"
              min="1"
              className={inp}
              value={form.max_adults}
              onChange={(e) => f("max_adults", e.target.value)}
            />
          </Field>
          <Field label="Max Children">
            <input
              type="number"
              min="0"
              className={inp}
              value={form.max_children}
              onChange={(e) => f("max_children", e.target.value)}
            />
          </Field>
          <Field label="Base Price (₹)" required>
            <input
              type="number"
              min="0"
              className={inp}
              value={form.base_price}
              onChange={(e) => f("base_price", e.target.value)}
            />
          </Field>
          <Field label="AMC Amount (₹)">
            <input
              type="number"
              min="0"
              className={inp}
              value={form.amc_amount}
              onChange={(e) => f("amc_amount", e.target.value)}
            />
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
            {editPkg ? "Save Changes" : "Create Package"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
