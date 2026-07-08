"use client";

import { useCallback, useEffect, useState } from "react";
import { api, getStoredUser } from "@/lib/api";
import { SECTIONS } from "@/lib/permissions";
import {
  Loader2,
  Pencil,
  Trash2,
  KeyRound,
  ShieldCheck,
  X,
  Check,
  Eye,
  EyeOff,
  Search,
  Users,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */

interface PanelUser {
  user_id: number;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  role: "ADMIN" | "MANAGER" | "AGENT";
  status: "ACTIVE" | "INACTIVE";
  allowed_sections?: string[] | null;
  created_at: string;
}

const ROLES = ["ADMIN", "MANAGER", "AGENT"] as const;
type Role = (typeof ROLES)[number];

const inp =
  "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
const sel = inp;

const ASSIGNABLE_SECTIONS = SECTIONS.filter((s) => !s.adminOnly);

const SECTION_LABEL: Record<string, string> = Object.fromEntries(
  SECTIONS.map((s) => [s.key, s.label])
);

/* ─── Helpers ────────────────────────────────────────────────── */

function getInitials(u: PanelUser): string {
  if (u.first_name && u.last_name) return (u.first_name[0] + u.last_name[0]).toUpperCase();
  if (u.first_name) return u.first_name[0].toUpperCase();
  return u.email[0].toUpperCase();
}

function getFullName(u: PanelUser): string {
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ");
  return name || u.email;
}

const ROLE_AVATAR: Record<string, string> = {
  ADMIN:   "bg-purple-100 text-purple-700",
  MANAGER: "bg-blue-100 text-blue-700",
  AGENT:   "bg-slate-100 text-slate-600",
};

/* ─── Role / Status badges ───────────────────────────────────── */

function RoleBadge({ role }: { role: string }) {
  const cls: Record<string, string> = {
    ADMIN:   "bg-purple-100 text-purple-700",
    MANAGER: "bg-blue-100 text-blue-700",
    AGENT:   "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls[role] ?? "bg-slate-100 text-slate-600"}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
      status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
    }`}>
      {status}
    </span>
  );
}

/* ─── User card ──────────────────────────────────────────────── */

function UserCard({
  user, currentUserId, onEdit, onResetPw, onDelete,
}: {
  user: PanelUser; currentUserId: number;
  onEdit: () => void; onResetPw: () => void; onDelete: () => void;
}) {
  const isSelf = user.user_id === currentUserId;
  const initials = getInitials(user);
  const fullName = getFullName(user);
  const isAdmin = user.role === "ADMIN";
  const sections = user.allowed_sections ?? [];
  const joined = new Date(user.created_at).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className={`bg-white rounded-2xl border ${isSelf ? "border-blue-200" : "border-slate-200"} flex flex-col hover:shadow-md transition-shadow overflow-hidden`}>
      {/* Card body */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Top row — avatar + name */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${ROLE_AVATAR[user.role] ?? "bg-slate-100 text-slate-600"}`}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 leading-tight truncate max-w-40">
              {fullName}
              {isSelf && (
                <span className="ml-1.5 text-[10px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full align-middle">
                  You
                </span>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-44">{user.email}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <RoleBadge role={user.role} />
          <StatusBadge status={user.status} />
        </div>

        {/* Access sections */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Section Access
          </p>
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs text-purple-600 font-medium">Full access to all sections</span>
            </div>
          ) : sections.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No sections assigned</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {sections.slice(0, 5).map((k) => (
                <span key={k} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {SECTION_LABEL[k] ?? k}
                </span>
              ))}
              {sections.length > 5 && (
                <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                  +{sections.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-300">Joined {joined}</p>
      </div>

      {/* Action bar */}
      <div className="border-t border-slate-100 grid grid-cols-3 divide-x divide-slate-100">
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          onClick={onResetPw}
          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-amber-600 transition-colors"
        >
          <KeyRound className="w-3.5 h-3.5" /> Reset PW
        </button>
        {isSelf ? (
          <div className="flex items-center justify-center py-2.5 text-xs text-slate-300 select-none">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
          </div>
        ) : (
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Section checkboxes ─────────────────────────────────────── */

function SectionPicker({ selected, onChange }: { selected: string[]; onChange: (k: string[]) => void }) {
  function toggle(key: string) {
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
  }
  const all = ASSIGNABLE_SECTIONS.every((s) => selected.includes(s.key));
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200">
        <input type="checkbox" checked={all}
          onChange={() => onChange(all ? [] : ASSIGNABLE_SECTIONS.map((s) => s.key))}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-xs font-semibold text-slate-600">Select all sections</span>
      </div>
      <div className="grid grid-cols-2">
        {ASSIGNABLE_SECTIONS.map((s) => (
          <label key={s.key}
            className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-slate-50 even:border-l border-slate-100 border-b last:border-b-0 nth-last-2:border-b-0"
          >
            <input type="checkbox" checked={selected.includes(s.key)} onChange={() => toggle(s.key)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs text-slate-700">{s.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ─── Edit drawer ────────────────────────────────────────────── */

interface DrawerForm {
  first_name: string; last_name: string; email: string;
  password: string; role: Role; status: "ACTIVE" | "INACTIVE";
  allowed_sections: string[];
}

function EditDrawer({ user, onClose, onSaved }: { user: PanelUser; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<DrawerForm>({
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    email: user.email,
    password: "",
    role: user.role as Role,
    status: user.status,
    allowed_sections: user.allowed_sections ?? [],
  });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function setF(k: keyof DrawerForm, v: unknown) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit() {
    if (!form.email) { setError("Email is required."); return; }
    setSaving(true); setError("");
    try {
      const payload: Record<string, unknown> = {
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        email: form.email,
        role: form.role,
        status: form.status,
        allowed_sections: form.role === "ADMIN" ? null : form.allowed_sections,
      };
      if (form.password) payload.password = form.password;

      const res = await api.put<{ success: boolean; message?: string }>(`/users/${user.user_id}`, payload);
      if (!res?.success) throw new Error(res?.message ?? "Failed to update user.");
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-\[440px\] bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Edit Panel User</h2>
            <p className="text-xs text-slate-400 mt-0.5">Update credentials and section access</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">First Name</label>
              <input className={inp} value={form.first_name} onChange={(e) => setF("first_name", e.target.value)} placeholder="First" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Last Name</label>
              <input className={inp} value={form.last_name} onChange={(e) => setF("last_name", e.target.value)} placeholder="Last" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email <span className="text-red-500">*</span></label>
            <input type="email" className={inp} value={form.email} onChange={(e) => setF("email", e.target.value)} placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              New Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span>
            </label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} className={inp + " pr-10"} value={form.password}
                onChange={(e) => setF("password", e.target.value)} placeholder="Min. 6 characters" />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Role</label>
              <select className={sel} value={form.role} onChange={(e) => setF("role", e.target.value as Role)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
              <select className={sel} value={form.status} onChange={(e) => setF("status", e.target.value as "ACTIVE" | "INACTIVE")}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>
          {form.role !== "ADMIN" && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Allowed Sections <span className="text-slate-400 font-normal">({form.allowed_sections.length} selected)</span>
              </label>
              <SectionPicker selected={form.allowed_sections} onChange={(k) => setF("allowed_sections", k)} />
            </div>
          )}
          {form.role === "ADMIN" && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-700">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              ADMIN role has full access to all sections automatically.
            </div>
          )}
          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reset password modal ───────────────────────────────────── */

function ResetPasswordModal({ user, onClose }: { user: PanelUser; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    if (!password || password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setSaving(true); setError("");
    try {
      const res = await api.post<{ success: boolean; message?: string }>(
        `/users/${user.user_id}/reset-password`, { password }
      );
      if (!res?.success) throw new Error(res?.message ?? "Failed to reset password.");
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-800">Reset Password</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-5 py-5 space-y-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm text-slate-700 font-medium">Password reset successfully</p>
              <p className="text-xs text-slate-400 text-center">
                The new password for <span className="font-semibold">{user.email}</span> is now active.
              </p>
              <button onClick={onClose} className="mt-1 px-6 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700">Done</button>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500">Setting a new password for <span className="font-semibold text-slate-700">{user.email}</span>.</p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} className={inp + " pr-10"} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" autoFocus />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={onClose} className="flex-1 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={handleReset} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-60">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                  {saving ? "Resetting…" : "Set Password"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Delete modal ───────────────────────────────────────────── */

function DeleteModal({ user, onClose, onDeleted }: { user: PanelUser; onClose: () => void; onDeleted: () => void }) {
  const [busy, setBusy] = useState(false);
  async function handleDelete() {
    setBusy(true);
    try { await api.delete(`/users/${user.user_id}`); onDeleted(); }
    catch { setBusy(false); }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Delete Panel User</h2>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600">This will soft-delete the user. They won&apos;t be able to log in.</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleDelete} disabled={busy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-60">
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */

export default function AllPanelUsersPage() {
  const storedUser = getStoredUser();
  const currentUserId: number = storedUser?.user_id ?? 0;

  const [users, setUsers] = useState<PanelUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [editTarget, setEditTarget] = useState<PanelUser | null>(null);
  const [resetTarget, setResetTarget] = useState<PanelUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PanelUser | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (query) params.set("search", query);
    if (roleFilter) params.set("role", roleFilter);
    api
      .get<{ data: { users: PanelUser[]; total: number } }>(`/users?${params}`)
      .then((res) => {
        const panel = (res?.data?.users ?? []).filter(
          (u) => (u.role as string) !== "CLIENT"
        );
        setUsers(panel);
        setTotal(panel.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, roleFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          All Panel Users
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">View and manage all admin panel accounts.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <form onSubmit={(e) => { e.preventDefault(); setQuery(search); }} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email…"
              className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
            Search
          </button>
        </form>
        <p className="text-sm text-slate-400 ml-1">{total} user{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400">
          <Users className="w-10 h-10 text-slate-200" />
          <p className="text-sm">No panel users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <UserCard
              key={u.user_id}
              user={u}
              currentUserId={currentUserId}
              onEdit={() => setEditTarget(u)}
              onResetPw={() => setResetTarget(u)}
              onDelete={() => setDeleteTarget(u)}
            />
          ))}
        </div>
      )}

      {editTarget && (
        <EditDrawer user={editTarget} onClose={() => setEditTarget(null)} onSaved={() => { setEditTarget(null); load(); }} />
      )}
      {resetTarget && (
        <ResetPasswordModal user={resetTarget} onClose={() => setResetTarget(null)} />
      )}
      {deleteTarget && (
        <DeleteModal user={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={() => { setDeleteTarget(null); load(); }} />
      )}
    </div>
  );
}
