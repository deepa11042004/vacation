"use client";

import Link from "next/link";
import CtaButton from "@/UI/CtaButton";
import { Mail, MapPin, CreditCard } from "lucide-react";

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
                href="https://www.instagram.com/mandarinvacations?igsh=MXU1NHZnajBnM2Vwcw=="
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
                href="https://www.facebook.com/share/14kMSQaGfzA/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://youtube.com/@mandarinvacations?si=jPoBXrl7nDNzASQe"
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
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 hover:text-white transition-colors text-white font-bold uppercase tracking-wider text-xs">
              <Mail className="w-4 h-4 shrink-0" />
              Support Email
            </span>
            <a href="mailto:info@mandarinworldwidevacations.com" className="">
              info@mandarinworldwidevacations.com
            </a>
            <a href="mailto:support@mwvpl.com" className="">
              support@mwvpl.com
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 hover:text-white transition-colors text-white font-bold uppercase tracking-wider text-xs">
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>WhatsApp</title>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Phone
            </span>
            <a href="tel:+919990942211" className="">
              +91 9990942211
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-xs">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> Location
            </span>

            <span>
              Mandarin Worldwide Vacation Pvt. Ltd. <br /> D-22, LGF, Pandav
              Nagar, Near Ram Leela Park, <br /> D-Block, Opposite Mother Dairy
              Main Plant, <br /> Laxmi Nagar, Pandav Nagar, New Delhi – 110092
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 hover:text-white transition-colors text-white font-bold uppercase tracking-wider text-xs">
              <CreditCard className="w-4 h-4 shrink-0" />
              Payment
            </span>
            <Link href="/">Pay Now (PhonePe)</Link>
            <Link href="/">Pay Now (PayU)</Link>
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
