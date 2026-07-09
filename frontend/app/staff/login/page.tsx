"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2, Briefcase } from "lucide-react";

const inp = "w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email,  setEmail]  = useState("");
  const [phone,  setPhone]  = useState("");
  const [error,  setError]  = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !phone) { setError("Email and phone number are required."); return; }
    setLoading(true); setError("");
    try {
      const res = await api.post<{ data: { token: string; staff: any } }>("/staff/auth/login", { email, phone });
      localStorage.setItem("staff_token", res.data.token);
      localStorage.setItem("staff_user", JSON.stringify(res.data.staff));
      router.replace("/staff/profile");
    } catch (e: any) {
      setError(e?.message ?? "Invalid email or phone number.");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-3">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Staff Login</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in with your email &amp; phone number</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
            <input className={inp} type="email" placeholder="you@company.com"
              value={email} onChange={e => { setEmail(e.target.value); setError(""); }} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number</label>
            <input className={inp} type="tel" placeholder="Your registered phone number"
              value={phone} onChange={e => { setPhone(e.target.value); setError(""); }} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors mt-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
