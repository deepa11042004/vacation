"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, Check, X, PhoneCall, ShoppingBag, ShieldCheck } from "lucide-react";
import CheckoutPaymentView from "./CheckoutPaymentView";

export interface PlanInfo {
  tierSlug: "ebony" | "ivory" | "jade";
  tierName: string;
  roomType: string;
  tenure: string;
  totalCost: string;
  downPayment: string;
  balance: string;
  emiStarts: string;
  weeksAccess: string;
  refCode: string;
}

export const PLAN_DATA_MAP: Record<string, PlanInfo> = {
  // EBONY PLANS
  "ebony-20": {
    tierSlug: "ebony",
    tierName: "EBONY",
    roomType: "Studio",
    tenure: "20 Years",
    totalCost: "₹11,65,000/-",
    downPayment: "₹2,91,250/-",
    balance: "₹8,73,750/-",
    emiStarts: "₹36,406/mo",
    weeksAccess: "52 weeks",
    refCode: "REF: CM-EBO-2026",
  },
  "ebony-15": {
    tierSlug: "ebony",
    tierName: "EBONY",
    roomType: "Studio",
    tenure: "15 Years",
    totalCost: "₹9,75,000/-",
    downPayment: "₹2,43,750/-",
    balance: "₹7,31,250/-",
    emiStarts: "₹30,469/mo",
    weeksAccess: "52 weeks",
    refCode: "REF: CM-EBO-2026",
  },
  "ebony-10": {
    tierSlug: "ebony",
    tierName: "EBONY",
    roomType: "Studio",
    tenure: "10 Years",
    totalCost: "₹7,40,000/-",
    downPayment: "₹1,85,000/-",
    balance: "₹5,55,000/-",
    emiStarts: "₹23,125/mo",
    weeksAccess: "52 weeks",
    refCode: "REF: CM-EBO-2026",
  },
  "ebony-5": {
    tierSlug: "ebony",
    tierName: "EBONY",
    roomType: "Studio",
    tenure: "5 Years",
    totalCost: "₹5,35,000/-",
    downPayment: "₹1,33,750/-",
    balance: "₹4,01,250/-",
    emiStarts: "₹16,719/mo",
    weeksAccess: "52 weeks",
    refCode: "REF: CM-EBO-2026",
  },
  // IVORY PLANS
  "ivory-20": {
    tierSlug: "ivory",
    tierName: "IVORY",
    roomType: "Studio",
    tenure: "20 Years",
    totalCost: "₹7,75,000/-",
    downPayment: "₹1,93,750/-",
    balance: "₹5,81,250/-",
    emiStarts: "₹24,219/mo",
    weeksAccess: "46 weeks",
    refCode: "REF: CM-IVO-2026",
  },
  "ivory-15": {
    tierSlug: "ivory",
    tierName: "IVORY",
    roomType: "Studio",
    tenure: "15 Years",
    totalCost: "₹6,60,000/-",
    downPayment: "₹1,65,000/-",
    balance: "₹4,95,000/-",
    emiStarts: "₹20,625/mo",
    weeksAccess: "46 weeks",
    refCode: "REF: CM-IVO-2026",
  },
  "ivory-10": {
    tierSlug: "ivory",
    tierName: "IVORY",
    roomType: "Studio",
    tenure: "10 Years",
    totalCost: "₹5,10,000/-",
    downPayment: "₹1,27,500/-",
    balance: "₹3,82,500/-",
    emiStarts: "₹15,938/mo",
    weeksAccess: "46 weeks",
    refCode: "REF: CM-IVO-2026",
  },
  "ivory-5": {
    tierSlug: "ivory",
    tierName: "IVORY",
    roomType: "Studio",
    tenure: "5 Years",
    totalCost: "₹4,10,000/-",
    downPayment: "₹1,02,500/-",
    balance: "₹3,07,500/-",
    emiStarts: "₹12,813/mo",
    weeksAccess: "46 weeks",
    refCode: "REF: CM-IVO-2026",
  },
  // JADE PLANS
  "jade-20": {
    tierSlug: "jade",
    tierName: "JADE",
    roomType: "Studio",
    tenure: "20 Years",
    totalCost: "₹5,55,000/-",
    downPayment: "₹1,38,750/-",
    balance: "₹4,16,250/-",
    emiStarts: "₹17,344/mo",
    weeksAccess: "24 weeks",
    refCode: "REF: CM-JAD-2026",
  },
  "jade-15": {
    tierSlug: "jade",
    tierName: "JADE",
    roomType: "Studio",
    tenure: "15 Years",
    totalCost: "₹4,85,000/-",
    downPayment: "₹1,21,250/-",
    balance: "₹3,63,750/-",
    emiStarts: "₹15,156/mo",
    weeksAccess: "24 weeks",
    refCode: "REF: CM-JAD-2026",
  },
  "jade-10": {
    tierSlug: "jade",
    tierName: "JADE",
    roomType: "Studio",
    tenure: "10 Years",
    totalCost: "₹3,95,000/-",
    downPayment: "₹98,750/-",
    balance: "₹2,96,250/-",
    emiStarts: "₹12,344/mo",
    weeksAccess: "24 weeks",
    refCode: "REF: CM-JAD-2026",
  },
  "jade-5": {
    tierSlug: "jade",
    tierName: "JADE",
    roomType: "Studio",
    tenure: "5 Years",
    totalCost: "₹3,35,000/-",
    downPayment: "₹83,750/-",
    balance: "₹2,51,250/-",
    emiStarts: "₹10,469/mo",
    weeksAccess: "24 weeks",
    refCode: "REF: CM-JAD-2026",
  },
};

