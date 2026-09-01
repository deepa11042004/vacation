"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Info, ShieldCheck, X } from "lucide-react";
import { PlanInfo } from "./PlanDetailsView";

interface CheckoutPaymentViewProps {
  plan: PlanInfo;
  onBack: () => void;
}

// Utility to format numbers into Indian Rupees format (e.g. 11,65,000)
function formatRupees(num: number): string {
  return "₹" + Math.round(num).toLocaleString("en-IN") + "/-";
}

function formatRupeesRaw(num: number): string {
  return "₹" + Math.round(num).toLocaleString("en-IN");
}

export default function CheckoutPaymentView({ plan, onBack }: CheckoutPaymentViewProps) {
  // Parse Total Cost integer from plan.totalCost string (e.g. "₹11,65,000/-" -> 1165000)
  const totalCostNumber = useMemo(() => {
    const clean = plan.totalCost.replace(/\D/g, "");
    return parseInt(clean, 10) || 1165000;
  }, [plan.totalCost]);

  // Down payment percentage state: 25, 50, 75, 100 (Default to 25%)
  const [dpPercent, setDpPercent] = useState<number>(25);

  // EMI tenure state (months): 3, 6, 12, 18, 24, 36, 48 (Default to 24)
  const [emiTenureMonths, setEmiTenureMonths] = useState<number>(24);

  // Modal Flow States: closed | details | otp | success
  const [modalStep, setModalStep] = useState<"closed" | "details" | "otp" | "success">("closed");

  // User details state for the Enter Details form
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
  });

  // OTP state
  const [otpValue, setOtpValue] = useState("");

  // Calculations
  const downPaymentAmount = useMemo(() => {
    return (totalCostNumber * dpPercent) / 100;
  }, [totalCostNumber, dpPercent]);

  const remainingBalance = useMemo(() => {
    return Math.max(0, totalCostNumber - downPaymentAmount);
  }, [totalCostNumber, dpPercent]);

  const isFullPayment = dpPercent === 100;

  // Monthly EMI calculation
  const monthlyEmi = useMemo(() => {
    if (isFullPayment || remainingBalance <= 0) return 0;

    // 3, 6, 12, 18, 24 months are No Cost EMI (Interest free)
    if (emiTenureMonths <= 24) {
      return remainingBalance / emiTenureMonths;
    }

    // 36 months (~14% total interest over tenure) & 48 months (~18% total interest)
    const interestMultiplier = emiTenureMonths === 36 ? 1.14 : 1.18;
    return (remainingBalance * interestMultiplier) / emiTenureMonths;
  }, [remainingBalance, emiTenureMonths, isFullPayment]);

  const handleProceedPayment = () => {
    setModalStep("details");
    setOtpValue("");
  };

  const handleGetOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalStep("otp");
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalStep("success");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#1C1608] via-[#2A200B] to-[#0E0B04] text-white pt-28 md:pt-32 pb-20 px-4 sm:px-6 lg:px-12 font-sans select-none relative overflow-hidden">
      {/* Golden Diagonal Striped Pattern Layer */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(212,175,55,0.07)_0px,rgba(212,175,55,0.07)_2px,transparent_2px,transparent_20px)] pointer-events-none" />

      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay">
        <Image src="/Img/pattern.png" alt="" fill className="object-cover scale-125" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Header Bar & Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform text-[#D4AF37]" />
            Back to Plan Details
          </button>
          <span className="text-xs font-mono text-amber-200 bg-[#281F0B]/80 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 backdrop-blur-md shadow-md">
            {plan.refCode}
          </span>
        </div>

        {/* Main Grid: Left EMI Selector Card & Right Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Card - Select EMI Plan */}
          <div className="lg:col-span-7 bg-[#161106]/95 border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md text-white">
            {/* Membership Price Banner Bar */}
            <div className="bg-[#0D0A04] border border-[#D4AF37]/30 rounded-2xl px-5 py-3.5 mb-8 flex items-center justify-between shadow-inner">
              <span className="text-xs sm:text-sm font-semibold text-amber-200/80 flex items-center gap-2">
                💎 Membership Price
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#F5E5B8]">
                {formatRupeesRaw(totalCostNumber)}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-white mb-6 font-sans">
              Select EMI Plan
            </h2>

            {/* Dropdowns Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Down Payment Dropdown */}
              <div>
                <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">
                  Down Payment
                </label>
                <select
                  value={dpPercent}
                  onChange={(e) => setDpPercent(Number(e.target.value))}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 cursor-pointer shadow-inner"
                >
                  <option value={25} className="bg-[#181206] text-white">
                    25% - {formatRupeesRaw((totalCostNumber * 25) / 100)}
                  </option>
                  <option value={50} className="bg-[#181206] text-white">
                    50% - {formatRupeesRaw((totalCostNumber * 50) / 100)}
                  </option>
                  <option value={75} className="bg-[#181206] text-white">
                    75% - {formatRupeesRaw((totalCostNumber * 75) / 100)}
                  </option>
                  <option value={100} className="bg-[#181206] text-white">
                    100% - {formatRupeesRaw(totalCostNumber)} (Full Payment)
                  </option>
                </select>
              </div>

              {/* EMI Tenure Dropdown */}
              <div>
                <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">
                  EMI Tenure
                </label>
                <select
                  disabled={isFullPayment}
                  value={emiTenureMonths}
                  onChange={(e) => setEmiTenureMonths(Number(e.target.value))}
                  className={`w-full px-4 py-3.5 rounded-2xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 cursor-pointer shadow-inner ${
                    isFullPayment ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isFullPayment ? (
                    <option value={0} className="bg-[#181206] text-white">N/A (Full Payment Selected)</option>
                  ) : (
                    <>
                      <option value={3} className="bg-[#181206] text-white">
                        3 Months (No Cost EMI) &nbsp;-&nbsp; {formatRupees(remainingBalance / 3)}
                      </option>
                      <option value={6} className="bg-[#181206] text-white">
                        6 Months (No Cost EMI) &nbsp;-&nbsp; {formatRupees(remainingBalance / 6)}
                      </option>
                      <option value={12} className="bg-[#181206] text-white">
                        12 Months (No Cost EMI) &nbsp;-&nbsp; {formatRupees(remainingBalance / 12)}
                      </option>
                      <option value={18} className="bg-[#181206] text-white">
                        18 Months (No Cost EMI) &nbsp;-&nbsp; {formatRupees(remainingBalance / 18)}
                      </option>
                      <option value={24} className="bg-[#181206] text-white">
                        24 Months (No Cost EMI) &nbsp;-&nbsp; {formatRupees(remainingBalance / 24)}
                      </option>
                      <option value={36} className="bg-[#181206] text-white">
                        36 Months &nbsp;-&nbsp; {formatRupees((remainingBalance * 1.14) / 36)}
                      </option>
                      <option value={48} className="bg-[#181206] text-white">
                        48 Months &nbsp;-&nbsp; {formatRupees((remainingBalance * 1.18) / 48)}
                      </option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Inset Summary Box */}
            <div className="bg-[#0D0A04] border border-[#D4AF37]/30 rounded-2xl p-6 mb-8 space-y-4">
              <div className="flex justify-between items-center text-sm py-1 border-b border-[#2C210C]">
                <span className="text-amber-200/80 font-medium">Down payment</span>
                <span className="font-extrabold text-white">
                  {formatRupees(downPaymentAmount)}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
                  EMI Details
                </span>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-amber-200/80">EMI Tenure</span>
                  <span className="font-semibold text-white">
                    {isFullPayment
                      ? "N/A (Full Payment)"
                      : `${emiTenureMonths} Months ${
                          emiTenureMonths <= 24 ? "(No Cost EMI)" : ""
                        }`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-amber-200/80">EMI Per Month</span>
                  <span className="font-extrabold text-[#F5D77F]">
                    {isFullPayment ? "₹0/-" : formatRupees(monthlyEmi)}
                  </span>
                </div>
              </div>
            </div>

            {/* Annual Maintenance Fee (AMC) Box */}
            <div className="pt-4 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                  <span>Annual Maintenance Fee (charged later)</span>
                  <span title="Annual Maintenance Charge payable every year" className="cursor-pointer text-[#D4AF37] hover:text-white">
                    <Info size={16} />
                  </span>
                </div>
                <p className="text-xs text-amber-200/70 mt-0.5">
                  Please note that the Annual Maintenance Fee (AMC) is payable every year.
                </p>
              </div>
              <span className="text-lg font-extrabold text-amber-400 shrink-0">
                ₹14,999
              </span>
            </div>
          </div>

          {/* Right Summary Dark Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#100C04] text-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
              {/* Pattern Texture Overlay */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <Image src="/Img/pattern.png" alt="" fill className="object-cover scale-125" />
              </div>

              <div className="relative z-10">
                {/* Header Title */}
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider font-sans text-white">
                  {plan.tierName}
                </h3>
                <p className="text-xs text-amber-200/80 font-semibold tracking-wide mt-1">
                  Room type: {plan.roomType} &nbsp;|&nbsp; Tenure: {plan.tenure}
                </p>

                <div className="w-full h-px bg-[#2C210C] my-6" />

                {/* Membership Cost & Down Payment */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-amber-200/70 font-medium">Membership Cost</span>
                  <span className="text-xl font-extrabold text-white">
                    {formatRupeesRaw(totalCostNumber)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-[#2C210C] text-sm">
                  <span className="text-amber-200 font-medium">Down Payment Payable Now</span>
                  <span className="text-xl font-black text-[#F5D77F]">
                    {formatRupeesRaw(downPaymentAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Action Proceed Button with Golden Metallic Gradient */}
            <button
              onClick={handleProceedPayment}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] hover:brightness-110 text-neutral-950 font-extrabold text-base shadow-lg shadow-[#D4AF37]/30 transition-all duration-300 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <span>Proceed to Pay {formatRupees(downPaymentAmount)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enter Details & OTP Verification Modal Dialog (Golden Striped Theme Matching Reference Image 1) */}
      {modalStep !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0A04]/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#181206] border-2 border-[#D4AF37]/40 text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl"
          >
            {/* Top Close Button */}
            <button
              onClick={() => setModalStep("closed")}
              className="absolute top-5 right-5 text-amber-200 hover:text-white p-1.5 rounded-full bg-[#2C210C] hover:bg-[#3D2E11] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {modalStep === "details" && (
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-1 font-sans">
                  Enter Details
                </h3>
                <p className="text-xs text-amber-200/80 font-medium mb-6">
                  You will receive OTPs on both your email &amp; mobile number
                </p>

                <form onSubmit={handleGetOtpSubmit} className="space-y-4">
                  {/* First Name & Last Name Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                        First Name<span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={userDetails.firstName}
                        onChange={(e) =>
                          setUserDetails({ ...userDetails, firstName: e.target.value })
                        }
                        placeholder="Enter your first name"
                        className="w-full px-3.5 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 text-sm focus:outline-none focus:border-[#D4AF37] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                        Last Name<span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={userDetails.lastName}
                        onChange={(e) =>
                          setUserDetails({ ...userDetails, lastName: e.target.value })
                        }
                        placeholder="Enter your last name"
                        className="w-full px-3.5 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 text-sm focus:outline-none focus:border-[#D4AF37] font-medium"
                      />
                    </div>
                  </div>

                  {/* Mobile Number with Country Code Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      Mobile Number<span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select className="px-3 py-3 rounded-xl bg-[#100C04] border border-[#D4AF37]/40 text-white text-sm font-semibold focus:outline-none cursor-pointer shrink-0">
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+971</option>
                      </select>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={userDetails.mobile}
                        onChange={(e) =>
                          setUserDetails({ ...userDetails, mobile: e.target.value })
                        }
                        placeholder="Enter mobile number"
                        className="w-full px-3.5 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 text-sm focus:outline-none focus:border-[#D4AF37] font-medium"
                      />
                    </div>
                  </div>

                  {/* Email ID */}
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      Email ID<span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={userDetails.email}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, email: e.target.value })
                      }
                      placeholder="Please enter valid email"
                      className="w-full px-3.5 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 text-sm focus:outline-none focus:border-[#D4AF37] font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 mt-2 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] hover:brightness-110 text-neutral-950 font-extrabold text-sm rounded-full shadow-lg shadow-[#D4AF37]/30 transition-all cursor-pointer text-center uppercase tracking-wider"
                  >
                    Get OTP
                  </button>
                </form>

                {/* Footer Note */}
                <p className="text-[11px] text-amber-200/60 text-left mt-6 font-normal leading-relaxed">
                  Note : Digilocker verification needed. Please keep PAN &amp; Aadhar card Handy.
                </p>
              </div>
            )}

            {modalStep === "otp" && (
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-1 font-sans">
                  Enter OTP
                </h3>
                <p className="text-xs text-amber-200/80 font-medium mb-6">
                  OTP sent to{" "}
                  <strong className="text-white">
                    +91 {userDetails.mobile || "9876543210"}
                  </strong>{" "}
                  and{" "}
                  <strong className="text-white">
                    {userDetails.email || "user@example.com"}
                  </strong>
                </p>

                <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                      6-Digit OTP Code<span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      placeholder="123456"
                      className="w-full tracking-[0.5em] text-center text-xl font-mono font-bold px-4 py-3.5 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 mt-2 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] hover:brightness-110 text-neutral-950 font-extrabold text-sm rounded-full shadow-lg shadow-[#D4AF37]/30 transition-all cursor-pointer text-center uppercase tracking-wider"
                  >
                    Verify &amp; Proceed to Pay {formatRupees(downPaymentAmount)}
                  </button>
                </form>

                <div className="flex justify-between items-center mt-6 text-xs text-amber-200/80 font-medium">
                  <span>Didn&apos;t receive code?</span>
                  <button
                    type="button"
                    onClick={() => alert("OTP resent successfully!")}
                    className="text-[#D4AF37] font-bold hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            )}

            {modalStep === "success" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/40">
                  <ShieldCheck size={36} />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">
                  Verification Successful!
                </h3>
                <p className="text-xs text-amber-200/80 mb-6">
                  Thank you,{" "}
                  <strong className="text-white">
                    {userDetails.firstName || "Member"} {userDetails.lastName}
                  </strong>
                  . Your membership application for{" "}
                  <strong className="text-white">
                    {plan.tierName} {plan.tenure}
                  </strong>{" "}
                  has been initiated.
                </p>

                <div className="bg-[#0D0A04] border border-[#D4AF37]/30 rounded-2xl p-4 text-xs text-amber-200 text-left space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Down Payment Amount:</span>
                    <span className="font-bold text-[#F5D77F]">
                      {formatRupees(downPaymentAmount)}
                    </span>
                  </div>
                  {!isFullPayment && (
                    <div className="flex justify-between">
                      <span>Monthly EMI ({emiTenureMonths} Months):</span>
                      <span className="font-bold text-white">
                        {formatRupees(monthlyEmi)} / mo
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Annual Maintenance Fee (AMC):</span>
                    <span className="font-bold text-amber-400">₹14,999 / year</span>
                  </div>
                </div>

                <button
                  onClick={() => setModalStep("closed")}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] text-neutral-950 font-extrabold rounded-full hover:brightness-110 transition-colors cursor-pointer text-sm shadow-lg shadow-[#D4AF37]/30 uppercase tracking-wider"
                >
                  Complete Payment &amp; Download Receipt
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
