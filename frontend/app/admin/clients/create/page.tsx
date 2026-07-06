"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Loader2, User } from "lucide-react";

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

export default function CreateClientPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const [form, setForm] = useState({
    first_name: "", middle_name: "", last_name: "",
    gender: "MALE", date_of_birth: "", spouse_name: "",
    mobile: "", alternate_mobile: "", country_code: "+91",
    email: "", marriage_anniversary: "",
  });

  const [addr, setAddr] = useState({
    primary_address: "", primary_state: "", primary_pincode: "",
    secondary_address: "", secondary_state: "", secondary_pincode: "",
  });
  const [sameAddress, setSameAddress] = useState(false);

  function setF(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  function setA(k: string, v: string) { setAddr(f => ({ ...f, [k]: v })); }

  function onSameAddress(checked: boolean) {
    setSameAddress(checked);
    if (checked) {
      setAddr(f => ({
        ...f,
        secondary_address: f.primary_address,
        secondary_state:   f.primary_state,
        secondary_pincode: f.primary_pincode,
      }));
    }
  }

  async function handleSubmit() {
    if (!form.first_name || !form.last_name || !form.mobile || !form.email || !form.gender) {
      setError("First name, last name, mobile, email and gender are required."); return;
    }
    setSaving(true); setError("");
    try {
      const clientPayload: Record<string, string> = { status: "INACTIVE" };
      Object.entries(form).forEach(([k, v]) => { if (v) clientPayload[k] = v; });

      const res = await api.post<{ success: boolean; data?: { client_id: number }; message?: string }>(
        "/clients", clientPayload,
      );
      if (!res?.success) throw new Error(res?.message ?? "Failed to create client.");

      const clientId = res.data?.client_id;
      if (!clientId) throw new Error("No client ID returned.");

      const hasAddress = addr.primary_address || addr.primary_state || addr.primary_pincode;
      if (hasAddress) {
        await api.put(`/clients/${clientId}/address`, addr);
      }

      router.push(`/admin/clients/${clientId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create New Client</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add a client without a membership — you can attach one later from their profile</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {/* Section header */}
        <div className="flex items-start gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Personal Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">Client&apos;s contact and identity information</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="First Name" required>
            <input className={inp} value={form.first_name} onChange={e => setF("first_name", e.target.value)} placeholder="First name" />
          </Field>
          <Field label="Middle Name">
            <input className={inp} value={form.middle_name} onChange={e => setF("middle_name", e.target.value)} placeholder="Middle name" />
          </Field>
          <Field label="Last Name" required>
            <input className={inp} value={form.last_name} onChange={e => setF("last_name", e.target.value)} placeholder="Last name" />
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
          <Field label="Spouse Name">
            <input className={inp} value={form.spouse_name} onChange={e => setF("spouse_name", e.target.value)} placeholder="Spouse name" />
          </Field>

          <Field label="Marriage Anniversary">
            <input type="date" className={inp} value={form.marriage_anniversary} onChange={e => setF("marriage_anniversary", e.target.value)} />
          </Field>
          <Field label="Country Code">
            <input className={inp} value={form.country_code} onChange={e => setF("country_code", e.target.value)} placeholder="+91" />
          </Field>
          <Field label="Mobile" required>
            <input className={inp} value={form.mobile} onChange={e => setF("mobile", e.target.value)} placeholder="Primary mobile" />
          </Field>

          <Field label="Alternate Mobile">
            <input className={inp} value={form.alternate_mobile} onChange={e => setF("alternate_mobile", e.target.value)} placeholder="Secondary mobile" />
          </Field>
          <div className="col-span-2">
            <Field label="Email" required>
              <input type="email" className={inp} value={form.email} onChange={e => setF("email", e.target.value)} placeholder="Email address" />
            </Field>
          </div>
        </div>

        {/* Address */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Address</p>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Primary Address">
              <input className={inp} value={addr.primary_address} onChange={e => setA("primary_address", e.target.value)} placeholder="Street / flat / building" />
            </Field>
            <Field label="State">
              <input className={inp} value={addr.primary_state} onChange={e => setA("primary_state", e.target.value)} placeholder="State" />
            </Field>
            <Field label="Pin Code">
              <input className={inp} value={addr.primary_pincode} onChange={e => setA("primary_pincode", e.target.value)} placeholder="Pin code" />
            </Field>
          </div>

          <label className="flex items-center gap-2 mt-3 mb-3 cursor-pointer select-none">
            <input type="checkbox" checked={sameAddress} onChange={e => onSameAddress(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
            <span className="text-sm text-slate-600">Secondary address same as primary</span>
          </label>

          {!sameAddress && (
            <div className="grid grid-cols-3 gap-4">
              <Field label="Secondary Address">
                <input className={inp} value={addr.secondary_address} onChange={e => setA("secondary_address", e.target.value)} placeholder="Street / flat / building" />
              </Field>
              <Field label="State">
                <input className={inp} value={addr.secondary_state} onChange={e => setA("secondary_state", e.target.value)} placeholder="State" />
              </Field>
              <Field label="Pin Code">
                <input className={inp} value={addr.secondary_pincode} onChange={e => setA("secondary_pincode", e.target.value)} placeholder="Pin code" />
              </Field>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex items-center justify-between pb-8">
        <button onClick={() => router.back()} className="px-5 py-2.5 text-sm text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 font-medium">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={saving}
          className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 shadow-sm shadow-blue-200">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Creating…" : "Create Client"}
        </button>
      </div>
    </div>
  );
}
