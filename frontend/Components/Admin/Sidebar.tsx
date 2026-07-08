"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Package,
  MapPin,
  LogOut,
  Hotel,
  Mail,
  ReceiptText,
  FilePlus,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { clearAuth, getStoredUser } from "@/lib/api";
import { hasAccess } from "@/lib/permissions";

const sections = [
  {
    label: null,
    items: [
      { href: "/admin/dashboard",                label: "Dashboard",          icon: LayoutDashboard, subtitle: null, section: "dashboard" },
    ],
  },
  {
    label: "Operations",
    items: [

      { href: "/admin/clients",                   label: "All Clients Details", icon: Users,          subtitle: null,                    section: "clients" },
      { href: "/admin/create-invoice",            label: "Create New Invoice", icon: FilePlus,        subtitle: "For existing clients",   section: "create_invoice" },
      { href: "/admin/invoices",                  label: "All Invoices",       icon: ReceiptText,     subtitle: null,                    section: "invoices" },
    ],
  },
  {
    label: "Catalog",
    items: [

      { href: "/admin/hotels",                    label: "Hotels",             icon: Hotel,           subtitle: null, section: "hotels" },
      { href: "/admin/locations",                 label: "Locations",          icon: MapPin,          subtitle: null, section: "locations" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings/email-template",            label: "Email Template",     icon: Mail,        subtitle: null, section: "email_template" },
      { href: "/admin/settings/panel-users/create",        label: "Create Panel User",  icon: UserPlus,    subtitle: null, section: "panel_users" },
      { href: "/admin/settings/panel-users",               label: "All Panel Users",    icon: ShieldCheck, subtitle: null, section: "panel_users" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getStoredUser();

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
          <Settings className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Peltown</p>
          <p className="text-slate-500 text-xs">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {sections.map((section, si) => {
          const visibleItems = section.items.filter((item) => hasAccess(user, item.section));
          if (visibleItems.length === 0) return null;
          return (
            <div key={si}>
              {section.label && (
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-1">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map(({ href, label, icon: Icon, subtitle }) => {
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
          );
        })}
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
