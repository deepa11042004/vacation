"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { processRazorpayPayment } from "@/lib/razorpay";

export default function PayNowPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+91",
    mobile: "",
    email: "",
    amount: "10000",
    remarks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId?: string;
    orderId?: string;
  }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const amountNum = parseFloat(formData.amount) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (amountNum <= 0) {
      setErrorMessage("Please enter a valid payment amount greater than ₹0.");
      return;
    }

    if (!formData.mobile || formData.mobile.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit lead details to record customer intention
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            mobile: `${formData.countryCode} ${formData.mobile}`.trim(),
            planTier: "PAY_NOW",
            planTenure: "Direct Payment",
            downPaymentAmount: amountNum,
            totalCost: `₹${Math.round(amountNum).toLocaleString("en-IN")}/-`,
            notes: formData.remarks ? `Pay Now: ${formData.remarks}` : "Direct Pay Now Online",
          }),
        });
      } catch (leadErr) {
        console.warn("Lead recording warning:", leadErr);
      }

      // 2. Open Razorpay Gateway modal
      await processRazorpayPayment({
        amount: amountNum,
        name: "Mandarin Worldwide Vacations",
        description: formData.remarks || "Direct Online Payment",
        paymentType: "DOWN_PAYMENT",
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.mobile,
        },
        notes: {
          purpose: formData.remarks || "Direct Pay Now",
          countryCode: formData.countryCode,
        },
        onSuccess: (res) => {
          setPaymentDetails({
            paymentId: res.razorpay_payment_id,
            orderId: res.razorpay_order_id,
          });
          setIsSuccess(true);
          setIsSubmitting(false);
        },
        onDismiss: () => {
          setIsSubmitting(false);
        },
      });
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      const errMsg =
        err?.message === "Failed to fetch"
          ? "Unable to connect to backend payment service. Please make sure the server is reachable."
          : err?.message || "Something went wrong while initiating Razorpay payment.";
      setErrorMessage(errMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#1C1608] via-[#2A200B] to-[#0E0B04] text-white pt-28 sm:pt-36 pb-20 px-4 flex items-center justify-center relative overflow-hidden font-sans select-none">
      {/* Golden Diagonal Striped Pattern Layer */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(212,175,55,0.07)_0px,rgba(212,175,55,0.07)_2px,transparent_2px,transparent_20px)] pointer-events-none" />

      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay">
        <Image
          src="/Img/pattern.png"
          alt=""
          fill
          className="object-cover scale-125"
          priority
        />
      </div>

      {/* Ambient Gold Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Form Card Matching Image 1 Exactly */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg bg-[#181206] border-2 border-[#D4AF37]/40 text-white rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.15)] z-10"
      >
        {/* Top Close Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-5 right-5 text-amber-200 hover:text-white p-2 rounded-full bg-[#2C210C] hover:bg-[#3D2E11] transition-colors cursor-pointer"
          aria-label="Close form"
        >
          <X size={18} />
        </button>

        {!isSuccess ? (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1 font-sans">
              Enter Details
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/80 font-medium mb-6">
              Please provide your basic details to proceed with the application.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                    First Name<span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="Enter your first name"
                    className="w-full px-3.5 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 text-sm focus:outline-none focus:border-[#D4AF37] font-medium transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                    Last Name<span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Enter your last name"
                    className="w-full px-3.5 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 text-sm focus:outline-none focus:border-[#D4AF37] font-medium transition-colors"
                  />
                </div>
              </div>

              {/* Mobile Number with Country Code Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-amber-200 mb-1.5">
                  Mobile Number<span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) =>
                      setFormData({ ...formData, countryCode: e.target.value })
                    }
                    className="px-3 py-3 rounded-xl bg-[#100C04] border border-[#D4AF37]/40 text-white text-sm font-semibold focus:outline-none cursor-pointer shrink-0"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="Enter mobile number"
                    className="w-full px-3.5 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 text-sm focus:outline-none focus:border-[#D4AF37] font-medium transition-colors"
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Please enter valid email"
                  className="w-full px-3.5 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 text-sm focus:outline-none focus:border-[#D4AF37] font-medium transition-colors"
                />
              </div>

              {/* Amount (₹) Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-amber-200">
                    Amount (₹)<span className="text-red-400">*</span>
                  </label>
                  {amountNum > 0 && (
                    <span className="text-[11px] text-amber-300 font-semibold tracking-wide">
                      ₹{Math.round(amountNum).toLocaleString("en-IN")}/-
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-200/60 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="Enter amount to pay"
                    className="w-full pl-8 pr-3.5 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 text-sm focus:outline-none focus:border-[#D4AF37] font-medium transition-colors"
                  />
                </div>
                {/* Quick amount presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[5000, 10000, 25000, 50000, 100000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, amount: String(preset) })
                      }
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        formData.amount === String(preset)
                          ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-sm"
                          : "bg-[#0D0A04]/60 text-amber-200/80 border-[#D4AF37]/30 hover:border-[#D4AF37] hover:text-white"
                      }`}
                    >
                      ₹{preset.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Remarks / Purpose */}
              <div>
                <label className="block text-xs font-semibold text-amber-200/80 mb-1.5">
                  Payment Purpose / Remark{" "}
                  <span className="text-amber-200/40 text-[11px] font-normal">
                    (Optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  placeholder="e.g. Vacation Membership, Down Payment, Booking"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/30 text-white placeholder-amber-200/30 text-xs focus:outline-none focus:border-[#D4AF37] font-medium transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-2 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] hover:brightness-110 text-neutral-950 font-extrabold text-sm rounded-full shadow-lg shadow-[#D4AF37]/30 transition-all cursor-pointer text-center uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </form>

            {/* Razorpay Trust Seal */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-200/50 mt-5">
              <ShieldCheck size={14} className="text-[#D4AF37]" />
              <span>Secured by Razorpay • 256-bit SSL Encryption</span>
            </div>
          </div>
        ) : (
          /* Payment Successful View */
          <div className="text-center py-6 px-2">
            <div className="w-16 h-16 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/10">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 font-sans">
              Payment Successful!
            </h2>
            <p className="text-sm text-amber-200/90 font-medium leading-relaxed mb-6">
              Thank you! Your payment has been received and verified. Our
              representative will contact you shortly.
            </p>

            <div className="bg-[#0D0A04] border border-[#D4AF37]/30 rounded-xl p-4 text-xs text-left mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-amber-200/60">Payment ID:</span>
                <span className="text-amber-200 font-mono font-medium">
                  {paymentDetails.paymentId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200/60">Order ID:</span>
                <span className="text-amber-200 font-mono font-medium">
                  {paymentDetails.orderId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200/60">Amount Paid:</span>
                <span className="text-[#D4AF37] font-bold">
                  ₹{Math.round(amountNum).toLocaleString("en-IN")}/-
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200/60">Customer:</span>
                <span className="text-white font-medium">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] hover:brightness-110 text-neutral-950 font-extrabold text-sm rounded-full shadow-lg shadow-[#D4AF37]/30 transition-all cursor-pointer uppercase tracking-wider"
            >
              Return to Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
