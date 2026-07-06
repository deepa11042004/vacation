"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Package,
  Building2,
  MapPin,
  LogOut,
  Hotel,
  Mail,
  ReceiptText,
  FilePlus,
} from "lucide-react";
import { clearAuth } from "@/lib/api";

const sections = [
  {
    label: null,
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, subtitle: null },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/clients/create", label: "Create New Client",  icon: UserPlus,     subtitle: null },
      { href: "/admin/clients",        label: "All Clients Details",        icon: Users,        subtitle: null },
      { href: "/admin/create-invoice", label: "Create New Invoice", icon: FilePlus,     subtitle: "For existing clients" },
      { href: "/admin/invoices",       label: "All Invoices",       icon: ReceiptText,  subtitle: null },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/packages", label: "Packages",   icon: Package, subtitle: null },
      { href: "/admin/hotels",   label: "Hotels",     icon: Hotel,   subtitle: null },
      { href: "/admin/locations", label: "Locations", icon: MapPin,  subtitle: null },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings/email-template", label: "Email Template", icon: Mail, subtitle: null },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearAuth();
    router.push("/admin/login");
  }

  function isActive(href: string) {
    if (pathname === href) return true;
    if (!pathname.startsWith(href + "/")) return false;
    const sub = pathname.slice(href.length + 1);
    return /^\d/.test(sub);
  }

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-slate-900 shrink-0">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Peltown</p>
          <p className="text-slate-500 text-xs">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-1">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon, subtitle }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex flex-col leading-tight">
                      <span>{label}</span>
                      {subtitle && (
                        <span className={`text-[10px] font-normal mt-0.5 ${active ? "text-blue-200" : "text-slate-600"}`}>
                          {subtitle}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
