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
                className="flex items-center gap-2 md:justify-end hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Instagram</title>
                  <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
                </svg>
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 md:justify-end hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>LinkedIn</title>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Linkedin
              </a>
              <a
                href="https://www.facebook.com/share/14kMSQaGfzA/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 md:justify-end hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Facebook</title>
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
                Facebook
              </a>
              <a
                href="https://youtube.com/@mandarinvacations?si=jPoBXrl7nDNzASQe"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 md:justify-end hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>YouTube</title>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
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
              D-22 LGF, Pandav Nagar, Near Laxmi Nagar <br /> Delhi – 110092
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
