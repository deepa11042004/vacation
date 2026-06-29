"use client";

import React from "react";
import Link from "next/link";
import CtaButton from "@/UI/CtaButton";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative h-screen w-full bg-black overflow-hidden text-white flex items-end">
      {/* Main Content Hub */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pb-10 flex flex-col justify-between h-full pt-36">
        {/* Top Row: Navigation Links + Centered Call To Action */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Main Page Directory */}
          <div className="md:col-span-3 flex flex-col gap-3 text-left md:text-left order-2 md:order-1">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              Main Page
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
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Central Column: Slogan Lockup + Custom Trigger Button */}
          <div className="md:col-span-6 flex flex-col items-center text-center justify-center order-1 md:order-2 self-center">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight max-w-lg">
              Expeditions Expertise <br /> at Your Service
            </h3>
            <CtaButton text="Contact Us" variant="white" size="md" />
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
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                X
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Row: Legalities & Metadata Lockup */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-medium text-neutral-300 select-none">
          <p>© {currentYear} Tourvia. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
