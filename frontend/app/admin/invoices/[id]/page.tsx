"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { InvoiceTemplate, CompanySettings } from "@/Components/InvoiceTemplate";
import { ArrowLeft, Loader2, Printer } from "lucide-react";

interface StoredInvoice {
  invoice_id: number;
  invoice_no: string;
  invoice_type: "invoice" | "tax";
  client_name: string;
  card_number: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  client_gst: string | null;
  payment_mode: string;
  payment_type: string;
  transaction_id: string;
  bank: string;
  card_cheque_no: string;
  amount: string;
  description: string;
  issue_date: string;
  deleted_at: string | null;
}

const CO_DEFAULTS: CompanySettings = {
  name: "Arena International Holidays",
  address: "101, Pratap Nagar, Mayur Vihar, Phase-1 Delhi-110091",
  state: "Delhi",
  gst_number: "",
  phone: "",
  email: "",
};

export default function InvoiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<StoredInvoice | null>(null);
  const [co,      setCo]      = useState<CompanySettings>(CO_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const safe = <T,>(p: Promise<T>) => p.catch(() => null);
        const [invRes, coRes] = await Promise.all([
          safe(api.get<{ data: StoredInvoice }>(`/invoices/${id}`)),
          safe(api.get<{ data: CompanySettings }>(`/settings/company`)),
        ]);
        if (!invRes?.data) { setError("Invoice not found."); return; }
        setInvoice(invRes.data);
        if (coRes?.data) setCo(coRes.data);
      } catch {
        setError("Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
        <p>{error || "Invoice not found."}</p>
        <button onClick={() => router.push("/admin/invoices")} className="text-sm text-blue-600 hover:underline">
          Back to Invoices
        </button>
      </div>
    );
  }

  const form: Record<string, string> = {
    invoice_no:     invoice.invoice_no,
    issue_date:     invoice.issue_date,
    client_name:    invoice.client_name,
    card_number:    invoice.card_number,
    email:          invoice.email,
    phone:          invoice.phone,
    address:        invoice.address,
    state:          invoice.state,
    client_gst:     invoice.client_gst || "",
    payment_mode:   invoice.payment_mode,
    payment_type:   invoice.payment_type,
    transaction_id: invoice.transaction_id,
    bank:           invoice.bank,
    card_cheque_no: invoice.card_cheque_no,
    amount:         String(invoice.amount),
    description:    invoice.description,
  };

  const isTax = invoice.invoice_type === "tax";

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top bar */}
      <div className="print:hidden flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/invoices")}
          className="text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">
            {isTax ? "Tax Invoice" : "Invoice"} — {invoice.invoice_no}
          </h1>
          {invoice.deleted_at && (
            <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              DELETED
            </span>
          )}
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-800 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      <InvoiceTemplate form={form} isTax={isTax} co={co} />
    </div>
  );
}
