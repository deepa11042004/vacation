"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
];

/*  Component */

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const useLightStyle =
    isScrolled ||
    mobileMenuOpen ||
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

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    /*  Layer 4 — navigation */
    <nav
      className={`fixed z-1000 flex flex-col lg:flex-row lg:items-center justify-between transition-all duration-300 ${
        isScrolled
          ? "top-0 lg:top-4 inset-x-0 lg:inset-x-4 xl:inset-x-8 2xl:inset-x-32 bg-white/95 backdrop-blur-md lg:bg-blue-50 lg:rounded-full py-3 px-4 md:px-6 lg:px-4 shadow-md"
          : mobileMenuOpen
            ? "inset-x-0 top-0 bg-white/95 rounded-b-2xl backdrop-blur-md py-4 px-4 md:px-8 shadow-sm"
            : "inset-x-0 top-0 bg-transparent py-4 lg:py-6 px-4 md:px-8 lg:px-6 xl:px-12 2xl:px-40"
      }`}
    >
      <div className="flex items-center justify-between w-full lg:w-auto">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src={isScrolled ? "/Img/logo.png" : "/Img/fulllogo.png"}
            alt="Logo"
            width={150}
            height={30}
            className={`${isScrolled ? "h-7 md:h-9 w-auto object-contain" : "h-7 md:h-20 w-auto object-contain"}`}
          />
        </Link>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 -mr-2 rounded-lg transition-colors ${
              !useLightStyle ? "text-white" : "text-gray-900"
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Center Navigation */}
      <div
        className={`hidden lg:flex items-center gap-0.5 xl:gap-1 rounded-full px-2 py-1.5 transition-colors duration-300 ${
          !useLightStyle && !isScrolled
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
              className={`flex items-center gap-1 rounded-full px-2.5 xl:px-4 py-2 text-[13px] xl:text-sm font-medium transition-colors duration-300 ${
                !useLightStyle && !isScrolled
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
                    !useLightStyle && !isScrolled
                      ? "bg-white/10 backdrop-blur-md border border-white/25"
                      : "bg-white border border-gray-100"
                  }`}
                >
                  {item.dropdown.map((dropItem) => (
                    <Link
                      key={dropItem.label}
                      href={dropItem.url}
                      className={`px-4 py-2 text-[13px] xl:text-sm transition-colors ${
                        !useLightStyle && !isScrolled
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

      {/* Desktop CTA Buttons */}
      <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
        <CtaButton
          text="Login"
          variant={!useLightStyle && !isScrolled ? "blue" : "blue"}
          href="/login"
          size="sm"
          className={!useLightStyle && !isScrolled ? "border-white" : ""}
        />
        <CtaButton
          text="Join Now"
          variant={!useLightStyle && !isScrolled ? "outline" : "blue"}
          href="/join"
          size="sm"
        />
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out w-full ${
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
                  className="px-4 py-3 text-sm font-medium text-gray-800 hover:bg-slate-50 rounded-xl transition-colors flex justify-between items-center w-full text-left cursor-pointer"
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${openDropdown === item.label ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <Link
                  href={item.url}
                  className="px-4 py-3 text-sm font-medium text-gray-800 hover:bg-slate-50 rounded-xl transition-colors flex justify-between items-center"
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
                        className="px-4 py-2 text-[13px] text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {dropItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

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
