"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Briefcase } from "lucide-react";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState("");

  useEffect(() => {
    if (pathname === "/staff/login") return;
    const token = localStorage.getItem("staff_token");
    if (!token) { router.replace("/staff/login"); return; }
    const raw = localStorage.getItem("staff_user");
    if (raw) { try { setName(JSON.parse(raw).full_name ?? ""); } catch {} }
  }, [pathname, router]);

  function logout() {
    localStorage.removeItem("staff_token");
    localStorage.removeItem("staff_user");
    router.replace("/staff/login");
  }

  if (pathname === "/staff/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">Staff Portal</span>
        </div>
        <div className="flex items-center gap-4">
          {name && <span className="text-sm text-slate-600">Hi, <span className="font-medium text-slate-800">{name}</span></span>}
          <button onClick={logout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
