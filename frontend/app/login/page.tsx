"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Minus, Loader2 } from "lucide-react";
import Badge from "@/UI/Badge";
import { saveMemberAuth } from "@/lib/member-api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        setError(json?.message ?? "Invalid email or password.");
        return;
      }
      const { accessToken, refreshToken, user } = json.data;
      saveMemberAuth(accessToken, refreshToken, user);
      router.replace("/profile");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url("/Img/bg.png")' }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <Link
        href="/"
        className="absolute top-8 left-6 md:top-12 md:left-12 lg:top-20 lg:left-50 z-20 inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white/90 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-24 items-center mt-16 md:mt-0">
        <div className="text-white space-y-4 md:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
          <Badge
            text="Mandarin Vacation"
            size="lg"
            variant="white"
            icon={Minus}
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-bold">
            Your Journey Continues
          </h1>
          <div className="space-y-4 pt-2 md:pt-4">
            <p className="text-base md:text-lg font-medium text-white/90">
              Sign in to unlock personalized travel experiences, premium
              vacation packages, and seamless trip management—all in one place.
            </p>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl md:rounded-4xl p-6 md:p-10 shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white tracking-widest uppercase">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white text-slate-900 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-white tracking-widest uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white text-slate-900 rounded-xl px-4 py-3.5 pr-12 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-300 bg-red-900/30 border border-red-400/30 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-colors mt-2 shadow-lg shadow-indigo-500/30"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Signing in…" : "SIGN IN"}
              </button>

              <p className="text-center text-xs text-white/60">
                Default password is your registered mobile number
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
