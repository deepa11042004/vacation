"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Package,
  MapPin,
  LogOut,
  Hotel,
  Route,
  Plane,
  Mail,
  ReceiptText,
  FilePlus,
  ShieldCheck,
  Settings,
  Menu,
  UserCog,
  MessageSquare,
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

      { href: "/admin/clients",                   label: "All Clients", icon: Users,          subtitle: null,                    section: "clients" },
      { href: "/admin/staff",                     label: "Staff",              icon: UserCog,         subtitle: null,                    section: "staff" },
      { href: "/admin/travel-queries",             label: "Travel Queries",     icon: Plane,           subtitle: null,                    section: "travel_queries" },
      { href: "/admin/enquiries",                  label: "Enquiries",          icon: MessageSquare,   subtitle: null,                    section: "enquiries" },
      { href: "/admin/create-invoice",            label: "Create New Invoice", icon: FilePlus,        subtitle: "For existing clients",   section: "create_invoice" },
      { href: "/admin/invoices",                  label: "All Invoices",       icon: ReceiptText,     subtitle: null,                    section: "invoices" },
    ],
  },
  {
    label: "Gift Voucher",
    items: [
      { href: "/admin/vouchers/create",           label: "Create Voucher",     icon: FilePlus,        subtitle: "Generate gift voucher",  section: "vouchers" },
      { href: "/admin/vouchers",                  label: "All Vouchers",       icon: ReceiptText,     subtitle: "Manage & resend email",  section: "vouchers" },
    ],
  },
  {
    label: "Catalog",
    items: [

      { href: "/admin/hotels",                    label: "Hotels",             icon: Hotel,           subtitle: null, section: "hotels" },
      { href: "/admin/locations",                 label: "Locations",          icon: MapPin,          subtitle: null, section: "locations" },
      { href: "/admin/itineraries",               label: "Itineraries",        icon: Route,           subtitle: null, section: "itineraries" },
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

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen?: boolean, setMobileMenuOpen?: (val: boolean) => void } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getStoredUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <aside className={`print:hidden flex flex-col h-screen overflow-hidden bg-slate-900 shrink-0 transition-all duration-300 fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} ${isCollapsed ? "md:w-20 w-64" : "w-64 md:w-60"}`}>
      <div className={`flex items-center px-5 py-5 border-b border-slate-800 ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <div className="flex items-center w-full justify-center pl-2">
            <Image
              src="/mandarine logo.PNG"
              alt="Mandarin Worldwide Vacations Logo"
              width={200}
              height={80}
              className="h-16 sm:h-20 w-auto object-contain"
              priority
            />
          </div>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-slate-400 hover:text-white transition-colors p-1">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto sidebar-scrollbar">
        {sections.map((section, si) => {
          const visibleItems = section.items.filter((item) => hasAccess(user, item.section));
          if (visibleItems.length === 0) return null;
          return (
            <div key={si}>
              {section.label && !isCollapsed && (
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
                      onClick={() => setMobileMenuOpen?.(false)}
                      title={isCollapsed ? label : undefined}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      } ${isCollapsed ? "justify-center" : ""}`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="flex flex-col leading-tight">
                          <span>{label}</span>
                          {subtitle && (
                            <span className={`text-[10px] font-normal mt-0.5 ${active ? "text-blue-200" : "text-slate-600"}`}>
                              {subtitle}
                            </span>
                          )}
                        </span>
                      )}
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
          title={isCollapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
