"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import {
  Search, Plus, Loader2, Pencil, Trash2, ShieldAlert, RotateCcw, Users,
} from "lucide-react";
import Modal from "@/Components/Admin/Modal";
import ConfirmModal from "@/Components/Admin/ConfirmModal";

interface StaffMember {
  staff_id: number;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  designation?: string | null;
  department?: string | null;
  joining_date?: string | null;
  status: "ACTIVE" | "INACTIVE";
  deleted_at?: string | null;
}

interface StaffForm {
  full_name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  joining_date: string;
  status: "ACTIVE" | "INACTIVE";
}

const empty: StaffForm = {
  full_name: "", email: "", phone: "",
  designation: "", department: "", joining_date: "", status: "ACTIVE",
};

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function StaffPage() {
  const [staff,   setStaff]   = useState<StaffMember[]>([]);
  const [total,   setTotal]   = useState(0);
  const [search,  setSearch]  = useState("");
  const [query,   setQuery]   = useState("");
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);

  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState<StaffMember | null>(null);
  const [form,      setForm]      = useState<StaffForm>(empty);
  const [saving,    setSaving]    = useState(false);
  const [formErr,   setFormErr]   = useState("");

  const [confirm, setConfirm] = useState<{ type: "soft" | "permanent"; member: StaffMember } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (query) p.set("search", query);
      const res = await api.get<{ data: { staff: StaffMember[]; total: number } }>(`/staff?${p}`);
      setStaff(res.data.staff ?? []);
      setTotal(res.data.total ?? 0);
    } catch { setStaff([]); }
    finally { setLoading(false); }
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditing(null); setForm(empty); setFormErr(""); setShowForm(true);
  }
  function openEdit(m: StaffMember) {
    setEditing(m);
    setForm({
      full_name: m.full_name, email: m.email, phone: m.phone,
      designation: m.designation ?? "", department: m.department ?? "",
      joining_date: m.joining_date ? m.joining_date.slice(0, 10) : "",
      status: m.status,
    });
    setFormErr(""); setShowForm(true);
  }

  async function handleSave() {
    if (!form.full_name || !form.email || !form.phone) {
      setFormErr("Full name, email and phone are required."); return;
    }
    setSaving(true); setFormErr("");
    try {
      const payload = {
        ...form,
        joining_date: form.joining_date || null,
        designation:  form.designation  || null,
        department:   form.department   || null,
      };
      if (editing) {
        await api.put(`/staff/${editing.staff_id}`, payload);
      } else {
        await api.post("/staff", payload);
      }
      setShowForm(false); load();
    } catch (e: any) {
      setFormErr(e?.message ?? "Failed to save.");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm) return;
    setDeleting(true);
    try {
      if (confirm.type === "permanent") {
        await api.delete(`/staff/${confirm.member.staff_id}/permanent`);
      } else {
        await api.delete(`/staff/${confirm.member.staff_id}`);
      }
      setConfirm(null); load();
    } catch { setDeleting(false); }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Staff</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} members</p>
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={e => { e.preventDefault(); setPage(1); setQuery(search); }} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name, dept, ID…"
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Search</button>
            {query && (
              <button type="button" onClick={() => { setSearch(""); setQuery(""); setPage(1); }}
                className="px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                Clear
              </button>
            )}
          </form>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /></div>
        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Users className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No staff members found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Employee ID", "Name", "Email", "Phone", "Designation", "Department", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map(m => (
                <tr key={m.staff_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{m.employee_id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{m.full_name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{m.email}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{m.phone}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{m.designation || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{m.department || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{fmtDate(m.joining_date)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      m.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(m)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setConfirm({ type: "soft", member: m })}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setConfirm({ type: "permanent", member: m })}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors">
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40">Previous</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal open={showForm} onClose={() => { if (!saving) setShowForm(false); }} title={editing ? "Edit Staff" : "Add Staff"} size="sm">
        <div className="space-y-4">
          {formErr && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formErr}</p>}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input className={inp} value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="e.g. Rahul Sharma" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email <span className="text-red-500">*</span></label>
              <input className={inp} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone <span className="text-red-500">*</span></label>
              <input className={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Used for login" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Designation</label>
              <input className={inp} value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} placeholder="e.g. Sales Executive" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
              <input className={inp} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Sales" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Joining Date</label>
              <input type="date" className={inp} value={form.joining_date} onChange={e => setForm(f => ({ ...f, joining_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select className={inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as "ACTIVE" | "INACTIVE" }))}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {!editing && (
            <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
              The staff member will log in using their <strong>email + phone number</strong>.
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button onClick={() => { if (!saving) setShowForm(false); }}
              className="flex-1 py-2.5 text-sm border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Staff"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modals */}
      <ConfirmModal
        open={confirm?.type === "soft"}
        title="Delete Staff Member"
        message={`Remove "${confirm?.member.full_name}" from the staff list? This can be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => { if (!deleting) setConfirm(null); }}
      />
      <ConfirmModal
        open={confirm?.type === "permanent"}
        title="Permanently Delete"
        message={`Permanently delete "${confirm?.member.full_name}"? This cannot be undone.`}
        confirmLabel="Delete Forever"
        variant="permanent"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => { if (!deleting) setConfirm(null); }}
      />
    </div>
  );
}
