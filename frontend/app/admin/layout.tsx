"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/Components/Admin/Sidebar";
import Topbar from "@/Components/Admin/Topbar";
import { getStoredUser } from "@/lib/api";
import { getRouteSection, hasAccess } from "@/lib/permissions";
import { ShieldOff } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLogin) { setAuthorized(true); return; }

    const t = localStorage.getItem("admin_token");
    if (!t) { router.replace("/admin/login"); return; }

    const user = getStoredUser();
    const section = getRouteSection(pathname);

    if (section && !hasAccess(user, section)) {
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;

  if (authorized === false) {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <ShieldOff className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-700">Access Restricted</h2>
                <p className="text-sm text-slate-400 mt-1">You don&apos;t have permission to view this section.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (authorized === null) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 print:h-auto print:overflow-visible print:bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden print:overflow-visible print:block">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 print:overflow-visible print:block print:p-0">{children}</main>
      </div>
    </div>
  );
}
