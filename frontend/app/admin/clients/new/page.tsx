"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Loader2, User, CreditCard, FileText, IndianRupee, Tag, Plus, X } from "lucide-react";

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
const sel = inp;

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
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
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const [personal, setPersonal] = useState({
    first_name: "", middle_name: "", last_name: "",
    gender: "MALE", date_of_birth: "", spouse_name: "",
    mobile: "", alternate_mobile: "", country_code: "+91",
    email: "", marriage_anniversary: "",
  });

  const [addr, setAddr] = useState({
    primary_address: "", primary_state: "", primary_pincode: "",
    secondary_address: "", secondary_state: "", secondary_pincode: "",
  });
  const [sameAddress, setSameAddress] = useState(false);

  const [mem, setMem] = useState({
    package_name: "", validity_years: "1", nights_per_year: "0",
    sale_date: today,
    total_price: "", discount_amount: "0", down_payment: "0", amc: "",
    payment_mode: "CASH",
    sales_consultant: "", take_over_manager: "",
    dsa: "", reference_by: "", remarks: "",
  });

  const [pay, setPay] = useState({ transaction_ref: "", bank_name: "" });

  const [offers, setOffers] = useState<{ offer_name: string; valid_until: string }[]>([
    { offer_name: "", valid_until: "" },
  ]);

  function addOffer() { setOffers(o => [...o, { offer_name: "", valid_until: "" }]); }
  function removeOffer(i: number) { setOffers(o => o.filter((_, idx) => idx !== i)); }
  function setOffer(i: number, k: "offer_name" | "valid_until", v: string) {
    setOffers(o => o.map((row, idx) => idx === i ? { ...row, [k]: v } : row));
  }

  function setP(k: string, v: string) { setPersonal(f => ({ ...f, [k]: v })); }
  function setA(k: string, v: string) { setAddr(f => ({ ...f, [k]: v })); }
  function setM(k: string, v: string) { setMem(f => ({ ...f, [k]: v })); }

  function onSameAddress(checked: boolean) {
    setSameAddress(checked);
    if (checked) {
      setAddr(f => ({
        ...f,
        secondary_address: f.primary_address,
        secondary_state:   f.primary_state,
        secondary_pincode: f.primary_pincode,
      }));
    }
  }

  const netPrice    = Math.max(0, Number(mem.total_price || 0) - Number(mem.discount_amount || 0));
  const outstanding = Math.max(0, netPrice - Number(mem.down_payment || 0));
  const hasDownPayment = Number(mem.down_payment) > 0;

  async function handleSubmit() {
    if (!personal.first_name || !personal.last_name || !personal.mobile || !personal.email || !personal.gender) {
      setError("First name, last name, mobile, email and gender are required."); return;
    }
    if (!mem.package_name || !mem.sale_date || !mem.total_price) {
      setError("Package name, sale date and total price are required."); return;
    }

    setSaving(true); setError("");
    try {
      const clientPayload: Record<string, string> = {};
      Object.entries(personal).forEach(([k, v]) => { if (v) clientPayload[k] = v; });

      const hasAddress = addr.primary_address || addr.primary_state || addr.primary_pincode;
      const addrPayload = hasAddress ? { ...addr } : undefined;

      const memPayload = {
        package_name:      mem.package_name,
        validity_years:    Number(mem.validity_years || 1),
        nights_per_year:   Number(mem.nights_per_year || 0),
        sale_date:         mem.sale_date,
        total_price:       Number(mem.total_price),
        discount_amount:   Number(mem.discount_amount || 0),
        down_payment:      Number(mem.down_payment || 0),
        amc:               mem.amc ? Number(mem.amc) : null,
        payment_mode:      mem.payment_mode,
        transaction_ref:   pay.transaction_ref || null,
        bank_name:         pay.bank_name || null,
        sales_consultant:  mem.sales_consultant || null,
        take_over_manager: mem.take_over_manager || null,
        dsa:               mem.dsa || null,
        reference_by:      mem.reference_by || null,
        remarks:           mem.remarks || null,
      };

      const offersPayload = offers
        .filter(o => o.offer_name.trim())
        .map(o => ({ offer_name: o.offer_name.trim(), valid_until: o.valid_until || null }));

      const res = await api.post<{ success: boolean; data?: { client_id: number }; message?: string }>(
        "/clients/onboard",
        { client: clientPayload, address: addrPayload, membership: memPayload, offers: offersPayload },
      );

      if (!res?.success) throw new Error(res?.message ?? "Onboarding failed.");
      router.push(`/admin/clients/${res.data?.client_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Nothing was saved.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">New Client Onboarding</h1>
          <p className="text-sm text-slate-500 mt-0.5">All data is saved atomically — nothing is stored unless everything succeeds</p>
        </div>
      </div>

      {/* ── Section 1: Personal Details ─────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader icon={User} title="Personal Details" subtitle="Client's contact and identity information" />
        <div className="grid grid-cols-3 gap-4">
          <Field label="First Name" required>
            <input className={inp} value={personal.first_name} onChange={e => setP("first_name", e.target.value)} placeholder="First name" />
          </Field>
          <Field label="Middle Name">
            <input className={inp} value={personal.middle_name} onChange={e => setP("middle_name", e.target.value)} placeholder="Middle name" />
          </Field>
          <Field label="Last Name" required>
            <input className={inp} value={personal.last_name} onChange={e => setP("last_name", e.target.value)} placeholder="Last name" />
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
          <Field label="Spouse Name">
            <input className={inp} value={personal.spouse_name} onChange={e => setP("spouse_name", e.target.value)} placeholder="Spouse name" />
          </Field>

          <Field label="Country Code">
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
          <Field label="Marriage Anniversary">
            <input type="date" className={inp} value={personal.marriage_anniversary} onChange={e => setP("marriage_anniversary", e.target.value)} />
          </Field>
        </div>

        {/* Address */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Address</p>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Primary Address">
              <input className={inp} value={addr.primary_address} onChange={e => setA("primary_address", e.target.value)} placeholder="Street / flat / building" />
            </Field>
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
              <Field label="Secondary Address">
                <input className={inp} value={addr.secondary_address} onChange={e => setA("secondary_address", e.target.value)} placeholder="Street / flat / building" />
              </Field>
              <Field label="State">
                <input className={inp} value={addr.secondary_state} onChange={e => setA("secondary_state", e.target.value)} placeholder="State" />
              </Field>
              <Field label="Pin Code">
                <input className={inp} value={addr.secondary_pincode} onChange={e => setA("secondary_pincode", e.target.value)} placeholder="Pin code" />
              </Field>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 2: Membership Details ──────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader icon={CreditCard} title="Membership Details" subtitle="Package, pricing and sales information" />

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Field label="Package Name" required>
              <input className={inp} value={mem.package_name} onChange={e => setM("package_name", e.target.value)} placeholder="e.g. Gold Package, Silver 3 Year…" />
            </Field>
          </div>
          <Field label="Validity (Years)">
            <input type="number" min="1" className={inp} value={mem.validity_years} onChange={e => setM("validity_years", e.target.value)} />
          </Field>

          <Field label="Nights Per Year">
            <input type="number" min="0" className={inp} value={mem.nights_per_year} onChange={e => setM("nights_per_year", e.target.value)} />
          </Field>
          <Field label="Sale / Joining Date" required>
            <input type="date" className={inp} value={mem.sale_date} onChange={e => setM("sale_date", e.target.value)} />
          </Field>
          <div /> {/* spacer to keep grid alignment */}

          <Field label="Total Price (₹)" required>
            <input type="number" min="0" className={inp} value={mem.total_price} onChange={e => setM("total_price", e.target.value)} />
          </Field>
          <Field label="Discount (₹)">
            <input type="number" min="0" className={inp} value={mem.discount_amount} onChange={e => setM("discount_amount", e.target.value)} />
          </Field>
          <Field label="Down Payment (₹)">
            <input type="number" min="0" className={inp} value={mem.down_payment} onChange={e => setM("down_payment", e.target.value)} />
          </Field>

          <Field label="AMC / Annual Maintenance Charge (₹)">
            <input type="number" min="0" className={inp} value={mem.amc} onChange={e => setM("amc", e.target.value)} placeholder="0" />
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
        </div>

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

        {/* Sales / Other Details — after membership pricing */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Sales Details</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sales Consultant">
              <input className={inp} value={mem.sales_consultant} onChange={e => setM("sales_consultant", e.target.value)} placeholder="Consultant name" />
            </Field>
            <Field label="Take Over Manager">
              <input className={inp} value={mem.take_over_manager} onChange={e => setM("take_over_manager", e.target.value)} placeholder="Manager name" />
            </Field>
            <div className="col-span-2">
              <Field label="Remarks">
                <textarea rows={2} className={inp} value={mem.remarks} onChange={e => setM("remarks", e.target.value)} placeholder="Membership notes…" />
              </Field>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Offers ─────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader icon={Tag} title="Offers" subtitle="Add one or more offers for this client (optional)" />

        <div className="space-y-2">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_180px_36px] gap-3 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Offer Name</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Valid Until</span>
            <span />
          </div>

          {offers.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_180px_36px] gap-3 items-center">
              <input
                className={inp}
                value={row.offer_name}
                onChange={e => setOffer(i, "offer_name", e.target.value)}
                placeholder="e.g. Free Room Upgrade, Complimentary Breakfast…"
              />
              <input
                type="date"
                className={inp}
                value={row.valid_until}
                onChange={e => setOffer(i, "valid_until", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeOffer(i)}
                disabled={offers.length === 1}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOffer}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add one more offer
        </button>
      </div>

      {/* ── Section 4: Payment Details (only when down payment > 0) */}
      {hasDownPayment && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader icon={IndianRupee} title="Payment Details" subtitle="Additional details for the down payment record" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Transaction Ref / Cheque No.">
              <input className={inp} value={pay.transaction_ref} onChange={e => setPay(f => ({ ...f, transaction_ref: e.target.value }))} placeholder="Ref / cheque number" />
            </Field>
            <Field label="Bank Name">
              <input className={inp} value={pay.bank_name} onChange={e => setPay(f => ({ ...f, bank_name: e.target.value }))} placeholder="Bank name" />
            </Field>
          </div>
        </div>
      )}

      {/* ── Summary ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader icon={FileText} title="Summary" subtitle="Review before activating membership" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Client</span>
            <span className="font-medium text-slate-800">
              {[personal.first_name, personal.last_name].filter(Boolean).join(" ") || "—"}
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
            <span className="font-medium text-slate-800">{mem.package_name || "—"}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Validity</span>
            <span className="font-medium text-slate-800">{mem.validity_years || 1} yr · {mem.nights_per_year || 0} nights/yr</span>
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
            <span className="text-slate-500">Outstanding</span>
            <span className="font-semibold text-red-600">₹{outstanding.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

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
