"use client";

import { Fragment, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import Modal from "@/Components/Admin/Modal";
import {
  ArrowLeft, Loader2, User, Pencil,
  LayoutList, CalendarDays, Wrench, Tag, CreditCard, PhoneCall, FileCheck,
  Plus, Trash2, AlertCircle, Hotel, X,
} from "lucide-react";

interface Client {
  client_id: number;
  title?: string; first_name: string; middle_name?: string; last_name: string;
  gender: string; date_of_birth?: string;
  mobile: string; alternate_mobile?: string; email: string; country_code: string;
  status: string;
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
              <h2 className="text-slate-900 font-bold text-lg leading-tight">{fullName}</h2>
              <p className="text-slate-400 text-sm">{client.email}</p>
              {membership?.membership_number && (
                <p className="text-xs font-mono text-blue-500 mt-0.5">{membership.membership_number}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              client.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
            }`}>
              {client.status}
            </span>
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

                <Section title="Financials" />
                <Row label="Total Price"        value={fmt(membership?.total_price)} />
                <Row label="Discount"           value={fmt(membership?.discount_amount)} />
                <Row label="Net Price"          value={fmt(membership?.net_price)} />
                <Row label="Down Payment"       value={fmt(membership?.down_payment)} />
                <Row label="Outstanding"        value={fmt(membership?.outstanding_balance)} />
                <Row label="AMC"                value={fmt(membership?.amc)} />
                <Row label="Payment Mode"       value={membership?.payment_mode} />

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
                                b.status === "CANCELLED" ? "border-l-red-200 bg-slate-50/50 opacity-50" : "border-l-orange-300 bg-orange-50/20 hover:bg-orange-50/40"
                              }`}>
                                <td className="px-4 py-3.5">
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-400 text-base font-light">↳</span>
                                </td>
                                <td className="px-4 py-3.5 text-slate-700">
                                  <span className="font-medium text-sm">{b.hotel_name}</span>
                                  {b.room_category && <span className="text-slate-400 text-xs ml-1.5">· {b.room_category}</span>}
                                </td>
                                <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">{fmtDate(b.check_in)}</td>
                                <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">{fmtDate(b.check_out)}</td>
                                <td className="px-4 py-3.5">
                                  <span className="text-sm font-bold text-orange-600">{b.nights} night{b.nights !== 1 ? "s" : ""}</span>
                                </td>
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                                      b.night_type === "MEMBERSHIP"    ? "bg-blue-50 text-blue-700" :
                                      b.night_type === "COMPLIMENTARY" ? "bg-purple-50 text-purple-700" :
                                      "bg-slate-100 text-slate-600"
                                    }`}>{b.night_type}</span>
                                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                                      b.status === "CONFIRMED"  ? "bg-emerald-50 text-emerald-700" :
                                      b.status === "COMPLETED"  ? "bg-slate-100 text-slate-600" :
                                      "bg-red-50 text-red-500"
                                    }`}>{b.status}</span>
                                    {b.status !== "CANCELLED" && (
                                      <button onClick={() => handleCancelBooking(b.booking_id)} disabled={cancellingId === b.booking_id}
                                        title="Cancel booking"
                                        className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                                        {cancellingId === b.booking_id
                                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          : <X className="w-3.5 h-3.5" />}
                                      </button>
                                    )}
                                  </div>
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
            if (!membership.amc) return (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Wrench className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-slate-600 font-medium text-sm">No AMC configured</p>
                <p className="text-slate-400 text-xs mt-1">AMC was not set for this membership</p>
              </div>
            );
            const rows = buildYearRows(membership);
            return (
              <div className="space-y-4">
                {/* Chart table */}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-16">Year</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Period</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-36">Due Date</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-36">AMC Amount</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-32">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.map(r => (
                        <tr key={r.year} className={`transition-colors ${r.status === "current" ? "bg-amber-50/40" : "hover:bg-slate-50"}`}>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                              {r.year}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-700">
                            <span className="font-medium">{fmtD(r.from)}</span>
                            <span className="text-slate-400 mx-2">→</span>
                            <span className="font-medium">{fmtD(r.to)}</span>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-slate-600 font-medium">{fmtD(r.from)}</td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm font-semibold text-slate-800">{fmt(membership.amc)}</span>
                          </td>
                          <td className="px-4 py-3.5"><YearBadge status={r.status} /></td>
                        </tr>
                      ))}
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
          {tab === "payment-chart"   && <ComingSoon label="Mode of Payment Chart" />}
          {tab === "call-recordings" && <ComingSoon label="Call Recordings" />}
          {tab === "kyc-documents"   && <ComingSoon label="KYC Documents" />}
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
    </div>
  );
}
