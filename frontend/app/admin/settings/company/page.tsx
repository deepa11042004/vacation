"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, Save, CheckCircle, AlertCircle, Building2 } from "lucide-react";

interface CompanySettings {
  name: string;
  address: string;
  state: string;
  gst_number: string;
  phone: string;
  email: string;
}

const inp =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function CompanySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState<CompanySettings>({
    name: "", address: "", state: "", gst_number: "", phone: "", email: "",
  });

  function set(k: keyof CompanySettings, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  useEffect(() => {
    api.get<{ data: CompanySettings }>("/settings/company").then(res => {
      if (res?.data) setForm(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function save() {
    if (!form.name.trim() || !form.address.trim() || !form.state.trim()) {
      setToast({ type: "error", msg: "Name, address and state are required." });
      return;
    }
    setSaving(true); setToast(null);
    try {
      await api.put("/settings/company", form);
      setToast({ type: "success", msg: "Company details saved successfully." });
    } catch {
      setToast({ type: "error", msg: "Failed to save company details." });
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
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Company Details</h1>
          <p className="text-sm text-slate-500">
            These details appear on every invoice — keep them accurate
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">

        <Field label="Company Name">
          <input
            className={inp}
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="Arena International Holidays"
          />
        </Field>

        <Field
          label="Registered Address"
          hint="Printed on the invoice header"
        >
          <textarea
            rows={2}
            className={`${inp} resize-none`}
            value={form.address}
            onChange={e => set("address", e.target.value)}
            placeholder="101, Pratap Nagar, Mayur Vihar, Phase-1 Delhi-110091"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="State"
            hint="Used to determine IGST vs CGST+SGST on tax invoices"
          >
            <input
              className={inp}
              value={form.state}
              onChange={e => set("state", e.target.value)}
              placeholder="Delhi"
            />
          </Field>
          <Field
            label="GST Number (GSTIN)"
            hint="Printed on tax invoices only"
          >
            <input
              className={inp}
              value={form.gst_number}
              onChange={e => set("gst_number", e.target.value)}
              placeholder="07AAAAA0000A1Z5"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone (optional)">
            <input
              className={inp}
              value={form.phone}
              onChange={e => set("phone", e.target.value)}
              placeholder="+91 98765 43210"
            />
          </Field>
          <Field label="Email (optional)">
            <input
              className={inp}
              value={form.email}
              onChange={e => set("email", e.target.value)}
              placeholder="info@company.com"
            />
          </Field>
        </div>

        {toast && (
          <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {toast.type === "success"
              ? <CheckCircle className="w-4 h-4 shrink-0" />
              : <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.msg}
          </div>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Details"}
        </button>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Invoice Header Preview
        </p>
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 flex items-start gap-4">
          <div className="w-12 h-12 rounded bg-slate-200 flex items-center justify-center shrink-0 text-slate-400 text-xs">
            Logo
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{form.name || "Company Name"}</p>
            <p className="text-xs text-blue-600 mt-0.5">{form.address || "Company Address"}</p>
            {form.gst_number && (
              <p className="text-xs text-slate-500 mt-0.5">GSTIN: {form.gst_number}</p>
            )}
          </div>
        </div>
        {form.state && (
          <p className="text-xs text-slate-400 mt-2">
            GST logic: client in <span className="font-medium text-slate-600">{form.state}</span> → CGST+SGST; other states → IGST
          </p>
        )}
      </div>

    </div>
  );
}
