"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "mwv_cookie_consent";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        // Small delay to allow page render / preloader transition before showing banner
        const timer = setTimeout(() => {
          setShowConsent(true);
          // Trigger slide-in animation frame
          requestAnimationFrame(() => setIsVisible(true));
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // If localStorage is disabled/restricted, default to showing
      setShowConsent(true);
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (choice: "accepted" | "declined") => {
    setIsVisible(false); // trigger fade/slide out animation
    setTimeout(() => {
      try {
        localStorage.setItem(CONSENT_KEY, choice);
        // Also set standard browser cookie for 1 year
        document.cookie = `${CONSENT_KEY}=${choice}; path=/; max-age=31536000; SameSite=Lax`;
      } catch (e) {
        console.error("Could not save cookie consent choice", e);
      }
      setShowConsent(false);
    }, 300);
  };

  if (!showConsent) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Consent Banner"
      className={`fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:bottom-6 z-[9990] max-w-md w-auto transition-all duration-300 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-95"
      }`}
    >
      <div className="bg-[#0B1536]/95 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl p-5 sm:p-6 text-white text-left flex flex-col gap-4">
        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
          We use cookies to enhance your experience and personalise content. Read our{" "}
          <Link
            href="/privacy-policy"
            className="text-[#48B84F] hover:text-[#5fd866] underline font-semibold transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleConsent("accepted")}
            className="px-6 py-2.5 rounded-full bg-[#48B84F] hover:bg-[#3ea244] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            ACCEPT ALL
          </button>
          <button
            type="button"
            onClick={() => handleConsent("declined")}
            className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-neutral-200 hover:text-white font-medium text-xs transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
