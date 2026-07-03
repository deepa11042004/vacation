"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, Save, CheckCircle, AlertCircle, Mail, Info } from "lucide-react";

interface Template {
  subject: string;
  body: string;
}
interface Templates {
  invoice: Template;
}

const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

const VARIABLES = [
  { key: "{{invoice_no}}",  desc: "Invoice number" },
  { key: "{{client_name}}",  desc: "Client full name" },
  { key: "{{issue_date}}",   desc: "Invoice date" },
  { key: "{{amount}}",       desc: "Payment amount" },
  { key: "{{email}}",        desc: "Client email" },
  { key: "{{phone}}",        desc: "Client phone" },
];

export default function EmailTemplatePage() {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [subject, setSubject]   = useState("");
  const [body, setBody]         = useState("");

  useEffect(() => {
    api.get<{ data: Templates }>("/settings/email-template").then(res => {
      const tpl = res?.data?.invoice;
      if (tpl) { setSubject(tpl.subject); setBody(tpl.body); }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function save() {
    if (!subject.trim() || !body.trim()) {
      setToast({ type: "error", msg: "Subject and body are required." });
      return;
    }
    setSaving(true);
    setToast(null);
    try {
      await api.put("/settings/email-template", { invoice: { subject, body } });
      setToast({ type: "success", msg: "Template saved successfully." });
    } catch {
      setToast({ type: "error", msg: "Failed to save template." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <Mail className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Email Template</h1>
          <p className="text-sm text-slate-500">Customize the subject and body sent when an invoice is emailed to a client</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">

        {/* Editor */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Subject</label>
            <input className={inp} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Invoice {{invoice_no}} — Peltown Vacations" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Body</label>
            <textarea
              rows={14}
              className={`${inp} resize-none font-mono text-xs leading-relaxed`}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Dear {{client_name}}, ..."
            />
            <p className="text-xs text-slate-400 mt-1">
              The invoice PDF is automatically attached. Write the email text here.
            </p>
          </div>

          {toast && (
            <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {toast.type === "success"
                ? <CheckCircle className="w-4 h-4 shrink-0" />
                : <AlertCircle className="w-4 h-4 shrink-0" />}
              {toast.msg}
            </div>
          )}

          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Template"}
          </button>
        </div>

        {/* Variables reference */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-500" />
              <p className="text-sm font-semibold text-slate-700">Available Variables</p>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Use these in both subject and body — they are replaced automatically when the email is sent.
            </p>
            <div className="space-y-2">
              {VARIABLES.map(v => (
                <div key={v.key} className="flex items-start gap-2">
                  <code className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono shrink-0">{v.key}</code>
                  <span className="text-xs text-slate-500">{v.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-700 mb-1">PDF Attachment</p>
            <p className="text-xs text-amber-600">
              The invoice PDF is always attached automatically — no variable needed. The file is named <code className="bg-amber-100 px-1 rounded">Invoice-[No].pdf</code>
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Preview (with sample data)</p>
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2">
          <p className="text-sm">
            <span className="text-slate-400 text-xs mr-2">Subject:</span>
            <span className="font-medium text-slate-800">
              {subject
                .replace("{{invoice_no}}", "2627/001")
                .replace("{{client_name}}", "Rahul Sharma")
                .replace("{{issue_date}}", "03-Jul-2026")
                .replace("{{amount}}", "50,000.00")
                .replace("{{email}}", "rahul@example.com")
                .replace("{{phone}}", "+91 9876543210")}
            </span>
          </p>
          <hr className="border-slate-200" />
          <pre className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
            {body
              .replace(/\{\{invoice_no\}\}/g, "2627/001")
              .replace(/\{\{client_name\}\}/g, "Rahul Sharma")
              .replace(/\{\{issue_date\}\}/g, "03-Jul-2026")
              .replace(/\{\{amount\}\}/g, "50,000.00")
              .replace(/\{\{email\}\}/g, "rahul@example.com")
              .replace(/\{\{phone\}\}/g, "+91 9876543210")}
          </pre>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded px-2 py-1 text-xs text-red-700">
              📎 Invoice-2627-001.pdf
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
