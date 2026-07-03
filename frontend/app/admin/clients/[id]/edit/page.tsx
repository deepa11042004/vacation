"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { ArrowLeft, Loader2, Save, CheckCircle, AlertCircle } from "lucide-react";

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
const sel = inp;

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast, setToast]     = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    title: "", first_name: "", middle_name: "", last_name: "",
    gender: "MALE", date_of_birth: "",
    country_code: "+91", mobile: "", alternate_mobile: "",
    email: "", spouse_name: "", marriage_anniversary: "",
    sales_consultant: "", take_over_manager: "",
    dsa: "", reference_by: "", status: "ACTIVE", remarks: "",
  });

  const [addr, setAddr] = useState({
    primary_address: "", primary_state: "", primary_pincode: "",
    secondary_address: "", secondary_state: "", secondary_pincode: "",
  });

  function setF(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  function setA(k: string, v: string) { setAddr(a => ({ ...a, [k]: v })); }

  useEffect(() => {
    Promise.all([
      api.get<{ data: Record<string, string> }>(`/clients/${id}`),
      api.get<{ data: Record<string, string> }>(`/clients/${id}/address`).catch(() => ({ data: null })),
    ]).then(([cr, ar]) => {
      const c = cr?.data;
      if (c) {
        setForm({
          title:               c.title              ?? "",
          first_name:          c.first_name         ?? "",
          middle_name:         c.middle_name        ?? "",
          last_name:           c.last_name          ?? "",
          gender:              c.gender             ?? "MALE",
          date_of_birth:       c.date_of_birth      ? c.date_of_birth.slice(0, 10) : "",
          country_code:        c.country_code       ?? "+91",
          mobile:              c.mobile             ?? "",
          alternate_mobile:    c.alternate_mobile   ?? "",
          email:               c.email              ?? "",
          spouse_name:         c.spouse_name        ?? "",
          marriage_anniversary:c.marriage_anniversary ? c.marriage_anniversary.slice(0, 10) : "",
          sales_consultant:    c.sales_consultant   ?? "",
          take_over_manager:   c.take_over_manager  ?? "",
          dsa:                 c.dsa                ?? "",
          reference_by:        c.reference_by       ?? "",
          status:              c.status             ?? "ACTIVE",
          remarks:             c.remarks            ?? "",
        });
      }
      const a = (ar as { data: Record<string, string> | null })?.data;
      if (a) {
        setAddr({
          primary_address:   a.primary_address   ?? "",
          primary_state:     a.primary_state     ?? "",
          primary_pincode:   a.primary_pincode   ?? "",
          secondary_address: a.secondary_address ?? "",
          secondary_state:   a.secondary_state   ?? "",
          secondary_pincode: a.secondary_pincode ?? "",
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  async function save() {
    setSaving(true);
    setToast(null);
    try {
      const payload: Record<string, string | null> = { ...form };
      // send null for empty optional fields
      (["middle_name","date_of_birth","alternate_mobile","spouse_name",
        "marriage_anniversary","sales_consultant","take_over_manager",
        "dsa","reference_by","remarks"] as const).forEach(k => {
        if (!payload[k]) payload[k] = null;
      });
      if (!payload.dsa) payload.dsa = null;

      await api.put(`/clients/${id}`, payload);

      const anyAddr = Object.values(addr).some(v => v.trim());
      if (anyAddr) {
        await api.put(`/clients/${id}/address`, addr);
      }

      setToast({ type: "success", msg: "Client updated successfully." });
      setTimeout(() => router.push("/admin/clients"), 1200);
    } catch (e: unknown) {
      setToast({ type: "error", msg: (e as { message?: string })?.message ?? "Failed to save." });
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
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/clients" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Edit Client</h1>
          <p className="text-sm text-slate-500">Update client details and address</p>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <p className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3">Personal Details</p>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Title">
            <select className={sel} value={form.title} onChange={e => setF("title", e.target.value)}>
              <option value="">—</option>
              {["Mr","Mrs","Ms","Dr","Prof"].map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Gender" required>
            <select className={sel} value={form.gender} onChange={e => setF("gender", e.target.value)}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
          <Field label="Date of Birth">
            <input type="date" className={inp} value={form.date_of_birth} onChange={e => setF("date_of_birth", e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="First Name" required>
            <input className={inp} value={form.first_name} onChange={e => setF("first_name", e.target.value)} />
          </Field>
          <Field label="Middle Name">
            <input className={inp} value={form.middle_name} onChange={e => setF("middle_name", e.target.value)} />
          </Field>
          <Field label="Last Name" required>
            <input className={inp} value={form.last_name} onChange={e => setF("last_name", e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Country Code" required>
            <input className={inp} value={form.country_code} onChange={e => setF("country_code", e.target.value)} placeholder="+91" />
          </Field>
          <Field label="Mobile" required>
            <input className={inp} value={form.mobile} onChange={e => setF("mobile", e.target.value)} />
          </Field>
          <Field label="Alternate Mobile">
            <input className={inp} value={form.alternate_mobile} onChange={e => setF("alternate_mobile", e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Email" required>
            <input type="email" className={inp} value={form.email} onChange={e => setF("email", e.target.value)} />
          </Field>
          <Field label="Spouse Name">
            <input className={inp} value={form.spouse_name} onChange={e => setF("spouse_name", e.target.value)} />
          </Field>
          <Field label="Marriage Anniversary">
            <input type="date" className={inp} value={form.marriage_anniversary} onChange={e => setF("marriage_anniversary", e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Sales Consultant">
            <input className={inp} value={form.sales_consultant} onChange={e => setF("sales_consultant", e.target.value)} />
          </Field>
          <Field label="Take Over Manager">
            <input className={inp} value={form.take_over_manager} onChange={e => setF("take_over_manager", e.target.value)} />
          </Field>
          <Field label="DSA">
            <select className={sel} value={form.dsa} onChange={e => setF("dsa", e.target.value)}>
              <option value="">—</option>
              <option value="VENUE">Venue</option>
              <option value="CSDO">CSDO</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Reference By">
            <input className={inp} value={form.reference_by} onChange={e => setF("reference_by", e.target.value)} />
          </Field>
          <Field label="Status" required>
            <select className={sel} value={form.status} onChange={e => setF("status", e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </Field>
          <Field label="Remarks">
            <input className={inp} value={form.remarks} onChange={e => setF("remarks", e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <p className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3">Address</p>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3">
            <Field label="Primary Address">
              <textarea rows={2} className={`${inp} resize-none`} value={addr.primary_address} onChange={e => setA("primary_address", e.target.value)} />
            </Field>
          </div>
          <Field label="Primary State">
            <input className={inp} value={addr.primary_state} onChange={e => setA("primary_state", e.target.value)} />
          </Field>
          <Field label="Primary Pincode">
            <input className={inp} value={addr.primary_pincode} onChange={e => setA("primary_pincode", e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3">
            <Field label="Secondary Address">
              <textarea rows={2} className={`${inp} resize-none`} value={addr.secondary_address} onChange={e => setA("secondary_address", e.target.value)} />
            </Field>
          </div>
          <Field label="Secondary State">
            <input className={inp} value={addr.secondary_state} onChange={e => setA("secondary_state", e.target.value)} />
          </Field>
          <Field label="Secondary Pincode">
            <input className={inp} value={addr.secondary_pincode} onChange={e => setA("secondary_pincode", e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Save */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
        {toast && (
          <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg flex-1 ${
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
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors ml-auto"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
