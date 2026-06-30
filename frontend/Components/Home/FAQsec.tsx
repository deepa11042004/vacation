"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Minus } from "lucide-react";
import Badge from "@/UI/Badge";

const FAQ_DATA = {
  "Club Elevate": [
    {
      question:
        "How do I know which Club Elevate Programme fits my family best?",
      answer:
        "Our team will help you choose based on your travel frequency, preferred seasons, and family size. EBONY offers year-round access, IVORY covers peak seasons, and JADE is ideal for off-peak travelers.",
    },
    {
      question:
        "What are the tenure options available in the Club Elevate Programme? Are they fixed, or can I upgrade or downgrade tenures?",
      answer:
        "Tenure options vary by plan. You can typically upgrade or downgrade during renewal periods, subject to availability and terms. Contact our membership desk for personalized guidance.",
    },
    {
      question: "What's the difference between JADE, IVORY, and EBONY Keys?",
      answer:
        "EBONY: 52 weeks/year access. IVORY: 46 weeks (excludes peak). JADE: 24 weeks (off-peak only). Each key unlocks different benefits and pricing tiers.",
    },
    {
      question: "Why should I become a Club Elevate member?",
      answer:
        "Enjoy guaranteed holidays every year, future-proof pricing, complimentary breakfasts, resort discounts, and exclusive experiences — all designed for seamless family getaways.",
    },
    {
      question: "Can I exit at any time?",
      answer:
        "Exit policies depend on your tenure and contract type. Early exits may incur fees. We recommend discussing your options with our customer success team before making changes.",
    },
  ],
  upgrade: [
    {
      question: "Can I upgrade from JADE to IVORY or EBONY?",
      answer:
        "Yes! Upgrades are possible during renewal cycles. You’ll pay the difference in membership cost and gain additional weeks/access.",
    },
    {
      question: "Is there a fee to upgrade?",
      answer:
        "Upgrading may involve a prorated fee based on remaining tenure and new plan value. No hidden charges — we’ll provide a clear breakdown.",
    },
  ],
  newMembership: [
    {
      question: "How do I start as a new member?",
      answer:
        "Fill out the inquiry form, speak with an advisor, select your Key type, complete documentation, and make payment. Your journey begins within 7–10 business days.",
    },
    {
      question: "Do I need to book immediately after joining?",
      answer:
        "No! You have up to 4 months to book your first holiday. Plan ahead and secure your favorite resorts early.",
    },
  ],
  bookingRules: [
    {
      question: "How far in advance can I book?",
      answer:
        "You can book up to 4 months in advance. Bookings are confirmed on a first-come, first-served basis.",
    },
    {
      question: "Can I cancel or modify my booking?",
      answer:
        "Modifications are allowed up to 30 days before check-in. Cancellations may incur fees depending on timing and season.",
    },
  ],
};

export default function FAQsec() {
  const [activeTab, setActiveTab] = useState<
    "Club Elevate" | "upgrade" | "newMembership" | "bookingRules"
  >("Club Elevate");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const tabs = [
    { id: "Club Elevate", label: "Club Elevate" },
    { id: "upgrade", label: "Upgrade" },
    { id: "newMembership", label: "New Membership" },
    { id: "bookingRules", label: "Booking Rules" },
  ];

  const currentFAQs = FAQ_DATA[activeTab];

  return (
    <section className="bg-white text-gray-950 py-20 px-6 sm:px-10 lg:px-14 w-full min-h-150 flex flex-col items-center font-display">
      <div className="max-w-4xl mx-auto w-full">
        {/* ─── Header Block matching your global layout standard ─── */}
        <div className="flex flex-col items-center text-center mb-12">
          <Badge
            text="FAQ"
            variant="black"
            size="lg"
            icon={Minus}
            className="mb-4"
          />
          <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
            Got Any Questions?
          </h2>
        </div>

        {/* ─── Segmented Navigation Switcher Tabs ─── */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          <div className="inline-flex flex-wrap gap-1.5 rounded-full bg-neutral-100 p-1.5 border border-neutral-200 shadow-xs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setActiveTab(tab.id as any);
                  setOpenIndex(null);
                }}
                className={`rounded-full px-5 py-2 text-xs font-bold tracking-widest transition-all uppercase duration-300 ${
                  activeTab === tab.id
                    ? "bg-neutral-950 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Upgraded Clean Minimalist Accordion Container ─── */}
        <div className="border border-gray-200 rounded-3xl overflow-hidden bg-neutral-50 shadow-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full"
            >
              {currentFAQs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-100/70 transition-colors cursor-pointer group"
                  >
                    <span className="text-base sm:text-lg font-bold text-gray-900 pr-4 transition-colors group-hover:text-black">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === idx ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="text-gray-400 group-hover:text-gray-900 shrink-0"
                    >
                      <ChevronDown size={18} strokeWidth={2.5} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
