"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import {
  Plane, Hotel, Car, Sliders, FileText, BedDouble,
  Search, Loader2, ChevronLeft, ChevronRight, RefreshCw,
  CheckCircle2, Clock, AlertCircle, XCircle,
} from "lucide-react";

type QueryType   = "FLIGHT" | "HOTEL" | "CAR_RENTAL" | "TRANSPORT" | "VISA" | "STAYS";
type QueryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

interface TravelQuery {
  query_id: number;
  query_type: QueryType;
  status: QueryStatus;
  card_number: string;
  details?: Record<string, string> | null;
  admin_notes?: string | null;
  created_at: string;
}

interface ApiResp {
  success: boolean;
  data: { queries: TravelQuery[]; total: number; page: number; limit: number };
}

const TYPE_META: Record<QueryType, { label: string; icon: React.ReactNode; color: string }> = {
  FLIGHT:    { label: "Flight",        icon: <Plane      className="w-3.5 h-3.5" />, color: "bg-blue-100 text-blue-700" },
  HOTEL:     { label: "Hotel",         icon: <Hotel      className="w-3.5 h-3.5" />, color: "bg-violet-100 text-violet-700" },
  CAR_RENTAL:{ label: "Car Rental",    icon: <Car        className="w-3.5 h-3.5" />, color: "bg-amber-100 text-amber-700" },
  TRANSPORT: { label: "Transport",     icon: <Sliders    className="w-3.5 h-3.5" />, color: "bg-teal-100 text-teal-700" },
  VISA:      { label: "Visa",          icon: <FileText   className="w-3.5 h-3.5" />, color: "bg-rose-100 text-rose-700" },
  STAYS:     { label: "Plan My Stays", icon: <BedDouble  className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700" },
};

const STATUS_META: Record<QueryStatus, { label: string; icon: React.ReactNode; color: string; idle: string }> = {
  NEW:         { label: "New",         icon: <AlertCircle   className="w-3.5 h-3.5" />, color: "bg-blue-100 text-blue-700 border border-blue-300",     idle: "bg-blue-50 text-blue-400 border border-blue-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300" },
  IN_PROGRESS: { label: "In Progress", icon: <Clock         className="w-3.5 h-3.5" />, color: "bg-amber-100 text-amber-700 border border-amber-300",   idle: "bg-amber-50 text-amber-400 border border-amber-200 hover:bg-amber-100 hover:text-amber-700 hover:border-amber-300" },
  RESOLVED:    { label: "Resolved",    icon: <CheckCircle2  className="w-3.5 h-3.5" />, color: "bg-emerald-100 text-emerald-700 border border-emerald-300", idle: "bg-emerald-50 text-emerald-400 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300" },
  CLOSED:      { label: "Closed",      icon: <XCircle       className="w-3.5 h-3.5" />, color: "bg-slate-200 text-slate-600 border border-slate-300",   idle: "bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-200 hover:text-slate-600 hover:border-slate-300" },
};

const STATUSES: QueryStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const TYPES:    QueryType[]   = ["FLIGHT", "HOTEL", "CAR_RENTAL", "TRANSPORT", "VISA", "STAYS"];

function fmtDate(s: string) {
  return new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-1.5 text-xs">
      <span className="text-slate-400 shrink-0">{label}:</span>
      <span className="text-slate-700 font-medium">{value}</span>
    </div>
  );
}

function QueryRow({ q, onUpdated }: { q: TravelQuery; onUpdated: () => void }) {
  const [open,    setOpen]    = useState(false);
  const [notes,   setNotes]   = useState(q.admin_notes ?? "");
  const [saving,  setSaving]  = useState(false);

  const type   = TYPE_META[q.query_type];
  const status = STATUS_META[q.status];

  async function updateStatus(newStatus: QueryStatus) {
    setSaving(true);
    try {
      await api.patch(`/travel-queries/${q.query_id}`, { status: newStatus });
      onUpdated();
    } finally { setSaving(false); }
  }

  async function saveNotes() {
    setSaving(true);
    try {
      await api.patch(`/travel-queries/${q.query_id}`, { admin_notes: notes });
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
        {/* Type badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${type.color}`}>
          {type.icon} {type.label}
        </span>
        {/* Card */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 font-mono">{q.card_number}</p>
          <p className="text-xs text-slate-400">Member card</p>
        </div>
        {/* Status badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${status.color}`}>
          {status.icon} {status.label}
        </span>
        {/* Date */}
        <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{fmtDate(q.created_at)}</span>
      </button>

      {/* Expanded detail panel */}
      {open && (
        <div className="border-t border-slate-100 p-4 space-y-4 bg-slate-50">
          {/* Query details */}
          {q.details && Object.keys(q.details).length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Request Details</p>
              <div className="bg-white border border-slate-200 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(q.details).map(([k, v]) => (
                  <DetailRow key={k} label={k.replace(/_/g, " ")} value={v} />
                ))}
              </div>
            </div>
          )}

          {/* Status changer */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  disabled={saving || q.status === s}
                  onClick={() => updateStatus(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:cursor-default
                    ${q.status === s ? STATUS_META[s].color + " ring-2 ring-offset-1 ring-current/30" : STATUS_META[s].idle}`}
                >
                  {saving && q.status !== s ? <Loader2 className="w-3 h-3 animate-spin" /> : STATUS_META[s].icon}
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Admin Notes</p>
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
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TravelQueriesPage() {
  const [queries,    setQueries]    = useState<TravelQuery[]>([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [filterType,   setFilterType]   = useState<QueryType | "">("");
  const [filterStatus, setFilterStatus] = useState<QueryStatus | "">("");
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (search)       params.set("search",     search);
      if (filterType)   params.set("query_type", filterType);
      if (filterStatus) params.set("status",     filterStatus);
      const res = await api.get<ApiResp>(`/travel-queries?${params}`);
      if (res?.success) {
        setQueries(res.data.queries);
        setTotal(res.data.total);
      }
    } finally { setLoading(false); }
  }, [page, search, filterType, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / LIMIT);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Travel Queries</h1>
          <p className="text-sm text-slate-500">{total} total request{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-48">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by card number…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </form>
        <select
          value={filterType} onChange={e => { setFilterType(e.target.value as QueryType | ""); setPage(1); }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 text-slate-600"
        >
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{TYPE_META[t].label}</option>)}
        </select>
        <select
          value={filterStatus} onChange={e => { setFilterStatus(e.target.value as QueryStatus | ""); setPage(1); }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 text-slate-600"
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-slate-400 animate-spin" /></div>
      ) : queries.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No travel queries found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {queries.map(q => <QueryRow key={q.query_id} q={q} onUpdated={load} />)}
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
