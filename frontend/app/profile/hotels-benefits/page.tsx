"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default function HotelsBenefitsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const hotels = [
    {
      id: 1,
      name: "Mandarin Oriental, Tokyo",
      location: "Tokyo, Japan",
      type: "Premium Partner",
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop",
      phone: "+81 3-3270-8800",
      email: "reservations.tyo@mandarin.com",
      benefits: ["Complimentary Breakfast", "Late Checkout", "Spa Access"]
    },
    {
      id: 2,
      name: "The Ritz-Carlton, Paris",
      location: "Paris, France",
      type: "Associated Hotel",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
      phone: "+33 1 43 16 30 30",
      email: "paris.reservations@ritzcarlton.com",
      benefits: ["Room Upgrade", "Welcome Drinks"]
    },
    {
      id: 3,
      name: "Burj Al Arab Jumeirah",
      location: "Dubai, UAE",
      type: "Elite Partner",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
      phone: "+971 4 301 7777",
      email: "baa@jumeirah.com",
      benefits: ["Airport Transfer", "Complimentary Breakfast", "20% Dining Discount"]
    },
    {
      id: 4,
      name: "Waldorf Astoria Maldives",
      location: "Ithaafushi, Maldives",
      type: "Premium Partner",
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop",
      phone: "+960 400-0300",
      email: "@mandarinworldwide.com",
      benefits: ["Yacht Transfer Discount", "Spa Credit"]
    },
    {
      id: 5,
      name: "The Taj Mahal Palace",
      location: "Mumbai, India",
      type: "Premium Partner",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
      phone: "+91 22 6665 3366",
      email: "@mandarinworldwide.com",
      benefits: ["Sea View Upgrade", "Complimentary Breakfast", "Spa Credit"]
    },
    {
      id: 6,
      name: "The Oberoi Amarvilas",
      location: "Agra, India",
      type: "Elite Partner",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
      phone: "+91 562 2231515",
      email: "@mandarinworldwide.com",
      benefits: ["Taj Mahal View Guaranteed", "High Tea", "Welcome Gifts"]
    },
    {
      id: 7,
      name: "The Leela Palace",
      location: "New Delhi, India",
      type: "Associated Hotel",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
      phone: "+91 11 3933 1234",
      email: "@mandarinworldwide.com",
      benefits: ["Room Upgrade", "Airport Transfer"]
    },
    {
      id: 8,
      name: "Rambagh Palace",
      location: "Jaipur, India",
      type: "Premium Partner",
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop",
      phone: "+91 141 2385700",
      email: "@mandarinworldwide.com",
      benefits: ["Heritage Walk", "Complimentary Breakfast", "20% Dining Discount"]
    }
  ];

  const filteredHotels = hotels.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">
            Hotels & Benefits
          </h2>
          <p className="text-slate-500 max-w-2xl">
            Explore the exclusive network of premium and associated hotels accessible under your membership.
          </p>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search hotels or locations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all w-full md:w-72"
          />
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredHotels.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No hotels found</h3>
            <p className="text-slate-500">We couldn&apos;t find any hotels matching &quot;{searchTerm}&quot;.</p>
          </div>
        ) : (
          filteredHotels.map((hotel) => (
            <div 
              key={hotel.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] group hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Image Header */}
              <div className="h-48 relative overflow-hidden">
                <Image 
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                      {hotel.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-marcellus truncate">{hotel.name}</h3>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center text-sm text-slate-600 mb-6 font-medium">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {hotel.location}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Membership Benefits</h4>
                    {hotel.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-700 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 mt-auto space-y-2">
                  <div className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
                    <Phone className="w-4 h-4 mr-3" />
                    {hotel.phone}
                  </div>
                  <div className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
                    <Mail className="w-4 h-4 mr-3" />
                    {hotel.email}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
