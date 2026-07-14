/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CtaButton from "@/UI/CtaButton";

/* Data */

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
];

/* Component */

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed inset-x-0 top-0 z-1000 bg-[#040B31] py-4 px-4 md:px-8 lg:px-10 rounded-b-4xl">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/Img/fanlogo.png"
            alt="Logo"
            width={150}
            height={40}
            className="h-12 md:h-18 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Center Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.url}
                className="flex items-center gap-1 rounded-full px-3 xl:px-4 py-2 text-[13px] xl:text-sm font-medium text-white hover:bg-white hover:text-black transition-colors duration-300"
              >
                {item.label}
                {item.dropdown && (
                  <ChevronDown className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-300" />
                )}
              </Link>

              {item.dropdown && (
                <div className="absolute left-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                  <div className="flex flex-col min-w-37.5 rounded-xl shadow-lg overflow-hidden py-1 bg-white border border-gray-100">
                    {item.dropdown.map((dropItem) => (
                      <Link
                        key={dropItem.label}
                        href={dropItem.url}
                        className="px-4 py-2 text-[13px] xl:text-sm text-gray-700 hover:bg-blue-50 hover:text-gray-900 transition-colors"
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

        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <CtaButton text="Login" variant="blue" href="/login" size="sm" />
          <CtaButton text="Join Now" variant="outline" href="/join" size="sm" />
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white hover:bg-white transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[80vh] opacity-100 mt-4 overflow-y-auto scrollbar-hide"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 py-2 border-t border-gray-100/50">
          {navItems.map((item) => (
            <div key={item.label} className="flex flex-col">
              {item.dropdown ? (
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === item.label ? null : item.label,
                    )
                  }
                  className="px-4 py-3 text-sm font-medium text-white hover:bg-gray-50 rounded-xl transition-colors flex justify-between items-center w-full text-left cursor-pointer"
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${openDropdown === item.label ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <Link
                  href={item.url}
                  className="px-4 py-3 text-sm font-medium text-white hover:bg-gray-50 rounded-xl transition-colors flex justify-between items-center"
                >
                  {item.label}
                </Link>
              )}

              {item.dropdown && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdown === item.label
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col ml-4 pl-4 border-l border-gray-200 mt-1 mb-2 gap-1">
                    {item.dropdown.map((dropItem) => (
                      <Link
                        key={dropItem.label}
                        href={dropItem.url}
                        className="px-4 py-2 text-[13px] text-white/80 hover:text-black hover:bg-white transition-colors"
                      >
                        {dropItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Mobile CTA buttons */}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100/50 px-4">
            <Link
              href="/login"
              className="w-full py-3 px-4 bg-white border border-blue-600 text-blue-600 rounded-full text-center text-sm font-bold shadow-sm transition-all hover:bg-blue-50"
            >
              Login
            </Link>
            <Link
              href="/join"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-full text-center text-sm font-bold shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
