"use client";

import { useState, useEffect } from "react";
import { FileText, Download, ShieldCheck, Calendar, Loader2 } from "lucide-react";
import { memberApi } from "@/lib/member-api";

interface Invoice {
  invoice_id: number;
  invoice_no: string;
  invoice_type: "invoice" | "tax";
  client_name: string;
  amount: string;
  issue_date?: string | null;
  email?: string | null;
  payment_mode?: string | null;
  created_at?: string | null;
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    memberApi.get<{ success: boolean; data: { invoices: Invoice[] } }>("/invoices")
      .then((res) => {
        if (res?.success) setInvoices(Array.isArray(res.data?.invoices) ? res.data.invoices : []);
        else setError("Failed to load invoices.");
      })
      .catch(() => setError("Failed to load invoices."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  const primary = invoices.filter((i) => i.invoice_type === "tax").slice(0, 1);
  const rest = invoices.filter((i) => i.invoice_type !== "tax" || primary[0]?.invoice_id !== i.invoice_id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">Invoices & Documents</h2>
        <p className="text-slate-500 max-w-2xl">Access and download your membership tax invoices and payment receipts.</p>
      </div>

      {error || invoices.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{error || "No invoices found."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {primary.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-black rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                <h3 className="text-xl font-bold font-marcellus mb-6 relative z-10">Primary Documents</h3>
                <div className="space-y-4 relative z-10">
                  {primary.map((doc) => (
                    <div key={doc.invoice_id} className="pt-5 group cursor-pointer">
                      <div className="flex items-start gap-4 mb-4">
                        <div>
                          <h4 className="font-bold text-white leading-tight mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            Invoice #{doc.invoice_no}
                          </h4>
                          <p className="text-xs text-slate-300 uppercase tracking-wider">Tax Invoice</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-medium">{fmt(doc.issue_date ?? doc.created_at)} &bull; ₹{doc.amount}</span>
                        <button className="p-2 bg-white rounded-full hover:bg-slate-200 transition-all group-hover:scale-105">
                          <Download className="w-4 h-4 text-black" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    All documents are digitally issued. Keep them safe for your records.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className={primary.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 font-marcellus">Payment Invoices</h3>
              </div>

              <div className="divide-y divide-slate-100">
                {rest.map((doc) => (
                  <div key={doc.invoice_id}
                    className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">Invoice #{doc.invoice_no}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                            {doc.invoice_type === "tax" ? "Tax Invoice" : "Invoice"}
                          </span>
                          {doc.payment_mode && (
                            <span className="text-sm text-slate-400 font-medium">{doc.payment_mode}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 ml-17 md:ml-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {fmt(doc.issue_date ?? doc.created_at)}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-700">₹{doc.amount}</span>
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
      )}
    </div>
  );
}
