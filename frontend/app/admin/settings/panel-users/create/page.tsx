"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { SECTIONS } from "@/lib/permissions";
import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

const inp =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
const sel = inp;

const ROLES = ["ADMIN", "MANAGER", "AGENT"] as const;
type Role = (typeof ROLES)[number];

const ASSIGNABLE_SECTIONS = SECTIONS.filter((s) => !s.adminOnly);

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

function SectionPicker({ selected, onChange }: { selected: string[]; onChange: (k: string[]) => void }) {
  function toggle(key: string) {
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
  }
  const all = ASSIGNABLE_SECTIONS.every((s) => selected.includes(s.key));
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200">
        <input type="checkbox" checked={all}
          onChange={() => onChange(all ? [] : ASSIGNABLE_SECTIONS.map((s) => s.key))}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-xs font-semibold text-slate-600">Select all sections</span>
      </div>
      <div className="grid grid-cols-2">
        {ASSIGNABLE_SECTIONS.map((s, i) => (
          <label key={s.key}
            className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-slate-50 border-b border-slate-100 ${
              i % 2 === 1 ? "border-l border-slate-100" : ""
            } ${i >= ASSIGNABLE_SECTIONS.length - (ASSIGNABLE_SECTIONS.length % 2 === 0 ? 2 : 1) ? "border-b-0" : ""}`}
          >
            <input type="checkbox" checked={selected.includes(s.key)} onChange={() => toggle(s.key)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700">{s.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function CreatePanelUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "AGENT" as Role,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    allowed_sections: [] as string[],
  });

  function setF(k: keyof typeof form, v: unknown) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit() {
    if (!form.email) { setError("Email is required."); return; }
    if (!form.password) { setError("Password is required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setSaving(true); setError("");
    try {
      const payload = {
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        email: form.email,
        password: form.password,
        role: form.role,
        status: form.status,
        allowed_sections: form.role === "ADMIN" ? null : form.allowed_sections,
      };

      const res = await api.post<{ success: boolean; message?: string }>("/users", payload);
      if (!res?.success) throw new Error(res?.message ?? "Failed to create user.");

      router.push("/admin/settings/panel-users");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Panel User</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add a new admin panel account with specific section access</p>
        </div>
      </div>

      {/* Personal details */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <UserPlus className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Account Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">Name, email and login credentials</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name">
            <input className={inp} value={form.first_name} onChange={(e) => setF("first_name", e.target.value)} placeholder="First name" />
          </Field>
          <Field label="Last Name">
            <input className={inp} value={form.last_name} onChange={(e) => setF("last_name", e.target.value)} placeholder="Last name" />
          </Field>
        </div>

        <Field label="Email" required>
          <input type="email" className={inp} value={form.email} onChange={(e) => setF("email", e.target.value)} placeholder="user@example.com" />
        </Field>

        <Field label="Password" required>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              className={inp + " pr-10"}
              value={form.password}
              onChange={(e) => setF("password", e.target.value)}
              placeholder="Min. 6 characters"
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Role">
            <select className={sel} value={form.role} onChange={(e) => setF("role", e.target.value as Role)}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={sel} value={form.status} onChange={(e) => setF("status", e.target.value as "ACTIVE" | "INACTIVE")}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Section access */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Section Access</h2>
            <p className="text-xs text-slate-500 mt-0.5">Choose which sections this user can access</p>
          </div>
        </div>

        {form.role === "ADMIN" ? (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-purple-50 border border-purple-100 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
            <p className="text-sm text-purple-700 font-medium">ADMIN role has full access to all sections automatically.</p>
          </div>
        ) : (
          <SectionPicker
            selected={form.allowed_sections}
            onChange={(k) => setF("allowed_sections", k)}
          />
        )}
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
          {saving ? "Creating…" : "Create Panel User"}
        </button>
      </div>
    </div>
  );
}
