"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  Ticket,
  Calendar,
  User,
  Users,
  Mail,
  Phone,
  Gift,
  MapPin,
  FileText,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Copy,
  Check,
  Search,
  X,
} from "lucide-react";

interface ClientOption {
  client_id: number;
  title?: string | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  mobile: string;
  country_code?: string | null;
  spouse_name?: string | null;
  membership_number?: string | null;
}

const clientFullName = (c: ClientOption) =>
  [c.title, c.first_name, c.middle_name, c.last_name].filter(Boolean).join(" ");

const INITIAL_LOCATIONS = [
  "Shimla",
  "Cochin",
  "Jim Corbett",
  "Jaipur",
  "Agra",
  "Goa",
  "Nainital",
  "Manesar",
];

const BENEFIT_OPTIONS = [
  "₹10,000 Holiday Voucher",
  "₹500 Movie Voucher",
  "2 Nights / 3 Days Holiday Voucher",
  "Custom",
];

const DEFAULT_TERMS = `HOLIDAY GIFT VOUCHER

1. Holiday Destination
Shimla
Cochin
Jim Corbett
Jaipur
Agra
Goa
Nainital
Manesar

2. 1 Year Validity.
*Locations and properties are timely amended.
*Booking is purely subject to availability as per the off-peak season.

3. The accommodation is in respect of a studio unit, which accommodates 2 adults and two kids below 6 years (same bed) occupancy cannot be exceeded. Food and travel expenses to be borne by the recipient.
It will expire in one year from the date of issuance.

4. The voucher allows you to experience Mandarin Worldwide Vacations associates properties. This offer is for off peak accommodation which is defined by each resort.

5. Reservation for 2 Nights can be done on 15 working days prior notification.
Reservation against movie voucher can be done on 7 working days prior notification.
The movie tickets will be available only for Monday to Thursday, not available for Friday to Sunday and gazetted holidays.

6. Utility charges are applicable for accommodation of 2 nights (off-peak).

7. The voucher of Rs. 10,000 is valid for international packages only.
For booking enquiry mail us at: packages@mandarinworldwidevacations.com
or visit: www.mandarinworldwidevacations.com

8. Once the accommodation request is confirmed the utility charges are non refundable.
If any government tax are there in a respective country, the same has to be borne by the recipient of this voucher.

9. All accommodations are subject to availability.
This Voucher is to be produced to confirm the accommodation and guests are expected to produce the confirmation voucher and a photo identification issued by Govt. / State while checking into the resorts.
The Management reserves the right to offer alternative accommodation from the one stipulated on the confirmation letter.
This voucher is not transferable, cannot be exchanged for cash and if not availed within the stipulated period will lapse.

To redeem this voucher, visit:
https://mwvpl.com/redeem-voucher
or email:
voucher@mandarinworldwidevacations.com

We hope to see you at the resorts.
HAPPY HOLIDAYING

Thanks & Regards
Mandarin Worldwide Vacations
Thanks For Visiting Mandarin Worldwide Vacations.`;

function generateVoucherNo(): string {
  const prefix = "81";
  const random = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `${prefix}${random}`;
}

function calculateExpiry(issueDateStr: string, validityStr: string): string {
  if (!issueDateStr) return "";
  const d = new Date(issueDateStr);
  if (isNaN(d.getTime())) return "";

  const expiry = new Date(d);
  const matchYear = validityStr.match(/(\d+)\s*Year/i);
  const matchMonth = validityStr.match(/(\d+)\s*Month/i);
  const matchDay = validityStr.match(/(\d+)\s*Day/i);

  if (matchYear) {
    expiry.setFullYear(expiry.getFullYear() + parseInt(matchYear[1], 10));
  } else if (matchMonth) {
    expiry.setMonth(expiry.getMonth() + parseInt(matchMonth[1], 10));
  } else if (matchDay) {
    expiry.setDate(expiry.getDate() + parseInt(matchDay[1], 10));
  } else {
    expiry.setFullYear(expiry.getFullYear() + 1);
  }

  return expiry.toISOString().slice(0, 10);
}

