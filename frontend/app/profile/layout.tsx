"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { getMemberToken, getStoredMemberUser, memberLogout, memberApi, saveMemberAuth, getMemberRefreshToken } from "@/lib/member-api";

interface MeUser {
  user_id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: string;
  client_id?: number | null;
  membership?: { membership_number: string; status: string } | null;
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<MeUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = getMemberToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const stored = getStoredMemberUser<MeUser>();
    if (stored) setUser(stored);

    memberApi.get<{ success: boolean; data: MeUser }>("/auth/me")
      .then((res) => {
        if (res?.success && res.data) {
          setUser(res.data);
          // Refresh stored user with latest data
          const refreshToken = getMemberRefreshToken();
          if (token && refreshToken) saveMemberAuth(token, refreshToken, res.data);
        } else {
          router.replace("/login");
        }
      })
      .catch(() => router.replace("/login"))
      .finally(() => setAuthChecked(true));
  }, [router]);

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

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || "Member";
  const memberNo = user?.membership?.membership_number ?? "";

  if (!authChecked && !getStoredMemberUser()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className={`fixed z-50 flex flex-col md:flex-row md:items-center justify-between transition-all duration-300 ${
        isScrolled
          ? "top-0 md:top-4 inset-x-0 md:inset-x-8 lg:inset-x-12 bg-white/90 backdrop-blur-xl md:rounded-full py-3 px-4 md:px-6 shadow-md border-b md:border border-slate-200"
          : "inset-x-0 top-0 bg-white md:bg-transparent py-4 md:py-6 px-6 md:px-12 lg:px-24 border-b border-slate-100 md:border-none"
      }`}>
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center">
            <Image src="/Img/logo.png" alt="Logo" width={150} height={30} className="h-8 w-auto object-cover" />
          </Link>

          <div className="flex items-center gap-4 md:hidden">
            <div className="relative cursor-pointer border-2 border-blue-600 rounded-full">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-slate-700">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Center Navigation */}
        <div className={`hidden md:flex flex-1 overflow-x-auto scrollbar-hide mx-6 transition-colors duration-300 ${
          isScrolled ? "bg-transparent" : "bg-white/50 backdrop-blur-md rounded-full border border-slate-200"
        }`}>
          <div className="flex items-center gap-3 px-2 mx-auto py-2">
            {navigation.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link key={item.url} href={item.url}
                  className={`flex items-center whitespace-nowrap gap-1 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-black"
                  }`}>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side Avatar */}
        <div className="hidden md:block relative group shrink-0">
          <div className="relative cursor-pointer border-2 border-blue-600 rounded-full hover:shadow-lg transition-shadow">
            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="absolute right-0 top-full pt-3 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2">
              <div className="px-4 py-3 border-b border-slate-100 mb-1">
                <p className="text-sm font-bold text-slate-800">{fullName}</p>
                {memberNo && <p className="text-xs text-slate-500">{memberNo}</p>}
              </div>
              <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                <Bell className="w-4 h-4 text-slate-400" />
                Notifications
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button
                onClick={() => memberLogout()}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-100 rounded-2xl opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}>
          <div className="flex flex-col gap-1 py-2 border-t border-slate-100">
            {navigation.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link key={item.url} href={item.url} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive ? "bg-black text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}>
                  {item.name}
                </Link>
              );
            })}
            <div className="h-px bg-slate-100 my-1" />
            <button onClick={() => memberLogout()}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-4 md:px-8 lg:px-24">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
