"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Users, CreditCard, IndianRupee, TrendingDown, ArrowRight, Loader2 } from "lucide-react";

interface Client { client_id: number; client_code: string; first_name: string; last_name: string; email: string; status: string; created_at: string }
interface Payment { payment_id: number; payment_number: string; amount: number; payment_type: string; payment_date: string; status: string; client?: { first_name: string; last_name: string } }
interface Membership { membership_id: number; membership_number: string; outstanding_balance: number; status: string; client?: { first_name: string; last_name: string }; package?: { category: string } }

const STATUS: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700", INACTIVE: "bg-slate-100 text-slate-600",
  PAID: "bg-emerald-50 text-emerald-700", CANCELLED: "bg-red-50 text-red-600", PENDING: "bg-amber-50 text-amber-700",
};
const CAT: Record<string, string> = {
  SILVER: "bg-slate-100 text-slate-600", GOLD: "bg-amber-50 text-amber-700", PLATINUM: "bg-violet-50 text-violet-700",
};

function KPI({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-slate-900 text-2xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [totalClients, setTotalClients] = useState(0);
  const [activeMemberships, setActiveMemberships] = useState(0);
  const [recentPaymentsTotal, setRecentPaymentsTotal] = useState(0);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [outstandingList, setOutstandingList] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ data: { total: number } }>("/clients?limit=1"),
      api.get<{ data: { total: number } }>("/memberships?status=ACTIVE&limit=1"),
      api.get<{ data: { payments: Payment[]; total: number } }>("/payments?limit=5&status=PAID"),
      api.get<{ data: { clients: Client[] } }>("/clients?limit=5"),
      api.get<{ data: { memberships: Membership[] } }>("/memberships?status=ACTIVE&limit=5"),
    ]).then(([c, m, p, recentC, activeMem]) => {
      setTotalClients(c?.data?.total ?? 0);
      setActiveMemberships(m?.data?.total ?? 0);
      const pays = p?.data?.payments ?? [];
      setRecentPayments(pays);
      setRecentPaymentsTotal(pays.reduce((sum, pay) => sum + Number(pay.amount), 0));
      setRecentClients(recentC?.data?.clients ?? []);
      const mems = activeMem?.data?.memberships ?? [];
      setOutstandingList(mems);
      setTotalOutstanding(mems.reduce((sum, mem) => sum + Number(mem.outstanding_balance), 0));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPI label="Total Clients"      value={totalClients}                                        icon={Users}        color="bg-blue-600"    sub="All time" />
        <KPI label="Active Memberships" value={activeMemberships}                                   icon={CreditCard}   color="bg-emerald-600" sub="Currently active" />
        <KPI label="Recent Payments"    value={`₹${recentPaymentsTotal.toLocaleString()}`}          icon={IndianRupee}  color="bg-violet-600"  sub="Last 5 payments (PAID)" />
        <KPI label="Outstanding (Active)"value={`₹${totalOutstanding.toLocaleString()}`}            icon={TrendingDown} color="bg-amber-500"   sub="Across active memberships" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Clients */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm">Recent Clients</h2>
            <Link href="/admin/clients" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentClients.length === 0 && <p className="text-slate-400 text-sm text-center py-8">No clients yet</p>}
            {recentClients.map(c => (
              <Link key={c.client_id} href={`/admin/clients/${c.client_id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-slate-800 text-sm font-medium">{c.first_name} {c.last_name}</p>
                  <p className="text-slate-400 text-xs">{c.client_code} · {c.email}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS[c.status] ?? "bg-slate-100 text-slate-500"}`}>{c.status}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm">Recent Payments</h2>
            <Link href="/admin/payments" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentPayments.length === 0 && <p className="text-slate-400 text-sm text-center py-8">No payments yet</p>}
            {recentPayments.map(p => (
              <div key={p.payment_id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-slate-800 text-sm font-medium">{p.client?.first_name} {p.client?.last_name}</p>
                  <p className="text-slate-400 text-xs">{p.payment_number} · {p.payment_type}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 text-sm font-semibold">₹{Number(p.amount).toLocaleString()}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS[p.status] ?? "bg-slate-100 text-slate-500"}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outstanding Memberships */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm">Pending Balance</h2>
            <Link href="/admin/memberships?status=ACTIVE" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {outstandingList.length === 0 && <p className="text-slate-400 text-sm text-center py-8">No active memberships</p>}
            {outstandingList.map(m => (
              <Link key={m.membership_id} href={`/admin/memberships/${m.membership_id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-slate-800 text-sm font-medium font-mono">{m.membership_number}</p>
                  <p className="text-slate-400 text-xs">{m.client?.first_name} {m.client?.last_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 text-sm font-semibold">₹{Number(m.outstanding_balance).toLocaleString()}</p>
                  {m.package?.category && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CAT[m.package.category] ?? ""}`}>{m.package.category}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
