"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Minus } from "lucide-react";
import Badge from "@/UI/Badge";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url("/Img/bg.png")' }}
    >
      {/* If the background image doesn't load well, fallback to a color or gradient, or use a pseudo-element for overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      <Link
        href="/"
        className="absolute top-8 left-6 md:top-12 md:left-12 lg:top-20 lg:left-50 z-20 inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white/90 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-24 items-center mt-16 md:mt-0">
        {/* Left Side Content */}
        <div className="text-white space-y-4 md:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
          <Badge
            text="MANDARIN WORLDWIDE"
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

        {/* Right Side Login Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl md:rounded-4xl p-6 md:p-10 shadow-2xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white tracking-widest uppercase">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
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

              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-sm text-white/80 hover:text-white transition-colors underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors mt-2 shadow-lg shadow-indigo-500/30"
              >
                SIGN IN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
