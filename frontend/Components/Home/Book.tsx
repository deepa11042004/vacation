"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, X, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Book() {
  const [destination, setDestination] = useState("");
  const [checkIn,     setCheckIn]     = useState("");
  const [checkOut,    setCheckOut]    = useState("");
  const [adults,      setAdults]      = useState("");
  const [rooms,       setRooms]       = useState("2 Bed Rooms");

  // Card modal
  const [modalOpen,  setModalOpen]  = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardError,  setCardError]  = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);

  function openModal() {
    setCardNumber("");
    setCardError("");
    setModalOpen(true);
  }

  async function submitWithCard() {
    if (!cardNumber.trim()) { setCardError("Please enter your card number."); return; }
    setSubmitting(true);
    setCardError("");
    try {
      const res = await fetch("/api/travel-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query_type:  "STAYS",
          card_number: cardNumber.trim(),
          details: {
            destination,
            check_in:  checkIn,
            check_out: checkOut,
            adults,
            rooms,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setCardError(json.message || "Something went wrong. Please try again.");
        return;
      }
      setModalOpen(false);
      setSuccess(true);
      // reset form
      setDestination(""); setCheckIn(""); setCheckOut(""); setAdults(""); setRooms("2 Bed Rooms");
    } catch {
      setCardError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative w-full overflow-hidden rounded-4xl p-6 sm:p-8 border border-blue-100/80 shadow-xl transition-colors duration-300 ease-in-out">
          {/* Background Sky Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/Img/bg.png"
              alt="Sky background"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-6 pl-1">
              Plan Your Stays
            </h2>

            {success ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800">Request Submitted!</p>
                  <p className="text-sm text-slate-500 mt-1">Our team will contact you shortly to confirm your stay.</p>
                </div>
                <button onClick={() => setSuccess(false)} className="text-sm text-blue-600 hover:underline">
                  Plan another stay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

                {/* Destination */}
                <div className="md:col-span-3 flex flex-col gap-2">
                  <label className="text-sm font-medium text-black pl-1">Destination</label>
                  <div className="border border-gray-200 rounded-full hover:border-blue-600 transition-colors duration-300 ease-in-out">
                    <input
                      type="text"
                      placeholder="Where do you want to go?"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      className="w-full bg-white hover:bg-white/50 transition-colors text-sm text-neutral-600 font-normal h-14 px-4 rounded-full outline-none"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-black pl-1">Check-in</label>
                  <div className="border border-gray-200 rounded-full hover:border-blue-600 transition-colors duration-300 ease-in-out">
                    <input
                      type="date"
                      value={checkIn}
                      onChange={e => setCheckIn(e.target.value)}
                      className="w-full bg-white hover:bg-white/50 transition-colors text-sm text-neutral-600 font-normal h-14 px-4 rounded-full appearance-none outline-none"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-black pl-1">Check-out</label>
                  <div className="border border-gray-200 rounded-full hover:border-blue-600 transition-colors duration-300 ease-in-out">
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || undefined}
                      onChange={e => setCheckOut(e.target.value)}
                      className="w-full bg-white hover:bg-white/50 transition-colors text-sm text-neutral-600 font-normal h-14 px-4 rounded-full appearance-none outline-none"
                    />
                  </div>
                </div>

                {/* Adults */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-black pl-1">Adults</label>
                  <div className="relative border border-gray-200 rounded-full hover:border-blue-600 transition-colors duration-300 ease-in-out">
                    <select
                      value={adults}
                      onChange={e => setAdults(e.target.value)}
                      className="w-full bg-white hover:bg-white/50 transition-colors text-sm text-neutral-600 font-normal h-14 px-4 rounded-full appearance-none outline-none cursor-pointer"
                    >
                      <option value="" disabled hidden>Adults</option>
                      <option value="1 Adult">1 Adult</option>
                      <option value="2 Adults">2 Adults</option>
                      <option value="3 Adults">3 Adults</option>
                      <option value="4+ Adults">4+ Adults</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/80 h-4 w-4 pointer-events-none" />
                  </div>
                </div>

                {/* Rooms */}
                <div className="md:col-span-3 flex flex-col gap-2">
                  <label className="text-sm font-medium text-black pl-1">Number Of Rooms</label>
                  <div className="relative border border-gray-200 rounded-full hover:border-blue-600 transition-colors duration-300 ease-in-out">
                    <select
                      value={rooms}
                      onChange={e => setRooms(e.target.value)}
                      className="w-full bg-white hover:bg-white/50 transition-colors text-sm text-black font-normal h-14 px-4 rounded-full appearance-none outline-none cursor-pointer"
                    >
                      <option value="1 Bed Room">1 Bed Room</option>
                      <option value="2 Bed Rooms">2 Bed Rooms</option>
                      <option value="3 Bed Rooms">3 Bed Rooms</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/80 h-4 w-4 pointer-events-none" />
                  </div>
                </div>

                {/* Search button */}
                <div className="md:col-span-12 w-full flex justify-center mt-4">
                  <button
                    onClick={openModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3.5 rounded-full shadow-lg shadow-blue-600/20 transition duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Number Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => !submitting && setModalOpen(false)}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.95, y: 10  }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 pointer-events-auto">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5 text-blue-600" />
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

                <div className="mb-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">Card Number</label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. MEM-00001"
                    value={cardNumber}
                    onChange={e => { setCardNumber(e.target.value); setCardError(""); }}
                    onKeyDown={e => e.key === "Enter" && submitWithCard()}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl py-3 px-4 text-sm text-slate-800 font-medium placeholder-slate-400 outline-none transition"
                  />
                  {cardError && <p className="text-xs text-red-500 mt-1.5">{cardError}</p>}
                </div>

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
    </section>
  );
}
