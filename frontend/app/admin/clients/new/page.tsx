"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { z } from "zod";
import { ArrowLeft, Loader2, User, CreditCard, FileText, Tag, Plus, X, Zap, Mail } from "lucide-react";

const inp = (err?: string) => `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${err ? "border-red-500 bg-red-50 text-red-900" : "border-slate-300 bg-white"}`;
const sel = inp;

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] font-semibold text-red-500">{error}</p>}
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

const dateRegex = /^(19|20)\d{2}-\d{2}-\d{2}$/;
const pincodeRegex = /^\d{6}$/;

const FormSchema = z.object({
  personal: z.object({
    first_name:           z.string().min(2, "Min 2 characters").max(50, "Too long").regex(/^[A-Za-z\s]+$/, "Only letters allowed"),
    middle_name:          z.string().max(50, "Too long").regex(/^[A-Za-z\s]*$/, "Only letters allowed").optional().or(z.literal("")),
    last_name:            z.string().min(1, "Last name is required").max(50, "Too long").regex(/^[A-Za-z\s]+$/, "Only letters allowed"),
    gender:               z.enum(["MALE", "FEMALE", "OTHER"]),
    date_of_birth:        z.string().regex(dateRegex, "Invalid date").optional().or(z.literal("")),
    spouse_name:          z.string().max(100, "Too long").regex(/^[A-Za-z\s]*$/, "Only letters allowed").optional().or(z.literal("")),
    country_code:         z.string().min(1, "Country code is required").max(10, "Too long"),
    mobile:               z.string().min(10, "At least 10 digits").max(15, "Too long").regex(/^\d+$/, "Only digits allowed"),
    alternate_mobile:     z.string().max(15, "Too long").regex(/^\d*$/, "Only digits allowed").optional().or(z.literal("")),
    email:                z.string().min(1, "Email is required").email("Enter a valid email address"),
    marriage_anniversary: z.string().regex(dateRegex, "Invalid date").optional().or(z.literal("")),
  }),
  addr: z.object({
    primary_address:   z.string().max(500, "Too long").optional().or(z.literal("")),
    primary_state:     z.string().max(100, "Too long").optional().or(z.literal("")),
    primary_pincode:   z.string().regex(pincodeRegex, "Must be 6 digits").optional().or(z.literal("")),
    secondary_address: z.string().max(500, "Too long").optional().or(z.literal("")),
    secondary_state:   z.string().max(100, "Too long").optional().or(z.literal("")),
    secondary_pincode: z.string().regex(pincodeRegex, "Must be 6 digits").optional().or(z.literal("")),
  }),
  mem: z.object({
    package_name:      z.string().min(1, "Package name is required").max(200, "Too long"),
    validity_years:    z.coerce.number().int("Must be a whole number").min(1, "At least 1 year").max(99, "Too long"),
    nights_per_year:   z.coerce.number().int("Must be a whole number").min(0, "Cannot be negative").optional(),
    sale_date:         z.string().min(1, "Sale date is required").regex(dateRegex, "Invalid date"),
    total_price:       z.coerce.number().positive("Total price must be greater than 0"),
    discount_amount:   z.coerce.number().min(0, "Cannot be negative").optional(),
    down_payment:      z.coerce.number().min(0, "Cannot be negative").optional(),
    payment_mode:      z.enum(["CASH", "CHEQUE", "ONLINE", "BANK_TRANSFER", "CARD"], { error: "Select a payment mode" }),
    dsa:               z.string().optional().or(z.literal("")),
    reference_by:      z.string().max(100, "Too long").optional().or(z.literal("")),
    transaction_ref:   z.string().max(100, "Too long").optional().or(z.literal("")),
    bank_name:         z.string().max(100, "Too long").optional().or(z.literal("")),
    sales_consultant:  z.string().max(100, "Too long").optional().or(z.literal("")),
    take_over_manager: z.string().max(100, "Too long").optional().or(z.literal("")),
    remarks:           z.string().max(1000, "Too long").optional().or(z.literal("")),
  }),
  offers: z.array(z.object({
    offer_name:  z.string().max(255, "Too long").optional().or(z.literal("")),
    valid_until: z.string().regex(dateRegex, "Invalid date").optional().or(z.literal("")),
  })),
});

