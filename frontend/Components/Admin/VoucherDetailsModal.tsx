"use client";

import { useState } from "react";
import Modal from "./Modal";
import {
  Ticket,
  User,
  Mail,
  Phone,
  Calendar,
  Gift,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Loader2,
  Download,
} from "lucide-react";
import { api } from "@/lib/api";

export interface VoucherItem {
  voucher_id: number;
  voucher_number: string;
  voucher_type: "Member" | "Non Member";
  applicant: string;
  spouse?: string | null;
  email: string;
  phone: string;
  locations: string[] | string;
  benefit: string;
  issue_date: string;
  validity: string;
  expiry_date: string;
  status: "ACTIVE" | "REDEEMED" | "EXPIRED";
  terms_and_conditions: string;
  redeemed_at?: string | null;
  created_at: string;
  updated_at: string;
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface VoucherDetailsModalProps {
  open: boolean;
  onClose: () => void;
  voucher: VoucherItem | null;
  onEmailSent?: () => void;
}

export default function VoucherDetailsModal({
  open,
  onClose,
  voucher,
  onEmailSent,
}: VoucherDetailsModalProps) {
  const [copied, setCopied] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!voucher) return null;

  const locationsList = Array.isArray(voucher.locations)
    ? voucher.locations.join(", ")
    : String(voucher.locations);

  function handleCopyNumber() {
    if (!voucher) return;
    navigator.clipboard.writeText(voucher.voucher_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadPdf() {
    if (!voucher) return;
    setDownloadingPdf(true);
    const link = document.createElement("a");
    link.href = `/api/vouchers/download/${voucher.voucher_number}`;
    link.download = `Holiday-Gift-Voucher-${voucher.voucher_number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingPdf(false), 1500);
  }

  async function handleResendEmail() {
    if (!voucher) return;
    setResending(true);
    setResendStatus(null);
    try {
      await api.post(`/vouchers/${voucher.voucher_id}/resend-email`, {});
      setResendStatus("Voucher email sent successfully.");
      onEmailSent?.();
    } catch {
      setResendStatus("Failed to send voucher email.");
    } finally {
      setResending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Gift Voucher Details" size="lg">
      <div className="space-y-6 pb-2">
        {/* Header Summary Card */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300">
              Mandarin Worldwide Vacations
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-mono font-bold text-amber-400">
                {voucher.voucher_number}
              </span>
              <button
                onClick={handleCopyNumber}
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Copy voucher number"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Created on {formatDate(voucher.created_at)}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <div>
              {voucher.status === "ACTIVE" && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
                </span>
              )}
              {voucher.status === "REDEEMED" && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" /> REDEEMED
                </span>
              )}
              {voucher.status === "EXPIRED" && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <AlertCircle className="w-3.5 h-3.5" /> EXPIRED
                </span>
              )}
            </div>
            <span className="text-xs text-slate-300 font-medium bg-white/10 px-2 py-0.5 rounded">
              {voucher.voucher_type}
            </span>
          </div>
        </div>

        {/* Resend Status Banner */}
        {resendStatus && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              resendStatus.includes("success")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {resendStatus.includes("success") ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{resendStatus}</span>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Applicant & Spouse */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" /> Recipient Details
            </p>
            <div>
              <p className="font-bold text-slate-800 text-base">{voucher.applicant}</p>
              {voucher.spouse && (
                <p className="text-xs text-slate-500 mt-0.5">Spouse: {voucher.spouse}</p>
              )}
            </div>
            <div className="space-y-1 text-xs text-slate-600 pt-1">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">{voucher.email}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">{voucher.phone}</span>
              </p>
            </div>
          </div>

          {/* Validity & Dates */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Validity &amp; Dates
            </p>
            <div>
              <p className="text-xs text-slate-600 font-semibold">Validity: <span className="text-slate-900 font-bold">{voucher.validity}</span></p>
            </div>
            <div className="space-y-1 text-xs text-slate-600 pt-1">
              <p className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Issued: <strong>{formatDate(voucher.issue_date)}</strong></span>
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Expires: <strong className="text-red-600">{formatDate(voucher.expiry_date)}</strong></span>
              </p>
            </div>
          </div>

          {/* Redemption Status */}
          {voucher.status === "REDEEMED" && (
            <div className="col-span-1 sm:col-span-2 bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 space-y-1">
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Redemption Information
              </p>
              <p className="text-xs text-blue-900">
                Redeemed At: <strong>{formatDateTime(voucher.redeemed_at)}</strong>
              </p>
            </div>
          )}

          {/* Destinations */}
          <div className="col-span-1 sm:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> Eligible Destinations
            </p>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {locationsList}
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="col-span-1 sm:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" /> Terms &amp; Conditions
            </p>
            <div className="max-h-40 overflow-y-auto p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">
              {voucher.terms_and_conditions}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={resending}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {resending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Email...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Resend Email</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold hover:bg-slate-900 transition-colors"
            >
              {downloadingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
