"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, XCircle, X } from "lucide-react";
import { api } from "@/lib/api";

interface ReferrerInfo {
  membership_id: number;
  membership_number: string;
  status: string;
  client: { first_name: string; last_name: string; mobile: string } | null;
}

type LookupState = "idle" | "loading" | "found" | "not_found";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSelect: (id: number | null, display: string) => void;
  error?: string;
}

const inp = (hasErr?: boolean) =>
  `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    hasErr
      ? "border-red-500 bg-red-50 text-red-900"
      : "border-slate-300 bg-white"
  }`;

export default function MembershipLookup({ value, onChange, onSelect, error }: Props) {
  const [state, setState] = useState<LookupState>("idle");
  const [info, setInfo] = useState<ReferrerInfo | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();

    // If field cleared or too short — reset
    if (!trimmed) {
      setState("idle");
      setInfo(null);
      onSelect(null, "");
      return;
    }

    setState("loading");
    debounceRef.current = setTimeout(async () => {
      try {
        const json = await api.get<{ success: boolean; data: ReferrerInfo | null }>(
          `/memberships/lookup?membership_no=${encodeURIComponent(trimmed)}`
        );
        if (json?.success && json?.data) {
          const data: ReferrerInfo = json.data;
          setInfo(data);
          setState("found");
          const name = data.client
            ? `${data.client.first_name} ${data.client.last_name}`
            : "Unknown";
          onSelect(data.membership_id, `${name} (${data.membership_number})`);
        } else {
          setInfo(null);
          setState("not_found");
          onSelect(null, "");
        }
      } catch {
        setInfo(null);
        setState("not_found");
        onSelect(null, "");
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleClear = () => {
    onChange("");
    setState("idle");
    setInfo(null);
    onSelect(null, "");
  };

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <input
          className={inp(!!error)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. MEM-00001"
          autoComplete="off"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {state === "loading" && (
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
          )}
          {value && state !== "loading" && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Found state */}
      {state === "found" && info && (
        <div className="flex items-start gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-green-800">
              {info.client
                ? `${info.client.first_name} ${info.client.last_name}`
                : "Unknown Member"}
            </p>
            <p className="text-[11px] text-green-600 mt-0.5">
              {info.membership_number}
              <span className="mx-1.5 text-green-400">·</span>
              {info.status}
              {info.client?.mobile && (
                <>
                  <span className="mx-1.5 text-green-400">·</span>
                  {info.client.mobile}
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Not found state */}
      {state === "not_found" && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-xs font-medium text-red-600">
            No membership found with that number
          </p>
        </div>
      )}

      {error && (
        <p className="text-[11px] font-semibold text-red-500">{error}</p>
      )}
    </div>
  );
}
