"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  Mail,
  Info,
  Cake,
  Heart,
  Play,
} from "lucide-react";

interface Template {
  subject: string;
  body: string;
}
interface Templates {
  invoice: Template;
  birthday: Template;
  anniversary: Template;
}

const inp =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

const INVOICE_VARS = [
  { key: "{{invoice_no}}", desc: "Invoice number" },
  { key: "{{client_name}}", desc: "Client full name" },
  { key: "{{issue_date}}", desc: "Invoice date" },
  { key: "{{amount}}", desc: "Payment amount" },
  { key: "{{email}}", desc: "Client email" },
  { key: "{{phone}}", desc: "Client phone" },
];

const BIRTHDAY_VARS = [
  { key: "{{client_name}}", desc: "Client full name" },
];

const ANNIVERSARY_VARS = [
  { key: "{{client_name}}", desc: "Client full name" },
  { key: "{{spouse_name}}", desc: "Spouse / partner name" },
];

type Tab = "invoice" | "birthday" | "anniversary";

function Toast({ type, msg }: { type: "success" | "error"; msg: string }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${
        type === "success"
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      {msg}
    </div>
  );
}

function TemplateEditor({
  label,
  subject,
  body,
  onSubjectChange,
  onBodyChange,
  bodyHint,
  variables,
  saving,
  toast,
  onSave,
  preview,
}: {
  label: string;
  subject: string;
  body: string;
  onSubjectChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  bodyHint?: string;
  variables: { key: string; desc: string }[];
  saving: boolean;
  toast: { type: "success" | "error"; msg: string } | null;
  onSave: () => void;
  preview: { subject: string; body: string };
}) {
  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Editor */}
      <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Email Subject
          </label>
          <input
            className={inp}
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder={`${label} subject...`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Email Body
          </label>
          <textarea
            rows={14}
            className={`${inp} resize-none font-mono text-xs leading-relaxed`}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder={`Dear {{client_name}}, ...`}
          />
          {bodyHint && (
            <p className="text-xs text-slate-400 mt-1">{bodyHint}</p>
          )}
        </div>

        {toast && <Toast type={toast.type} msg={toast.msg} />}

        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving…" : "Save Template"}
        </button>
      </div>

      {/* Variables */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-500" />
            <p className="text-sm font-bold text-slate-700">Available Variables</p>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Use these in subject and body — replaced automatically when the email is sent.
          </p>
          <div className="space-y-2">
            {variables.map((v) => (
              <div key={v.key} className="flex items-start gap-2">
                <code className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono shrink-0">
                  {v.key}
                </code>
                <span className="text-xs text-slate-500">{v.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
            Preview
          </p>
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 space-y-2">
            <p className="text-xs">
              <span className="text-slate-400 mr-1">Subject:</span>
              <span className="font-medium text-slate-800">{preview.subject}</span>
            </p>
            <hr className="border-slate-200" />
            <pre className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
              {preview.body}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function interpolatePreview(str: string, vars: Record<string, string>) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

export default function EmailTemplatePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("invoice");
  const [triggeringCron, setTriggeringCron] = useState(false);
  const [cronToast, setCronToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Invoice
  const [invSubject, setInvSubject] = useState("");
  const [invBody, setInvBody] = useState("");
  const [invSaving, setInvSaving] = useState(false);
  const [invToast, setInvToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Birthday
  const [bdSubject, setBdSubject] = useState("");
  const [bdBody, setBdBody] = useState("");
  const [bdSaving, setBdSaving] = useState(false);
  const [bdToast, setBdToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Anniversary
  const [annSubject, setAnnSubject] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annSaving, setAnnSaving] = useState(false);
  const [annToast, setAnnToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    api
      .get<{ data: Templates }>("/settings/email-template")
      .then((res) => {
        const d = res?.data;
        if (d?.invoice) { setInvSubject(d.invoice.subject); setInvBody(d.invoice.body); }
        if (d?.birthday) { setBdSubject(d.birthday.subject); setBdBody(d.birthday.body); }
        if (d?.anniversary) { setAnnSubject(d.anniversary.subject); setAnnBody(d.anniversary.body); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function saveAll(patch: Partial<Templates>) {
    const current: Templates = {
      invoice: { subject: invSubject, body: invBody },
      birthday: { subject: bdSubject, body: bdBody },
      anniversary: { subject: annSubject, body: annBody },
      ...patch,
    };
    await api.put("/settings/email-template", current);
  }

  async function saveInvoice() {
    if (!invSubject.trim() || !invBody.trim()) { setInvToast({ type: "error", msg: "Subject and body are required." }); return; }
    setInvSaving(true); setInvToast(null);
    try { await saveAll({ invoice: { subject: invSubject, body: invBody } }); setInvToast({ type: "success", msg: "Invoice template saved." }); }
    catch { setInvToast({ type: "error", msg: "Failed to save template." }); }
    finally { setInvSaving(false); }
  }

  async function saveBirthday() {
    if (!bdSubject.trim() || !bdBody.trim()) { setBdToast({ type: "error", msg: "Subject and body are required." }); return; }
    setBdSaving(true); setBdToast(null);
    try { await saveAll({ birthday: { subject: bdSubject, body: bdBody } }); setBdToast({ type: "success", msg: "Birthday template saved." }); }
    catch { setBdToast({ type: "error", msg: "Failed to save template." }); }
    finally { setBdSaving(false); }
  }

  async function saveAnniversary() {
    if (!annSubject.trim() || !annBody.trim()) { setAnnToast({ type: "error", msg: "Subject and body are required." }); return; }
    setAnnSaving(true); setAnnToast(null);
    try { await saveAll({ anniversary: { subject: annSubject, body: annBody } }); setAnnToast({ type: "success", msg: "Anniversary template saved." }); }
    catch { setAnnToast({ type: "error", msg: "Failed to save template." }); }
    finally { setAnnSaving(false); }
  }

  async function triggerNow() {
    setTriggeringCron(true); setCronToast(null);
    try {
      const res = await fetch("/api/cron/send-birthday-anniversary", {
        method: "POST",
        headers: { "x-cron-secret": process.env.NEXT_PUBLIC_CRON_SECRET || "" },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed");
      const d = json?.data;
      setCronToast({ type: "success", msg: `Sent ${d?.birthdaySent ?? 0} birthday + ${d?.anniversarySent ?? 0} anniversary email(s) today.` });
    } catch (e: unknown) {
      setCronToast({ type: "error", msg: e instanceof Error ? e.message : "Failed to trigger job." });
    } finally {
      setTriggeringCron(false);
    }
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "invoice", label: "Invoice", icon: <Mail className="w-4 h-4" /> },
    { id: "birthday", label: "Birthday", icon: <Cake className="w-4 h-4" /> },
    { id: "anniversary", label: "Anniversary", icon: <Heart className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const bdSample = { client_name: "Rahul Sharma" };
  const annSample = { client_name: "Rahul Sharma", spouse_name: "Priya Sharma" };
  const invSample = { invoice_no: "2627/001", client_name: "Rahul Sharma", issue_date: "03-Jul-2026", amount: "50,000.00", email: "rahul@example.com", phone: "+91 9876543210" };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Email Templates</h1>
            <p className="text-sm text-slate-500">
              Customize emails sent to clients — invoice, birthday & anniversary
            </p>
          </div>
        </div>

        {/* Manual trigger */}
        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={triggerNow}
            disabled={triggeringCron}
            className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {triggeringCron ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {triggeringCron ? "Running…" : "Run Now (Test)"}
          </button>
          {cronToast && (
            <div className={`text-xs px-3 py-1.5 rounded-lg ${cronToast.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {cronToast.msg}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t.id
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Invoice */}
      {activeTab === "invoice" && (
        <TemplateEditor
          label="Invoice"
          subject={invSubject}
          body={invBody}
          onSubjectChange={setInvSubject}
          onBodyChange={setInvBody}
          bodyHint="The invoice PDF is automatically attached — no variable needed."
          variables={INVOICE_VARS}
          saving={invSaving}
          toast={invToast}
          onSave={saveInvoice}
          preview={{
            subject: interpolatePreview(invSubject, invSample),
            body: interpolatePreview(invBody, invSample),
          }}
        />
      )}

      {/* Birthday */}
      {activeTab === "birthday" && (
        <TemplateEditor
          label="Birthday"
          subject={bdSubject}
          body={bdBody}
          onSubjectChange={setBdSubject}
          onBodyChange={setBdBody}
          bodyHint="Sent automatically at 9:00 AM IST on the client's birthday."
          variables={BIRTHDAY_VARS}
          saving={bdSaving}
          toast={bdToast}
          onSave={saveBirthday}
          preview={{
            subject: interpolatePreview(bdSubject, bdSample),
            body: interpolatePreview(bdBody, bdSample),
          }}
        />
      )}

      {/* Anniversary */}
      {activeTab === "anniversary" && (
        <TemplateEditor
          label="Anniversary"
          subject={annSubject}
          body={annBody}
          onSubjectChange={setAnnSubject}
          onBodyChange={setAnnBody}
          bodyHint="Sent automatically at 9:00 AM IST on the client's wedding anniversary."
          variables={ANNIVERSARY_VARS}
          saving={annSaving}
          toast={annToast}
          onSave={saveAnniversary}
          preview={{
            subject: interpolatePreview(annSubject, annSample),
            body: interpolatePreview(annBody, annSample),
          }}
        />
      )}
    </div>
  );
}