interface PlanDetailsViewProps {
  plan: PlanInfo;
  onBack: () => void;
}

export default function PlanDetailsView({ plan, onBack }: PlanDetailsViewProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [modalType, setModalType] = useState<"buy" | "call" | "calc" | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", city: "" });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  if (showCheckout) {
    return <CheckoutPaymentView plan={plan} onBack={() => setShowCheckout(false)} />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#1C1608] via-[#2A200B] to-[#0E0B04] text-white pt-28 md:pt-32 pb-20 px-4 sm:px-6 lg:px-12 font-sans select-none relative overflow-hidden">
      {/* Golden Diagonal Striped Pattern Layer */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(212,175,55,0.07)_0px,rgba(212,175,55,0.07)_2px,transparent_2px,transparent_20px)] pointer-events-none" />

      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay">
        <Image src="/Img/pattern.png" alt="" fill className="object-cover scale-125" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button & Ref Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform text-[#D4AF37]" />
            Back to Ownership Tiers
          </button>
          <span className="text-xs font-mono text-amber-200 bg-[#281F0B]/80 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 backdrop-blur-md shadow-md">
            {plan.refCode}
          </span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.35em] font-semibold text-[#D4AF37] block mb-1">
            Mandarin Worldwide Vacations
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
            Plan Details
          </h1>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Dark Card - Plan Specifications */}
          <div className="lg:col-span-6 bg-[#161106]/95 border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <Image src="/Img/pattern.png" alt="" fill className="object-cover scale-125" />
            </div>

            <div className="relative z-10">
              {/* Header Title */}
              <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-white uppercase font-sans flex items-center justify-between">
                <span>{plan.tierName} &nbsp;|&nbsp; {plan.roomType} &nbsp;|&nbsp; {plan.tenure}</span>
              </h2>
              <div className="w-full h-px bg-gradient-to-r from-[#D4AF37]/60 via-[#D4AF37]/20 to-transparent my-5" />

              {/* Pricing Box */}
              <div className="bg-[#0D0A04] rounded-2xl p-5 sm:p-6 border border-[#D4AF37]/30 flex flex-col sm:flex-row justify-between gap-6 mb-6 shadow-inner">
                {/* Membership Cost */}
                <div className="bg-[#1C1608] rounded-xl p-4 sm:p-5 flex-1 border border-[#D4AF37]/30">
                  <span className="text-xs text-amber-200/80 font-medium block mb-1 uppercase tracking-wider">
                    Membership Cost
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#F5E5B8] tracking-tight">
                    {plan.totalCost}
                  </p>
                </div>

                {/* Down Payment & EMI */}
                <div className="flex flex-col justify-center gap-3 sm:text-right pr-2">
                  <div>
                    <span className="text-[11px] text-amber-200/70 font-medium block">
                      Down Payment starts at
                    </span>
                    <span className="text-base font-bold text-white tracking-tight">
                      {plan.downPayment}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-amber-200/70 font-medium block">
                      EMI Starts at
                    </span>
                    <span className="text-base font-bold text-white tracking-tight">
                      {plan.emiStarts}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub Grid: Weeks Access + Safari Photo */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* 52 Weeks Box */}
                <div className="relative bg-[#100C04] border border-[#D4AF37]/30 rounded-2xl p-6 flex flex-col justify-center items-center text-center overflow-hidden min-h-[160px]">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <Image src="/Img/pattern.png" alt="" fill className="object-cover" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-white z-10">
                    {plan.weeksAccess}
                  </span>
                  <span className="text-xs text-amber-200/80 font-medium mt-1 z-10">
                    of access
                  </span>
                </div>

                {/* Vacation Resort Image Box */}
                <div className="relative rounded-2xl overflow-hidden min-h-[160px] border border-[#D4AF37]/30 shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                    alt="Vacation experience"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1608]/70 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            {/* Bottom Calculator Bar */}
            <div className="relative z-10 pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between">
              <button
                onClick={() => setModalType("calc")}
                className="flex items-center gap-3 text-sm font-semibold text-amber-200 hover:text-amber-400 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                  <Calculator size={18} />
                </div>
                <span>Check Holiday Calculator</span>
              </button>
              <button
                onClick={() => setModalType("calc")}
                className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
              >
                →
              </button>
            </div>
          </div>

          {/* Right White Card - Key Benefits & CTA */}
          <div className="lg:col-span-6 bg-white text-neutral-900 rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-2xl relative border-2 border-[#D4AF37]/30">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#B8860B] block mb-1">
                Exclusive Privileges
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mb-8 font-sans">
                Key Benefits
              </h3>

              <ul className="space-y-4 mb-10">
                {[
                  `6N/7D holidays every year across ${plan.weeksAccess}`,
                  "Complimentary breakfast for 2 per room per night, up to 6 years",
                  "24/7 concierge services",
                  "Priority access to signature experiences",
                  "Access to 140+ international resorts",
                  "Flexible cancellation policies",
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-semibold text-neutral-800 leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-neutral-950 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons with Metallic Gold Theme */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-neutral-200">
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full sm:flex-1 py-4 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] hover:brightness-110 text-neutral-950 font-extrabold text-sm shadow-lg shadow-[#D4AF37]/30 transition-all duration-300 active:scale-95 cursor-pointer text-center uppercase tracking-wider"
              >
                Buy Membership
              </button>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setModalType("call");
                }}
                className="w-full sm:flex-1 py-4 px-6 rounded-full border-2 border-neutral-950 text-neutral-950 font-extrabold text-sm hover:bg-neutral-950 hover:text-white transition-all duration-300 shadow-sm cursor-pointer text-center"
              >
                Request a Call
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Request Call / Calculator */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0A04]/80 backdrop-blur-md animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#181206] border-2 border-[#D4AF37]/40 text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl"
          >
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 text-amber-200 hover:text-white p-1.5 rounded-full bg-[#2C210C] hover:bg-[#3D2E11] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {modalType === "calc" ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/40">
                  <Calculator size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Holiday Cost Calculator</h3>
                <p className="text-sm text-amber-200/80 mb-6">
                  With your <strong className="text-white">{plan.tierName} {plan.tenure}</strong> plan, you save over 45% compared to regular hotel bookings across {plan.weeksAccess}!
                </p>
                <div className="bg-[#0D0A04] border border-[#D4AF37]/30 rounded-2xl p-4 text-left space-y-3 mb-6 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-[#2C210C]">
                    <span className="text-amber-200/70">Regular 10-Year Hotel Cost:</span>
                    <span className="font-bold text-white">₹16,50,000/-</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2C210C]">
                    <span className="text-amber-200/70">Your Plan Ownership:</span>
                    <span className="font-bold text-[#F5D77F]">{plan.totalCost}</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-bold text-white">
                    <span>Net Family Savings:</span>
                    <span className="text-amber-400">Save ~₹4,85,000/-</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setModalType(null);
                    setShowCheckout(true);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] text-neutral-950 font-extrabold rounded-full hover:brightness-110 transition-colors shadow-lg shadow-[#D4AF37]/30 uppercase tracking-wider"
                >
                  Proceed to Buy Membership
                </button>
              </div>
            ) : formSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/40">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-sm text-amber-200/80 mb-6">
                  Your request for <strong className="text-white">{plan.tierName} {plan.tenure}</strong> ({plan.roomType}) has been recorded. Our vacation specialist will contact you shortly.
                </p>
                <button
                  onClick={() => setModalType(null)}
                  className="px-8 py-3 bg-white text-neutral-950 font-extrabold rounded-full hover:bg-neutral-200 transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Request a Callback
                    </h3>
                    <p className="text-xs text-amber-200/80">
                      {plan.tierName} | {plan.roomType} | {plan.tenure} ({plan.totalCost})
                    </p>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 focus:outline-none focus:border-[#D4AF37] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 focus:outline-none focus:border-[#D4AF37] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0D0A04] border border-[#D4AF37]/40 text-white placeholder-amber-200/30 focus:outline-none focus:border-[#D4AF37] text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] hover:brightness-110 text-neutral-950 font-extrabold rounded-full transition-colors mt-2 text-sm cursor-pointer shadow-lg shadow-[#D4AF37]/30 uppercase tracking-wider"
                  >
                    Request Instant Callback
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
