"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api, getToken } from "@/lib/api";
import { staffImageUrl } from "@/lib/imageUrl";
import {
  Search, Plus, Loader2, Pencil, Trash2, ShieldAlert, RotateCcw, Users,
  Camera, Upload, X, User,
} from "lucide-react";
import Modal from "@/Components/Admin/Modal";
import ConfirmModal from "@/Components/Admin/ConfirmModal";

interface StaffMember {
  staff_id: number;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  photo?: string | null;
  designation?: string | null;
  department?: string | null;
  joining_date?: string | null;
  status: "ACTIVE" | "INACTIVE";
  deleted_at?: string | null;
}

interface StaffForm {
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  photo: string;
  designation: string;
  department: string;
  joining_date: string;
  status: "ACTIVE" | "INACTIVE";
}

const empty: StaffForm = {
  employee_id: "", full_name: "", email: "", phone: "", photo: "",
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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setEditing(null);
    setForm(empty);
    setPhotoFile(null);
    setPhotoPreview("");
    setFormErr("");
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openEdit(m: StaffMember) {
    setEditing(m);
    setForm({
      employee_id: m.employee_id ?? "",
      full_name: m.full_name,
      email: m.email,
      phone: m.phone,
      photo: m.photo ?? "",
      designation: m.designation ?? "",
      department: m.department ?? "",
      joining_date: m.joining_date ? m.joining_date.slice(0, 10) : "",
      status: m.status,
    });
    setPhotoFile(null);
    setPhotoPreview(m.photo || "");
    setFormErr("");
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handlePhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormErr("Image size cannot exceed 5MB.");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleRemovePhoto() {
    setPhotoFile(null);
    setPhotoPreview("");
    setForm(f => ({ ...f, photo: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    if (!form.full_name || !form.email || !form.phone) {
      setFormErr("Full name, email and phone are required.");
      return;
    }
    setSaving(true);
    setFormErr("");
    try {
      let photoUrl: string | null = form.photo ? form.photo : null;

      // If user selected a new photo file, upload it
      if (photoFile) {
        const fd = new FormData();
        fd.append("file", photoFile);
        const t = getToken();
        const uploadRes = await fetch("/api/staff/upload-photo", {
          method: "POST",
          headers: t ? { Authorization: `Bearer ${t}` } : {},
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData?.message || "Failed to upload staff photo.");
        }
        photoUrl = uploadData?.data?.photo || uploadData?.data?.url || null;
      }

      const payload = {
        ...form,
        photo: photoUrl,
        employee_id:  form.employee_id.trim() || undefined,
        joining_date: form.joining_date || null,
        designation:  form.designation  || null,
        department:   form.department   || null,
      };
      if (editing) {
        await api.put(`/staff/${editing.staff_id}`, payload);
      } else {
        await api.post("/staff", payload);
      }
      setShowForm(false);
      load();
    } catch (e: any) {
      setFormErr(e?.message ?? "Failed to save.");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm) return;
    const targetId = confirm.member.staff_id;
    setDeleting(true);
    try {
      if (confirm.type === "permanent") {
        await api.delete(`/staff/${targetId}/permanent`);
      } else {
        await api.delete(`/staff/${targetId}`);
      }
      setStaff(prev => prev.filter(s => s.staff_id !== targetId));
      setTotal(prev => Math.max(0, prev - 1));
      setConfirm(null);
      await load();
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("not found")) {
        setStaff(prev => prev.filter(s => s.staff_id !== targetId));
        setTotal(prev => Math.max(0, prev - 1));
        setConfirm(null);
      } else {
        alert(err?.message || "Failed to delete staff member.");
      }
    } finally {
      setDeleting(false);
    }
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[950px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Employee ID</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Phone</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Designation</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Department</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Joined</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 pr-6 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map(m => (
                  <tr key={m.staff_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{m.employee_id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {m.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={staffImageUrl(m.photo)}
                            alt={m.full_name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {m.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-slate-800">{m.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{m.email}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{m.phone}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{m.designation || "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{m.department || "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{fmtDate(m.joining_date)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        m.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>{m.status}</span>
                    </td>
                    <td className="px-4 py-3 pr-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(m)}
                          title="Edit Staff"
                          className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setConfirm({ type: "soft", member: m })}
                          title="Delete Staff"
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setConfirm({ type: "permanent", member: m })}
                          title="Permanently Delete Staff"
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors">
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      <Modal open={showForm} onClose={() => { if (!saving) setShowForm(false); }} title={editing ? "Edit Staff" : "Add Staff"} size="md">
        <div className="space-y-4">
          {formErr && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formErr}</p>}

          {/* Staff Photo Picker */}
          <div className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-white flex items-center justify-center shadow-inner">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={staffImageUrl(photoPreview)} alt="Staff preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Staff Photo</span>
                <span className="text-[11px] text-slate-400 font-normal">(Optional)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, or WEBP up to 5MB</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{photoPreview ? "Change Photo" : "Upload Photo"}</span>
                </button>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handlePhotoPick}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Employee ID <span className="text-slate-400 font-normal">(Auto if blank)</span></label>
              <input className={inp} value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} placeholder="e.g. EMP-004" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input className={inp} value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="e.g. Rahul Sharma" />
            </div>
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
