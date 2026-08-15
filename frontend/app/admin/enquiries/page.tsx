"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search, Loader2, ChevronLeft, ChevronRight, RefreshCw,
  CheckCircle2, Clock, XCircle, PhoneCall, UserCheck, MessageSquare,
} from "lucide-react";

type EnquiryStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";

interface Enquiry {
  id: number;
  name: string;
  mobile: string;
  city: string;
  age: string;
  email: string;
  status: EnquiryStatus;
  created_at: string;
  notes?: string;
}

interface ApiResp {
  success: boolean;
  data: { enquiries: Enquiry[]; total: number; page: number; limit: number };
}

const STATUS_META: Record<EnquiryStatus, { label: string; icon: React.ReactNode; color: string; idle: string }> = {
  NEW:       { label: "New",       icon: <Clock         className="w-3.5 h-3.5" />, color: "bg-blue-100 text-blue-700 border border-blue-300",     idle: "bg-blue-50 text-blue-400 border border-blue-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300" },
  CONTACTED: { label: "Contacted", icon: <PhoneCall      className="w-3.5 h-3.5" />, color: "bg-amber-100 text-amber-700 border border-amber-300",   idle: "bg-amber-50 text-amber-400 border border-amber-200 hover:bg-amber-100 hover:text-amber-700 hover:border-amber-300" },
  CONVERTED: { label: "Converted", icon: <UserCheck      className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700 border border-emerald-300", idle: "bg-emerald-50 text-emerald-400 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300" },
  CLOSED:    { label: "Closed",    icon: <XCircle        className="w-3.5 h-3.5" />, color: "bg-slate-200 text-slate-600 border border-slate-300",   idle: "bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-200 hover:text-slate-600 hover:border-slate-300" },
};

const STATUSES: EnquiryStatus[] = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];

function fmtDate(s: string) {
  return new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function EnquiryRow({ e, onUpdated }: { e: Enquiry; onUpdated: () => void }) {
  const [open,   setOpen]   = useState(false);
  const [notes,  setNotes]  = useState(e.notes ?? "");
  const [saving, setSaving] = useState(false);

  const status = STATUS_META[e.status] ?? STATUS_META.NEW;

  async function updateStatus(newStatus: EnquiryStatus) {
    setSaving(true);
    try {
      await fetch(`/api/enquiries/${e.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      onUpdated();
    } finally { setSaving(false); }
  }

  async function saveNotes() {
    setSaving(true);
    try {
      await fetch(`/api/enquiries/${e.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      onUpdated();
    } finally { setSaving(false); }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors text-left"
      >
        {/* Name + email */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{e.name}</p>
          <p className="text-xs text-slate-400 truncate">{e.email}</p>
        </div>
        {/* Mobile */}
        <p className="text-sm text-slate-600 shrink-0 hidden sm:block">{e.mobile}</p>
        {/* City */}
        <p className="text-xs text-slate-400 shrink-0 hidden md:block">{e.city || "—"}</p>
        {/* Age */}
        <p className="text-xs text-slate-400 shrink-0 hidden lg:block">{e.age || "—"}</p>
        {/* Status badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${status.color}`}>
          {status.icon} {status.label}
        </span>
        {/* Date */}
        <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{fmtDate(e.created_at)}</span>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="border-t border-slate-100 p-4 space-y-4 bg-slate-50">
          {/* Details grid */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Enquiry Details</p>
            <div className="bg-white border border-slate-200 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="flex gap-1.5 text-xs"><span className="text-slate-400 shrink-0">Name:</span><span className="text-slate-700 font-medium">{e.name}</span></div>
              <div className="flex gap-1.5 text-xs"><span className="text-slate-400 shrink-0">Mobile:</span><span className="text-slate-700 font-medium">{e.mobile}</span></div>
              <div className="flex gap-1.5 text-xs"><span className="text-slate-400 shrink-0">Email:</span><span className="text-slate-700 font-medium break-all">{e.email}</span></div>
              {e.city && <div className="flex gap-1.5 text-xs"><span className="text-slate-400 shrink-0">City:</span><span className="text-slate-700 font-medium">{e.city}</span></div>}
              {e.age && <div className="flex gap-1.5 text-xs"><span className="text-slate-400 shrink-0">Age Group:</span><span className="text-slate-700 font-medium">{e.age}</span></div>}
              <div className="flex gap-1.5 text-xs"><span className="text-slate-400 shrink-0">Submitted:</span><span className="text-slate-700 font-medium">{fmtDate(e.created_at)}</span></div>
            </div>
          </div>

          {/* Status changer */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  disabled={saving || e.status === s}
                  onClick={() => updateStatus(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:cursor-default
                    ${e.status === s ? STATUS_META[s].color + " ring-2 ring-offset-1 ring-current/30" : STATUS_META[s].idle}`}
                >
                  {saving && e.status !== s ? <Loader2 className="w-3 h-3 animate-spin" /> : STATUS_META[s].icon}
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              <MessageSquare className="w-3 h-3 inline mr-1" />Admin Notes
            </p>
            <textarea
              rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Add notes visible only to admins…"
              className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={saveNotes} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-60 transition-colors"
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

export default function EnquiriesPage() {
  const [enquiries,    setEnquiries]    = useState<Enquiry[]>([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState<EnquiryStatus | "">("");
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (search)       params.set("search", search);
      if (filterStatus) params.set("status", filterStatus);
      const res = await fetch(`/api/enquiries?${params}`);
      const data: ApiResp = await res.json();
      if (data?.success) {
        setEnquiries(data.data.enquiries);
        setTotal(data.data.total);
      }
    } finally { setLoading(false); }
  }, [page, search, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / LIMIT);

  // Summary counts
  const newCount       = enquiries.filter(e => e.status === "NEW").length;
  const contactedCount = enquiries.filter(e => e.status === "CONTACTED").length;
  const convertedCount = enquiries.filter(e => e.status === "CONVERTED").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Enquiries</h1>
          <p className="text-sm text-slate-500">{total} total enquir{total !== 1 ? "ies" : "y"} from the website form</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total",     value: total,         color: "bg-blue-50 text-blue-700",    border: "border-blue-200" },
          { label: "New",       value: newCount,      color: "bg-amber-50 text-amber-700",  border: "border-amber-200" },
          { label: "Contacted", value: contactedCount,color: "bg-violet-50 text-violet-700",border: "border-violet-200" },
          { label: "Converted", value: convertedCount,color: "bg-emerald-50 text-emerald-700",border: "border-emerald-200" },
        ].map(({ label, value, color, border }) => (
          <div key={label} className={`rounded-xl border p-4 ${border} ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide mt-1 opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, mobile, city…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value as EnquiryStatus | ""); setPage(1); }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 text-slate-600"
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-slate-400 animate-spin" /></div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No enquiries found</p>
          <p className="text-sm mt-1">Enquiries submitted on the website will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {enquiries.map(e => <EnquiryRow key={e.id} e={e} onUpdated={load} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
