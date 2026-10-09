"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Briefcase, User, Ticket, PlusCircle } from "lucide-react";

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

  const isProfile = pathname === "/staff/profile";
  const isVouchers = pathname === "/staff/vouchers";
  const isCreateVoucher = pathname === "/staff/vouchers/create";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Staff Portal</span>
          </div>

          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <Link
              href="/staff/profile"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isProfile ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </Link>
            <Link
              href="/staff/vouchers"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isVouchers ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>All Vouchers</span>
            </Link>
            <Link
              href="/staff/vouchers/create"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCreateVoucher ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Voucher</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {name && <span className="text-sm text-slate-600">Hi, <span className="font-medium text-slate-800">{name}</span></span>}
          <button onClick={logout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