const today = new Date().toISOString().slice(0, 10);

function NewClientForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activateClientId = searchParams.get("activate");

  const [prefillLoading, setPrefillLoading] = useState(false);
  const [prefillName,    setPrefillName]    = useState("");

  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState("");
  const [fieldErrors,  setFieldErrors]  = useState<Record<string, string>>({});
  const [sendWelcome,  setSendWelcome]  = useState(true);

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
    total_price: "", discount_amount: "0", down_payment: "0",
    payment_mode: "CASH",
    sales_consultant: "", take_over_manager: "",
    dsa: "", reference_by: "", remarks: "",
    transaction_ref: "", bank_name: "",
  });

  const [offers, setOffers] = useState<{ offer_name: string; valid_until: string }[]>([
    { offer_name: "", valid_until: "" },
  ]);

  useEffect(() => {
    if (!activateClientId) return;
    setPrefillLoading(true);
    Promise.all([
      api.get<{ data: Record<string, string> }>(`/clients/${activateClientId}`),
      api.get<{ data: Record<string, string> | null }>(`/clients/${activateClientId}/address`).catch(() => null),
    ]).then(([cr, ar]) => {
      const c = cr?.data;
      if (c) {
        setPersonal({
          first_name:           c.first_name            ?? "",
          middle_name:          c.middle_name            ?? "",
          last_name:            c.last_name              ?? "",
          gender:               c.gender                ?? "MALE",
          date_of_birth:        c.date_of_birth         ? c.date_of_birth.slice(0, 10) : "",
          spouse_name:          c.spouse_name            ?? "",
          mobile:               c.mobile                ?? "",
          alternate_mobile:     c.alternate_mobile       ?? "",
          country_code:         c.country_code           ?? "+91",
          email:                c.email                 ?? "",
          marriage_anniversary: c.marriage_anniversary  ? c.marriage_anniversary.slice(0, 10) : "",
        });
        setPrefillName(`${c.first_name ?? ""} ${c.last_name ?? ""}`.trim());
      }
      const a = ar?.data;
      if (a) {
        setAddr({
          primary_address:   a.primary_address   ?? "",
          primary_state:     a.primary_state     ?? "",
          primary_pincode:   a.primary_pincode   ?? "",
          secondary_address: a.secondary_address ?? "",
          secondary_state:   a.secondary_state   ?? "",
          secondary_pincode: a.secondary_pincode ?? "",
        });
      }
    }).finally(() => setPrefillLoading(false));
  }, [activateClientId]);

  function addOffer()    { setOffers(o => [...o, { offer_name: "", valid_until: "" }]); }
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

  const totalPrice    = Number(mem.total_price  || 0);
  const discountAmt   = Number(mem.discount_amount || 0);
  const downPayment   = Number(mem.down_payment || 0);
  const netPrice      = Math.max(0, totalPrice - discountAmt);
  const outstanding   = Math.max(0, netPrice - downPayment);

  const memPayload = {
    package_name:      mem.package_name,
    validity_years:    Number(mem.validity_years || 1),
    nights_per_year:   Number(mem.nights_per_year || 0),
    sale_date:         mem.sale_date,
    total_price:       totalPrice,
    discount_amount:   discountAmt,
    down_payment:      downPayment,
    payment_mode:      mem.payment_mode,
    transaction_ref:   mem.transaction_ref   || null,
    bank_name:         mem.bank_name         || null,
    sales_consultant:  mem.sales_consultant  || null,
    take_over_manager: mem.take_over_manager || null,
    dsa:               mem.dsa               || null,
    reference_by:      mem.reference_by      || null,
    remarks:           mem.remarks           || null,
  };

  const offersPayload = offers
    .filter(o => o.offer_name.trim())
    .map(o => ({ offer_name: o.offer_name.trim(), valid_until: o.valid_until || null }));

  async function sendWelcomeMail(clientId: number) {
    const clientName = [personal.first_name, personal.last_name].filter(Boolean).join(" ");
    const subject  = `Welcome to Peltown Vacations, ${clientName}!`;
    const bodyText = `Dear ${clientName},\n\nWelcome to the Peltown Vacations family! We are delighted to have you as a valued member.\n\nYour membership has been successfully activated. Our team is here to assist you in making the most of your vacation experiences.\n\nIf you have any questions or need assistance, please do not hesitate to reach out to us.\n\nWarm regards,\nPeltown Vacations Team`;
    await api.post(`/clients/${clientId}/send-welcome-mail`, { subject, bodyText });
  }

  async function handleSubmit() {
    setSaving(true); setError(""); setFieldErrors({});
    try {
      // Schema validation
      const parsed = FormSchema.safeParse({ personal, addr, mem, offers });
      if (!parsed.success) {
        const errors: Record<string, string> = {};
        parsed.error.issues.forEach(e => {
          if (e.path.length > 0) errors[e.path.join(".")] = e.message;
        });
        setFieldErrors(errors);
        setError("Please fix the validation errors in the form before submitting.");
        setSaving(false);
        return;
      }

      // Business logic validation
      const businessErrors: Record<string, string> = {};
      if (discountAmt > totalPrice) {
        businessErrors["mem.discount_amount"] = "Discount cannot exceed total price";
      }
      if (downPayment > netPrice) {
        businessErrors["mem.down_payment"] = "Down payment cannot exceed net price after discount";
      }
      if (Object.keys(businessErrors).length > 0) {
        setFieldErrors(businessErrors);
        setError("Please fix the validation errors in the form before submitting.");
        setSaving(false);
        return;
      }

      if (activateClientId) {
        const clientId = Number(activateClientId);
        const clientPayload: Record<string, string> = { status: "ACTIVE" };
        Object.entries(personal).forEach(([k, v]) => { if (v) clientPayload[k] = v; });
        await api.put(`/clients/${activateClientId}`, clientPayload);

        const hasAddress = addr.primary_address || addr.primary_state || addr.primary_pincode;
        if (hasAddress) await api.put(`/clients/${activateClientId}/address`, addr);

        const memRes = await api.post<{ success: boolean; message?: string }>(
          "/memberships",
          { ...memPayload, client_id: clientId },
        );
        if (!memRes?.success) throw new Error(memRes?.message ?? "Failed to create membership.");

        for (const offer of offersPayload) {
          await api.post(`/clients/${activateClientId}/offers`, offer);
        }

        if (sendWelcome && personal.email) {
          await sendWelcomeMail(clientId).catch(() => {});
        }

        router.push(`/admin/clients/${activateClientId}`);
      } else {
        const clientPayload: Record<string, string> = {};
        Object.entries(personal).forEach(([k, v]) => { if (v) clientPayload[k] = v; });

        const hasAddress = addr.primary_address || addr.primary_state || addr.primary_pincode;
        const addrPayload = hasAddress ? { ...addr } : undefined;

        const res = await api.post<{ success: boolean; data?: { client_id: number }; message?: string }>(
          "/clients/onboard",
          { client: clientPayload, address: addrPayload, membership: memPayload, offers: offersPayload },
        );
        if (!res?.success) throw new Error(res?.message ?? "Onboarding failed.");

        const newClientId = res.data?.client_id;
        if (sendWelcome && personal.email && newClientId) {
          await sendWelcomeMail(newClientId).catch(() => {});
        }

        router.push(`/admin/clients/${newClientId}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Nothing was saved.");
      setSaving(false);
    }
  }

  if (prefillLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {activateClientId ? "Activate Client" : "New Client Onboarding"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {activateClientId
              ? "Complete membership details to activate this client"
              : "All data is saved atomically — nothing is stored unless everything succeeds"}
          </p>
        </div>
      </div>

      {activateClientId && prefillName && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Zap className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            Activating <span className="font-semibold">{prefillName}</span> — personal details are prefilled. Fill in membership details below to activate.
          </p>
        </div>
      )}

      {/* ── Section 1: Personal Details ─────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader icon={User} title="Personal Details" subtitle="Client's contact and identity information" />
        <div className="grid grid-cols-3 gap-4">
          <Field error={fieldErrors["personal.first_name"]} label="First Name" required>
            <input className={inp(fieldErrors["personal.first_name"])} value={personal.first_name} onChange={e => setP("first_name", e.target.value)} placeholder="First name" />
          </Field>
          <Field error={fieldErrors["personal.middle_name"]} label="Middle Name">
            <input className={inp(fieldErrors["personal.middle_name"])} value={personal.middle_name} onChange={e => setP("middle_name", e.target.value)} placeholder="Middle name" />
          </Field>
          <Field error={fieldErrors["personal.last_name"]} label="Last Name" required>
            <input className={inp(fieldErrors["personal.last_name"])} value={personal.last_name} onChange={e => setP("last_name", e.target.value)} placeholder="Last name" />
          </Field>

          <Field error={fieldErrors["personal.gender"]} label="Gender" required>
            <select className={sel(fieldErrors["personal.gender"])} value={personal.gender} onChange={e => setP("gender", e.target.value)}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
          <Field error={fieldErrors["personal.date_of_birth"]} label="Date of Birth">
            <input type="date" className={inp(fieldErrors["personal.date_of_birth"])} value={personal.date_of_birth} onChange={e => setP("date_of_birth", e.target.value)} />
          </Field>
          <Field error={fieldErrors["personal.spouse_name"]} label="Spouse Name">
            <input className={inp(fieldErrors["personal.spouse_name"])} value={personal.spouse_name} onChange={e => setP("spouse_name", e.target.value)} placeholder="Spouse name" />
          </Field>

          <Field error={fieldErrors["personal.country_code"]} label="Country Code" required>
            <input className={inp(fieldErrors["personal.country_code"])} value={personal.country_code} onChange={e => setP("country_code", e.target.value)} placeholder="+91" />
          </Field>
          <Field error={fieldErrors["personal.mobile"]} label="Mobile" required>
            <input className={inp(fieldErrors["personal.mobile"])} value={personal.mobile} onChange={e => setP("mobile", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" maxLength={15} />
          </Field>
          <Field error={fieldErrors["personal.alternate_mobile"]} label="Alternate Mobile">
            <input className={inp(fieldErrors["personal.alternate_mobile"])} value={personal.alternate_mobile} onChange={e => setP("alternate_mobile", e.target.value.replace(/\D/g, ""))} placeholder="Alternate mobile" maxLength={15} />
          </Field>

          <div className="col-span-2">
            <Field error={fieldErrors["personal.email"]} label="Email" required>
              <input type="email" className={inp(fieldErrors["personal.email"])} value={personal.email} onChange={e => setP("email", e.target.value)} placeholder="Email address" />
            </Field>
          </div>
          <Field error={fieldErrors["personal.marriage_anniversary"]} label="Marriage Anniversary">
            <input type="date" className={inp(fieldErrors["personal.marriage_anniversary"])} value={personal.marriage_anniversary} onChange={e => setP("marriage_anniversary", e.target.value)} />
          </Field>
        </div>

        {/* Address */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Address</p>
          <div className="grid grid-cols-3 gap-4">
            <Field error={fieldErrors["addr.primary_address"]} label="Primary Address">
              <input className={inp(fieldErrors["addr.primary_address"])} value={addr.primary_address} onChange={e => setA("primary_address", e.target.value)} placeholder="Street / flat / building" />
            </Field>
            <Field error={fieldErrors["addr.primary_state"]} label="State">
              <input className={inp(fieldErrors["addr.primary_state"])} value={addr.primary_state} onChange={e => setA("primary_state", e.target.value)} placeholder="State" />
            </Field>
            <Field error={fieldErrors["addr.primary_pincode"]} label="Pin Code">
              <input className={inp(fieldErrors["addr.primary_pincode"])} value={addr.primary_pincode} onChange={e => setA("primary_pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit pin code" maxLength={6} />
            </Field>
          </div>

          <label className="flex items-center gap-2 mt-3 mb-3 cursor-pointer select-none">
            <input type="checkbox" checked={sameAddress} onChange={e => onSameAddress(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
            <span className="text-sm text-slate-600">Secondary address same as primary</span>
          </label>

          {!sameAddress && (
            <div className="grid grid-cols-3 gap-4">
              <Field error={fieldErrors["addr.secondary_address"]} label="Secondary Address">
                <input className={inp(fieldErrors["addr.secondary_address"])} value={addr.secondary_address} onChange={e => setA("secondary_address", e.target.value)} placeholder="Street / flat / building" />
              </Field>
              <Field error={fieldErrors["addr.secondary_state"]} label="State">
                <input className={inp(fieldErrors["addr.secondary_state"])} value={addr.secondary_state} onChange={e => setA("secondary_state", e.target.value)} placeholder="State" />
              </Field>
              <Field error={fieldErrors["addr.secondary_pincode"]} label="Pin Code">
                <input className={inp(fieldErrors["addr.secondary_pincode"])} value={addr.secondary_pincode} onChange={e => setA("secondary_pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit pin code" maxLength={6} />
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
            <Field error={fieldErrors["mem.package_name"]} label="Package Name" required>
              <input className={inp(fieldErrors["mem.package_name"])} value={mem.package_name} onChange={e => setM("package_name", e.target.value)} placeholder="e.g. Gold Package, Silver 3 Year…" />
            </Field>
          </div>
          <Field error={fieldErrors["mem.validity_years"]} label="Validity (Years)" required>
            <input type="number" min="1" max="99" className={inp(fieldErrors["mem.validity_years"])} value={mem.validity_years} onChange={e => setM("validity_years", e.target.value)} />
          </Field>

          <Field error={fieldErrors["mem.nights_per_year"]} label="Nights Per Year">
            <input type="number" min="0" className={inp(fieldErrors["mem.nights_per_year"])} value={mem.nights_per_year} onChange={e => setM("nights_per_year", e.target.value)} />
          </Field>
          <Field error={fieldErrors["mem.sale_date"]} label="Sale / Joining Date" required>
            <input type="date" className={inp(fieldErrors["mem.sale_date"])} value={mem.sale_date} onChange={e => setM("sale_date", e.target.value)} />
          </Field>
          <div />

          <Field error={fieldErrors["mem.total_price"]} label="Total Price (₹)" required>
            <input type="number" min="1" className={inp(fieldErrors["mem.total_price"])} value={mem.total_price} onChange={e => setM("total_price", e.target.value)} placeholder="e.g. 150000" />
          </Field>
          <Field error={fieldErrors["mem.discount_amount"]} label="Discount (₹)">
            <input type="number" min="0" className={inp(fieldErrors["mem.discount_amount"])} value={mem.discount_amount} onChange={e => setM("discount_amount", e.target.value)} />
          </Field>
          <Field error={fieldErrors["mem.down_payment"]} label="Down Payment (₹)">
            <input type="number" min="0" className={inp(fieldErrors["mem.down_payment"])} value={mem.down_payment} onChange={e => setM("down_payment", e.target.value)} />
          </Field>

          <Field error={fieldErrors["mem.payment_mode"]} label="Payment Mode" required>
            <select className={sel(fieldErrors["mem.payment_mode"])} value={mem.payment_mode} onChange={e => setM("payment_mode", e.target.value)}>
              {["CASH", "CHEQUE", "ONLINE", "BANK_TRANSFER", "CARD"].map(m => (
                <option key={m} value={m}>{m.replace("_", " ")}</option>
              ))}
            </select>
          </Field>
          <Field error={fieldErrors["mem.dsa"]} label="DSA">
            <select className={sel(fieldErrors["mem.dsa"])} value={mem.dsa} onChange={e => setM("dsa", e.target.value)}>
              <option value="">None</option>
              <option value="VENUE">Venue</option>
              <option value="CSDO">CSDO</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
          <Field error={fieldErrors["mem.reference_by"]} label="Reference By">
            <input className={inp(fieldErrors["mem.reference_by"])} value={mem.reference_by} onChange={e => setM("reference_by", e.target.value)} placeholder="Referred by" />
          </Field>

          <Field error={fieldErrors["mem.transaction_ref"]} label="Transaction Ref / Cheque No.">
            <input className={inp(fieldErrors["mem.transaction_ref"])} value={mem.transaction_ref} onChange={e => setM("transaction_ref", e.target.value)} placeholder="Ref / cheque number" />
          </Field>
          <Field error={fieldErrors["mem.bank_name"]} label="Bank Name">
            <input className={inp(fieldErrors["mem.bank_name"])} value={mem.bank_name} onChange={e => setM("bank_name", e.target.value)} placeholder="Bank name" />
          </Field>
        </div>

        {mem.total_price && (
          <div className="mt-4 flex gap-4 bg-blue-50 rounded-xl p-4">
            <div className="flex-1 text-center border-r border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Total Price</p>
              <p className="text-lg font-bold text-blue-800 mt-0.5">₹{totalPrice.toLocaleString()}</p>
            </div>
            <div className="flex-1 text-center border-r border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Net Price</p>
              <p className="text-lg font-bold text-blue-800 mt-0.5">₹{netPrice.toLocaleString()}</p>
            </div>
            <div className="flex-1 text-center border-r border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Down Payment</p>
              <p className="text-lg font-bold text-blue-800 mt-0.5">₹{downPayment.toLocaleString()}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs text-blue-600 font-medium">Outstanding</p>
              <p className={`text-lg font-bold mt-0.5 ${outstanding > 0 ? "text-red-600" : "text-green-600"}`}>₹{outstanding.toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Sales Details</p>
          <div className="grid grid-cols-2 gap-4">
            <Field error={fieldErrors["mem.sales_consultant"]} label="Sales Consultant">
              <input className={inp(fieldErrors["mem.sales_consultant"])} value={mem.sales_consultant} onChange={e => setM("sales_consultant", e.target.value)} placeholder="Consultant name" />
            </Field>
            <Field error={fieldErrors["mem.take_over_manager"]} label="Take Over Manager">
              <input className={inp(fieldErrors["mem.take_over_manager"])} value={mem.take_over_manager} onChange={e => setM("take_over_manager", e.target.value)} placeholder="Manager name" />
            </Field>
            <div className="col-span-2">
              <Field error={fieldErrors["mem.remarks"]} label="Remarks">
                <textarea rows={2} className={inp(fieldErrors["mem.remarks"])} value={mem.remarks} onChange={e => setM("remarks", e.target.value)} placeholder="Membership notes…" />
              </Field>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Offers ─────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SectionHeader icon={Tag} title="Offers" subtitle="Add one or more offers for this client (optional)" />
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_180px_36px] gap-3 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Offer Name</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Valid Until</span>
            <span />
          </div>
          {offers.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_180px_36px] gap-3 items-start">
              <div>
                <input className={inp(fieldErrors[`offers.${i}.offer_name`])} value={row.offer_name} onChange={e => setOffer(i, "offer_name", e.target.value)} placeholder="e.g. Free Room Upgrade…" />
                {fieldErrors[`offers.${i}.offer_name`] && <p className="mt-1 text-[11px] font-semibold text-red-500">{fieldErrors[`offers.${i}.offer_name`]}</p>}
              </div>
              <div>
                <input type="date" className={inp(fieldErrors[`offers.${i}.valid_until`])} value={row.valid_until} onChange={e => setOffer(i, "valid_until", e.target.value)} />
                {fieldErrors[`offers.${i}.valid_until`] && <p className="mt-1 text-[11px] font-semibold text-red-500">{fieldErrors[`offers.${i}.valid_until`]}</p>}
              </div>
              <button type="button" onClick={() => removeOffer(i)} disabled={offers.length === 1}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addOffer}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          <Plus className="w-4 h-4" /> Add one more offer
        </button>
      </div>

      {/* ── Section 4: Summary ──────────────────────────────────── */}
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
            <span className={`font-semibold ${outstanding > 0 ? "text-red-600" : "text-green-600"}`}>₹{outstanding.toLocaleString()}</span>
          </div>
        </div>

        {/* Welcome email checkbox */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={sendWelcome}
              onChange={e => setSendWelcome(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Send welcome email to client</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {personal.email
                  ? `A welcome message will be sent to ${personal.email} after onboarding.`
                  : "No email address provided — welcome email will be skipped."}
              </p>
            </div>
          </label>
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
          className={`flex items-center gap-2 px-8 py-2.5 text-sm font-semibold rounded-xl disabled:opacity-60 shadow-sm ${
            activateClientId
              ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
          }`}>
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving…" : activateClientId ? "Activate Client" : "Activate Membership & Create Client"}
        </button>
      </div>
    </div>
  );
}

export default function NewClientPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>}>
      <NewClientForm />
    </Suspense>
  );
}
