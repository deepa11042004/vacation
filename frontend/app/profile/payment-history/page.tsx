"use client";

import React from "react";
import { Download, CreditCard, Building, CalendarCheck } from "lucide-react";

export default function PaymentHistoryPage() {
  const payments = [
    {
      id: "TXN-9982-KPL",
      type: "Down Payment",
      date: "Jan 15, 2024",
      amount: "$3,000",
      mode: "Credit Card",
      status: "Completed",
      icon: CreditCard,
    },
    {
      id: "TXN-1029-JNM",
      type: "EMI Installment (1/12)",
      date: "Feb 15, 2024",
      amount: "$833.33",
      mode: "Bank Transfer",
      status: "Completed",
      icon: Building,
    },
    {
      id: "TXN-1055-LQA",
      type: "EMI Installment (2/12)",
      date: "Mar 15, 2024",
      amount: "$833.33",
      mode: "Bank Transfer",
      status: "Completed",
      icon: Building,
    },
    {
      id: "TXN-1098-ZYX",
      type: "EMI Installment (3/12)",
      date: "Apr 15, 2024",
      amount: "$833.33",
      mode: "Credit Card",
      status: "Processing",
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">
          Payment History
        </h2>
        <p className="text-slate-500 max-w-2xl">
          Track all your membership payments, EMIs, and download your receipts.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-slate-50 border-b border-slate-100 text-sm font-bold text-slate-600 uppercase tracking-wider">
          <div className="col-span-3 ml-5">Payment Details</div>
          <div className="col-span-2 ml-3">Date</div>
          <div className="col-span-2 ml-2">Mode</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2 ml-4">Status</div>
          <div className="col-span-1 text-left">Action</div>
        </div>

        {/* Payment List */}
        <div className="divide-y divide-slate-100">
          {payments.map((payment, idx) => (
            <div
              key={idx}
              className="p-6 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-slate-50/50 transition-colors flex flex-col gap-4"
            >
              {/* Mobile Header / Desktop Col 1 */}
              <div className="col-span-3 flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl shrink-0 ${
                    payment.status === "Completed"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  <payment.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{payment.type}</h4>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    Ref: {payment.id}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2 flex md:block justify-between items-center">
                <span className="md:hidden text-sm text-slate-500 font-medium">
                  Date
                </span>
                <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                  <CalendarCheck className="w-4 h-4 text-slate-400 md:hidden" />
                  {payment.date}
                </div>
              </div>

              {/* Mode */}
              <div className="col-span-2 flex md:block justify-between items-center">
                <span className="md:hidden text-sm text-slate-500 font-medium">
                  Mode
                </span>
                <span className="text-sm text-slate-700 font-medium">
                  {payment.mode}
                </span>
              </div>

              {/* Amount */}
              <div className="col-span-2 flex md:block justify-between items-center">
                <span className="md:hidden text-sm text-slate-500 font-medium">
                  Amount
                </span>
                <span className="font-bold text-slate-800 text-lg md:text-base">
                  {payment.amount}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2 flex md:block justify-between items-center">
                <span className="md:hidden text-sm text-slate-500 font-medium">
                  Status
                </span>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-bold uppercase rounded-full ${
                    payment.status === "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {payment.status}
                </span>
              </div>

              {/* Action */}
              <div className="col-span-1 flex justify-end mt-4 md:mt-0 pt-4 md:pt-0 border-t border-slate-100 md:border-0">
                <button className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl text-sm font-medium transition-colors shadow-sm">
                  <Download className="w-4 h-4" />
                  <span className="hidden lg:inline">Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
