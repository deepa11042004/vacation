"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, LogOut } from "lucide-react";
import Image from "next/image";
import Book from "@/Components/Home/Book";
import Destination from "@/Components/Home/Destination";

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
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
    { id: "dashboard", name: "Dashboard overview" },
    { id: "book_now", name: "Book Now" },
    { id: "bookings", name: "Booking History" },
    { id: "referrals", name: "Referrals" },
    { id: "settings", name: "Settings" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus">
              Welcome back, John Doe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500 font-medium">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-2">12</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500 font-medium">
                  Active Referrals
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-2">4</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500 font-medium">
                  Reward Points
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-2">2,450</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Recent Activity
              </h3>
              <p className="text-slate-500">
                Your recent activity will appear here. Start exploring
                destinations!
              </p>
            </div>
          </div>
        );
      case "book_now":
        return (
          <div className="flex flex-col w-full">
            <Book />
            <Destination />
          </div>
        );
      case "bookings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus">
              Booking History
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800">
                    Santorini Coastal Villa
                  </h4>
                  <p className="text-sm text-slate-500">
                    Aug 15 - Aug 22, 2026
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Completed
                </span>
              </div>
              <div className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800">
                    Swiss Alps Resort
                  </h4>
                  <p className="text-sm text-slate-500">
                    Dec 10 - Dec 17, 2026
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        );
      case "referrals":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus">
              Your Referrals
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-semibold text-slate-800">
                    Your Referral Code
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Share this code with friends to earn rewards.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white px-4 py-2 rounded-lg font-mono font-bold text-lg border border-slate-200 tracking-wider">
                    VACAY2026
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800 font-marcellus">
              Account Settings
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500">
                Settings configuration options will go here.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
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
          className="text-xl md:text-3xl font-[--font-marcellus] text-slate-900 font-bold"
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
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-blue-100/50 hover:text-gray-900"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Right Side Avatar & Dropdown */}
        <div className="relative group">
          <div className="relative cursor-pointer">
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
      <main className={`pt-32 pb-16 ${activeTab === 'book_now' ? 'px-0' : 'px-6 md:px-12 lg:px-40'}`}>
        <div className={activeTab === 'book_now' ? 'w-full' : 'max-w-5xl mx-auto'}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
