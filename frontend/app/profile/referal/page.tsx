"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Gift,
  Share2,
  Users,
  Coins,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import Image from "next/image";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "VACAY2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: Share2,
      title: "Share your code",
      desc: "Send your unique code to friends and family.",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: UserPlus,
      title: "They join Tourvia",
      desc: "Friends sign up using your referral code.",
      color: "text-violet-500",
      bg: "bg-violet-50",
    },
    {
      icon: Gift,
      title: "You both earn",
      desc: "You each get 500 points when they book their first trip.",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ];

  const recentReferrals = [
    {
      id: 1,
      name: "Emma Thompson",
      date: "Oct 12, 2026",
      status: "Reward",
      points: "+500",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    {
      id: 2,
      name: "Michael Chen",
      date: "Oct 08, 2026",
      status: "Pending",
      points: "0",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 3,
      name: "Sarah Williams",
      date: "Sep 25, 2026",
      status: "Claimed",
      points: "+500",
      avatar: "https://i.pravatar.cc/150?img=42",
    },
    {
      id: 4,
      name: "David Garcia",
      date: "Sep 15, 2026",
      status: "Claimed",
      points: "+500",
      avatar: "https://i.pravatar.cc/150?img=33",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">
          Refer & Earn
        </h2>
        <p className="text-slate-500 max-w-2xl">
          Invite your friends to Tourvia and earn exclusive reward points. Use
          your points to unlock premium bookings and VIP experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main CTA & Steps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Referral Card */}
          <div className="bg-linear-to-br from-blue-400 to-blue-600 rounded-3xl p-1 relative overflow-hidden shadow-xl">
            <div className="rounded-[23px] p-8 md:p-10 relative z-10 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-lg rounded-full border border-white/20 mb-4">
                  <span className="text-sm font-medium tracking-wide">
                    Give 500, Get 500
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold font-marcellus mb-3">
                  Share the magic of travel.
                </h3>
                <p className="text-blue-100 font-medium max-w-sm mx-auto md:mx-0">
                  Your friends get 500 bonus points on signup, and you get 500
                  points when they book!
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl border border-white/20 w-full md:w-auto shrink-0 text-center">
                <p className="text-sm text-blue-200 font-medium mb-3 uppercase tracking-wider">
                  Your Referral Code
                </p>
                <div className="flex items-center justify-center gap-3 p-2 rounded-xl border border-white/30">
                  <span className="font-mono text-2xl font-bold tracking-widest px-4 text-white">
                    {referralCode}
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`p-3 rounded-lg transition-all cursor-pointer ${
                      copied
                        ? "bg-emerald-500 text-white"
                        : "bg-blue-500 hover:bg-blue-500/80 text-white"
                    }`}
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Steps */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 font-marcellus mb-6">
              How it works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] relative z-10 group hover:-translate-y-1 transition-transform duration-300"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Decorative line connecting steps on desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-slate-200 z-0"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Recent Referrals */}
        <div className="space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                Total Referrals
              </p>
              <h4 className="text-2xl font-bold text-slate-800">12</h4>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                Points Earned
              </p>
              <h4 className="text-2xl font-bold text-slate-800">4,500</h4>
            </div>
          </div>

          {/* Recent Referrals List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 font-marcellus">
                Recent Friends
              </h3>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center transition-colors">
                See all <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {recentReferrals.map((user) => (
                <div
                  key={user.id}
                  className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {user.name}
                      </h4>
                      <p className="text-xs text-slate-500">{user.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        user.points !== "0"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {user.status}
                    </span>
                    <p
                      className={`text-sm font-bold ${
                        user.points !== "0"
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      {user.points !== "0" ? `${user.points} pts` : "--"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
