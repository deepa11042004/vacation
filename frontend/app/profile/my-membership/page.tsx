"use client";

import React from "react";
import { CreditCard, Calendar, Moon, Award, Briefcase } from "lucide-react";

export default function MyMembershipPage() {
  const membershipData = {
    number: "MEM-MNDRN-88902",
    packageName: "Platinum Global Explorer",
    status: "Active",
    saleDate: "Jan 15, 2024",
    endDate: "Jan 14, 2034",
    validityYears: "10 Years",
    nightsPerYear: 14,
    nightsRemaining: 9,
    financials: {
      totalPrice: "$15,000",
      discount: "$2,000 (Launch Offer)",
      netPrice: "$13,000",
      outstandingBalance: "$4,500",
    },
    staff: {
      dsa: "Global Travel Partners LLC",
      consultant: "Sarah Jenkins",
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">
          My Membership
        </h2>
        <p className="text-slate-500 max-w-2xl">
          View your membership details, available nights, and financial summary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Membership Card & Nights */}
        <div className="lg:col-span-1 space-y-8">
          {/* Membership Premium Card */}
          <div className="bg-black rounded-3xl p-8 text-white shadow-2xl shadow-slate-300 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>

            <div className="relative z-10 flex flex-col h-full justify-between min-h-50">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">
                    MANDARIN WORLDWIDE
                  </p>
                  <h3 className="text-xl font-marcellus text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-yellow-500">
                    {membershipData.packageName}
                  </h3>
                </div>
                <Award className="w-8 h-8 text-amber-400 opacity-80" />
              </div>

              <div>
                <p className="font-mono text-lg tracking-widest text-white/90 mb-4">
                  {membershipData.number}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                      Valid Thru
                    </p>
                    <p className="text-sm font-medium">
                      {membershipData.endDate}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase rounded-full">
                    {membershipData.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nights Summary */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <h4 className="text-lg font-bold text-slate-800 font-marcellus mb-6 flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600" />
              Nights Overview
            </h4>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 font-medium">
                    Nights Remaining this year
                  </span>
                  <span className="text-slate-800 font-bold">
                    {membershipData.nightsRemaining} /{" "}
                    {membershipData.nightsPerYear}
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${(membershipData.nightsRemaining / membershipData.nightsPerYear) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Total Entitled
                  </p>
                  <p className="text-xl font-bold text-slate-800">
                    {membershipData.nightsPerYear}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Used
                  </p>
                  <p className="text-xl font-bold text-slate-800">
                    {membershipData.nightsPerYear -
                      membershipData.nightsRemaining}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info Grids */}
        <div className="lg:col-span-2 space-y-6">
          {/* Validity & Dates */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 font-marcellus">
                Term & Validity
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Sale Date</p>
                <p className="font-semibold text-slate-800">
                  {membershipData.saleDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">End Date</p>
                <p className="font-semibold text-slate-800">
                  {membershipData.endDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Validity</p>
                <p className="font-semibold text-slate-800">
                  {membershipData.validityYears}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 font-marcellus">
                Financial Summary
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <p className="text-sm text-slate-500">Total Price</p>
                <p className="font-semibold text-slate-800">
                  {membershipData.financials.totalPrice}
                </p>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <p className="text-sm text-slate-500">Discount</p>
                <p className="font-semibold text-emerald-600">
                  {membershipData.financials.discount}
                </p>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <p className="text-sm text-slate-500">Net Price</p>
                <p className="font-semibold text-slate-800">
                  {membershipData.financials.netPrice}
                </p>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <p className="text-sm text-slate-500 font-medium">
                  Outstanding Balance
                </p>
                <p className="font-bold text-rose-600">
                  {membershipData.financials.outstandingBalance}
                </p>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 font-marcellus">
                Account Management
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  DSA Agency
                </p>
                <p className="font-semibold text-slate-800">
                  {membershipData.staff.dsa}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Sales Consultant
                </p>
                <p className="font-semibold text-slate-800">
                  {membershipData.staff.consultant}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
