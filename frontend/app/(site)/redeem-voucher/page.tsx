"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Home,
  Clock,
  Download,
} from "lucide-react";
import Badge from "@/UI/Badge";

interface RedeemSuccessData {
  voucher_number: string;
  message: string;
}

export default function RedeemVoucherPage() {
  const [voucherNumber, setVoucherNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<RedeemSuccessData | null>(null);

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = voucherNumber.trim();

    if (!trimmed) {
      setErrorMsg("Please enter your voucher number.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessData(null);

    try {
      const res = await fetch("/api/vouchers/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voucherNumber: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Descriptive error from backend: "Invalid voucher number.", "This voucher has expired.", "This voucher has already been redeemed."
        const msg = data?.message || data?.error || "Invalid voucher number.";
        setErrorMsg(msg);
      } else {
        setSuccessData({
          voucher_number: data?.data?.voucher_number || trimmed,
          message: data?.message || "Your voucher has been redeemed successfully.",
        });
        setVoucherNumber("");
      }
    } catch {
      setErrorMsg("Unable to connect to verification server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setSuccessData(null);
    setErrorMsg(null);
    setVoucherNumber("");
  }

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-slate-900 via-[#0b192e] to-slate-950 text-white font-display py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl mx-auto w-full relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-amber-400">Voucher Redemption</span>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/60 relative overflow-hidden">
          
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mx-auto shadow-inner">
              <Ticket className="w-7 h-7" />
            </div>

            <div className="flex justify-center">
              <Badge
                text="MANDARIN WORLDWIDE VACATIONS"
                variant="white"
                size="sm"
                icon={Sparkles}
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Redeem Your Voucher
            </h1>

            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Enter your voucher number below to verify and redeem your holiday voucher online.
            </p>
          </div>

          {/* SUCCESS STATE */}
          {successData ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 shadow-lg shadow-emerald-950/40">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-emerald-300">
                    ✓ Voucher Redeemed Successfully
                  </h2>
                  <p className="text-sm text-slate-200">
                    {successData.message}
                  </p>
                </div>

                <div className="bg-slate-950/60 rounded-xl p-4 border border-emerald-500/20">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Redeemed Voucher Number
                  </p>
                  <span className="font-mono text-xl font-extrabold text-amber-400 tracking-wider">
                    {successData.voucher_number}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Thank you for choosing Mandarin Worldwide Vacations. Our holiday desk will reach out to you shortly to assist with your bookings.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
                <a
                  href={`/api/vouchers/download/${successData.voucher_number}`}
                  download={`Holiday-Gift-Voucher-${successData.voucher_number}.pdf`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-sm transition-all border border-amber-500/30 shadow-md"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Voucher PDF</span>
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors border border-slate-700"
                >
                  Redeem Another
                </button>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                >
                  <span>Home</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* REDEMPTION FORM */
            <form onSubmit={handleRedeem} className="space-y-6">
              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-950/50 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl flex items-start gap-3 text-sm shadow-md animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMsg}</div>
                </div>
              )}

              {/* Voucher Number Input */}
              <div className="space-y-2">
                <label
                  htmlFor="voucherNumberInput"
                  className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
                >
                  Voucher Number <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="voucherNumberInput"
                    type="text"
                    required
                    disabled={loading}
                    placeholder="e.g. 81714091628"
                    value={voucherNumber}
                    onChange={(e) => setVoucherNumber(e.target.value)}
                    className="w-full px-4 py-3.5 text-base font-mono font-bold bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 placeholder:font-sans placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Ticket className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Please enter the exact voucher code sent to your registered email address.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !voucherNumber.trim()}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-extrabold text-sm tracking-wide uppercase shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>VERIFYING...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>VERIFY &amp; REDEEM</span>
                  </>
                )}
              </button>

              {/* Security & Support note */}
              <div className="pt-4 border-t border-slate-800 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Valid for 1 Year from issuance date</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Need assistance? Contact our concierge at{" "}
                  <a
                    href="mailto:voucher@mandarinworldwidevacations.com"
                    className="text-amber-400 hover:underline"
                  >
                    voucher@mandarinworldwidevacations.com
                  </a>
                </p>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
