"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getStoredUser, logout } from "@/lib/api";
import { UserCircle, LogOut } from "lucide-react";

const titles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/clients": "Clients",
  "/admin/memberships": "Memberships",
  "/admin/payments": "Payments",
  "/admin/packages": "Packages",
  "/admin/hotels": "Hotels",
  "/admin/locations": "Locations",
};

function getTitle(pathname: string) {
  for (const [key, label] of Object.entries(titles)) {
    if (pathname === key || pathname.startsWith(key + "/")) return label;
  }
  return "Admin";
}

export default function Topbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(
    null,
  );

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-slate-800 font-bold text-base">
        {getTitle(pathname)}
      </h1>
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-slate-400" />
          <span className="font-medium">{user?.email ?? "Admin"}</span>
          {user?.role && (
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {user.role}
            </span>
          )}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </header>
  );
}
