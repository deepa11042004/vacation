"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search, Loader2, ChevronLeft, ChevronRight, RefreshCw,
  CheckCircle2, Clock, XCircle, PhoneCall, FileText, UserCheck, Trash2, Eye, CreditCard, Sparkles
} from "lucide-react";

type LeadStatus = "NEW" | "UNDER_REVIEW" | "CONTACTED" | "APPROVED" | "REJECTED";

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  mobile: string;
  email: string;
  planTier?: string;
  planTenure?: string;
  planRefCode?: string;
  roomType?: string;
  totalCost?: string;
  downPaymentPercent?: number;
  downPaymentAmount?: number;
  emiTenureMonths?: number;
  monthlyEmi?: number;
  status: LeadStatus;
  created_at: string;
  notes?: string;
}

interface ApiResp {
  success: boolean;
  data: { leads: Lead[]; total: number; page: number; limit: number };
}

const STATUS_META: Record<LeadStatus, { label: string; icon: React.ReactNode; color: string; idle: string }> = {
  NEW:          { label: "New",          icon: <Clock className="w-3.5 h-3.5" />,        color: "bg-blue-100 text-blue-700 border border-blue-300",         idle: "bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 hover:text-blue-700" },
  UNDER_REVIEW: { label: "Under Review", icon: <Eye className="w-3.5 h-3.5" />,          color: "bg-amber-100 text-amber-700 border border-amber-300",       idle: "bg-amber-50 text-amber-500 border border-amber-200 hover:bg-amber-100 hover:text-amber-700" },
  CONTACTED:    { label: "Contacted",    icon: <PhoneCall className="w-3.5 h-3.5" />,    color: "bg-purple-100 text-purple-700 border border-purple-300",   idle: "bg-purple-50 text-purple-500 border border-purple-200 hover:bg-purple-100 hover:text-purple-700" },
  APPROVED:     { label: "Approved",     icon: <UserCheck className="w-3.5 h-3.5" />,    color: "bg-emerald-100 text-emerald-700 border border-emerald-300", idle: "bg-emerald-50 text-emerald-500 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700" },
  REJECTED:     { label: "Rejected",     icon: <XCircle className="w-3.5 h-3.5" />,      color: "bg-rose-100 text-rose-700 border border-rose-300",         idle: "bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 hover:text-rose-700" },
};

const STATUSES: LeadStatus[] = ["NEW", "UNDER_REVIEW", "CONTACTED", "APPROVED", "REJECTED"];

