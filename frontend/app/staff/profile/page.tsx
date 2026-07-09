"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Phone, Mail, Briefcase, Building2, Calendar, BadgeCheck } from "lucide-react";

interface StaffProfile {
  staff_id: number;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  designation?: string | null;
  department?: string | null;
  joining_date?: string | null;
  status: string;
}

function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function Field({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function StaffProfilePage() {
  const router  = useRouter();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("staff_token");
    if (!token) { router.replace("/staff/login"); return; }

    const cached = localStorage.getItem("staff_user");
    if (cached) {
      try { setProfile(JSON.parse(cached)); } catch {}
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="flex justify-center pt-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  }

  if (!profile) return null;

  const statusColor = profile.status === "ACTIVE"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-slate-100 text-slate-500";

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-white">
            {profile.full_name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-800 truncate">{profile.full_name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {profile.designation || "Staff Member"}{profile.department ? ` · ${profile.department}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor}`}>{profile.status}</span>
          <span className="text-xs font-mono text-slate-400">{profile.employee_id}</span>
        </div>
      </div>

      {/* Details card */}
      <div className="bg-white rounded-2xl border border-slate-200 px-6">
        <Field icon={User}       label="Full Name"    value={profile.full_name} />
        <Field icon={Mail}       label="Email"        value={profile.email} />
        <Field icon={Phone}      label="Phone"        value={profile.phone} />
        <Field icon={Briefcase}  label="Designation"  value={profile.designation} />
        <Field icon={Building2}  label="Department"   value={profile.department} />
        <Field icon={Calendar}   label="Joining Date" value={fmtDate(profile.joining_date)} />
        <Field icon={BadgeCheck} label="Employee ID"  value={profile.employee_id} />
      </div>

      <p className="text-center text-xs text-slate-400">This is a read-only view of your profile. Contact admin for any changes.</p>
    </div>
  );
}
