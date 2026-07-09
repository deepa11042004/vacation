"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2, Search, Eye, Trash2, FileText, RotateCcw, ShieldAlert } from "lucide-react";
import ConfirmModal from "@/Components/Admin/ConfirmModal";

interface Invoice {
  invoice_id: number;
  invoice_no: string;
  invoice_type: "invoice" | "tax";
  client_id: number;
  client_name: string;
  card_number: string;
  email: string;
  amount: string;
  issue_date: string;
  created_at: string;
  deleted_at: string | null;
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function fmtAmt(amt: string | number) {
  return `₹${Number(amt || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState("");
  const [query,    setQuery]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ type: "soft" | "permanent" | "restore"; invoice: Invoice } | null>(null);

  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (query) params.set("search", query);
      const res = await api.get<{ data: { invoices: Invoice[]; total: number } }>(
        `/invoices?${params}`,
      );
      setInvoices(res.data.invoices);
      setTotal(res.data.total);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  }

  const [restoring,    setRestoring]    = useState<number | null>(null);
  const [permDeleting, setPermDeleting] = useState<number | null>(null);

  async function handleDelete(invoice_id: number) {
    setDeleting(invoice_id);
    try {
      await api.delete(`/invoices/${invoice_id}`);
      setConfirmModal(null);
      await load();
    } catch {
      alert("Failed to delete invoice.");
    } finally {
      setDeleting(null);
    }
  }

  async function handleRestore(invoice_id: number) {
    setRestoring(invoice_id);
    try {
      await api.post(`/invoices/${invoice_id}/restore`, {});
      setConfirmModal(null);
      await load();
    } catch {
      alert("Failed to restore invoice.");
    } finally {
      setRestoring(null);
    }
  }

  async function handlePermanentDelete(invoice_id: number) {
    setPermDeleting(invoice_id);
    try {
      await api.delete(`/invoices/${invoice_id}/permanent`);
      setConfirmModal(null);
      await load();
    } catch {
      alert("Failed to permanently delete invoice.");
    } finally {
      setPermDeleting(null);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Invoices</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} total invoices sent</p>
        </div>
        <FileText className="w-6 h-6 text-slate-400" />
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Search by name, invoice no, card no…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={() => { setSearch(""); setQuery(""); setPage(1); }}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <FileText className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No invoices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">S.No</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Card No</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Invoice No</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Created At</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Amount</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-600">Open</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-600">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv, idx) => {
                  const isDeleted = !!inv.deleted_at;
                  return (
                    <tr
                      key={inv.invoice_id}
                      className={isDeleted ? "bg-red-50 opacity-70" : "hover:bg-slate-50 transition-colors"}
                    >
                      <td className="px-4 py-3 text-slate-500">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">
                        {inv.card_number || "—"}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {inv.invoice_no}
                        {isDeleted && (
                          <span className="ml-2 text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                            DELETED
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {inv.invoice_type === "tax" ? (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            TAX
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                            INV
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{fmtDate(inv.created_at)}</td>
                      <td className="px-4 py-3 text-slate-800">{inv.client_name}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800">
                        {fmtAmt(inv.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => router.push(`/admin/invoices/${inv.invoice_id}`)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Open
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!isDeleted ? (
                          <button
                            onClick={() => setConfirmModal({ type: "soft", invoice: inv })}
                            className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              onClick={() => setConfirmModal({ type: "restore", invoice: inv })}
                              disabled={restoring === inv.invoice_id || permDeleting === inv.invoice_id}
                              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              {restoring === inv.invoice_id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <RotateCcw className="w-3.5 h-3.5" />}
                              Restore
                            </button>
                            <button
                              onClick={() => setConfirmModal({ type: "permanent", invoice: inv })}
                              disabled={restoring === inv.invoice_id || permDeleting === inv.invoice_id}
                              className="inline-flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-700 transition-colors disabled:opacity-50"
                            >
                              {permDeleting === inv.invoice_id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <ShieldAlert className="w-3.5 h-3.5" />}
                              Delete Forever
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm modals */}
      <ConfirmModal
        open={confirmModal?.type === "soft"}
        title="Delete Invoice"
        message={`Delete invoice "${confirmModal?.invoice.invoice_no}"? It will be marked as deleted and can be restored later.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting === confirmModal?.invoice.invoice_id}
        onConfirm={() => confirmModal && handleDelete(confirmModal.invoice.invoice_id)}
        onClose={() => { if (!deleting) setConfirmModal(null); }}
      />
      <ConfirmModal
        open={confirmModal?.type === "restore"}
        title="Restore Invoice"
        message={`Restore invoice "${confirmModal?.invoice.invoice_no}"? It will become active again.`}
        confirmLabel="Restore"
        variant="safe"
        loading={restoring === confirmModal?.invoice.invoice_id}
        onConfirm={() => confirmModal && handleRestore(confirmModal.invoice.invoice_id)}
        onClose={() => { if (!restoring) setConfirmModal(null); }}
      />
      <ConfirmModal
        open={confirmModal?.type === "permanent"}
        title="Permanently Delete Invoice"
        message={`Permanently delete invoice "${confirmModal?.invoice.invoice_no}"? This cannot be undone.`}
        confirmLabel="Delete Forever"
        variant="permanent"
        loading={permDeleting === confirmModal?.invoice.invoice_id}
        onConfirm={() => confirmModal && handlePermanentDelete(confirmModal.invoice.invoice_id)}
        onClose={() => { if (!permDeleting) setConfirmModal(null); }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-500">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-slate-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
