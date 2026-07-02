"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import { ArrowLeft, Loader2, User, Pencil, Plus } from "lucide-react";

interface Client {
  client_id: number; client_code: string;
  title?: string; first_name: string; middle_name?: string; last_name: string;
  gender: string; date_of_birth?: string;
  mobile: string; alternate_mobile?: string; email: string; country_code: string;
  status: string; dsa?: string; reference_by?: string;
  sales_consultant?: string; take_over_manager?: string;
  marriage_anniversary?: string; spouse_name?: string;
  remarks?: string; created_at: string;
}

interface Pkg { package_id: number; name: string; category: string; validity_years: number; base_price: number }
interface Membership {
  membership_id: number; membership_number: string; status: string;
  outstanding_balance: number; net_price: number; end_date: string;
  package?: { name: string; category: string };
}
interface Payment {
  payment_id: number; payment_number: string; payment_type: string;
  amount: number; payment_date: string; payment_mode: string; status: string;
}

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const sel = `${inp} bg-white`;

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return <div className="flex gap-2 py-1"><span className="text-slate-400 text-xs w-40 shrink-0">{label}</span><span className="text-slate-700 text-sm">{value}</span></div>;
}

const CAT_BADGE: Record<string, string> = {
  SILVER: "bg-slate-100 text-slate-600", GOLD: "bg-amber-50 text-amber-700", PLATINUM: "bg-violet-50 text-violet-700",
};
const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700", SUSPENDED: "bg-amber-50 text-amber-700",
  CANCELLED: "bg-red-50 text-red-600", EXPIRED: "bg-slate-100 text-slate-500",
  PAID: "bg-emerald-50 text-emerald-700", PENDING: "bg-amber-50 text-amber-700",
};