function fmtDate(s: string) {
  return new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function formatRupees(num?: number | string): string {
  if (num === undefined || num === null) return "—";
  if (typeof num === "string") return num.startsWith("₹") ? num : `₹${num}`;
  return "₹" + Math.round(num).toLocaleString("en-IN");
}

function LeadRow({ lead, onUpdated }: { lead: Lead; onUpdated: () => void }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const status = STATUS_META[lead.status] ?? STATUS_META.NEW;

  async function updateStatus(newStatus: LeadStatus) {
    setSaving(true);
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      onUpdated();
    } finally {
      setSaving(false);
    }
  }

  async function saveNotes() {
    setSaving(true);
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      onUpdated();
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead() {
    if (!confirm(`Are you sure you want to delete lead for ${lead.name}?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        onUpdated();
      } else {
        alert(data?.error || "Failed to delete lead");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting lead");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow">
      {/* Summary Header Row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors text-left cursor-pointer"
      >
        {/* Lead Name & Plan Badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-800 truncate">{lead.name}</p>
            {lead.planTier && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                👑 {lead.planTier} {lead.planTenure ? `(${lead.planTenure})` : ""}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate">{lead.email}</p>
        </div>

        {/* Mobile */}
        <p className="text-sm text-slate-600 shrink-0 hidden sm:block font-medium">{lead.mobile}</p>

        {/* Down Payment Summary */}
        <div className="text-right shrink-0 hidden md:block">
          <p className="text-xs font-bold text-slate-700">
            {formatRupees(lead.downPaymentAmount)}
          </p>
          <p className="text-[10px] text-slate-400">
            DP ({lead.downPaymentPercent ?? 25}%)
          </p>
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${status.color}`}>
          {status.icon} {status.label}
        </span>

        {/* Date */}
        <span className="text-xs text-slate-400 shrink-0 hidden lg:block">{fmtDate(lead.created_at)}</span>
      </button>

      {/* Expanded Details Panel */}
      {open && (
        <div className="border-t border-slate-100 p-5 space-y-5 bg-slate-50">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Lead & Plan Details Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" /> Lead &amp; Plan Details
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">First Name:</span>
                  <span className="font-semibold text-slate-800">{lead.firstName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Last Name:</span>
                  <span className="font-semibold text-slate-800">{lead.lastName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Mobile:</span>
                  <span className="font-semibold text-slate-800">{lead.mobile}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-800 break-all">{lead.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Plan Tier:</span>
                  <span className="font-bold text-amber-700">{lead.planTier || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Tenure:</span>
                  <span className="font-semibold text-slate-800">{lead.planTenure || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Room Type:</span>
                  <span className="font-semibold text-slate-800">{lead.roomType || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Ref Code:</span>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">{lead.planRefCode || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Financial & Payment Breakdown Card */}
            <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 border border-amber-200/80 rounded-xl p-4 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Payment &amp; EMI Breakdown
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="text-slate-600">Total Membership Cost:</span>
                  <span className="font-extrabold text-slate-900">{formatRupees(lead.totalCost)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="text-slate-600">Down Payment Selected:</span>
                  <span className="font-bold text-amber-800">{lead.downPaymentPercent ?? 25}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="text-slate-600">Down Payment Amount (Payable Now):</span>
                  <span className="font-extrabold text-emerald-700">{formatRupees(lead.downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="text-slate-600">EMI Tenure:</span>
                  <span className="font-semibold text-slate-800">
                    {lead.emiTenureMonths ? `${lead.emiTenureMonths} Months ${lead.emiTenureMonths <= 24 ? "(No Cost EMI)" : ""}` : "Full Payment"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="text-slate-600">Monthly EMI:</span>
                  <span className="font-extrabold text-blue-700">{lead.monthlyEmi ? `${formatRupees(lead.monthlyEmi)} / mo` : "₹0/-"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Annual Maintenance Fee (AMC):</span>
                  <span className="font-bold text-amber-600">₹14,999 / year</span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Status Actions */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Update Lead Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={saving || lead.status === s}
                  onClick={() => updateStatus(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer disabled:cursor-default ${
                    lead.status === s ? STATUS_META[s].color + " ring-2 ring-offset-1 ring-current/30" : STATUS_META[s].idle
                  }`}
                >
                  {saving && lead.status !== s ? <Loader2 className="w-3 h-3 animate-spin" /> : STATUS_META[s].icon}
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Notes & Delete */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin Notes</p>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this lead…"
              className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
            <div className="flex justify-between items-center pt-1">
              <button
                onClick={deleteLead}
                disabled={deleting}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete Lead
              </button>

              <button
                onClick={saveNotes}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-60 transition-colors cursor-pointer"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "">("");
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (search) params.set("search", search);
      if (filterStatus) params.set("status", filterStatus);
      const res = await fetch(`/api/leads?${params}`);
      const data: ApiResp = await res.json();
      if (data?.success) {
        setLeads(data.data.leads);
        setTotal(data.data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / LIMIT);

  // Summary counts
  const newCount = leads.filter((l) => l.status === "NEW").length;
  const reviewCount = leads.filter((l) => l.status === "UNDER_REVIEW").length;
  const approvedCount = leads.filter((l) => l.status === "APPROVED").length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Leads
          </h1>
          <p className="text-sm text-slate-500">
            {total} total membership lead{total !== 1 ? "s" : ""} from website form
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Leads", value: total, color: "bg-blue-50 text-blue-700", border: "border-blue-200" },
          { label: "New", value: newCount, color: "bg-amber-50 text-amber-700", border: "border-amber-200" },
          { label: "Under Review", value: reviewCount, color: "bg-purple-50 text-purple-700", border: "border-purple-200" },
          { label: "Approved", value: approvedCount, color: "bg-emerald-50 text-emerald-700", border: "border-emerald-200" },
        ].map(({ label, value, color, border }) => (
          <div key={label} className={`rounded-xl border p-4 ${border} ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide mt-1 opacity-75">{label}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, mobile, plan tier…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as LeadStatus | "");
            setPage(1);
          }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 text-slate-600 cursor-pointer"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white border border-slate-200 rounded-xl">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-slate-700">No membership leads found</p>
          <p className="text-sm mt-1 text-slate-400">
            Leads submitted through the membership join form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map((l) => (
            <LeadRow key={l.id} lead={l} onUpdated={load} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
