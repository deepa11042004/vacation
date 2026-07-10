"use client";

import React from "react";
import {
  FileText,
  Download,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export default function InvoicesPage() {
  const documents = [
    {
      id: "AGR-9982-MNDRN",
      title: "Membership Agreement",
      type: "Legal Document",
      date: "Jan 15, 2024",
      size: "2.4 MB",
      icon: ShieldCheck,
      isPrimary: true,
    },
    {
      id: "INV-2024-001",
      title: "Down Payment Invoice",
      type: "Tax Invoice",
      date: "Jan 15, 2024",
      size: "845 KB",
      icon: FileText,
      isPrimary: false,
    },
    {
      id: "INV-2024-002",
      title: "EMI Installment (1/12)",
      type: "Tax Invoice",
      date: "Feb 15, 2024",
      size: "820 KB",
      icon: FileText,
      isPrimary: false,
    },
    {
      id: "INV-2024-003",
      title: "EMI Installment (2/12)",
      type: "Tax Invoice",
      date: "Mar 15, 2024",
      size: "820 KB",
      icon: FileText,
      isPrimary: false,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">
          Invoices & Documents
        </h2>
        <p className="text-slate-500 max-w-2xl">
          Access and download your membership agreements, tax invoices, and
          payment receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Important Documents */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-black rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>

            <h3 className="text-xl font-bold font-marcellus mb-6 relative z-10">
              Primary Documents
            </h3>

            <div className="space-y-4 relative z-10">
              {documents
                .filter((d) => d.isPrimary)
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="pt-5  group cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div>
                        <h4 className="font-bold text-white leading-tight mb-2">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-slate-300 uppercase tracking-wider">
                          {doc.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">
                        {doc.date} &bull; {doc.size}
                      </span>
                      <button className="p-2 bg-white rounded-full hover:bg-slate-200 transition-all group-hover:scale-105 cursor-pointer">
                        <Download className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white">
              <div className="flex items-center">
                <p className="text-sm text-slate-300 leading-relaxed">
                  All documents are digitally signed and legally binding. Keep
                  them safe for your records.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Invoices List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 font-marcellus">
                Payment Invoices
              </h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Download All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {documents
                .filter((d) => !d.isPrimary)
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <doc.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">
                          {doc.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                            {doc.type}
                          </span>
                          <span className="text-sm text-slate-400 font-medium font-mono">
                            {doc.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 ml-17 md:ml-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {doc.date}
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="hidden md:inline-block text-xs font-medium text-slate-400">
                          {doc.size}
                        </span>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl text-sm font-medium transition-colors shadow-sm">
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                      </div>
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