function Badge({ value, map }: { value: string; map: Record<string, string> }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[value] ?? "bg-slate-100 text-slate-500"}`}>{value}</span>;
}

const EMPTY_MEM = {
  package_id: "", sale_date: "", start_date: "", total_price: "",
  discount_amount: "0", payment_mode: "CASH", down_payment: "0",
  dsa: "", reference_by: "", remarks: "",
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient]         = useState<Client | null>(null);
  const [packages, setPackages]     = useState<Pkg[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [payments, setPayments]     = useState<Payment[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<"memberships" | "payments">("memberships");

  // Edit client modal
  const [showEdit, setShowEdit]     = useState(false);
  const [editForm, setEditForm]     = useState<Record<string, string>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editErr, setEditErr]       = useState("");

  // New membership modal
  const [showMem, setShowMem]       = useState(false);
  const [memForm, setMemForm]       = useState({ ...EMPTY_MEM });
  const [memSaving, setMemSaving]   = useState(false);
  const [memErr, setMemErr]         = useState("");

  function loadData() {
    Promise.all([
      api.get<{ data: Client }>(`/clients/${id}`),
      api.get<{ data: Membership[] }>(`/clients/${id}/memberships`),
      api.get<{ data: { payments: Payment[] } }>(`/clients/${id}/payments`),
      api.get<{ data: { packages: Pkg[] } }>("/packages?limit=100&status=ACTIVE"),
    ]).then(([c, m, p, pkgs]) => {
      setClient(c?.data ?? null);
      setMemberships(m?.data ?? []);
      setPayments(p?.data?.payments ?? []);
      setPackages(pkgs?.data?.packages ?? []);
      setLoading(false);
    });
  }

  useEffect(() => { loadData(); }, [id]);

  function openEdit() {
    if (!client) return;
    setEditForm({
      title: client.title ?? "", first_name: client.first_name, middle_name: client.middle_name ?? "",
      last_name: client.last_name, gender: client.gender, mobile: client.mobile,
      alternate_mobile: client.alternate_mobile ?? "", email: client.email,
      country_code: client.country_code, sales_consultant: client.sales_consultant ?? "",
      take_over_manager: client.take_over_manager ?? "", dsa: client.dsa ?? "",
      reference_by: client.reference_by ?? "", spouse_name: client.spouse_name ?? "",
      marriage_anniversary: client.marriage_anniversary ? client.marriage_anniversary.slice(0, 10) : "",
      date_of_birth: client.date_of_birth ? client.date_of_birth.slice(0, 10) : "",
      remarks: client.remarks ?? "", status: client.status,
    });
    setEditErr(""); setShowEdit(true);
  }

  async function saveEdit() {
    setEditSaving(true); setEditErr("");
    const payload: Record<string, string> = {};
    Object.entries(editForm).forEach(([k, v]) => { if (v !== undefined) payload[k] = v; });
    const res = await api.put<{ success: boolean; message?: string }>(`/clients/${id}`, payload);
    setEditSaving(false);
    if (res?.success) { setShowEdit(false); loadData(); }
    else setEditErr(res?.message ?? "Failed to update.");
  }

  async function saveMembership() {
    if (!memForm.package_id || !memForm.sale_date || !memForm.start_date || !memForm.total_price || !memForm.payment_mode) {
      setMemErr("Package, dates, total price and payment mode are required."); return;
    }
    setMemSaving(true); setMemErr("");
    const payload: Record<string, string | number> = {
      client_id: Number(id),
      package_id: Number(memForm.package_id),
      sale_date: memForm.sale_date,
      start_date: memForm.start_date,
      total_price: Number(memForm.total_price),
      discount_amount: Number(memForm.discount_amount || 0),
      payment_mode: memForm.payment_mode,
      down_payment: Number(memForm.down_payment || 0),
    };
    if (memForm.dsa) payload.dsa = memForm.dsa;
    if (memForm.reference_by) payload.reference_by = memForm.reference_by;
    if (memForm.remarks) payload.remarks = memForm.remarks;
    const res = await api.post<{ success: boolean; message?: string }>("/memberships", payload);
    setMemSaving(false);
    if (res?.success) { setShowMem(false); setMemForm({ ...EMPTY_MEM }); loadData(); }
    else setMemErr(res?.message ?? "Failed to create membership.");
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  if (!client) return <p className="text-slate-500">Client not found.</p>;

  return (
    <div className="space-y-5 max-w-5xl">
      <Link href="/admin/clients" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </Link>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900 font-bold text-lg">{client.title} {client.first_name} {client.middle_name} {client.last_name}</h2>
              <p className="text-slate-400 text-sm font-mono">{client.client_code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${client.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{client.status}</span>
            <button onClick={openEdit} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
              <Pencil className="w-3 h-3" /> Edit
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0">
          <Row label="Email"             value={client.email} />
          <Row label="Mobile"            value={`${client.country_code} ${client.mobile}`} />
          <Row label="Alternate Mobile"  value={client.alternate_mobile} />
          <Row label="Gender"            value={client.gender} />
          <Row label="Date of Birth"     value={client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString() : null} />
          <Row label="Spouse"            value={client.spouse_name} />
          <Row label="Anniversary"       value={client.marriage_anniversary ? new Date(client.marriage_anniversary).toLocaleDateString() : null} />
          <Row label="DSA"               value={client.dsa} />
          <Row label="Reference By"      value={client.reference_by} />
          <Row label="Sales Consultant"  value={client.sales_consultant} />
          <Row label="Take-Over Manager" value={client.take_over_manager} />
          <Row label="Remarks"           value={client.remarks} />
          <Row label="Member Since"      value={new Date(client.created_at).toLocaleDateString()} />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-1">
          <div className="flex">
            {(["memberships", "payments"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium capitalize transition-colors ${tab === t ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}>
                {t} ({t === "memberships" ? memberships.length : payments.length})
              </button>
            ))}
          </div>
          {tab === "memberships" && (
            <button onClick={() => { setMemForm({ ...EMPTY_MEM }); setMemErr(""); setShowMem(true); }}
              className="flex items-center gap-1 mr-3 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-3 h-3" /> New Membership
            </button>
          )}
        </div>

        {tab === "memberships" && (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Card No.", "Package", "Category", "Status", "Outstanding", "Expires", ""].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {memberships.length === 0 && <tr><td colSpan={7} className="text-center text-slate-400 py-8">No memberships</td></tr>}
              {memberships.map(m => (
                <tr key={m.membership_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{m.membership_number}</td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{m.package?.name}</td>
                  <td className="px-4 py-3"><Badge value={m.package?.category ?? ""} map={CAT_BADGE} /></td>
                  <td className="px-4 py-3"><Badge value={m.status} map={STATUS_BADGE} /></td>
                  <td className="px-4 py-3 font-semibold text-slate-800">₹{Number(m.outstanding_balance).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(m.end_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/memberships/${m.membership_id}`} className="text-blue-600 text-xs hover:underline">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "payments" && (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Pay No.", "Type", "Amount", "Date", "Mode", "Status"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.length === 0 && <tr><td colSpan={6} className="text-center text-slate-400 py-8">No payments</td></tr>}
              {payments.map(p => (
                <tr key={p.payment_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.payment_number}</td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{p.payment_type}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">₹{Number(p.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{new Date(p.payment_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{p.payment_mode}</td>
                  <td className="px-4 py-3"><Badge value={p.status} map={STATUS_BADGE} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Client Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Client" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Title</label><input className={inp} value={editForm.title ?? ""} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Mr / Mrs / Ms" /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Gender</label>
            <select className={sel} value={editForm.gender ?? "MALE"} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))}>
              <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
            </select>
          </div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">First Name</label><input className={inp} value={editForm.first_name ?? ""} onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Middle Name</label><input className={inp} value={editForm.middle_name ?? ""} onChange={e => setEditForm(f => ({ ...f, middle_name: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label><input className={inp} value={editForm.last_name ?? ""} onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
            <select className={sel} value={editForm.status ?? "ACTIVE"} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
              <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Country Code</label><input className={inp} value={editForm.country_code ?? ""} onChange={e => setEditForm(f => ({ ...f, country_code: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Mobile</label><input className={inp} value={editForm.mobile ?? ""} onChange={e => setEditForm(f => ({ ...f, mobile: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Alternate Mobile</label><input className={inp} value={editForm.alternate_mobile ?? ""} onChange={e => setEditForm(f => ({ ...f, alternate_mobile: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Email</label><input type="email" className={inp} value={editForm.email ?? ""} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Sales Consultant</label><input className={inp} value={editForm.sales_consultant ?? ""} onChange={e => setEditForm(f => ({ ...f, sales_consultant: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Take Over Manager</label><input className={inp} value={editForm.take_over_manager ?? ""} onChange={e => setEditForm(f => ({ ...f, take_over_manager: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">DSA</label>
            <select className={sel} value={editForm.dsa ?? ""} onChange={e => setEditForm(f => ({ ...f, dsa: e.target.value }))}>
              <option value="">None</option><option value="VENUE">Venue</option><option value="CSDO">CSDO</option><option value="OTHER">Other</option>
            </select>
          </div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Reference By</label><input className={inp} value={editForm.reference_by ?? ""} onChange={e => setEditForm(f => ({ ...f, reference_by: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Spouse Name</label><input className={inp} value={editForm.spouse_name ?? ""} onChange={e => setEditForm(f => ({ ...f, spouse_name: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Anniversary</label><input type="date" className={inp} value={editForm.marriage_anniversary ?? ""} onChange={e => setEditForm(f => ({ ...f, marriage_anniversary: e.target.value }))} /></div>
          <div className="col-span-2"><label className="block text-xs font-medium text-slate-600 mb-1">Remarks</label><textarea rows={2} className={inp} value={editForm.remarks ?? ""} onChange={e => setEditForm(f => ({ ...f, remarks: e.target.value }))} /></div>
        </div>
        {editErr && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{editErr}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={saveEdit} disabled={editSaving} className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
            {editSaving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
          </button>
        </div>
      </Modal>

      {/* New Membership Modal */}
      <Modal open={showMem} onClose={() => setShowMem(false)} title="New Membership" size="md">
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Package <span className="text-red-500">*</span></label>
            <select className={sel} value={memForm.package_id} onChange={e => setMemForm(f => ({ ...f, package_id: e.target.value }))}>
              <option value="">Select package…</option>
              {packages.map(p => <option key={p.package_id} value={p.package_id}>{p.name} ({p.category}) — ₹{Number(p.base_price).toLocaleString()}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Sale Date <span className="text-red-500">*</span></label><input type="date" className={inp} value={memForm.sale_date} onChange={e => setMemForm(f => ({ ...f, sale_date: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Start Date <span className="text-red-500">*</span></label><input type="date" className={inp} value={memForm.start_date} onChange={e => setMemForm(f => ({ ...f, start_date: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Total Price (₹) <span className="text-red-500">*</span></label><input type="number" className={inp} value={memForm.total_price} onChange={e => setMemForm(f => ({ ...f, total_price: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Discount (₹)</label><input type="number" className={inp} value={memForm.discount_amount} onChange={e => setMemForm(f => ({ ...f, discount_amount: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Down Payment (₹)</label><input type="number" className={inp} value={memForm.down_payment} onChange={e => setMemForm(f => ({ ...f, down_payment: e.target.value }))} /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Payment Mode <span className="text-red-500">*</span></label>
              <select className={sel} value={memForm.payment_mode} onChange={e => setMemForm(f => ({ ...f, payment_mode: e.target.value }))}>
                {["CASH","CHEQUE","ONLINE","BANK_TRANSFER","CARD"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">DSA</label>
              <select className={sel} value={memForm.dsa} onChange={e => setMemForm(f => ({ ...f, dsa: e.target.value }))}>
                <option value="">None</option><option value="VENUE">Venue</option><option value="CSDO">CSDO</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Reference By</label><input className={inp} value={memForm.reference_by} onChange={e => setMemForm(f => ({ ...f, reference_by: e.target.value }))} /></div>
          </div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Remarks</label><textarea rows={2} className={inp} value={memForm.remarks} onChange={e => setMemForm(f => ({ ...f, remarks: e.target.value }))} /></div>
          {memForm.total_price && (
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 space-y-0.5">
              <p>Net Price: ₹{(Number(memForm.total_price) - Number(memForm.discount_amount || 0)).toLocaleString()}</p>
              <p>Outstanding after down payment: ₹{(Number(memForm.total_price) - Number(memForm.discount_amount || 0) - Number(memForm.down_payment || 0)).toLocaleString()}</p>
            </div>
          )}
        </div>
        {memErr && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{memErr}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowMem(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={saveMembership} disabled={memSaving} className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
            {memSaving && <Loader2 className="w-4 h-4 animate-spin" />} Create Membership
          </button>
        </div>
      </Modal>
    </div>
  );
}
