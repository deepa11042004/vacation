"use client";

import React from 'react';
import { 
  Gift, 
  Sparkles, 
  Clock, 
  ArrowRight
} from 'lucide-react';

export default function MyOffersPage() {
  const offers = [
    {
      id: "OFF-2024-X1",
      name: "Double Nights Weekend",
      validity: "Valid until Nov 30, 2026",
      details: "Book any premium partner hotel for a weekend stay (Fri-Sun) and we'll only deduct half the nights from your annual quota.",
      type: "Exclusive",
      color: "from-blue-600 to-indigo-600"
    },
    {
      id: "OFF-2024-X2",
      name: "Free Airport Transfer",
      validity: "Valid until Dec 15, 2026",
      details: "Enjoy a complimentary luxury airport transfer (S-Class or equivalent) on your next booking of 3+ nights.",
      type: "Transport",
      color: "from-amber-500 to-orange-500"
    },
    {
      id: "OFF-2024-X3",
      name: "20% Spa Discount",
      validity: "Valid until Jan 01, 2027",
      details: "Claim a 20% discount on all spa and wellness treatments at participating Mandarin Worldwide associated properties.",
      type: "Wellness",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2 flex items-center gap-3">
            My Offers
            <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-bold font-sans">3 New</span>
          </h2>
          <p className="text-slate-500 max-w-2xl">
            Exclusive promotions and special offers attached to your Platinum Global Explorer membership.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className="group bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            
            {/* Offer Header Banner */}
            <div className={`h-32 bg-linear-to-r ${offer.color} relative overflow-hidden p-6 text-white flex flex-col justify-between`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
                  {offer.type}
                </span>
                <Gift className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="relative z-10 text-xl font-bold font-marcellus truncate">{offer.name}</h3>
            </div>

            {/* Offer Details */}
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {offer.details}
              </p>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  {offer.validity}
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white font-medium rounded-xl cursor-pointer">
                  Claim Offer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
          </div>
        ))}
        
        {/* Placeholder for future offers */}
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 flex flex-col items-center justify-center text-center min-h-100">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2 font-marcellus">More offers coming soon</h3>
          <p className="text-sm text-slate-500 max-w-50">
            Check back later for seasonal discounts and exclusive partner deals.
          </p>
        </div>
      </div>

    </div>
  );
}
