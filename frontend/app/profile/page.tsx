"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { memberApi } from "@/lib/member-api";

interface ClientProfile {
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  mobile?: string | null;
  country_code?: string | null;
  gender?: string | null;
  ClientAddress?: { primary_address?: string | null; primary_state?: string | null; primary_pincode?: string | null } | null;
}

interface MeResponse {
  user_id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  client_id?: number | null;
  membership?: { membership_number: string; status: string; package_name?: string } | null;
  clientProfile?: ClientProfile | null;
}

export default function MyProfilePage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memberApi.get<{ success: boolean; data: MeResponse }>("/auth/me")
      .then((res) => { if (res?.success) setMe(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const cp = me?.clientProfile;
  const fullName = [cp?.first_name ?? me?.first_name, cp?.last_name ?? me?.last_name].filter(Boolean).join(" ") || "Member";
  const email = cp?.email ?? me?.email ?? "";
  const mobile = cp?.mobile ? `${cp.country_code ?? ""} ${cp.mobile}`.trim() : "";
  const address = cp?.ClientAddress;
  const addressText = [address?.primary_address, address?.primary_state, address?.primary_pincode].filter(Boolean).join(", ");
  const memberNo = me?.membership?.membership_number ?? "";

  const fields = [
    { icon: User, label: "Full Name", value: fullName },
    { icon: Mail, label: "Email Address", value: email },
    { icon: Phone, label: "Phone Number", value: mobile || "—" },
    ...(addressText ? [{ icon: MapPin, label: "Residential Address", value: addressText }] : []),
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">My Profile</h2>
        <p className="text-slate-500 max-w-2xl">Your personal information and membership details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-blue-50 to-white"></div>
            <div className="relative mt-4 mb-6">
              <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white">
                {fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 font-marcellus mb-1">{fullName}</h3>
            {memberNo && <p className="text-blue-600 font-medium text-sm mb-1">{memberNo}</p>}
            {me?.membership?.package_name && (
              <p className="text-xs text-slate-400 mb-2">{me.membership.package_name}</p>
            )}
            {me?.membership?.status && (
              <span className="mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full">
                {me.membership.status}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <h3 className="text-xl font-bold text-slate-800 font-marcellus mb-8">Contact Information</h3>
            <div className="space-y-6">
              {fields.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                    <Icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-slate-800 font-medium">{value}</p>
                  </div>
                </div>
              ))}
              {cp?.gender && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Gender</p>
                    <p className="text-slate-800 font-medium capitalize">{cp.gender.toLowerCase()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
