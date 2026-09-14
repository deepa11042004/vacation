"use client";

import React from "react";
import Link from "next/link";
import { Ticket, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Badge from "@/UI/Badge";

export default function RedeemVoucherSection() {
  return (
    <section className="w-full py-16 px-6 sm:px-10 lg:px-14 font-display bg-slate-50 relative overflow-hidden">
      {/* Subtle background glow & decorative elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#0b192e] via-[#0f2342] to-[#071324] p-8 sm:p-14 lg:p-16 text-white overflow-hidden shadow-2xl border border-white/10">
          
          {/* Background watermark icon */}
          <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
            <Ticket className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl flex flex-col items-start">
            <Badge
              text="GIFT VOUCHER"
              variant="white"
              size="sm"
              icon={Sparkles}
              className="mb-5"
            />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5">
              Redeem Your Voucher
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-4 max-w-2xl">
              Have a gift voucher from <span className="font-semibold text-amber-400">Mandarin Worldwide Vacations</span>?
            </p>

            <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed mb-8 max-w-2xl">
              Verify and redeem your voucher online in just a few clicks to unlock exclusive holiday stays, entertainment benefits, and unforgettable luxury experiences.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/redeem-voucher"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
              >
                <span>Redeem Your Voucher</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-2 text-xs text-slate-400 sm:ml-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Online Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
