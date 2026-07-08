"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import Image from "next/image";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { url: "/profile", name: "Dashboard overview" },
    { url: "/profile/book-now", name: "Book Now" },
    { url: "/profile/booking", name: "Booking History" },
    { url: "/profile/referal", name: "Referrals" },
    { url: "/profile/settings", name: "Settings" },
  ];

  const isBookNow = pathname === "/profile/book-now";

  return (
    <div className="min-h-screen bg-white">
      {/* Horizontal Navbar Profile Edition */}
      <nav
        className={`fixed z-50 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "top-4 inset-x-4 md:inset-x-8 lg:inset-x-32 bg-blue-50 rounded-full py-3 px-4 md:px-6 shadow-md"
            : "inset-x-0 top-0 bg-transparent py-6 px-6 md:px-12 lg:px-40"
        }`}
      >
        {/* Left Side Logo */}
        <Link
          href="/"
          className="text-xl md:text-4xl font-[--font-marcellus] text-black"
        >
          Tourvia.
        </Link>

        {/* Center Navigation */}
        <div
          className={`hidden lg:flex items-center gap-1 rounded-full px-2 py-2 transition-colors duration-300 ${
            isScrolled ? "bg-transparent" : "bg-blue-50 border border-slate-200"
          }`}
        >
          {navigation.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-blue-100/50 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side Avatar & Dropdown */}
        <div className="relative group">
          <div className="relative cursor-pointer border-2 border-blue-600 rounded-full">
            <Image
              src="https://i.pravatar.cc/150?img=11"
              alt="User Avatar"
              width={50}
              height={50}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            {/* Green dot for active status */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          {/* Dropdown Menu on Hover */}
          <div className="absolute right-0 top-full pt-2 w-48 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden py-2">
              <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                <Bell className="w-4 h-4 text-slate-400" />
                Notifications
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium">
                <LogOut className="w-4 h-4 text-red-400" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main
        className={`pt-32 pb-16 ${
          isBookNow ? "px-0" : "px-6 md:px-12 lg:px-40"
        }`}
      >
        <div className={isBookNow ? "w-full" : "max-w-5xl mx-auto"}>
          {children}
        </div>
      </main>
    </div>
  );
}
