"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { saveMemberAuth } from "@/lib/member-api";

function QrLoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setError("Invalid QR code — no token found.");
      return;
    }

    async function doQrLogin() {
      try {
        const res = await fetch(`/api/auth/qr-login?token=${encodeURIComponent(token!)}`, {
          method: "GET",
        });
        const json = await res.json();
        if (!res.ok || !json?.success) {
          setError(json?.message ?? "QR login failed. Please ask for a new QR code.");
          return;
        }
        const { accessToken, refreshToken, user } = json.data;
        saveMemberAuth(accessToken, refreshToken, user);
        router.replace("/profile");
      } catch {
        setError("Something went wrong. Please try again.");
      }
    }

    doQrLogin();
  }, [params, router]);

  if (error) {
    return (
      <>
        <XCircle className="w-12 h-12 text-red-400" />
        <p className="text-white text-lg font-semibold max-w-sm">{error}</p>
        <a
          href="/login"
          className="mt-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Go to Login
        </a>
      </>
    );
  }

  return (
    <>
      <Loader2 className="w-12 h-12 text-white animate-spin" />
      <p className="text-white text-lg font-semibold">Logging you in…</p>
      <p className="text-white/60 text-sm">Please wait a moment</p>
    </>
  );
}

export default function QrLoginPage() {
  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: 'url("/Img/bg.png")' }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="z-10 flex flex-col items-center gap-5 text-center">
        <Suspense
          fallback={
            <>
              <Loader2 className="w-12 h-12 text-white animate-spin" />
              <p className="text-white text-lg font-semibold">Loading…</p>
            </>
          }
        >
          <QrLoginInner />
        </Suspense>
      </div>
    </div>
  );
}
