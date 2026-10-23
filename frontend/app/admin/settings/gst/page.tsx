"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, Save, CheckCircle, AlertCircle, Plus, Trash2 } from "lucide-react";

interface GstData {
  slots: { id: string; label: string; rate: number }[];
  default_slot_id: string;
}

interface Slot {
  id: string;
  label: string;
  rate: string;
}

const inp =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

const newId = () => `gst-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export default function GstSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [defaultId, setDefaultId] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function apply(g: GstData) {
    setSlots(g.slots.map(s => ({ ...s, rate: String(s.rate) })));
    setDefaultId(g.default_slot_id);
  }

  useEffect(() => {
    api.get<{ data: GstData }>("/settings/gst")
      .then(res => apply(res.data))
      .catch(e => setToast({ type: "error", msg: e?.message ?? "Failed to load settings." }))
      .finally(() => setLoading(false));
  }, []);

  function update(id: string, patch: Partial<Slot>) {
    setSlots(s => s.map(x => (x.id === id ? { ...x, ...patch } : x)));
  }

  function removeSlot(id: string) {
    setSlots(s => s.filter(x => x.id !== id));
    if (defaultId === id) setDefaultId("");
  }

  async function save() {
    setToast(null);
    const cleaned = slots.map(s => ({ id: s.id, label: s.label.trim(), rate: Number(s.rate) }));
    if (cleaned.some(s => !s.label || Number.isNaN(s.rate) || s.rate < 0 || s.rate > 100)) {
      setToast({ type: "error", msg: "Each slot needs a name and a GST percentage between 0 and 100." });
      return;
    }
    const def = cleaned.some(s => s.id === defaultId) ? defaultId : cleaned[0]?.id;
    if (!def) {
      setToast({ type: "error", msg: "Add at least one GST slot." });
      return;
    }
    setSaving(true);
    try {
      const res = await api.put<{ data: GstData }>("/settings/gst", { slots: cleaned, default_slot_id: def });
      apply(res.data);
      setToast({ type: "success", msg: "Saved. Tax invoices will use these GST rates." });
    } catch (e: unknown) {
      setToast({ type: "error", msg: (e as { message?: string })?.message ?? "Failed to save." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">GST Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Define GST slots for tax invoices. The default slot is pre-selected when creating a tax invoice, and the
          invoice uses that percentage (split into CGST + SGST for same-state clients, or IGST otherwise).
        </p>
      </div>

      {toast && (
        <div
          className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg border ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <div className="grid grid-cols-[1fr_8rem_5rem_2.5rem] gap-3 text-xs font-semibold text-slate-600">
          <span>Slot name</span>
          <span>GST %</span>
          <span className="text-center">Default</span>
          <span />
        </div>

        {slots.map(s => (
          <div key={s.id} className="grid grid-cols-[1fr_8rem_5rem_2.5rem] gap-3 items-center">
            <input className={inp} value={s.label} maxLength={60} placeholder="e.g. GST 5%" onChange={e => update(s.id, { label: e.target.value })} />
            <input className={inp} type="number" min={0} max={100} step="0.01" value={s.rate} placeholder="5" onChange={e => update(s.id, { rate: e.target.value })} />
            <div className="flex justify-center">
              <input type="radio" name="default-slot" className="w-4 h-4 accent-blue-600" checked={defaultId === s.id} onChange={() => setDefaultId(s.id)} />
            </div>
            <button
              onClick={() => removeSlot(s.id)}
              disabled={slots.length <= 1}
              title="Remove slot"
              className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={() => setSlots(s => [...s, { id: newId(), label: "", rate: "" }])}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" /> Add slot
        </button>

        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Changes apply to invoices created from now on. Invoices already issued keep the rate they were created with.
        </p>

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
