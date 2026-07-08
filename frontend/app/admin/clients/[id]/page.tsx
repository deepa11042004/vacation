"use client";

import { Fragment, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import {
  ArrowLeft, Loader2, User, Pencil,
  LayoutList, CalendarDays, Wrench, Tag, CreditCard, PhoneCall, FileCheck,
  Plus, Trash2, AlertCircle, Hotel, X, Mail, CheckCircle2, XCircle
} from "lucide-react";

interface Client {
  client_id: number;
  title?: string; first_name: string; middle_name?: string; last_name: string;
  gender: string; date_of_birth?: string;
  mobile: string; alternate_mobile?: string; email: string; country_code: string;
  status: string;
  is_welcome_mail_sent?: boolean;
  marriage_anniversary?: string; spouse_name?: string;
  created_at: string; updated_at?: string;
}

interface Address {
  primary_address?: string | null;
  primary_state?: string | null;
  primary_pincode?: string | null;
  secondary_address?: string | null;
  secondary_state?: string | null;
  secondary_pincode?: string | null;
}

interface PaymentRecord {
  payment_id: number;
  payment_number: string;
  payment_type: string;
  amount: number;
  payment_date: string;
  due_date?: string | null;
  payment_mode: string;
  transaction_ref?: string | null;
  bank_name?: string | null;
  status: string;
  remarks?: string | null;
  created_at: string;
}

interface AmcPayment {
  amc_payment_id: number;
  year_number: number;
  is_received: boolean;
  payment_date?: string | null;
  payment_mode?: string | null;
  amount?: number | null;
}

interface CallRecording {
  call_recording_id: number;
  note: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

interface KycDocument {
  kyc_document_id: number;
  title: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

interface Offer {
  offer_id: number;
  offer_name: string;
  valid_until?: string | null;
  is_redeemed: boolean;
  created_at: string;
}

interface Booking {
  booking_id: number;
  client_id: number;
  membership_id: number;
  assist_by?: string | null;
  contact_number?: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  no_of_rooms: number;
  no_of_adults: number;
  children: number;
  booking_type?: string | null;
  hotel_name: string;
  hotel_address?: string | null;
  hotel_contact?: string | null;
  confirmation_number?: string | null;
  booking_amount?: number | null;
  room_category?: string | null;
  remark?: string | null;
  night_type: string;
  redeemed_offer_ids?: number[] | null;
  amount_paid_by_client: number;
  note?: string | null;
  status: string;
  created_at: string;
}

interface Membership {
  membership_id: number;
  membership_number: string;
  package_name?: string | null;
  validity_years?: number | null;
  nights_per_year?: number | null;
  nights_remaining?: number | null;
  sale_date?: string | null;
  end_date?: string | null;
  total_price?: number | null;
  discount_amount?: number | null;
  net_price?: number | null;
  down_payment?: number | null;
  outstanding_balance?: number | null;
  amc?: number | null;
  payment_mode?: string | null;
  sales_consultant?: string | null;
  take_over_manager?: string | null;
  dsa?: string | null;
  reference_by?: string | null;
  remarks?: string | null;
  status?: string | null;
}

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const sel = `${inp} bg-white`;

type Tab = "all-details" | "holiday-chart" | "amc-chart" | "offers-chart" | "payment-chart" | "call-recordings" | "kyc-documents";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "all-details",     label: "All Details",     icon: LayoutList   },
  { id: "holiday-chart",   label: "Holiday Chart",   icon: CalendarDays },
  { id: "amc-chart",       label: "AMC Chart",       icon: Wrench       },
  { id: "offers-chart",    label: "Offers Chart",    icon: Tag          },
  { id: "payment-chart",   label: "Mode of Payment", icon: CreditCard   },
  { id: "call-recordings", label: "Call Recordings", icon: PhoneCall    },
  { id: "kyc-documents",   label: "KYC Documents",   icon: FileCheck    },
];

function Section({ title }: { title: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6 mb-2 first:mt-0">{title}</p>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex gap-3 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-400 text-xs w-48 shrink-0 pt-0.5">{label}</span>
      <span className="text-slate-700 text-sm">{String(value)}</span>
    </div>
  );
}

function fmt(n?: number | null) {
  if (n == null) return null;
  return `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d?: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function fmtAmcDate(d: Date): string {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${ordinal(d.getDate())}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

function fmtAmcAmt(n?: number | null): string {
  if (n == null) return "—";
  return Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "/-";
}

function fmtPayDate(d?: string | null): string {
  if (!d) return "—";
  const date = new Date(d);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${ordinal(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function paymentTypeLabel(t: string): string {
  return ({ DOWN_PAYMENT: "Down Payment", INSTALMENT: "Instalment", AMC: "AMC", PENALTY: "Penalty", REFUND: "Refund" } as Record<string,string>)[t] ?? t;
}

interface YearRow {
  year: number;
  from: Date;
  to: Date;
  status: "completed" | "current" | "upcoming";
}

function buildYearRows(mem: Membership): YearRow[] {
  if (!mem.sale_date || !mem.validity_years) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const rows: YearRow[] = [];
  for (let i = 0; i < mem.validity_years; i++) {
    const from = new Date(mem.sale_date);
    from.setFullYear(from.getFullYear() + i);
    const to = new Date(mem.sale_date);
    to.setFullYear(to.getFullYear() + i + 1);
    to.setDate(to.getDate() - 1);
    const status: "completed" | "current" | "upcoming" =
      today > to ? "completed" : today >= from ? "current" : "upcoming";
    rows.push({ year: i + 1, from, to, status });
  }
  return rows;
}

function fmtD(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function YearBadge({ status }: { status: "completed" | "current" | "upcoming" }) {
  if (status === "completed") return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Completed</span>
  );
  if (status === "current") return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
      Current
    </span>
  );
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Upcoming</span>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <p className="text-slate-700 font-semibold text-base">{label}</p>
      <p className="text-slate-400 text-sm mt-1">This section is coming soon</p>
    </div>
  );
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [client,     setClient]     = useState<Client | null>(null);
  const [address,    setAddress]    = useState<Address | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState<Tab>("all-details");

  const [offers,        setOffers]        = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersFetched, setOffersFetched] = useState(false);
  const [newOffer,      setNewOffer]      = useState({ offer_name: "", valid_until: "" });
  const [addingOffer,   setAddingOffer]   = useState(false);
  const [deletingId,    setDeletingId]    = useState<number | null>(null);

  const emptyBookingForm = {
    assist_by: "", contact_number: "",
    check_in: "", check_out: "",
    no_of_rooms: "1", no_of_adults: "1", children: "0",
    booking_type: "", hotel_name: "", hotel_address: "",
    hotel_contact: "", confirmation_number: "",
    booking_amount: "", room_category: "", remark: "",
    night_type: "MEMBERSHIP",
    amount_paid_by_client: "0", note: "",
  };
  const [bookings,         setBookings]         = useState<Booking[]>([]);
  const [bookingsLoading,  setBookingsLoading]  = useState(false);
  const [bookingsFetched,  setBookingsFetched]  = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm,      setBookingForm]      = useState(emptyBookingForm);
  const [bookingNights,    setBookingNights]    = useState<number | null>(null);
  const [selectedOfferIds, setSelectedOfferIds] = useState<number[]>([]);
  const [bookingSaving,    setBookingSaving]    = useState(false);
  const [bookingError,     setBookingError]     = useState("");
  const [cancellingId,     setCancellingId]     = useState<number | null>(null);
  const [selectedYearIdx,  setSelectedYearIdx]  = useState<number | null>(null);

  const [amcPayments,        setAmcPayments]        = useState<AmcPayment[]>([]);
  const [showWelcomeMailModal, setShowWelcomeMailModal] = useState(false);
  const [welcomeMailForm,      setWelcomeMailForm]      = useState({ subject: "", bodyText: "" });
  const [welcomeMailSending,   setWelcomeMailSending]   = useState(false);
  const [welcomeMailError,     setWelcomeMailError]     = useState("");
  const [amcPaymentsLoading, setAmcPaymentsLoading] = useState(false);
  const [amcPaymentsFetched, setAmcPaymentsFetched] = useState(false);
  const [showAmcModal,       setShowAmcModal]       = useState(false);
  const [amcForm,            setAmcForm]            = useState({ year_number: "", is_received: false, payment_date: "", payment_mode: "" });
  const [amcSaving,          setAmcSaving]          = useState(false);
  const [amcError,           setAmcError]           = useState("");

  const emptyPaymentForm = {
    membership_id: "", payment_type: "INSTALMENT", amount: "",
    payment_date: "", due_date: "", payment_mode: "CASH",
    transaction_ref: "", bank_name: "", status: "PAID", remarks: "",
  };
  const [paymentRecords,      setPaymentRecords]      = useState<PaymentRecord[]>([]);
  const [paymentsLoading,     setPaymentsLoading]     = useState(false);
  const [paymentsFetched,     setPaymentsFetched]     = useState(false);
  const [showPaymentModal,    setShowPaymentModal]    = useState(false);
  const [paymentForm,         setPaymentForm]         = useState(emptyPaymentForm);
  const [paymentSaving,       setPaymentSaving]       = useState(false);
  const [paymentError,        setPaymentError]        = useState("");

  const [callRecordings,        setCallRecordings]        = useState<CallRecording[]>([]);
  const [callRecordingsLoading, setCallRecordingsLoading] = useState(false);
  const [callRecordingsFetched, setCallRecordingsFetched] = useState(false);
  const [showCallModal,         setShowCallModal]         = useState(false);
  const [callNote,              setCallNote]              = useState("");
  const [callFile,              setCallFile]              = useState<File | null>(null);
  const [callSaving,            setCallSaving]            = useState(false);
  const [callError,             setCallError]             = useState("");

  const [kycDocuments,        setKycDocuments]        = useState<KycDocument[]>([]);
  const [kycDocumentsLoading, setKycDocumentsLoading] = useState(false);
  const [kycDocumentsFetched, setKycDocumentsFetched] = useState(false);
  const [showKycModal,        setShowKycModal]        = useState(false);
  const [kycTitle,            setKycTitle]            = useState("");
  const [kycFile,             setKycFile]             = useState<File | null>(null);
  const [kycSaving,           setKycSaving]           = useState(false);
  const [kycError,            setKycError]            = useState("");

  const [showEdit,   setShowEdit]   = useState(false);
  const [editForm,   setEditForm]   = useState<Record<string, string>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editErr,    setEditErr]    = useState("");

  function loadData() {
    const safe = <T,>(p: Promise<T>) => p.catch(() => null);
    Promise.all([
      api.get<{ data: Client }>(`/clients/${id}`),
      safe(api.get<{ data: Address | null }>(`/clients/${id}/address`)),
      safe(api.get<{ data: { memberships: Membership[] } }>(`/memberships?client_id=${id}&limit=1`)),
    ]).then(([cr, ar, mr]) => {
      setClient(cr?.data ?? null);
      setAddress((ar as any)?.data ?? null);
      setMembership((mr as any)?.data?.memberships?.[0] ?? null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  useEffect(() => { loadData(); }, [id]);

  function loadOffers() {
    setOffersLoading(true);
    api.get<{ data: { offers: Offer[] } }>(`/clients/${id}/offers`)
      .then(res => { setOffers(res?.data?.offers ?? []); setOffersFetched(true); setOffersLoading(false); })
      .catch(() => { setOffers([]); setOffersFetched(true); setOffersLoading(false); });
  }

  useEffect(() => {
    if (tab === "offers-chart" && !offersFetched) loadOffers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, offersFetched]);

  function loadBookings() {
    setBookingsLoading(true);
    api.get<{ data: { bookings: Booking[] } }>(`/clients/${id}/bookings`)
      .then(res => { setBookings(res?.data?.bookings ?? []); setBookingsFetched(true); setBookingsLoading(false); })
      .catch(() => { setBookings([]); setBookingsFetched(true); setBookingsLoading(false); });
  }

  useEffect(() => {
    if (tab === "holiday-chart" && !bookingsFetched) {
      loadBookings();
      if (!offersFetched) loadOffers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, bookingsFetched]);

  function loadAmcPayments() {
    setAmcPaymentsLoading(true);
    api.get<{ data: { payments: AmcPayment[] } }>(`/clients/${id}/amc-payments`)
      .then(res => { setAmcPayments(res?.data?.payments ?? []); setAmcPaymentsFetched(true); setAmcPaymentsLoading(false); })
      .catch(() => { setAmcPayments([]); setAmcPaymentsFetched(true); setAmcPaymentsLoading(false); });
  }

  useEffect(() => {
    if (tab === "amc-chart" && !amcPaymentsFetched) loadAmcPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, amcPaymentsFetched]);

  async function handleSaveAmcPayment() {
    if (!membership) return;
    if (!amcForm.year_number) { setAmcError("Please select a year."); return; }
    if (amcForm.is_received && !amcForm.payment_date) { setAmcError("Please enter the date of receiving."); return; }
    setAmcSaving(true); setAmcError("");
    try {
      await api.post(`/clients/${id}/amc-payments`, {
        membership_id: membership.membership_id,
        year_number:   Number(amcForm.year_number),
        is_received:   amcForm.is_received,
        payment_date:  amcForm.is_received ? amcForm.payment_date || null : null,
        payment_mode:  amcForm.is_received ? amcForm.payment_mode || null : null,
      });
      setShowAmcModal(false);
      setAmcForm({ year_number: "", is_received: false, payment_date: "", payment_mode: "" });
      loadAmcPayments();
    } catch (err: unknown) {
      setAmcError(err instanceof Error ? err.message : "Failed to save.");
    } finally { setAmcSaving(false); }
  }

  async function handleSendWelcomeMail() {
    if (!welcomeMailForm.subject.trim() || !welcomeMailForm.bodyText.trim()) {
      setWelcomeMailError("Please provide both subject and body.");
      return;
    }
    setWelcomeMailSending(true);
    setWelcomeMailError("");
    try {
      const res: any = await api.post(`/clients/${id}/send-welcome-mail`, welcomeMailForm);
      if (res && res.success === false) {
        throw new Error(res.message || "Failed to send email");
      }
      setShowWelcomeMailModal(false);
      setWelcomeMailForm({ subject: "", bodyText: "" });
      setClient(prev => prev ? { ...prev, is_welcome_mail_sent: true } : null);
      loadData();
      alert("Welcome mail sent successfully");
    } catch (err: any) {
      setWelcomeMailError(err.message || "Failed to send email");
    } finally {
      setWelcomeMailSending(false);
    }
  }

  function loadPayments() {
    setPaymentsLoading(true);
    api.get<{ data: { payments: PaymentRecord[] } }>(`/clients/${id}/payments`)
      .then(res => { setPaymentRecords(res?.data?.payments ?? []); setPaymentsFetched(true); setPaymentsLoading(false); })
      .catch(() => { setPaymentRecords([]); setPaymentsFetched(true); setPaymentsLoading(false); });
  }

  useEffect(() => {
    if (tab === "payment-chart" && !paymentsFetched) loadPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, paymentsFetched]);

  const [sendingInvoice, setSendingInvoice] = useState(false);

  async function handleSendInvoice() {
    if (!client) return;
    setSendingInvoice(true);
    try {
      const activePayments = paymentRecords.filter(p => p.status !== "CANCELLED");
      const totalAmc = membership ? amcPayments.filter(p => p.is_received).reduce((s, p) => s + Number((p.amount ?? membership.amc) || 0), 0) : 0;
      const totalPaid = activePayments.reduce((s, p) => s + Number(p.amount), 0) + totalAmc;
      const lastPayment = activePayments.length > 0 ? activePayments[0] : null;

      const payload = {
        invoice_no: `INV-${client.client_id}-${Math.floor(1000 + Math.random() * 9000)}`,
        issue_date: new Date().toISOString().split('T')[0],
        client_name: [client.first_name, client.last_name].filter(Boolean).join(" "),
        card_number: membership?.membership_number || "",
        email: client.email,
        phone: client.mobile,
        address: address ? [address.address_line1, address.city, address.state, address.country].filter(Boolean).join(", ") : "",
        payment_mode: lastPayment?.payment_mode || "CASH",
        payment_type: "Cash",
        transaction_id: lastPayment?.transaction_id || "",
        bank: lastPayment?.bank_name || "",
        amount: String(totalPaid),
        description: "Holiday Package (Sheet Attached For Details)",
        state: address?.state || "",
        invoice_type: "invoice"
      };

      const res: any = await api.post(`/clients/${id}/invoice`, payload);
      if (res && res.success === false) {
        throw new Error(res.message || "Failed to send invoice");
      }
      alert("Invoice sent successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to send invoice");
    } finally {
      setSendingInvoice(false);
    }
  }

  useEffect(() => {
    if (tab === "call-recordings" && !callRecordingsFetched) loadCallRecordings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, callRecordingsFetched]);

  useEffect(() => {
    if (tab === "kyc-documents" && !kycDocumentsFetched) loadKycDocuments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, kycDocumentsFetched]);

  async function handleAddPayment() {
    if (!membership) return;
    if (!paymentForm.amount || !paymentForm.payment_date) {
      setPaymentError("Amount and payment date are required."); return;
    }
    setPaymentSaving(true); setPaymentError("");
    try {
      await api.post(`/clients/${id}/payments`, {
        membership_id:   membership.membership_id,
        payment_type:    paymentForm.payment_type,
        amount:          Number(paymentForm.amount),
        payment_date:    paymentForm.payment_date,
        due_date:        paymentForm.due_date || null,
        payment_mode:    paymentForm.payment_mode,
        transaction_ref: paymentForm.transaction_ref || null,
        bank_name:       paymentForm.bank_name || null,
        status:          paymentForm.status,
        remarks:         paymentForm.remarks || null,
      });
      setShowPaymentModal(false);
      setPaymentForm(emptyPaymentForm);
      loadPayments();
      loadData();
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : "Failed to record payment.");
    } finally { setPaymentSaving(false); }
  }

  function calcNights(checkIn: string, checkOut: string): number {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(diff / 86400000));
  }

  function setBF(k: string, v: string) { setBookingForm(f => ({ ...f, [k]: v })); }

  function toggleOffer(offer_id: number) {
    setSelectedOfferIds(ids =>
      ids.includes(offer_id) ? ids.filter(x => x !== offer_id) : [...ids, offer_id],
    );
  }

  async function handleCreateBooking() {
    if (!membership) return;
    if (!bookingForm.check_in || !bookingForm.check_out || !bookingForm.hotel_name) {
      setBookingError("Check-in, check-out and hotel name are required."); return;
    }
    const nights = bookingNights ?? calcNights(bookingForm.check_in, bookingForm.check_out);
    if (nights <= 0) { setBookingError("Check-out must be after check-in."); return; }

    if (selectedYearIdx === null) { setBookingError("Please select the membership year."); return; }
    const allYearRows = buildYearRows(membership);
    const targetYear = allYearRows[selectedYearIdx];
    if (targetYear) {
      const checkInDate = new Date(bookingForm.check_in);
      if (checkInDate < targetYear.from || checkInDate > targetYear.to) {
        setBookingError(`Check-in must be within Year ${targetYear.year} (${fmtD(targetYear.from)} → ${fmtD(targetYear.to)}).`);
        return;
      }
    }
    if (bookingForm.night_type === "MEMBERSHIP") {
      const available = membership.nights_remaining ?? 0;
      if (nights > available) {
        setBookingError(`Only ${available} night${available !== 1 ? "s" : ""} remaining — cannot book ${nights} nights.`);
        return;
      }
    }

    setBookingSaving(true); setBookingError("");
    try {
      await api.post(`/clients/${id}/bookings`, {
        membership_id:         membership.membership_id,
        assist_by:             bookingForm.assist_by || null,
        contact_number:        bookingForm.contact_number || null,
        check_in:              bookingForm.check_in,
        check_out:             bookingForm.check_out,
        nights,
        no_of_rooms:           Number(bookingForm.no_of_rooms || 1),
        no_of_adults:          Number(bookingForm.no_of_adults || 1),
        children:              Number(bookingForm.children || 0),
        booking_type:          bookingForm.booking_type || null,
        hotel_name:            bookingForm.hotel_name,
        hotel_address:         bookingForm.hotel_address || null,
        hotel_contact:         bookingForm.hotel_contact || null,
        confirmation_number:   bookingForm.confirmation_number || null,
        booking_amount:        bookingForm.booking_amount ? Number(bookingForm.booking_amount) : null,
        room_category:         bookingForm.room_category || null,
        remark:                bookingForm.remark || null,
        night_type:            bookingForm.night_type,
        redeemed_offer_ids:    selectedOfferIds.length ? selectedOfferIds : null,
        amount_paid_by_client: Number(bookingForm.amount_paid_by_client || 0),
        note:                  bookingForm.note || null,
      });
      setShowBookingModal(false);
      setBookingForm(emptyBookingForm);
      setSelectedOfferIds([]);
      setSelectedYearIdx(null);
      setBookingNights(null);
      loadData();
      loadBookings();
      if (offersFetched) loadOffers();
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Failed to create booking.");
    } finally { setBookingSaving(false); }
  }

  async function handleCancelBooking(booking_id: number) {
    setCancellingId(booking_id);
    try {
      await api.delete(`/clients/${id}/bookings/${booking_id}`);
      loadData();
      loadBookings();
      if (offersFetched) loadOffers();
    } finally { setCancellingId(null); }
  }

  async function handleAddOffer() {
    if (!newOffer.offer_name.trim()) return;
    setAddingOffer(true);
    try {
      await api.post(`/clients/${id}/offers`, {
        offer_name: newOffer.offer_name.trim(),
        valid_until: newOffer.valid_until || null,
      });
      setNewOffer({ offer_name: "", valid_until: "" });
      loadOffers();
    } finally { setAddingOffer(false); }
  }

  async function handleDeleteOffer(offer_id: number) {
    setDeletingId(offer_id);
    try {
      await api.delete(`/clients/${id}/offers/${offer_id}`);
      setOffers(o => o.filter(x => x.offer_id !== offer_id));
    } finally { setDeletingId(null); }
  }

  function loadCallRecordings() {
    setCallRecordingsLoading(true);
    api.get<{ data: { recordings: CallRecording[] } }>(`/clients/${id}/call-recordings`)
      .then(res => { setCallRecordings(res?.data?.recordings ?? []); setCallRecordingsFetched(true); setCallRecordingsLoading(false); })
      .catch(() => { setCallRecordings([]); setCallRecordingsFetched(true); setCallRecordingsLoading(false); });
  }

  function loadKycDocuments() {
    setKycDocumentsLoading(true);
    api.get<{ data: { documents: KycDocument[] } }>(`/clients/${id}/kyc-documents`)
      .then(res => { setKycDocuments(res?.data?.documents ?? []); setKycDocumentsFetched(true); setKycDocumentsLoading(false); })
      .catch(() => { setKycDocuments([]); setKycDocumentsFetched(true); setKycDocumentsLoading(false); });
  }

  async function handleAddCallRecording() {
    if (!callNote.trim()) { setCallError("Please enter a note or title."); return; }
    if (!callFile) { setCallError("Please select an MP3 file."); return; }
    setCallSaving(true); setCallError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const fd = new FormData();
      fd.append("note", callNote.trim());
      fd.append("file", callFile);
      const res = await fetch(`/api/clients/${id}/call-recordings`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j?.message ?? "Upload failed"); }
      setShowCallModal(false); setCallNote(""); setCallFile(null);
      loadCallRecordings();
    } catch (err) {
      setCallError(err instanceof Error ? err.message : "Upload failed.");
    } finally { setCallSaving(false); }
  }

  async function handleAddKycDocument() {
    if (!kycTitle.trim()) { setKycError("Please enter a document title."); return; }
    if (!kycFile) { setKycError("Please select a PDF file."); return; }
    setKycSaving(true); setKycError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const fd = new FormData();
      fd.append("title", kycTitle.trim());
      fd.append("file", kycFile);
      const res = await fetch(`/api/clients/${id}/kyc-documents`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j?.message ?? "Upload failed"); }
      setShowKycModal(false); setKycTitle(""); setKycFile(null);
      loadKycDocuments();
    } catch (err) {
      setKycError(err instanceof Error ? err.message : "Upload failed.");
    } finally { setKycSaving(false); }
  }

  function openEdit() {
    if (!client) return;
    setEditForm({
      title:                client.title               ?? "",
      first_name:           client.first_name,
      middle_name:          client.middle_name          ?? "",
      last_name:            client.last_name,
      gender:               client.gender,
      mobile:               client.mobile,
      alternate_mobile:     client.alternate_mobile     ?? "",
      email:                client.email,
      country_code:         client.country_code,
      spouse_name:          client.spouse_name          ?? "",
      marriage_anniversary: client.marriage_anniversary ? client.marriage_anniversary.slice(0, 10) : "",
      date_of_birth:        client.date_of_birth        ? client.date_of_birth.slice(0, 10) : "",
      status:               client.status,
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

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  if (!client) return <p className="text-slate-500">Client not found.</p>;

  const fullName = [client.title, client.first_name, client.middle_name, client.last_name].filter(Boolean).join(" ");

  return (
    <div className="space-y-5 max-w-7xl">
      <Link href="/admin/clients" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-slate-900 font-bold text-lg leading-tight">{fullName}</h2>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  client.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {client.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm">{client.email}</p>
              {membership?.membership_number && (
                <p className="text-xs font-mono text-blue-500 mt-0.5">{membership.membership_number}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => {
                  setWelcomeMailForm({ subject: "Welcome to Peltown Vacations!", bodyText: `Dear ${fullName},\n\nWelcome to Peltown Vacations!\n\nBest regards,\nPeltown Vacations Team` });
                  setWelcomeMailError("");
                  setShowWelcomeMailModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> Welcome Mail
              </button>
              {client.is_welcome_mail_sent ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-1" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 ml-1" />
              )}
            </div>
            <button onClick={openEdit} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
              <Pencil className="w-3 h-3" /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200">
          {TABS.map(({ id: tid, label, icon: Icon }) => (
            <button
              key={tid}
              onClick={() => setTab(tid)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                tab === tid
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "all-details" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-2">

              {/* Column 1 — Personal */}
              <div>
                <Section title="Personal" />
                <Row label="Title"             value={client.title} />
                <Row label="First Name"        value={client.first_name} />
                <Row label="Middle Name"       value={client.middle_name} />
                <Row label="Last Name"         value={client.last_name} />
                <Row label="Gender"            value={client.gender} />
                <Row label="Date of Birth"     value={fmtDate(client.date_of_birth)} />
                <Row label="Spouse Name"       value={client.spouse_name} />
                <Row label="Anniversary"       value={fmtDate(client.marriage_anniversary)} />
                <Row label="Status"            value={client.status} />
                <Row label="Member Since"      value={fmtDate(client.created_at)} />

                <Section title="Contact" />
                <Row label="Email"             value={client.email} />
                <Row label="Mobile"            value={`${client.country_code} ${client.mobile}`} />
                <Row label="Alternate Mobile"  value={client.alternate_mobile} />
              </div>

              {/* Column 2 — Address */}
              <div>
                <Section title="Primary Address" />
                <Row label="Address"    value={address?.primary_address} />
                <Row label="State"      value={address?.primary_state} />
                <Row label="Pin Code"   value={address?.primary_pincode} />

                <Section title="Secondary Address" />
                <Row label="Address"    value={address?.secondary_address} />
                <Row label="State"      value={address?.secondary_state} />
                <Row label="Pin Code"   value={address?.secondary_pincode} />
              </div>

              {/* Column 3 — Membership */}
              <div>
                <Section title="Membership" />
                <Row label="Membership No"      value={membership?.membership_number} />
                <Row label="Package"            value={membership?.package_name} />
                <Row label="Status"             value={membership?.status} />
                <Row label="Validity"           value={membership?.validity_years != null ? `${membership.validity_years} yr${membership.validity_years !== 1 ? "s" : ""}` : null} />
                <Row label="Nights / Year"      value={membership?.nights_per_year} />
                <Row label="Nights Remaining"   value={membership?.nights_remaining} />
                <Row label="Sale Date"          value={fmtDate(membership?.sale_date)} />
                <Row label="Expiry Date"        value={fmtDate(membership?.end_date)} />

                <Section title="Sales Details" />
                <Row label="Sales Consultant"   value={membership?.sales_consultant} />
                <Row label="Take-Over Manager"  value={membership?.take_over_manager} />
                <Row label="DSA"                value={membership?.dsa} />
                <Row label="Reference By"       value={membership?.reference_by} />
                <Row label="Remarks"            value={membership?.remarks} />
              </div>

            </div>
          )}

          {tab === "holiday-chart" && (() => {
            if (!membership) return (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CalendarDays className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-slate-500 font-medium text-sm">No membership found</p>
              </div>
            );
            const rows = buildYearRows(membership);
            function nightsUsed(r: YearRow) {
              return bookings
                .filter(b => b.status !== "CANCELLED" && b.night_type === "MEMBERSHIP" &&
                  new Date(b.check_in) >= r.from && new Date(b.check_in) <= r.to)
                .reduce((s, b) => s + b.nights, 0);
            }
            return (
              <div className="space-y-6">
                {/* Year chart */}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Year-by-Year Breakdown</p>
                  <button
                    onClick={() => { setBookingForm(emptyBookingForm); setBookingNights(null); setSelectedOfferIds([]); setSelectedYearIdx(null); setBookingError(""); setShowBookingModal(true); }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Create Booking
                  </button>
                </div>
                {bookingsLoading && (
                  <div className="flex justify-center py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  </div>
                )}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-16">Year</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Period / Hotel</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-32">Entitled</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-28">Used</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-28">Remaining</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-48">Status / Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(r => {
                        const entitled = membership.nights_per_year ?? 0;
                        const used = nightsUsed(r);
                        const remaining = Math.max(0, entitled - used);
                        const yearBookings = bookings.filter(b =>
                          new Date(b.check_in) >= r.from && new Date(b.check_in) <= r.to
                        );
                        return (
                          <Fragment key={r.year}>
                            <tr className={`border-b border-slate-100 transition-colors ${r.status === "current" ? "bg-emerald-50/40" : "hover:bg-slate-50"}`}>
                              <td className="px-4 py-3.5">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-600">{r.year}</span>
                              </td>
                              <td className="px-4 py-3.5 text-slate-700">
                                <span className="font-medium">{fmtD(r.from)}</span>
                                <span className="text-slate-400 mx-2">→</span>
                                <span className="font-medium">{fmtD(r.to)}</span>
                              </td>
                              <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">{entitled} nights</td>
                              <td className="px-4 py-3.5">
                                <span className={`text-sm font-semibold ${used > 0 ? "text-orange-600" : "text-slate-400"}`}>{used} nights</span>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`text-sm font-bold ${remaining === 0 ? "text-red-500" : "text-emerald-600"}`}>{remaining} nights</span>
                              </td>
                              <td className="px-4 py-3.5"><YearBadge status={r.status} /></td>
                            </tr>
                            {yearBookings.map(b => (
                              <tr key={b.booking_id} className={`border-b border-slate-100 border-l-4 transition-colors ${
                                b.status === "CANCELLED" ? "border-l-red-200 bg-slate-50/50 opacity-50" :
                                b.status === "CONFIRMED" ? "border-l-orange-500 bg-orange-100 hover:bg-orange-200" :
                                "border-l-orange-300 bg-orange-50/20 hover:bg-orange-50/40"
                              }`}>
                                <td className="pl-8 pr-4 py-2.5">
                                  <div className="flex items-center gap-2">
                                    {b.status === "CONFIRMED" && (
                                      <span className="px-1.5 py-0.5 rounded bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">Used</span>
                                    )}
                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-light ${
                                      b.status === "CONFIRMED" ? "bg-orange-200 text-orange-700" :
                                      "bg-orange-100 text-orange-400"
                                    }`}>↳</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2.5 text-slate-600">
                                  <span className="font-medium text-xs">{fmtDate(b.check_in)}</span>
                                  <span className="text-slate-400 mx-1.5">→</span>
                                  <span className="font-medium text-xs">{fmtDate(b.check_out)}</span>
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className="text-xs font-medium text-slate-700">{b.hotel_name}</span>
                                  {b.hotel_address && <span className="text-xs text-slate-400 ml-1">· {b.hotel_address}</span>}
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className="text-xs font-bold text-orange-600">{b.nights} night{b.nights !== 1 ? "s" : ""}</span>
                                </td>
                                <td className="px-4 py-2.5"></td>
                                <td className="px-4 py-2.5">
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    b.status === "CONFIRMED"  ? "bg-emerald-100 text-emerald-700" :
                                    b.status === "COMPLETED"  ? "bg-slate-200 text-slate-700" :
                                    "bg-red-100 text-red-600"
                                  }`}>{b.status}</span>
                                </td>
                              </tr>
                            ))}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {tab === "amc-chart" && (() => {
            if (!membership) return (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Wrench className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-slate-500 font-medium text-sm">No membership found</p>
              </div>
            );

            const rows = buildYearRows(membership);
            return (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">AMC Chart</p>
                  <button
                    onClick={() => { setAmcForm({ year_number: "", is_received: false, payment_date: "", payment_mode: "" }); setAmcError(""); setShowAmcModal(true); }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Update AMC
                  </button>
                </div>

                {amcPaymentsLoading && (
                  <div className="flex justify-center py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  </div>
                )}

                {/* AMC table */}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Years</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-40">Package</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-28">Received</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-44">Date Of Receiving</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Mode Of Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.map(r => {
                        const pmt = amcPayments.find(p => p.year_number === r.year);
                        const received = pmt?.is_received ?? false;
                        return (
                          <tr key={r.year} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{fmtAmcDate(r.from)}</td>
                            <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{fmtAmcAmt(pmt?.amount ?? membership.amc)}</td>
                            <td className="px-4 py-3.5">
                              {received ? (
                                <span className="text-sm font-semibold text-emerald-600">Yes</span>
                              ) : (
                                <span className="text-sm font-semibold text-red-500">No</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-slate-600">
                              {pmt?.payment_date ? fmtDate(pmt.payment_date) : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-slate-600">
                              {pmt?.payment_mode ?? <span className="text-slate-300">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {tab === "offers-chart" && (
            <div className="space-y-5">
              {/* Add offer inline form */}
              <div className="flex items-end gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Offer Name</label>
                  <input
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={newOffer.offer_name}
                    onChange={e => setNewOffer(o => ({ ...o, offer_name: e.target.value }))}
                    placeholder="e.g. Free Room Upgrade, Complimentary Breakfast…"
                    onKeyDown={e => { if (e.key === "Enter") handleAddOffer(); }}
                  />
                </div>
                <div className="w-48">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Valid Until</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={newOffer.valid_until}
                    onChange={e => setNewOffer(o => ({ ...o, valid_until: e.target.value }))}
                  />
                </div>
                <button
                  onClick={handleAddOffer}
                  disabled={addingOffer || !newOffer.offer_name.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
                >
                  {addingOffer ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Offer
                </button>
              </div>

              {/* Offers table */}
              {offersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              ) : offers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                    <Tag className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium text-sm">No offers yet</p>
                  <p className="text-slate-400 text-xs mt-1">Add an offer using the form above</p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-8">#</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Offer Name</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-40">Valid Until</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-28">Status</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-24">Added On</th>
                        <th className="px-4 py-3 w-12" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {offers.map((offer, i) => {
                        const isRedeemed = offer.is_redeemed;
                        const isExpired = !isRedeemed && offer.valid_until
                          ? new Date(offer.valid_until) < new Date(new Date().toDateString())
                          : false;
                        const expiringSoon = !isRedeemed && !isExpired && offer.valid_until
                          ? (new Date(offer.valid_until).getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000
                          : false;
                        return (
                          <tr key={offer.offer_id} className={`transition-colors ${isRedeemed ? "bg-purple-50/30" : "hover:bg-slate-50"}`}>
                            <td className="px-4 py-3 text-xs text-slate-400">{i + 1}</td>
                            <td className={`px-4 py-3 font-medium ${isRedeemed ? "text-slate-400 line-through" : "text-slate-800"}`}>{offer.offer_name}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {offer.valid_until ? fmtDate(offer.valid_until) : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-4 py-3">
                              {isRedeemed ? (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">Redeemed</span>
                              ) : isExpired ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                                  <AlertCircle className="w-3 h-3" /> Expired
                                </span>
                              ) : expiringSoon ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                                  Expiring Soon
                                </span>
                              ) : (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-400">{fmtDate(offer.created_at)}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDeleteOffer(offer.offer_id)}
                                disabled={deletingId === offer.offer_id}
                                className="p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                {deletingId === offer.offer_id
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : <Trash2 className="w-4 h-4" />}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {tab === "payment-chart" && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">Payment Chart</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSendInvoice}
                    disabled={sendingInvoice}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 disabled:opacity-60 transition-colors"
                  >
                    {sendingInvoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    {sendingInvoice ? "Sending..." : "Send Invoice"}
                  </button>
                  <button
                    onClick={() => { setPaymentForm(emptyPaymentForm); setPaymentError(""); setShowPaymentModal(true); }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Payment Record
                  </button>
                </div>
              </div>

              {paymentsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /></div>
              ) : paymentRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <CreditCard className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-slate-500 text-sm font-medium">No payment records yet</p>
                  <p className="text-slate-400 text-xs mt-1">Click &ldquo;Add Payment Record&rdquo; to add one</p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-200">
                      <tr>
                        <th className="text-left font-bold text-slate-700 px-5 py-4">Payment For</th>
                        <th className="text-left font-bold text-slate-700 px-5 py-4 w-40">Receiving Date</th>
                        <th className="text-left font-bold text-slate-700 px-5 py-4 w-44">Mode Of Payment</th>
                        <th className="text-left font-bold text-slate-700 px-5 py-4 w-36">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentRecords.filter(p => p.status !== "CANCELLED").map(p => (
                        <tr key={p.payment_id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-4 text-teal-600 font-medium">
                            {p.remarks || paymentTypeLabel(p.payment_type)}
                          </td>
                          <td className="px-5 py-4 text-teal-600">{fmtPayDate(p.payment_date as string)}</td>
                          <td className="px-5 py-4 text-slate-700">
                            {p.bank_name || p.payment_mode.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                          </td>
                          <td className="px-5 py-4 text-slate-800 font-medium">{fmtAmcAmt(p.amount)}</td>
                        </tr>
                      ))}
                      {membership && amcPayments.filter(p => p.is_received).map(p => {
                        const yearRow = buildYearRows(membership).find(r => r.year === p.year_number);
                        return (
                          <tr key={`amc-${p.amc_payment_id}`} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-4 text-teal-600 font-medium">
                              AMC Payment {yearRow ? `(${fmtAmcDate(yearRow.from)})` : `(Year ${p.year_number})`}
                            </td>
                            <td className="px-5 py-4 text-teal-600">{p.payment_date ? fmtPayDate(p.payment_date) : "—"}</td>
                            <td className="px-5 py-4 text-slate-700">
                              {p.payment_mode ? p.payment_mode.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "—"}
                            </td>
                            <td className="px-5 py-4 text-slate-800 font-medium">{fmtAmcAmt((p.amount ?? membership.amc) || 0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100/80 border-t border-slate-200">
                        <td colSpan={3} className="px-5 py-4 text-right font-bold text-slate-700">Total</td>
                        <td className="px-5 py-4 font-bold text-slate-800">
                          {fmtAmcAmt(
                            paymentRecords.filter(p => p.status !== "CANCELLED").reduce((s, p) => s + Number(p.amount), 0) +
                            (membership ? amcPayments.filter(p => p.is_received).reduce((s, p) => s + Number((p.amount ?? membership.amc) || 0), 0) : 0)
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}
          {tab === "call-recordings" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">Call Recordings</h3>
                <button
                  onClick={() => { setCallNote(""); setCallFile(null); setCallError(""); setShowCallModal(true); }}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Recording
                </button>
              </div>
              {callRecordingsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-violet-500" /></div>
              ) : callRecordings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <PhoneCall className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-slate-500 text-sm font-medium">No recordings yet</p>
                  <p className="text-slate-400 text-xs mt-1">Click &ldquo;Add Recording&rdquo; to upload one</p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-8">#</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Note</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-56">File</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-36">Added On</th>
                        <th className="px-4 py-3 w-24" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {callRecordings.map((r, i) => (
                        <tr key={r.call_recording_id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-xs text-slate-400">{i + 1}</td>
                          <td className="px-4 py-3 text-slate-800 font-medium">{r.note}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 text-xs text-violet-700 font-medium bg-violet-50 px-2.5 py-1 rounded-full">
                              <PhoneCall className="w-3 h-3" /> {r.file_name}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400">{fmtDate(r.created_at)}</td>
                          <td className="px-4 py-3 text-right">
                            <a href={r.file_path} download={r.file_name}
                              className="text-xs font-medium text-violet-600 hover:text-violet-800 hover:underline">
                              Download
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {tab === "kyc-documents" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">KYC Documents</h3>
                <button
                  onClick={() => { setKycTitle(""); setKycFile(null); setKycError(""); setShowKycModal(true); }}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Document
                </button>
              </div>
              {kycDocumentsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-indigo-500" /></div>
              ) : kycDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <FileCheck className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-slate-500 text-sm font-medium">No documents yet</p>
                  <p className="text-slate-400 text-xs mt-1">Click &ldquo;Add Document&rdquo; to upload one</p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-8">#</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Document Title</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-56">File</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-36">Added On</th>
                        <th className="px-4 py-3 w-16" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {kycDocuments.map((d, i) => (
                        <tr key={d.kyc_document_id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-xs text-slate-400">{i + 1}</td>
                          <td className="px-4 py-3 text-slate-800 font-medium">{d.title}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 text-xs text-indigo-700 font-medium bg-indigo-50 px-2.5 py-1 rounded-full">
                              <FileCheck className="w-3 h-3" /> {d.file_name}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400">{fmtDate(d.created_at)}</td>
                          <td className="px-4 py-3 text-right">
                            <a href={d.file_path} target="_blank" rel="noreferrer"
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <Modal open={showBookingModal} onClose={() => setShowBookingModal(false)} title="Create Booking" size="lg">
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Client info (read-only) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Client&apos;s ID</label>
              <input className={`${inp} bg-slate-50 text-slate-500`} readOnly value={membership?.membership_number ?? "—"} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Client</label>
              <input className={`${inp} bg-slate-50 text-slate-500`} readOnly
                value={[client?.first_name, client?.last_name].filter(Boolean).join(" ")} />
            </div>
          </div>

          {/* Membership year selector */}
          {(() => {
            const yrs = membership ? buildYearRows(membership) : [];
            if (!yrs.length) return null;
            return (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Membership Year <span className="text-red-500">*</span>
                </label>
                <select
                  className={`${inp} bg-white`}
                  value={selectedYearIdx ?? ""}
                  onChange={e => {
                    setSelectedYearIdx(e.target.value !== "" ? Number(e.target.value) : null);
                    setBF("check_in", ""); setBF("check_out", ""); setBookingNights(null);
                  }}
                >
                  <option value="">— select year —</option>
                  {yrs.map((r, i) => (
                    <option key={i} value={i}>Year {r.year} · {fmtD(r.from)} → {fmtD(r.to)}</option>
                  ))}
                </select>
              </div>
            );
          })()}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Assist By</label>
              <input className={inp} value={bookingForm.assist_by} onChange={e => setBF("assist_by", e.target.value)} placeholder="Staff name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Contact Number</label>
              <input className={inp} value={bookingForm.contact_number} onChange={e => setBF("contact_number", e.target.value)} placeholder="Contact" />
            </div>
          </div>

          {/* Dates + nights calculator */}
          {(() => {
            const yrs = membership ? buildYearRows(membership) : [];
            const yr = selectedYearIdx !== null ? yrs[selectedYearIdx] : null;
            const minDate = yr ? yr.from.toISOString().slice(0, 10) : undefined;
            const maxDate = yr ? yr.to.toISOString().slice(0, 10) : undefined;
            return (
              <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Check In <span className="text-red-500">*</span></label>
                  <input type="date" className={inp} value={bookingForm.check_in} min={minDate} max={maxDate}
                    onChange={e => { setBF("check_in", e.target.value); setBookingNights(null); }} />
                  {yr && <p className="text-xs text-slate-400 mt-0.5">{fmtD(yr.from)} – {fmtD(yr.to)}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Check Out <span className="text-red-500">*</span></label>
                  <input type="date" className={inp} value={bookingForm.check_out} min={minDate} max={maxDate}
                    onChange={e => { setBF("check_out", e.target.value); setBookingNights(null); }} />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => { const n = calcNights(bookingForm.check_in, bookingForm.check_out); setBookingNights(n); }}
                    className="px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    Check
                  </button>
                  {bookingNights !== null && (
                    <span className="text-sm font-bold text-blue-600 whitespace-nowrap">{bookingNights} nights</span>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Rooms</label>
              <input type="number" min="1" className={inp} value={bookingForm.no_of_rooms} onChange={e => setBF("no_of_rooms", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Adults</label>
              <input type="number" min="1" className={inp} value={bookingForm.no_of_adults} onChange={e => setBF("no_of_adults", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Children</label>
              <input type="number" min="0" className={inp} value={bookingForm.children} onChange={e => setBF("children", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Booking Type</label>
              <input className={inp} value={bookingForm.booking_type} onChange={e => setBF("booking_type", e.target.value)} placeholder="e.g. with Breakfast" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Hotel Name <span className="text-red-500">*</span></label>
            <input className={inp} value={bookingForm.hotel_name} onChange={e => setBF("hotel_name", e.target.value)} placeholder="Hotel name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Hotel Address</label>
              <input className={inp} value={bookingForm.hotel_address} onChange={e => setBF("hotel_address", e.target.value)} placeholder="Address" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Hotel Contact</label>
              <input className={inp} value={bookingForm.hotel_contact} onChange={e => setBF("hotel_contact", e.target.value)} placeholder="Phone" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Confirmation Number</label>
              <input className={inp} value={bookingForm.confirmation_number} onChange={e => setBF("confirmation_number", e.target.value)} placeholder="Hotel confirmation ref" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Booking Amount <span className="text-slate-400 font-normal">(internal)</span></label>
              <input type="number" min="0" className={inp} value={bookingForm.booking_amount} onChange={e => setBF("booking_amount", e.target.value)} placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Room Category</label>
            <input className={inp} value={bookingForm.room_category} onChange={e => setBF("room_category", e.target.value)} placeholder="e.g. Luxury Room, Studio Room…" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Remark</label>
            <input className={inp} value={bookingForm.remark} onChange={e => setBF("remark", e.target.value)} placeholder="Remark" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-600">Night Type</label>
              {bookingForm.night_type === "MEMBERSHIP" && membership?.nights_remaining != null && (
                <span className={`text-xs font-semibold ${(membership.nights_remaining ?? 0) === 0 ? "text-red-500" : "text-emerald-600"}`}>
                  {membership.nights_remaining} night{membership.nights_remaining !== 1 ? "s" : ""} remaining
                </span>
              )}
            </div>
            <select className={`${inp} bg-white`} value={bookingForm.night_type} onChange={e => setBF("night_type", e.target.value)}>
              <option value="MEMBERSHIP">Membership Night (deduct from holiday chart)</option>
              <option value="COMPLIMENTARY">Complimentary</option>
              <option value="EXTRA">Extra</option>
            </select>
          </div>

          {/* Offer deduction */}
          {offers.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Offer Deduction Against</p>
              <div className="space-y-1.5 bg-slate-50 rounded-lg p-3 border border-slate-200">
                {offers.filter(o => !o.is_redeemed).map(o => (
                  <label key={o.offer_id} className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedOfferIds.includes(o.offer_id)}
                      onChange={() => toggleOffer(o.offer_id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{o.offer_name}</span>
                    {o.valid_until && <span className="text-xs text-slate-400">valid till {fmtDate(o.valid_until)}</span>}
                  </label>
                ))}
                {offers.every(o => o.is_redeemed) && (
                  <p className="text-xs text-slate-400">All offers already redeemed</p>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Amount Paid by Client</label>
              <input type="number" min="0" className={inp} value={bookingForm.amount_paid_by_client} onChange={e => setBF("amount_paid_by_client", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Note</label>
              <input className={inp} value={bookingForm.note} onChange={e => setBF("note", e.target.value)} placeholder="Internal note" />
            </div>
          </div>

          {bookingError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{bookingError}</p>}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowBookingModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={handleCreateBooking} disabled={bookingSaving}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
            {bookingSaving && <Loader2 className="w-4 h-4 animate-spin" />} Create Booking
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      {/* Add Payment Modal */}
      <Modal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Add Payment Record" size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Payment For <span className="text-red-500">*</span></label>
            <input className={inp} value={paymentForm.remarks}
              onChange={e => setPaymentForm(f => ({ ...f, remarks: e.target.value }))}
              placeholder="e.g. Holiday Package (Sheet Attached For Details)" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Amount <span className="text-red-500">*</span></label>
              <input type="number" min="0" step="0.01" className={inp} value={paymentForm.amount}
                onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Receiving Date <span className="text-red-500">*</span></label>
              <input type="date" className={inp} value={paymentForm.payment_date}
                onChange={e => setPaymentForm(f => ({ ...f, payment_date: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Mode of Payment <span className="text-red-500">*</span></label>
              <select className={`${inp} bg-white`} value={paymentForm.payment_mode} onChange={e => setPaymentForm(f => ({ ...f, payment_mode: e.target.value }))}>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="ONLINE">Online</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CARD">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Payment Gateway / Bank Name</label>
              <input className={inp} value={paymentForm.bank_name}
                onChange={e => setPaymentForm(f => ({ ...f, bank_name: e.target.value }))} placeholder="e.g. Razorpay, HDFC Bank…" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Transaction Ref</label>
              <input className={inp} value={paymentForm.transaction_ref}
                onChange={e => setPaymentForm(f => ({ ...f, transaction_ref: e.target.value }))} placeholder="Cheque no / UTR / Ref no" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Payment Type</label>
              <select className={`${inp} bg-white`} value={paymentForm.payment_type} onChange={e => setPaymentForm(f => ({ ...f, payment_type: e.target.value }))}>
                <option value="DOWN_PAYMENT">Down Payment</option>
                <option value="INSTALMENT">Instalment</option>
                <option value="AMC">AMC</option>
                <option value="PENALTY">Penalty</option>
                <option value="REFUND">Refund</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select className={`${inp} bg-white`} value={paymentForm.status} onChange={e => setPaymentForm(f => ({ ...f, status: e.target.value }))}>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label>
              <input type="date" className={inp} value={paymentForm.due_date}
                onChange={e => setPaymentForm(f => ({ ...f, due_date: e.target.value }))} />
            </div>
          </div>

          {paymentError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{paymentError}</p>}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={handleAddPayment} disabled={paymentSaving}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
            {paymentSaving && <Loader2 className="w-4 h-4 animate-spin" />} Record Payment
          </button>
        </div>
      </Modal>

      {/* Update AMC Modal */}
      <Modal open={showAmcModal} onClose={() => setShowAmcModal(false)} title="Update AMC" size="sm">
        <div className="space-y-4">
          {/* Year selector */}
          {(() => {
            const yrs = membership ? buildYearRows(membership) : [];
            return (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Year <span className="text-red-500">*</span></label>
                <select className={`${inp} bg-white`} value={amcForm.year_number}
                  onChange={e => setAmcForm(f => ({ ...f, year_number: e.target.value }))}>
                  <option value="">— select year —</option>
                  {yrs.map((r, i) => (
                    <option key={i} value={r.year}>{fmtAmcDate(r.from)}</option>
                  ))}
                </select>
              </div>
            );
          })()}

          {/* Received toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAmcForm(f => ({ ...f, is_received: !f.is_received }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${amcForm.is_received ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${amcForm.is_received ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <label className="text-sm font-medium text-slate-700">
              {amcForm.is_received ? "Payment Received" : "Not Received"}
            </label>
          </div>

          {amcForm.is_received && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date Of Receiving <span className="text-red-500">*</span></label>
                <input type="date" className={inp}
                  value={amcForm.payment_date}
                  onChange={e => setAmcForm(f => ({ ...f, payment_date: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Mode Of Payment</label>
                <input className={inp} placeholder="e.g. Cash, Cheque, UPI…"
                  value={amcForm.payment_mode}
                  onChange={e => setAmcForm(f => ({ ...f, payment_mode: e.target.value }))} />
              </div>
            </>
          )}

          {amcError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{amcError}</p>}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowAmcModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={handleSaveAmcPayment} disabled={amcSaving}
            className="px-5 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60 flex items-center gap-2">
            {amcSaving && <Loader2 className="w-4 h-4 animate-spin" />} Save
          </button>
        </div>
      </Modal>

      {/* Add Call Recording Modal */}
      <Modal open={showCallModal} onClose={() => setShowCallModal(false)} title="Add Call Recording" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Note / Title <span className="text-red-500">*</span></label>
            <input className={inp} value={callNote} onChange={e => setCallNote(e.target.value)}
              placeholder="e.g. Initial call, Follow-up, Complaint call…" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">MP3 File <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type="file" accept=".mp3,audio/mpeg,audio/*"
                className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 border border-slate-300 rounded-lg cursor-pointer"
                onChange={e => setCallFile(e.target.files?.[0] ?? null)} />
            </div>
            {callFile && <p className="text-xs text-slate-500 mt-1">Selected: {callFile.name}</p>}
          </div>
          {callError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{callError}</p>}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowCallModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={handleAddCallRecording} disabled={callSaving}
            className="px-5 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-60 flex items-center gap-2">
            {callSaving && <Loader2 className="w-4 h-4 animate-spin" />} Upload Recording
          </button>
        </div>
      </Modal>

      {/* Add KYC Document Modal */}
      <Modal open={showKycModal} onClose={() => setShowKycModal(false)} title="Add KYC Document" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Document Title <span className="text-red-500">*</span></label>
            <input className={inp} value={kycTitle} onChange={e => setKycTitle(e.target.value)}
              placeholder="e.g. Aadhaar Card, PAN Card, Passport…" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">PDF File <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type="file" accept=".pdf,application/pdf"
                className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-slate-300 rounded-lg cursor-pointer"
                onChange={e => setKycFile(e.target.files?.[0] ?? null)} />
            </div>
            {kycFile && <p className="text-xs text-slate-500 mt-1">Selected: {kycFile.name}</p>}
          </div>
          {kycError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{kycError}</p>}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowKycModal(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={handleAddKycDocument} disabled={kycSaving}
            className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2">
            {kycSaving && <Loader2 className="w-4 h-4 animate-spin" />} Upload Document
          </button>
        </div>
      </Modal>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Client" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
            <input className={inp} value={editForm.title ?? ""} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Mr / Mrs / Ms" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Gender</label>
            <select className={sel} value={editForm.gender ?? "MALE"} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))}>
              <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
            <input className={inp} value={editForm.first_name ?? ""} onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Middle Name</label>
            <input className={inp} value={editForm.middle_name ?? ""} onChange={e => setEditForm(f => ({ ...f, middle_name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
            <input className={inp} value={editForm.last_name ?? ""} onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
            <select className={sel} value={editForm.status ?? "ACTIVE"} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
              <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Country Code</label>
            <input className={inp} value={editForm.country_code ?? ""} onChange={e => setEditForm(f => ({ ...f, country_code: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Mobile</label>
            <input className={inp} value={editForm.mobile ?? ""} onChange={e => setEditForm(f => ({ ...f, mobile: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Alternate Mobile</label>
            <input className={inp} value={editForm.alternate_mobile ?? ""} onChange={e => setEditForm(f => ({ ...f, alternate_mobile: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input type="email" className={inp} value={editForm.email ?? ""} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Date of Birth</label>
            <input type="date" className={inp} value={editForm.date_of_birth ?? ""} onChange={e => setEditForm(f => ({ ...f, date_of_birth: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Spouse Name</label>
            <input className={inp} value={editForm.spouse_name ?? ""} onChange={e => setEditForm(f => ({ ...f, spouse_name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Anniversary</label>
            <input type="date" className={inp} value={editForm.marriage_anniversary ?? ""} onChange={e => setEditForm(f => ({ ...f, marriage_anniversary: e.target.value }))} />
          </div>
        </div>
        {editErr && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{editErr}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={saveEdit} disabled={editSaving} className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
            {editSaving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
          </button>
        </div>
      </Modal>

      <Modal open={showWelcomeMailModal} title="Send Welcome Mail" size="lg" onClose={() => !welcomeMailSending && setShowWelcomeMailModal(false)}>
        <div className="space-y-4 p-5 w-full">
          {welcomeMailError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {welcomeMailError}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
            <input
              className={inp}
              value={welcomeMailForm.subject}
              onChange={e => setWelcomeMailForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Email Subject"
              disabled={welcomeMailSending}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mail Content</label>
            <textarea
              className={`${inp} h-40 resize-none`}
              value={welcomeMailForm.bodyText}
              onChange={e => setWelcomeMailForm(f => ({ ...f, bodyText: e.target.value }))}
              placeholder="Type or paste mail content here..."
              disabled={welcomeMailSending}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowWelcomeMailModal(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              disabled={welcomeMailSending}
            >
              Cancel
            </button>
            <button
              onClick={handleSendWelcomeMail}
              disabled={welcomeMailSending}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-70 min-w-[100px]"
            >
              {welcomeMailSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {welcomeMailSending ? "Sending..." : "Send Mail"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
