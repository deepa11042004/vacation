"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Hotel, Car, FileText, Calendar, MapPin,
  ShieldCheck, Clock, TrendingDown, Bell, Headphones,
  CreditCard, CheckCircle2, Sliders, Loader2, X, CreditCard as CardIcon,
} from "lucide-react";

type TabType = "flights" | "hotels" | "transport" | "car-rental" | "visa";

export default function TravelDesk() {
  const [activeTab, setActiveTab] = useState<TabType>("flights");

  // Per-tab form state
  const [flight,    setFlight]    = useState({ from: "", to: "", depart_date: "", return_date: "" });
  const [hotel,     setHotel]     = useState({ destination: "", check_in: "", check_out: "" });
  const [carRental, setCarRental] = useState({ pickup_location: "", dropoff_location: "", pickup_date: "", dropoff_date: "" });
  const [transport, setTransport] = useState({ pickup_location: "", pickup_date: "", pickup_time: "" });
  const [visa,      setVisa]      = useState({ passport_country: "", destination_country: "" });

  // Card number modal
  const [modalOpen,    setModalOpen]    = useState(false);
  const [cardNumber,   setCardNumber]   = useState("");
  const [pendingData,  setPendingData]  = useState<{ type: string; details: Record<string, string> } | null>(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [cardError,    setCardError]    = useState("");
  const [successTab,   setSuccessTab]   = useState<TabType | null>(null);

  const tabVariants = {
    hidden:  { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit:    { opacity: 0, x: 10,  transition: { duration: 0.2 } },
  };

  function switchTab(tab: TabType) {
    setActiveTab(tab);
    setSuccessTab(null);
    setCardError("");
  }

  // Called when any form's submit button is clicked
  function openCardModal(type: string, details: Record<string, string>) {
    setPendingData({ type, details });
    setCardNumber("");
    setCardError("");
    setModalOpen(true);
  }

  async function submitWithCard() {
    if (!cardNumber.trim()) { setCardError("Please enter your card number."); return; }
    if (!pendingData) return;
    setSubmitting(true);
    setCardError("");
    try {
      const res = await fetch("/api/travel-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query_type:  pendingData.type,
          card_number: cardNumber.trim(),
          details:     pendingData.details,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setCardError(json.message || "Something went wrong. Please try again.");
        return;
      }
      setModalOpen(false);
      setSuccessTab(activeTab);
      setPendingData(null);
      setCardNumber("");
    } catch {
      setCardError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const SuccessState = () => (
    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
      </div>
      <div>
        <p className="text-base font-bold text-slate-800">Request Submitted!</p>
        <p className="text-sm text-slate-500 mt-1">Our travel desk team will contact you shortly.</p>
      </div>
      <button onClick={() => setSuccessTab(null)} className="text-sm text-blue-600 hover:underline">
        Submit another request
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full">
      {/* HERO */}
      <section className="relative text-white py-40 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.pexels.com/photos/8828679/pexels-photo-8828679.jpeg"
            alt="Travel Desk" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white/10 text-blue-200 px-3 py-2 rounded-full text-sm font-medium tracking-wide uppercase mb-4 inline-block">
            Corporate &amp; Leisure Travel Desk
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Your Complete Journey, Simplified
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">
            Book flights, reserve stays, manage car rentals, arrange transfers,
            and get visa support — all in one premium ecosystem.
          </motion.p>
        </div>
      </section>

      {/* BOOKING WIDGET */}
      <section className="max-w-6xl mx-auto px-4 -mt-15 relative z-20 mb-24">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
          {/* Tab nav */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
            <TabButton active={activeTab === "flights"}    onClick={() => switchTab("flights")}    icon={<Plane className="w-5 h-5" />}    label="Flights" />
            <TabButton active={activeTab === "hotels"}     onClick={() => switchTab("hotels")}     icon={<Hotel className="w-5 h-5" />}    label="Hotels" />
            <TabButton active={activeTab === "car-rental"} onClick={() => switchTab("car-rental")} icon={<Car className="w-5 h-5" />}     label="Car Rental" />
            <TabButton active={activeTab === "transport"}  onClick={() => switchTab("transport")}  icon={<Sliders className="w-5 h-5" />}  label="Transportation" />
            <TabButton active={activeTab === "visa"}       onClick={() => switchTab("visa")}       icon={<FileText className="w-5 h-5" />} label="Visa Assistance" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="min-h-55">
              {successTab === activeTab ? <SuccessState /> : (
                <>
                  {/* FLIGHTS */}
                  {activeTab === "flights" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-slate-800">Search Domestic &amp; International Flights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <InputField icon={<MapPin className="text-blue-400" />}    label="From"   placeholder="Departure City/Airport"   value={flight.from}          onChange={v => setFlight(p => ({ ...p, from: v }))} />
                        <InputField icon={<MapPin className="text-blue-400" />}    label="To"     placeholder="Destination City/Airport" value={flight.to}            onChange={v => setFlight(p => ({ ...p, to: v }))} />
                        <InputField icon={<Calendar className="text-blue-400" />}  label="Depart" type="date"                           value={flight.depart_date}   onChange={v => setFlight(p => ({ ...p, depart_date: v }))} />
                        <InputField icon={<Calendar className="text-blue-400" />}  label="Return" type="date"                           value={flight.return_date}   onChange={v => setFlight(p => ({ ...p, return_date: v }))} />
                      </div>
                      <SubmitRow label="Search Flights" onSubmit={() => openCardModal("FLIGHT", { from: flight.from, to: flight.to, depart_date: flight.depart_date, return_date: flight.return_date })} />
                    </div>
                  )}

                  {/* HOTELS */}
                  {activeTab === "hotels" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-slate-800">Book Resorts, Hotels &amp; Vacation Rentals</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField icon={<MapPin className="text-blue-400" />}   label="Where to?"  placeholder="City, region, or specific hotel" value={hotel.destination} onChange={v => setHotel(p => ({ ...p, destination: v }))} />
                        <InputField icon={<Calendar className="text-blue-400" />} label="Check-in"   type="date"                                   value={hotel.check_in}    onChange={v => setHotel(p => ({ ...p, check_in: v }))} />
                        <InputField icon={<Calendar className="text-blue-400" />} label="Check-out"  type="date"                                   value={hotel.check_out}   onChange={v => setHotel(p => ({ ...p, check_out: v }))} />
                      </div>
                      <SubmitRow label="Find Accommodations" onSubmit={() => openCardModal("HOTEL", { destination: hotel.destination, check_in: hotel.check_in, check_out: hotel.check_out })} />
                    </div>
                  )}

                  {/* CAR RENTAL */}
                  {activeTab === "car-rental" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-slate-800">Compare &amp; Reserve Rental Cars</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <InputField icon={<MapPin className="text-blue-400" />}   label="Pick-up Location"  placeholder="City or Airport"   value={carRental.pickup_location}  onChange={v => setCarRental(p => ({ ...p, pickup_location: v }))} />
                        <InputField icon={<MapPin className="text-blue-400" />}   label="Drop-off Location" placeholder="Same location"     value={carRental.dropoff_location} onChange={v => setCarRental(p => ({ ...p, dropoff_location: v }))} />
                        <InputField icon={<Calendar className="text-blue-400" />} label="Pick-up Date"      type="date"                     value={carRental.pickup_date}      onChange={v => setCarRental(p => ({ ...p, pickup_date: v }))} />
                        <InputField icon={<Calendar className="text-blue-400" />} label="Drop-off Date"     type="date"                     value={carRental.dropoff_date}     onChange={v => setCarRental(p => ({ ...p, dropoff_date: v }))} />
                      </div>
                      <SubmitRow label="Search Rental Cars" onSubmit={() => openCardModal("CAR_RENTAL", { pickup_location: carRental.pickup_location, dropoff_location: carRental.dropoff_location, pickup_date: carRental.pickup_date, dropoff_date: carRental.dropoff_date })} />
                    </div>
                  )}

                  {/* TRANSPORT */}
                  {activeTab === "transport" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-slate-800">Airport Transfers, Taxis, Buses &amp; Trains</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <InputField icon={<MapPin className="text-blue-400" />}  label="Pickup Location" placeholder="Airport, Station, or Address" value={transport.pickup_location} onChange={v => setTransport(p => ({ ...p, pickup_location: v }))} />
                        </div>
                        <InputField icon={<Calendar className="text-blue-400" />} label="Pickup Date" type="date" value={transport.pickup_date} onChange={v => setTransport(p => ({ ...p, pickup_date: v }))} />
                        <InputField icon={<Clock className="text-blue-400" />}    label="Pickup Time" type="time" value={transport.pickup_time} onChange={v => setTransport(p => ({ ...p, pickup_time: v }))} />
                      </div>
                      <SubmitRow label="Reserve Ride" onSubmit={() => openCardModal("TRANSPORT", { pickup_location: transport.pickup_location, pickup_date: transport.pickup_date, pickup_time: transport.pickup_time })} />
                    </div>
                  )}

                  {/* VISA */}
                  {activeTab === "visa" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800">Visa Application Info &amp; Professional Support</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField icon={<FileText className="text-blue-400" />} label="Citizen of (Passport)"  placeholder="Your Country"        value={visa.passport_country}    onChange={v => setVisa(p => ({ ...p, passport_country: v }))} />
                          <InputField icon={<MapPin className="text-blue-400" />}   label="Destination Country"    placeholder="Where are you going?" value={visa.destination_country} onChange={v => setVisa(p => ({ ...p, destination_country: v }))} />
                        </div>
                        <SubmitRow label="Check Requirements &amp; Apply" onSubmit={() => openCardModal("VISA", { passport_country: visa.passport_country, destination_country: visa.destination_country })} />
                      </div>
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-slate-600 self-start">
                        <h4 className="font-bold text-blue-900 mb-2">How we assist you:</h4>
                        <ul className="space-y-2">
                          <li>✓ Automated document checklist matching your profile.</li>
                          <li>✓ VFS appointment prioritization &amp; scheduling.</li>
                          <li>✓ 98.4% success rate with verified application reviews.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-blue-50 max-w-6xl mx-auto px-4 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black tracking-tight">Why Book Through Our Travel Desk?</h2>
          <p className="text-slate-500 mt-2">Engineered to bring seamless efficiency to all your journeys</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BenefitCard icon={<Clock className="w-6 h-6 text-emerald-600" />}     title="All-in-One Efficiency"    description="Saves massive chunks of your day by unifying every flight, stay, car rental, and document checklist inside one hub." />
          <BenefitCard icon={<TrendingDown className="w-6 h-6 text-blue-400" />} title="Smart Rate Compares"      description="Instantly pulls real-time inventories across multiple leading providers to ensure you leverage competitive rates." />
          <BenefitCard icon={<ShieldCheck className="w-6 h-6 text-purple-600" />} title="Personalized Framework"  description="Offers tailored travel configurations built around your previous routes, corporate policies, and car preferences." />
          <BenefitCard icon={<Headphones className="w-6 h-6 text-amber-600" />}  title="Proactive Human Assist"  description="Provides priority troubleshooting support before, during, and well after your target itinerary dates wrap up." />
          <BenefitCard icon={<CheckCircle2 className="w-6 h-6 text-rose-600" />} title="Simplified Management"   description="View details, file rapid modifications, or execute immediate cancellations with effortless self-serve utilities." />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white text-black rounded-t-[6vw] py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">Enterprise-Grade Desk Capabilities</h2>
            <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">Everything required for modernized global logistical infrastructure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<Plane className="w-6 h-6 text-blue-400" />}          title="Fluid Search UX"           description="Intuitively engineered panels mapped out for frictionless booking interactions." />
            <FeatureCard icon={<Clock className="w-6 h-6 text-indigo-600" />}         title="Real-Time Catalogs"        description="Instantaneous sync for live pricing engines and vehicle availability windows." />
            <FeatureCard icon={<CreditCard className="w-6 h-6 text-purple-600" />}    title="Secure Transactions"       description="End-to-end tokenized payment routing structures shielding high-volume accounts." />
            <FeatureCard icon={<Bell className="w-6 h-6 text-rose-600" />}            title="Instant Confirmations"     description="Automated notifications dispatched to SMS and corporate emails within seconds." />
            <FeatureCard icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />} title="Full Lifecycle Control"    description="Robust native tools designed to monitor, track, modify car rentals, or process cancellations." />
            <FeatureCard icon={<Headphones className="w-6 h-6 text-amber-600" />}     title="24/7 Global Helpline"      description="Always available routing lines maintaining around-the-clock emergency support." />
            <FeatureCard icon={<Bell className="w-6 h-6 text-teal-600" />}            title="Proactive Travel Alerts"   description="Live flight delays, weather tracking, and ground transportation updates." />
            <FeatureCard icon={<TrendingDown className="w-6 h-6 text-orange-600" />}  title="Strategic Corporate Deals" description="Unlocks special pre-negotiated volume benefits and custom car rental enterprise discounts." />
          </div>
        </div>
      </section>

      {/* CARD NUMBER MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => !submitting && setModalOpen(false)}
            />
            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.95, y: 10  }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 pointer-events-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <CardIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Enter Your Card Number</p>
                      <p className="text-xs text-slate-400">Your membership / client card</p>
                    </div>
                  </div>
                  <button onClick={() => !submitting && setModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Input */}
                <div className="mb-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">Card Number</label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. MV-20240001"
                    value={cardNumber}
                    onChange={e => { setCardNumber(e.target.value); setCardError(""); }}
                    onKeyDown={e => e.key === "Enter" && submitWithCard()}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl py-3 px-4 text-sm text-slate-800 font-medium placeholder-slate-400 outline-none transition"
                  />
                  {cardError && <p className="text-xs text-red-500 mt-1.5">{cardError}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => !submitting && setModalOpen(false)}
                    className="flex-1 py-2.5 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitWithCard}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-60 transition-colors"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {submitting ? "Submitting…" : "Submit Request"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SubmitRow({ label, onSubmit }: { label: string; onSubmit: () => void }) {
  return (
    <div className="mt-6 flex justify-end">
      <button
        onClick={onSubmit}
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-blue-600/20 transition duration-200 flex items-center gap-2"
      >
        {label}
      </button>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
        active ? "text-blue-400" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
    </button>
  );
}

function InputField({ icon, label, placeholder, type = "text", value, onChange }: {
  icon: React.ReactNode; label: string; placeholder?: string; type?: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 z-10 pointer-events-none">{icon}</div>
        <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 font-medium placeholder-slate-400 outline-none transition duration-150"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="bg-blue-50 border border-blue-200/60 cursor-pointer rounded-2xl p-7 hover:scale-[1.05] transition-all duration-200 flex flex-col justify-between min-h-55">
      <div>
        <div className="p-3 bg-white/90 shadow-sm rounded-xl w-fit mb-5">{icon}</div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white border border-slate-100 cursor-pointer rounded-2xl p-6 hover:scale-[1.05] transition-all duration-200">
      <div className="p-3 bg-slate-50 rounded-xl w-fit mb-4">{icon}</div>
      <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
