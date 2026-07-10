"use client";

import Link from "next/link";
import CtaButton from "@/UI/CtaButton";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // FIXED: Changed 'h-screen' to 'min-h-screen lg:h-screen' (optional if you want full screen on desktop)
    // and removed 'overflow-hidden' so content flows properly on mobile.
    <footer className="relative min-h-screen lg:h-screen w-full bg-black text-white flex items-end py-12 lg:py-0">
      {/* Main Content Hub */}
      {/* FIXED: Adjusted pt-36 to a responsive pt-20 lg:pt-36 to give it breathing room on mobile */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pb-10 flex flex-col justify-between h-full pt-20 lg:pt-36 gap-12 lg:gap-0">
        {/* Top Row: Navigation Links + Centered Call To Action */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Main Page Directory */}
          <div className="md:col-span-3 flex flex-col gap-3 text-left md:text-left order-2 md:order-1">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2 text-sm font-medium text-neutral-300">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/package"
                className="hover:text-white transition-colors"
              >
                Package
              </Link>
              <Link
                href="/destination"
                className="hover:text-white transition-colors"
              >
                Destination
              </Link>
              <Link
                href="/login"
                className="hover:text-white transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>

          {/* Central Column: Slogan Lockup + Custom Trigger Button */}
          <div className="md:col-span-6 flex flex-col items-center text-center justify-center order-1 md:order-2 self-center">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight max-w-lg">
              Expeditions Expertise <br /> at Your Service
            </h3>
            <Link href="/contact">
              <CtaButton text="Contact Us" variant="white" size="md" />
            </Link>
          </div>

          {/* Right Column: Social Channels Directory */}
          <div className="md:col-span-3 flex flex-col gap-3 text-left md:text-right order-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              Social Media
            </h4>
            <nav className="flex flex-col gap-2 text-sm font-medium text-neutral-300">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Linkedin
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Youtube
              </a>
            </nav>
          </div>
        </div>

        {/* Middle Row: Customer Support Details */}
        {/* FIXED: Changed alignment on mobile from text-center to text-left to match your image style layout */}
        <div className="mt-8 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row items-start justify-between gap-8 text-sm font-medium text-neutral-300 text-left">
          <div className="flex flex-col gap-1">
            <span className="text-white font-bold uppercase tracking-wider text-xs">
              Support Email
            </span>
            <a
              href="mailto:support@mandarinworldwide.com"
              className="hover:text-white transition-colors"
            >
              support@mandarinworldwide.com
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white font-bold uppercase tracking-wider text-xs">
              Phone
            </span>
            <a
              href="tel:+18001234567"
              className="hover:text-white transition-colors"
            >
              +1 (800) 123-4567
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white font-bold uppercase tracking-wider text-xs">
              Location
            </span>
            <span>123 Expedition Way, Adventure City, NY 10001</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white font-bold uppercase tracking-wider text-xs">
              Payment
            </span>
            <Link href="/" className="hover:text-white transition-colors">
              Pay Now (PhonePe)
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Pay Now (PayU)
            </Link>
          </div>
        </div>

        {/* Bottom Row: Legalities & Metadata Lockup */}
        {/* FIXED: flex-wrap ensures items break gracefully on smaller viewport sizes */}
        <div className="mt-8 lg:mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm font-medium text-neutral-300 select-none">
          <p>© {currentYear} MANDARIN WORLDWIDE. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/refund-policy"
              className="hover:text-white transition-colors"
            >
              Refund Policy
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-conditions"
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/staff/login"
              className="hover:text-white transition-colors opacity-60 hover:opacity-100"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
