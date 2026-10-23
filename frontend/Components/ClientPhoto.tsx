"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";

export const PHOTO_MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Round client photo with a camera button to pick a new image (the parent does the actual upload). */
export default function ClientPhoto({
  src,
  name,
  size = 96,
  busy = false,
  onSelect,
  onRemove,
  className = "",
}: {
  src?: string | null;
  name: string;
  size?: number;
  busy?: boolean;
  onSelect: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const initial = (name.trim().charAt(0) || "?").toUpperCase();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Use a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      setError("Photo must be 2 MB or smaller.");
      return;
    }
    setError("");
    onSelect(file);
  }

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name || "Client photo"}
            className="w-full h-full rounded-full object-cover border-2 border-white shadow"
          />
        ) : (
          <div
            className="w-full h-full rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-white shadow"
            style={{ fontSize: size * 0.4 }}
          >
            {initial}
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 rounded-full bg-white/70 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          title={src ? "Change photo" : "Add photo"}
          className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-slate-900 text-white border-2 border-white hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
          style={{ width: Math.max(24, size * 0.3), height: Math.max(24, size * 0.3) }}
        >
          <Camera style={{ width: Math.max(12, size * 0.15), height: Math.max(12, size * 0.15) }} />
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
      </div>

      {src && onRemove && !busy && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" /> Remove
        </button>
      )}
      {error && <p className="text-[11px] text-red-600 max-w-40 text-center">{error}</p>}
    </div>
  );
}
