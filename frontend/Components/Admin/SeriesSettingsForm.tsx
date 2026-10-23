"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, Save, CheckCircle, AlertCircle } from "lucide-react";

interface Series {
  prefix: string;
  start_number: number;
  next_number: number;
  padding: number;
  next: string;
}

const inp =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

export default function SeriesSettingsForm({
  title,
  description,
  endpoint,
  prefixHelp,
}: {
  title: string;
  description: string;
  endpoint: string;
  prefixHelp: string;
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [start, setStart] = useState("1");
  const [padding, setPadding] = useState("4");
  const [next, setNext] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function apply(s: Series) {
    setPrefix(s.prefix);
    setStart(String(s.start_number));
    setPadding(String(s.padding));
    setNext(s.next);
  }

  useEffect(() => {
    api.get<{ data: Series }>(endpoint)
      .then(res => apply(res.data))
      .catch(e => setToast({ type: "error", msg: e?.message ?? "Failed to load settings." }))
      .finally(() => setLoading(false));
  }, [endpoint]);

  // Live example of the first number the series will produce
  const example = `${prefix}${String(Number(start) || 0).padStart(Number(padding) || 1, "0")}`;

  async function save() {
    setSaving(true);
    setToast(null);
    try {
      const res = await api.put<{ data: Series }>(endpoint, {
        prefix: prefix.trim(),
        start_number: Number(start),
        padding: Number(padding),
      });
      apply(res.data);
      setToast({ type: "success", msg: "Saved. New numbers will follow this series." });
    } catch (e: unknown) {
      setToast({ type: "error", msg: (e as { message?: string })?.message ?? "Failed to save." });
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
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>

      {toast && (
        <div
          className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg border ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Prefix</label>
            <input className={inp} value={prefix} maxLength={20} onChange={e => setPrefix(e.target.value)} placeholder="e.g. INV-" />
          </div>
          <div className="col-span-3 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Start number</label>
            <input className={inp} type="number" min={1} value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div className="col-span-3 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Digits (zero padding)</label>
            <input className={inp} type="number" min={1} max={10} value={padding} onChange={e => setPadding(e.target.value)} />
          </div>
        </div>
        <p className="text-xs text-slate-500">{prefixHelp}</p>

        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm space-y-1">
          <p>
            <span className="text-slate-500">Series starts at:</span>{" "}
            <span className="font-mono font-semibold text-slate-800">{example}</span>
          </p>
          <p>
            <span className="text-slate-500">Next number to be issued:</span>{" "}
            <span className="font-mono font-semibold text-blue-600">{next || "—"}</span>
          </p>
        </div>

        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Saving restarts the series at the start number. Numbers already in use are skipped automatically, so existing records are never duplicated.
        </p>

        <button
          onClick={save}
          disabled={saving || !Number(start) || Number(start) < 1}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