export default function CreateVoucherPage() {
  const router = useRouter();

  const [voucherNumber, setVoucherNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [voucherType, setVoucherType] = useState<"Non Member" | "Member">("Non Member");
  const [recipientMode, setRecipientMode] = useState<"existing" | "outsider">("outsider");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [clientQuery, setClientQuery] = useState("");
  const [clientResults, setClientResults] = useState<ClientOption[]>([]);
  const [clientSearching, setClientSearching] = useState(false);
  const [applicant, setApplicant] = useState("");
  const [spouse, setSpouse] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [validity, setValidity] = useState("1 Year");
  const [terms, setTerms] = useState(DEFAULT_TERMS);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const [createdResult, setCreatedResult] = useState<{
    voucherNumber: string;
    email: string;
    emailSent: boolean;
    emailError?: string | null;
  } | null>(null);

  useEffect(() => {
    setVoucherNumber(generateVoucherNo());
    setIssueDate(new Date().toISOString().slice(0, 10));
  }, []);

  const calculatedExpiry = calculateExpiry(issueDate, validity);

  // Debounced client lookup for the "Existing Client" recipient
  useEffect(() => {
    if (recipientMode !== "existing" || selectedClient || clientQuery.trim().length < 2) {
      setClientResults([]);
      return;
    }
    setClientSearching(true);
    const t = setTimeout(() => {
      api.get<{ data: { clients: ClientOption[] } }>(`/clients?search=${encodeURIComponent(clientQuery.trim())}&limit=8`)
        .then(res => setClientResults(res.data?.clients ?? []))
        .catch(() => setClientResults([]))
        .finally(() => setClientSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [clientQuery, recipientMode, selectedClient]);

  function clearRecipient() {
    setSelectedClient(null);
    setClientQuery("");
    setClientResults([]);
    setApplicant("");
    setSpouse("");
    setEmail("");
    setPhone("");
  }

  function switchRecipientMode(mode: "existing" | "outsider") {
    if (mode === recipientMode) return;
    clearRecipient();
    setRecipientMode(mode);
    setVoucherType(mode === "existing" ? "Member" : "Non Member");
  }

  function pickClient(c: ClientOption) {
    setSelectedClient(c);
    setClientResults([]);
    setApplicant(clientFullName(c));
    setSpouse(c.spouse_name ?? "");
    setEmail(c.email);
    setPhone(`${c.country_code ?? ""} ${c.mobile}`.trim());
    setVoucherType("Member");
  }

  function handleCopyNumber(num: string) {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function resetForm() {
    setVoucherNumber(generateVoucherNo());
    setIssueDate(new Date().toISOString().slice(0, 10));
    setVoucherType("Non Member");
    setRecipientMode("outsider");
    clearRecipient();
    setValidity("1 Year");
    setTerms(DEFAULT_TERMS);
    setErrorMsg("");
    setCreatedResult(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (recipientMode === "existing" && !selectedClient) {
      setErrorMsg("Select an existing client, or switch to Outsider.");
      return;
    }
    if (!applicant.trim()) {
      setErrorMsg("Applicant name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Valid email address is required.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Phone number is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        voucher_number: voucherNumber,
        voucher_type: voucherType,
        client_id: recipientMode === "existing" ? selectedClient?.client_id : undefined,
        applicant: applicant.trim(),
        spouse: spouse.trim() || null,
        email: email.trim(),
        phone: phone.trim(),
        locations: INITIAL_LOCATIONS,
        benefit: "Holiday Gift Voucher",
        issue_date: issueDate,
        validity: validity,
        terms_and_conditions: terms,
      };

      const res = await api.post<{
        status: string;
        message: string;
        data: {
          voucher: {
            voucher_id: number;
            voucher_number: string;
            email: string;
          };
          email_sent: boolean;
          email_error: string | null;
        };
      }>("/vouchers", payload);

      if (res?.data?.voucher) {
        setCreatedResult({
          voucherNumber: res.data.voucher.voucher_number,
          email: res.data.voucher.email,
          emailSent: res.data.email_sent,
          emailError: res.data.email_error,
        });
      } else {
        throw new Error((res as any)?.message || "Failed to create voucher");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create voucher. Please check input.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/vouchers")}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Vouchers
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Create Gift Voucher</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Generate and dispatch a new luxury holiday gift voucher to a client.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Ticket className="w-5 h-5" />
        </div>
      </div>

      {/* Success Modal / Card */}
      {createdResult && (
        <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl shadow-emerald-500/5 space-y-5 animate-in fade-in zoom-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800">Voucher Created Successfully!</h2>
              <p className="text-sm text-slate-600">
                The voucher has been generated and recorded in the database.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Voucher Number
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-lg font-bold text-blue-600">
                  {createdResult.voucherNumber}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyNumber(createdResult.voucherNumber)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Copy Voucher Number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email Dispatch Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                {createdResult.emailSent ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" /> Email Sent to {createdResult.email}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5" /> Created, but email delivery failed
                  </span>
                )}
              </div>
              {createdResult.emailError && (
                <p className="text-xs text-amber-600 mt-1">{createdResult.emailError}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={resetForm}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
            >
              Create Another Voucher
            </button>
            <button
              onClick={() => router.push("/admin/vouchers")}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              View in All Vouchers
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Section 1: Voucher Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-blue-600" />
            1. Voucher Identification &amp; Terms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Voucher Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Voucher Number <span className="text-slate-400 font-normal">(Auto-generated)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={voucherNumber}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-blue-700 focus:outline-none cursor-default"
                />
                <button
                  type="button"
                  onClick={() => setVoucherNumber(generateVoucherNo())}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                  title="Generate New Number"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Issuing Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issuing Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Voucher Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Voucher Type <span className="text-red-500">*</span>
              </label>
              <select
                value={voucherType}
                onChange={(e) => setVoucherType(e.target.value as "Non Member" | "Member")}
                disabled={recipientMode === "existing"}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
              >
                <option value="Non Member">Non Member</option>
                <option value="Member">Member</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Beneficiary Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            2. Beneficiary Information
          </h2>

          {/* Recipient: existing client or outsider */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Voucher For <span className="text-red-500">*</span>
            </label>
            <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden text-sm font-medium">
              {([["existing", "Existing Client"], ["outsider", "Outsider"]] as const).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => switchRecipientMode(mode)}
                  className={`px-4 py-2 transition-colors ${recipientMode === mode ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"} ${mode === "outsider" ? "border-l border-slate-300" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {recipientMode === "existing" && (
              selectedClient ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div className="text-sm">
                    <p className="font-semibold text-slate-800">{clientFullName(selectedClient)}</p>
                    <p className="text-xs text-slate-500">
                      {selectedClient.membership_number ? `${selectedClient.membership_number} · ` : ""}{selectedClient.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearRecipient}
                    className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
                    title="Choose a different client"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={clientQuery}
                    onChange={(e) => setClientQuery(e.target.value)}
                    placeholder="Search client by name, email or mobile"
                    className="w-full pl-9 pr-9 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  {clientSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-slate-400" />}
                  {clientResults.length > 0 && (
                    <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg divide-y divide-slate-100">
                      {clientResults.map(c => (
                        <li key={c.client_id}>
                          <button
                            type="button"
                            onClick={() => pickClient(c)}
                            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors"
                          >
                            <p className="text-sm font-medium text-slate-800">{clientFullName(c)}</p>
                            <p className="text-xs text-slate-500">
                              {c.membership_number ? `${c.membership_number} · ` : ""}{c.email} · {c.mobile}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!clientSearching && clientQuery.trim().length >= 2 && clientResults.length === 0 && (
                    <p className="mt-1.5 text-xs text-slate-500">No matching client. Use Outsider to enter details manually.</p>
                  )}
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Applicant */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Applicant Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. John Doe"
                  value={applicant}
                  onChange={(e) => setApplicant(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Spouse */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Spouse Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Mrs. Jane Doe"
                  value={spouse}
                  onChange={(e) => setSpouse(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
                <span className="text-slate-400 font-normal ml-1">(Voucher will be emailed here)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Validity */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            3. Validity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Validity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Validity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="1 Year"
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Calculated Expiry */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Calculated Expiry Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  value={calculatedExpiry || "—"}
                  className="w-full pl-9 pr-3 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-default"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Terms & Conditions */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            4. Terms &amp; Conditions Template
          </h2>
          <p className="text-xs text-slate-500">
            Prefilled with standard Mandarin Worldwide Vacations voucher policy. Review or edit if needed.
          </p>
          <textarea
            rows={8}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            className="w-full p-3 text-xs font-mono text-slate-700 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 leading-relaxed"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.push("/admin/vouchers")}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating &amp; Sending Voucher...</span>
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4" />
                <span>Create &amp; Dispatch Voucher</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
