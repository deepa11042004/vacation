"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard, 
  Download, 
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

export default function BookingHistoryPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Upcoming', 'Completed', 'Cancelled'];

  const bookings = [
    {
      id: "BKG-7829-XJ",
      title: "Swiss Alps Resort",
      location: "Zermatt, Switzerland",
      image: "https://images.pexels.com/photos/19244948/pexels-photo-19244948.jpeg",
      checkIn: "Dec 10, 2026",
      checkOut: "Dec 17, 2026",
      guests: "2 Adults, 1 Room",
      amount: "$2,850",
      status: "Upcoming",
      statusColor: "bg-blue-100 text-blue-700 border-blue-200",
      paymentStatus: "Paid in full"
    },
    {
      id: "BKG-5412-PR",
      title: "Santorini Coastal Villa",
      location: "Oia, Greece",
      image: "https://images.pexels.com/photos/16771759/pexels-photo-16771759.jpeg",
      checkIn: "Aug 15, 2026",
      checkOut: "Aug 22, 2026",
      guests: "4 Adults, 2 Rooms",
      amount: "$4,200",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      paymentStatus: "Paid in full"
    },
    {
      id: "BKG-9921-LM",
      title: "Kyoto Zen Retreat",
      location: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
      checkIn: "Apr 05, 2026",
      checkOut: "Apr 12, 2026",
      guests: "2 Adults, 1 Room",
      amount: "$1,950",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      paymentStatus: "Paid in full"
    },
    {
      id: "BKG-3304-WQ",
      title: "Maldives Overwater Bungalow",
      location: "Male, Maldives",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop",
      checkIn: "Jan 10, 2026",
      checkOut: "Jan 15, 2026",
      guests: "2 Adults, 1 Room",
      amount: "$5,100",
      status: "Cancelled",
      statusColor: "bg-rose-100 text-rose-700 border-rose-200",
      paymentStatus: "Refunded"
    }
  ];

  const filteredBookings = activeFilter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">
            Your Journeys
          </h2>
          <p className="text-slate-500">
            View and manage all your past, present, and future adventures.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No bookings found</h3>
            <p className="text-slate-500">You don&apos;t have any {activeFilter.toLowerCase()} bookings at the moment.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div 
              key={booking.id}
              className="group bg-white rounded-3xl p-4 md:p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-blue-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Image Section */}
                <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 rounded-2xl overflow-hidden">
                  <Image 
                    src={booking.image}
                    alt={booking.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${booking.statusColor}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center text-sm text-slate-500 font-medium mb-1">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          {booking.location}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 font-marcellus leading-tight">
                          {booking.title}
                        </h3>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm font-medium text-slate-500">Booking Ref</p>
                        <p className="text-sm font-bold text-slate-800">{booking.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-600">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Dates</p>
                          <p className="text-sm font-bold text-slate-800">{booking.checkIn} — {booking.checkOut}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-600">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Guests & Rooms</p>
                          <p className="text-sm font-bold text-slate-800">{booking.guests}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Total Amount</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-slate-800">{booking.amount}</p>
                          <span className="text-xs font-medium text-slate-500">({booking.paymentStatus})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm">
                        <Download className="w-4 h-4" />
                        <span className="hidden xs:inline">Invoice</span>
                      </button>
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors text-sm group/btn">
                        Details
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
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
