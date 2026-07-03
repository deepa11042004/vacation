"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Loader2, User, CreditCard, FileText, IndianRupee } from "lucide-react";

interface Pkg {
  package_id: number; name: string; category: string;
  validity_years: number; nights_per_year: number; base_price: number; amc_amount: number;
}

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
const sel = inp;

function Field({ label, required, half, children }: { label: string; required?: boolean; half?: boolean; children: React.ReactNode }) {
  return (
    <div className={half ? "col-span-1" : ""}>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-6 pb-4 border-b border-slate-200">
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-blue-600" size={18} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

const today = new Date().toISOString().slice(0, 10);

export default function NewClientPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Personal Details ──────────────────────────────────────────
  const [personal, setPersonal] = useState({
    title: "", first_name: "", middle_name: "", last_name: "",
    gender: "MALE", date_of_birth: "", mobile: "", alternate_mobile: "",
    email: "", country_code: "+91", spouse_name: "", marriage_anniversary: "",
    sales_consultant: "", take_over_manager: "", dsa: "", reference_by: "", remarks: "",
  });

  // ── Address ───────────────────────────────────────────────────
  const [addr, setAddr] = useState({
    primary_address: "", primary_state: "", primary_pincode: "",
    secondary_address: "", secondary_state: "", secondary_pincode: "",
  });
  const [sameAddress, setSameAddress] = useState(false);

  // ── Membership ────────────────────────────────────────────────
  const [mem, setMem] = useState({
    package_id: "", sale_date: today, start_date: today,
    total_price: "", discount_amount: "0", down_payment: "0",
    payment_mode: "CASH", dsa: "", reference_by: "", remarks: "",
  });
  const [selectedPkg, setSelectedPkg] = useState<Pkg | null>(null);

  // ── Payment ───────────────────────────────────────────────────
  const [pay, setPay] = useState({
    payment_date: today, payment_type: "DOWN_PAYMENT",
    payment_mode: "CASH", amount: "", transaction_ref: "", bank_name: "",
  });
  const [createPayment, setCreatePayment] = useState(false);

  useEffect(() => {
    api.get<{ data: { packages: Pkg[] } }>("/packages?limit=100&status=ACTIVE")
      .then(res => setPackages(res?.data?.packages ?? []));
  }, []);

  function setP(k: string, v: string) { setPersonal(f => ({ ...f, [k]: v })); }
  function setA(k: string, v: string) { setAddr(f => ({ ...f, [k]: v })); }
  function setM(k: string, v: string) { setMem(f => ({ ...f, [k]: v })); }
  function setPay2(k: string, v: string) { setPay(f => ({ ...f, [k]: v })); }

  function onPackageChange(pid: string) {
    setM("package_id", pid);
    const pkg = packages.find(p => String(p.package_id) === pid) ?? null;
    setSelectedPkg(pkg);
    if (pkg) {
      setM("total_price", String(pkg.base_price));
    }
  }

  function onSameAddress(checked: boolean) {
    setSameAddress(checked);
    if (checked) {
      setAddr(f => ({
        ...f,
        secondary_address: f.primary_address,
        secondary_state: f.primary_state,
        secondary_pincode: f.primary_pincode,
      }));
    }
  }

  const netPrice = Math.max(0, Number(mem.total_price || 0) - Number(mem.discount_amount || 0));
  const outstanding = Math.max(0, netPrice - Number(mem.down_payment || 0));

  useEffect(() => {
    if (Number(mem.down_payment) > 0) {
      setPay(f => ({ ...f, amount: mem.down_payment, payment_mode: mem.payment_mode }));
      setCreatePayment(true);
    } else {
      setCreatePayment(false);
    }
  }, [mem.down_payment, mem.payment_mode]);

  async function handleSubmit() {
    // Basic validation
    if (!personal.first_name || !personal.last_name || !personal.mobile || !personal.email || !personal.gender) {
      setError("First name, last name, mobile, email and gender are required."); return;
    }
    if (!mem.package_id || !mem.sale_date || !mem.start_date || !mem.total_price) {
      setError("Package, sale date, start date and total price are required."); return;
    }

    setSaving(true); setError("");
    try {
      // 1. Create client
      const clientPayload: Record<string, string | undefined> = {};
      Object.entries(personal).forEach(([k, v]) => { if (v) clientPayload[k] = v; });
      const clientRes = await api.post<{ success: boolean; data?: { client_id: number }; message?: string }>("/clients", clientPayload);
      if (!clientRes?.success) throw new Error(clientRes?.message ?? "Failed to create client.");
      const client_id = clientRes.data?.client_id;
      if (!client_id) throw new Error("Client created but ID not returned.");

      // 2. Save address if any field is filled
      const hasAddress = addr.primary_address || addr.primary_state || addr.primary_pincode;
      if (hasAddress) {
        const addrPayload: Record<string, string> = {};
        Object.entries(addr).forEach(([k, v]) => { if (v) addrPayload[k] = v; });
        await api.put(`/clients/${client_id}/address`, addrPayload).catch(() => {/* address is optional */});
      }

      // 3. Create membership
      const memPayload: Record<string, string | number> = {
        client_id,
        package_id: Number(mem.package_id),
        sale_date: mem.sale_date,
        start_date: mem.start_date,
        total_price: Number(mem.total_price),
        discount_amount: Number(mem.discount_amount || 0),
        payment_mode: mem.payment_mode,
        down_payment: Number(mem.down_payment || 0),
      };
      if (mem.dsa) memPayload.dsa = mem.dsa;
      if (mem.reference_by) memPayload.reference_by = mem.reference_by;
      if (mem.remarks) memPayload.remarks = mem.remarks;
      const memRes = await api.post<{ success: boolean; data?: { membership_id: number }; message?: string }>("/memberships", memPayload);
      if (!memRes?.success) throw new Error(memRes?.message ?? "Failed to create membership.");
      const membership_id = memRes.data?.membership_id;

      // 4. Create payment if down payment > 0
      if (createPayment && membership_id && Number(pay.amount) > 0) {
        const payPayload: Record<string, string | number> = {
          membership_id,
          client_id,
          payment_type: pay.payment_type,
          amount: Number(pay.amount),
          payment_date: pay.payment_date,
          payment_mode: pay.payment_mode,
        };
        if (pay.transaction_ref) payPayload.transaction_ref = pay.transaction_ref;
        if (pay.bank_name) payPayload.bank_name = pay.bank_name;
        await api.post("/payments", payPayload).catch(() => {/* payment is optional */});
      }

      router.push(`/admin/clients/${client_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">New Client Onboarding</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create client, membership and first payment in one step</p>
        </div>
      </div>

      {/* ── Section 1: Personal Details ─────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader icon={User} title="Personal Details" subtitle="Client's contact and identity information" />
        <div className="grid grid-cols-3 gap-4">
          <Field label="Title">
            <select className={sel} value={personal.title} onChange={e => setP("title", e.target.value)}>
              <option value="">Select…</option>
              {["Mr.", "Mrs.", "Ms.", "Dr."].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Gender" required>
            <select className={sel} value={personal.gender} onChange={e => setP("gender", e.target.value)}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
          <Field label="Date of Birth">
            <input type="date" className={inp} value={personal.date_of_birth} onChange={e => setP("date_of_birth", e.target.value)} />
          </Field>

          <Field label="First Name" required>
            <input className={inp} value={personal.first_name} onChange={e => setP("first_name", e.target.value)} placeholder="First name" />
          </Field>
          <Field label="Middle Name">
            <input className={inp} value={personal.middle_name} onChange={e => setP("middle_name", e.target.value)} placeholder="Middle name" />
          </Field>
          <Field label="Last Name" required>
            <input className={inp} value={personal.last_name} onChange={e => setP("last_name", e.target.value)} placeholder="Last name" />
          </Field>

          <Field label="Country Code" required>
            <input className={inp} value={personal.country_code} onChange={e => setP("country_code", e.target.value)} placeholder="+91" />
          </Field>
          <Field label="Mobile" required>
            <input className={inp} value={personal.mobile} onChange={e => setP("mobile", e.target.value)} placeholder="Primary mobile" />
          </Field>
          <Field label="Alternate Mobile">
            <input className={inp} value={personal.alternate_mobile} onChange={e => setP("alternate_mobile", e.target.value)} placeholder="Secondary mobile" />
          </Field>

          <div className="col-span-2">
            <Field label="Email" required>
              <input type="email" className={inp} value={personal.email} onChange={e => setP("email", e.target.value)} placeholder="Email address" />
            </Field>
          </div>
          <Field label="Spouse Name">
            <input className={inp} value={personal.spouse_name} onChange={e => setP("spouse_name", e.target.value)} placeholder="Spouse name" />
          </Field>
          <div className="col-span-1">
            <Field label="Marriage Anniversary">
              <input type="date" className={inp} value={personal.marriage_anniversary} onChange={e => setP("marriage_anniversary", e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Address */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Address</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Field label="Primary Address">
                <input className={inp} value={addr.primary_address} onChange={e => setA("primary_address", e.target.value)} placeholder="Street / flat / building" />
              </Field>
            </div>
            <Field label="State">
              <input className={inp} value={addr.primary_state} onChange={e => setA("primary_state", e.target.value)} placeholder="State" />
            </Field>
            <Field label="Pin Code">
              <input className={inp} value={addr.primary_pincode} onChange={e => setA("primary_pincode", e.target.value)} placeholder="Pin code" />
            </Field>
          </div>

          <label className="flex items-center gap-2 mt-3 mb-3 cursor-pointer select-none">
            <input type="checkbox" checked={sameAddress} onChange={e => onSameAddress(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
            <span className="text-sm text-slate-600">Secondary address same as primary</span>
          </label>

          {!sameAddress && (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Field label="Secondary Address">
                  <input className={inp} value={addr.secondary_address} onChange={e => setA("secondary_address", e.target.value)} placeholder="Street / flat / building" />
                </Field>
              </div>
              <Field label="State">
                <input className={inp} value={addr.secondary_state} onChange={e => setA("secondary_state", e.target.value)} placeholder="State" />
              </Field>
              <Field label="Pin Code">
                <input className={inp} value={addr.secondary_pincode} onChange={e => setA("secondary_pincode", e.target.value)} placeholder="Pin code" />
              </Field>
            </div>
          )}
        </div>

        {/* Other Details */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Other Details</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sales Consultant">
              <input className={inp} value={personal.sales_consultant} onChange={e => setP("sales_consultant", e.target.value)} placeholder="Consultant name" />
            </Field>
            <Field label="Take Over Manager">
              <input className={inp} value={personal.take_over_manager} onChange={e => setP("take_over_manager", e.target.value)} placeholder="Manager name" />
            </Field>
            <Field label="DSA">
              <select className={sel} value={personal.dsa} onChange={e => setP("dsa", e.target.value)}>
                <option value="">None</option>
                <option value="VENUE">Venue</option>
                <option value="CSDO">CSDO</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>
            <Field label="Reference By">
              <input className={inp} value={personal.reference_by} onChange={e => setP("reference_by", e.target.value)} placeholder="Referred by" />
            </Field>
            <div className="col-span-2">
              <Field label="Remarks">
                <textarea rows={2} className={inp} value={personal.remarks} onChange={e => setP("remarks", e.target.value)} placeholder="Any notes…" />
              </Field>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Membership Details ──────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader icon={CreditCard} title="Membership Details" subtitle="Package selection and pricing" />

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Package" required>
              <select className={sel} value={mem.package_id} onChange={e => onPackageChange(e.target.value)}>
                <option value="">Select a package…</option>
                {packages.map(p => (
                  <option key={p.package_id} value={p.package_id}>
                    {p.name} — {p.category} · {p.validity_years}yr · {p.nights_per_year} nights/yr · ₹{Number(p.base_price).toLocaleString()}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {selectedPkg && (
            <div className="col-span-2 grid grid-cols-4 gap-3 bg-slate-50 rounded-lg p-3 text-sm">
              <div><p className="text-xs text-slate-500">Category</p><p className="font-semibold text-slate-700">{selectedPkg.category}</p></div>
              <div><p className="text-xs text-slate-500">Validity</p><p className="font-semibold text-slate-700">{selectedPkg.validity_years} years</p></div>
              <div><p className="text-xs text-slate-500">Nights/Year</p><p className="font-semibold text-slate-700">{selectedPkg.nights_per_year}</p></div>
              <div><p className="text-xs text-slate-500">AMC</p><p className="font-semibold text-slate-700">₹{Number(selectedPkg.amc_amount).toLocaleString()}</p></div>
            </div>
          )}

          <Field label="Sale Date (Joining Date)" required>
            <input type="date" className={inp} value={mem.sale_date} onChange={e => setM("sale_date", e.target.value)} />
          </Field>
          <Field label="Start Date" required>
            <input type="date" className={inp} value={mem.start_date} onChange={e => setM("start_date", e.target.value)} />
          </Field>

          <Field label="Total Price (₹)" required>
            <input type="number" min="0" className={inp} value={mem.total_price} onChange={e => setM("total_price", e.target.value)} placeholder="0" />
          </Field>
          <Field label="Discount (₹)">
            <input type="number" min="0" className={inp} value={mem.discount_amount} onChange={e => setM("discount_amount", e.target.value)} placeholder="0" />
          </Field>
          <Field label="Down Payment (₹)">
            <input type="number" min="0" className={inp} value={mem.down_payment} onChange={e => setM("down_payment", e.target.value)} placeholder="0" />
          </Field>
          <Field label="Payment Mode" required>
            <select className={sel} value={mem.payment_mode} onChange={e => setM("payment_mode", e.target.value)}>
              {["CASH","CHEQUE","ONLINE","BANK_TRANSFER","CARD"].map(m => (
                <option key={m} value={m}>{m.replace("_", " ")}</option>
              ))}
            </select>
          </Field>
          <Field label="DSA">
            <select className={sel} value={mem.dsa} onChange={e => setM("dsa", e.target.value)}>
              <option value="">None</option>
              <option value="VENUE">Venue</option>
              <option value="CSDO">CSDO</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
          <Field label="Reference By">
            <input className={inp} value={mem.reference_by} onChange={e => setM("reference_by", e.target.value)} placeholder="Referred by" />
          </Field>
          <div className="col-span-2">
            <Field label="Remarks">
              <textarea rows={2} className={inp} value={mem.remarks} onChange={e => setM("remarks", e.target.value)} placeholder="Membership notes…" />
            </Field>
          </div>
        </div>

        {/* Price summary */}
        {mem.total_price && (
          <div className="mt-4 flex gap-4 bg-blue-50 rounded-xl p-4">
            <div className="flex-1 text-center border-r border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Total Price</p>
              <p className="text-lg font-bold text-blue-800 mt-0.5">₹{Number(mem.total_price).toLocaleString()}</p>
            </div>
            <div className="flex-1 text-center border-r border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Net Price</p>
              <p className="text-lg font-bold text-blue-800 mt-0.5">₹{netPrice.toLocaleString()}</p>
            </div>
            <div className="flex-1 text-center border-r border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Down Payment</p>
              <p className="text-lg font-bold text-blue-800 mt-0.5">₹{Number(mem.down_payment || 0).toLocaleString()}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs text-blue-600 font-medium">Outstanding</p>
              <p className="text-lg font-bold text-blue-800 mt-0.5">₹{outstanding.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 3: First Payment ────────────────────────────── */}
      {createPayment && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader icon={IndianRupee} title="First Payment Record" subtitle="Log the down payment transaction" />
          <div className="grid grid-cols-3 gap-4">
            <Field label="Payment Date" required>
              <input type="date" className={inp} value={pay.payment_date} onChange={e => setPay2("payment_date", e.target.value)} />
            </Field>
            <Field label="Payment Type">
              <select className={sel} value={pay.payment_type} onChange={e => setPay2("payment_type", e.target.value)}>
                {["DOWN_PAYMENT","INSTALMENT","AMC","PENALTY","REFUND"].map(t => (
                  <option key={t} value={t}>{t.replace("_", " ")}</option>
                ))}
              </select>
            </Field>
            <Field label="Payment Mode">
              <select className={sel} value={pay.payment_mode} onChange={e => setPay2("payment_mode", e.target.value)}>
                {["CASH","CHEQUE","ONLINE","BANK_TRANSFER","CARD"].map(m => (
                  <option key={m} value={m}>{m.replace("_", " ")}</option>
                ))}
              </select>
            </Field>
            <Field label="Amount (₹)" required>
              <input type="number" min="0" className={inp} value={pay.amount} onChange={e => setPay2("amount", e.target.value)} placeholder="0" />
            </Field>
            <Field label="Transaction Ref / Cheque No.">
              <input className={inp} value={pay.transaction_ref} onChange={e => setPay2("transaction_ref", e.target.value)} placeholder="Ref / cheque number" />
            </Field>
            <Field label="Bank Name">
              <input className={inp} value={pay.bank_name} onChange={e => setPay2("bank_name", e.target.value)} placeholder="Bank name" />
            </Field>
          </div>
        </div>
      )}

      {/* ── Summary / Invoice Preview ──────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader icon={FileText} title="Summary" subtitle="Review before activating membership" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Client</span>
            <span className="font-medium text-slate-800">
              {[personal.title, personal.first_name, personal.last_name].filter(Boolean).join(" ") || "—"}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Mobile</span>
            <span className="font-medium text-slate-800">{personal.country_code} {personal.mobile || "—"}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Email</span>
            <span className="font-medium text-slate-800">{personal.email || "—"}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Package</span>
            <span className="font-medium text-slate-800">{selectedPkg?.name ?? "—"}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Sale Date</span>
            <span className="font-medium text-slate-800">{mem.sale_date || "—"}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Net Price</span>
            <span className="font-semibold text-slate-800">₹{netPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Down Payment</span>
            <span className="font-medium text-slate-800">₹{Number(mem.down_payment || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Outstanding</span>
            <span className="font-semibold text-red-600">₹{outstanding.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pb-8">
        <button onClick={() => router.back()} className="px-5 py-2.5 text-sm text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 font-medium">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={saving}
          className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 shadow-sm shadow-blue-200">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {saving ? "Creating…" : "Activate Membership & Create Client"}
        </button>
      </div>
    </div>
  );
}
