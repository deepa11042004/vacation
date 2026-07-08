"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CtaButton from "@/UI/CtaButton";

/*  Data */

type NavItem = {
  label: string;
  url: string;
  dropdown?: { label: string; url: string }[];
};

const navItems: NavItem[] = [
  { label: "About Us", url: "/about" },
  { label: "Activities", url: "/activities" },
  { label: "Stays", url: "/stays" },
  { label: "Membership", url: "/membership" },
  {
    label: "Destination",
    url: "/destination",
    dropdown: [
      { label: "National", url: "/destination/national" },
      { label: "International", url: "/destination/international" },
    ],
  },
  {
    label: "Hotels",
    url: "/hotels",
    dropdown: [
      { label: "Associated", url: "/hotels/associated" },
      { label: "Internal", url: "/hotels/internal" },
    ],
  },
  { label: "Contact", url: "/contact" },
  { label: "Login", url: "/login" },
];

/*  Component */

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const useLightStyle =
    isScrolled ||
    pathname === "/stays" ||
    pathname === "/contact" ||
    pathname === "/join" ||
    pathname === "/terms-conditions" ||
    pathname === "/privacy-policy" ||
    pathname === "/refund-policy" ||
    pathname.startsWith("/destination") ||
    pathname.startsWith("/hotels");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /*  Layer 4 — navigation */
    <nav
      className={`fixed z-1000 flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? "top-4 inset-x-4 md:inset-x-8 lg:inset-x-32 bg-blue-50 rounded-full py-3 px-4 md:px-6 lg:px-8 shadow-md"
          : "inset-x-0 top-0 bg-transparent py-6 px-6 md:px-12 lg:px-40"
      }`}
    >
      <Link
        href="/"
        className={`text-xl md:text-4xl font-[--font-marcellus] transition-colors duration-300 ${!useLightStyle ? "text-white" : "text-gray-900"}`}
      >
        Tourvia.
      </Link>

      <div
        className={`hidden items-center gap-1 rounded-full px-2 py-2 lg:flex transition-colors duration-300 ${
          !useLightStyle
            ? "border border-white/25 bg-white/10 backdrop-blur-md"
            : isScrolled
              ? "bg-transparent"
              : "bg-blue-50"
        }`}
      >
        {navItems.map((item) => (
          <div key={item.label} className="group relative">
            <Link
              href={item.url}
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                !useLightStyle
                  ? "text-white/90 hover:bg-white/20"
                  : "text-gray-700 hover:bg-blue-100/50 hover:text-gray-900"
              }`}
            >
              {item.label}
              {item.dropdown && (
                <ChevronDown className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-300" />
              )}
            </Link>

            {item.dropdown && (
              <div className="absolute left-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                <div
                  className={`flex flex-col min-w-37.5 rounded-2xl shadow-lg overflow-hidden py-1 ${
                    !useLightStyle
                      ? "bg-white/10 backdrop-blur-md border border-white/25"
                      : "bg-white border border-gray-100"
                  }`}
                >
                  {item.dropdown.map((dropItem) => (
                    <Link
                      key={dropItem.label}
                      href={dropItem.url}
                      className={`px-4 py-2 text-sm transition-colors ${
                        !useLightStyle
                          ? "text-white/90 hover:bg-white/20"
                          : "text-gray-700 hover:bg-blue-50 hover:text-gray-900"
                      }`}
                    >
                      {dropItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <CtaButton
        text="Join Now"
        variant={!useLightStyle ? "outline" : "blue"}
        href="/join"
        size="sm"
      />
    </nav>
  );
}
