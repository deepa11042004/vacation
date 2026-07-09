"use client";

import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  CalendarDays,
  CreditCard
} from 'lucide-react';

export default function AmcStatusPage() {
  const amcRecords = [
    {
      year: "Year 1 (2024)",
      status: "Received",
      paymentDate: "Jan 20, 2024",
      mode: "Credit Card",
      amountDue: "$150",
      amountPaid: "$150"
    },
    {
      year: "Year 2 (2025)",
      status: "Not Received",
      paymentDate: "-",
      mode: "-",
      amountDue: "$150",
      amountPaid: "$0"
    },
    {
      year: "Year 3 (2026)",
      status: "Not Received",
      paymentDate: "-",
      mode: "-",
      amountDue: "$150",
      amountPaid: "$0"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">
          AMC Status
        </h2>
        <p className="text-slate-500 max-w-2xl">
          Track your Annual Maintenance Contract (AMC) payments and due dates to keep your membership active.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* AMC Overview Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wider">Annual Fee</p>
              <h3 className="text-3xl font-bold font-marcellus mb-4">$150<span className="text-lg text-blue-200 font-sans">/year</span></h3>
              <p className="text-sm text-blue-50 leading-relaxed">
                Your AMC covers maintenance of global properties, ensuring 5-star quality for your stays.
              </p>
            </div>
          </div>
        </div>

        {/* AMC Records Timeline */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            
            <h3 className="text-xl font-bold text-slate-800 font-marcellus mb-8 border-b border-slate-100 pb-4">
              Payment Schedule
            </h3>
            
            <div className="space-y-8">
              {amcRecords.map((record, idx) => (
                <div key={idx} className="relative flex gap-6">
                  
                  {/* Timeline Line (Desktop) */}
                  {idx !== amcRecords.length - 1 && (
                    <div className="hidden md:block absolute left-4.5 top-10 -bottom-8 w-px bg-slate-200"></div>
                  )}
                  
                  {/* Status Icon */}
                  <div className="shrink-0 relative z-10">
                    {record.status === 'Received' ? (
                      <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                        <AlertCircle className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Record Content */}
                  <div className={`flex-1 rounded-2xl border p-5 md:p-6 transition-all ${
                    record.status === 'Received' 
                      ? 'border-emerald-100 bg-emerald-50/30' 
                      : 'border-slate-100 bg-white shadow-sm hover:shadow-md'
                  }`}>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100/50">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{record.year}</h4>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          record.status === 'Received' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                      
                      <div className="text-left md:text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Amount Due</p>
                        <p className="text-xl font-bold text-slate-800">{record.amountDue}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <CalendarDays className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Payment Date</p>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5">{record.paymentDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <CreditCard className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Payment Mode</p>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5">{record.mode}</p>
                        </div>
                      </div>
                    </div>

                    {record.status === 'Not Received' && (
                      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                        <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                          Pay Now
                        </button>
                      </div>
                    )}
                    
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
