"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Ticket,
  Plus,
  Eye,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  Copy,
  Check,
  Download,
} from "lucide-react";
import VoucherDetailsModal, { VoucherItem } from "@/Components/Admin/VoucherDetailsModal";

function fmtDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AllVouchersPage() {
  const router = useRouter();

  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [resendingId, setResendingId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [copiedNo, setCopiedNo] = useState<string | null>(null);

  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (query) params.set("search", query);
      if (typeFilter) params.set("voucher_type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (fromDate) params.set("from_date", fromDate);
      if (toDate) params.set("to_date", toDate);

      const res = await api.get<{
        data: {
          vouchers: VoucherItem[];
          total: number;
        };
      }>(`/vouchers?${params.toString()}`);

      setVouchers(res?.data?.vouchers ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch {
      setVouchers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, query, typeFilter, statusFilter, fromDate, toDate]);

  useEffect(() => {
    load();
  }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  }

  function handleClearFilters() {
    setSearch("");
    setQuery("");
    setTypeFilter("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setPage(1);
  }

  function handleCopy(num: string) {
    navigator.clipboard.writeText(num);
    setCopiedNo(num);
    setTimeout(() => setCopiedNo(null), 2000);
  }

  async function handleResend(voucher: VoucherItem) {
    setResendingId(voucher.voucher_id);
    setToastMsg(null);
    try {
      await api.post(`/vouchers/${voucher.voucher_id}/resend-email`, {});
      setToastMsg({
        text: `Voucher email sent successfully to ${voucher.email}.`,
        type: "success",
      });
      setTimeout(() => setToastMsg(null), 4000);
    } catch {
      setToastMsg({
        text: `Failed to resend voucher email to ${voucher.email}.`,
        type: "error",
      });
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setResendingId(null);
    }
  }

  function openView(v: VoucherItem) {
    setSelectedVoucher(v);
    setDetailsOpen(true);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Gift Vouchers</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {total} total vouchers issued • Manage redemption status and email dispatches
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/vouchers/create")}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Voucher</span>
        </button>
      </div>

      {/* Notification Toast */}
      {toastMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            toastMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{toastMsg.text}</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="text-xs text-slate-400 hover:text-slate-700 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[240px] flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Voucher No, Applicant, Email, Phone..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Non Member">Non Member</option>
            <option value="Member">Member</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="REDEEMED">REDEEMED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>

          {/* Date range filters */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className="text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span>To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className="text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(query || typeFilter || statusFilter || fromDate || toDate) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center h-56">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : vouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 text-slate-400">
            <Ticket className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-base font-semibold text-slate-600">No vouchers found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or create a new voucher.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3.5">Voucher No</th>
                  <th className="text-left px-4 py-3.5">Applicant</th>
                  <th className="text-left px-4 py-3.5">Type</th>
                  <th className="text-left px-4 py-3.5">Email</th>
                  <th className="text-left px-4 py-3.5">Issue Date</th>
                  <th className="text-left px-4 py-3.5">Expiry</th>
                  <th className="text-center px-4 py-3.5">Status</th>
                  <th className="text-center px-4 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vouchers.map((v) => {
                  return (
                    <tr
                      key={v.voucher_id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Voucher No */}
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-blue-700">
                        <div className="flex items-center gap-1.5">
                          <span>{v.voucher_number}</span>
                          <button
                            onClick={() => handleCopy(v.voucher_number)}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                            title="Copy number"
                          >
                            {copiedNo === v.voucher_number ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Applicant */}
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        {v.applicant}
                        {v.spouse && (
                          <span className="block text-[11px] font-normal text-slate-400">
                            &amp; {v.spouse}
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5 text-xs text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                          {v.voucher_type}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px]" title={v.email}>
                            {v.email}
                          </span>
                        </div>
                      </td>

                      {/* Issue Date */}
                      <td className="px-4 py-3.5 text-xs text-slate-600">
                        {fmtDate(v.issue_date)}
                      </td>

                      {/* Expiry */}
                      <td className="px-4 py-3.5 text-xs font-medium text-slate-700">
                        {fmtDate(v.expiry_date)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        {v.status === "ACTIVE" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> ACTIVE
                          </span>
                        )}
                        {v.status === "REDEEMED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            <CheckCircle2 className="w-3 h-3" /> REDEEMED
                          </span>
                        )}
                        {v.status === "EXPIRED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" /> EXPIRED
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openView(v)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                            title="View Voucher Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>View</span>
                          </button>

                          <a
                            href={`/api/vouchers/download/${v.voucher_number}`}
                            download={`Holiday-Gift-Voucher-${v.voucher_number}.pdf`}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
                            title="Download Voucher PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-600" />
                            <span>PDF</span>
                          </a>

                          <button
                            onClick={() => handleResend(v)}
                            disabled={resendingId === v.voucher_id}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
                            title="Resend Voucher Email"
                          >
                            {resendingId === v.voucher_id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Resend</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm pt-2">
          <p className="text-slate-500 text-xs">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} vouchers
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-xs font-semibold text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* View Voucher Modal */}
      <VoucherDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        voucher={selectedVoucher}
        onEmailSent={load}
      />
    </div>
  );
}
