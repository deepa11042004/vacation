"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, X, Loader2, ChevronRight } from "lucide-react";
import Image from "next/image";
import {
  getMemberToken,
  getStoredMemberUser,
  memberLogout,
  memberApi,
  saveMemberAuth,
  getMemberRefreshToken,
} from "@/lib/member-api";

interface MeUser {
  user_id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: string;
  client_id?: number | null;
  membership?: { membership_number: string; status: string } | null;
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<MeUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect(() => {
  //   const token = getMemberToken();
  //   if (!token) {
  //     router.replace("/login");
  //     return;
  //   }

  //   const stored = getStoredMemberUser<MeUser>();
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   if (stored) setUser(stored);

  //   memberApi
  //     .get<{ success: boolean; data: MeUser }>("/auth/me")
  //     .then((res) => {
  //       if (res?.success && res.data) {
  //         setUser(res.data);
  //         // Refresh stored user with latest data
  //         const refreshToken = getMemberRefreshToken();
  //         if (token && refreshToken)
  //           saveMemberAuth(token, refreshToken, res.data);
  //       } else {
  //         router.replace("/login");
  //       }
  //     })
  //     .catch(() => router.replace("/login"))
  //     .finally(() => setAuthChecked(true));
  // }, [router]);

  const navigation = [
    { url: "/profile", name: "My Profile" },
    { url: "/profile/my-membership", name: "My Membership" },
    { url: "/profile/payment-history", name: "Payment History" },
    { url: "/profile/amc-status", name: "AMC Status" },
    { url: "/profile/booking-history", name: "Booking History" },
    { url: "/profile/hotels-benefits", name: "Hotels & Benefits" },
    { url: "/profile/my-offers", name: "My Offers" },
    { url: "/profile/invoices", name: "Invoices" },
  ];

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Member";
  const memberNo = user?.membership?.membership_number ?? "";

  // if (!authChecked && !getStoredMemberUser()) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-50">
  //       <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center rounded-b-2xl justify-between bg-white p-4 border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center">
          <Image
            src="/Img/fulllogo.png"
            alt="Logo"
            width={120}
            height={24}
            className="h-15 md:h-20 w-auto object-contain"
          />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -mr-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center p-16 border-b border-slate-100 h-20 shrink-0">
          <Link href="/">
            <Image
              src="/Img/fulllogo.png"
              alt="Logo"
              width={150}
              height={30}
              className="h-15 md:h-20 w-auto object-contain"
            />
          </Link>
        </div>

        {/* User Profile Summary */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 shrink-0 bg-slate-50/50">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow-sm">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">
              {fullName}
            </p>
            {memberNo && (
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                {memberNo}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1.5 scrollbar-hide">
          {navigation.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.url}
                href={item.url}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2 shrink-0 bg-slate-50/50">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">
            <Bell className="w-5 h-5 text-slate-400" />
            Notifications
          </button>
          <button
            onClick={() => memberLogout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-red-100 transition-all"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 w-full transition-all duration-300 h-screen overflow-y-auto">
        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
